# Architettura

La landing è una pagina React e TypeScript compilata da Vite. `index.html` carica [`src/main.tsx`](../src/main.tsx), che monta l’app e il router. Il viaggio è accessibile da `/` e le tappe si possono collegare direttamente con i frammenti `#inizio`, `#storia`, `#obiettivi`, `#eventi`, `#gadget` e `#contatti`. Vercel serve la build statica. Le azioni di donazione, telefono, social e WhatsApp aprono collegamenti esterni.

## Pagina e scena

- [`src/App.tsx`](../src/App.tsx) compone i pannelli in HTML, gestisce le ancore del menu e sincronizza il gadget selezionato con la scena 3D. I dialoghi dell’archivio eventi usano Radix UI, con animazioni Motion.
- [`src/worldflight/index.ts`](../src/worldflight/index.ts) definisce l’ordine delle tappe, le soglie di scroll e il punto d’arrivo delle ancore. `at` indica quando cambia il pannello. `arrival` è il punto a cui porta un clic sul menu, scelto per trovare la scena e il testo già leggibili.
- [`src/worldflight/useScrollStory.ts`](../src/worldflight/useScrollStory.ts) attiva il controller quando la modalità 3D è pronta. [`scrollStory.ts`](../src/worldflight/scrollStory.ts) traduce lo scroll in un avanzamento da 0 a 1 tramite GSAP ScrollTrigger. Il controller aggiorna il pannello attivo e chiede al canvas di ridisegnare la scena.
- [`src/worldflight/FlightStage.tsx`](../src/worldflight/FlightStage.tsx) carica la scena in modo asincrono mostrando un poster iniziale. [`UnicornScene.tsx`](../src/worldflight/UnicornScene.tsx) usa React Three Fiber e Three.js per spostare camera e oggetti nello stesso canvas, disegnare la scia e ospitare [`MerchStage3D.tsx`](../src/worldflight/MerchStage3D.tsx) alla tappa `#gadget` (orbita dei 4 modelli `.glb`, selezione con clic 3D e rotazione col trascinamento). [`FlightParticles.tsx`](../src/worldflight/FlightParticles.tsx) usa lo stesso canvas e lo stesso avanzamento per disperdere la sagoma dell’unicorno e ricomporre il cuore alato. Il rendering avviene quando serve (`frameloop="demand"`). Gli schermi stretti usano inquadrature dedicate e una risoluzione del canvas contenuta.
- [`src/styles.css`](../src/styles.css) contiene la palette, il layout, la tipografia e gli adattamenti per desktop e mobile. I pannelli fuori scena sono inerti durante il viaggio 3D.

## Fallback WebGL

L’esperienza è esclusivamente 3D lungo l’intero viaggio (con riduzione delle animazioni automatiche quando `prefers-reduced-motion: reduce` è attivo). Solo in caso di mancata disponibilità di WebGL o errore di caricamento GLB (`ErrorBoundary` o `webglcontextlost`), `onUnavailable` attiva un fallback di cortesia essenziale in flusso verticale per mantenere accessibili testi, donazioni e contatti.

La regia e il ritmo del viaggio sono descritti nel [brief Scroll Craft](brief-scroll-craft.md).
