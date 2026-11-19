# Architettura

La landing è una pagina React e TypeScript compilata da Vite. `index.html` carica [`src/main.tsx`](../src/main.tsx), che monta l’app e il router. Il viaggio è accessibile da `/` e le tappe si possono collegare direttamente con i frammenti `#inizio`, `#storia`, `#obiettivi`, `#eventi`, `#gadget` e `#contatti`. Vercel serve la build statica. Le azioni di donazione, telefono, social e WhatsApp aprono collegamenti esterni.

## Pagina e scena

- [`src/App.tsx`](../src/App.tsx) compone i pannelli in HTML, gestisce le ancore del menu e conserva la tappa nel passaggio tra viaggio 3D e versione lineare. I dialoghi usano Radix UI, con animazioni Motion.
- [`src/worldflight/index.ts`](../src/worldflight/index.ts) definisce l’ordine delle tappe, le soglie di scroll e il punto d’arrivo delle ancore. `at` indica quando cambia il pannello. `arrival` è il punto a cui porta un clic sul menu, scelto per trovare la scena e il testo già leggibili.
- [`src/worldflight/useScrollStory.ts`](../src/worldflight/useScrollStory.ts) attiva il controller quando la modalità 3D è pronta. [`scrollStory.ts`](../src/worldflight/scrollStory.ts) traduce lo scroll in un avanzamento da 0 a 1 tramite GSAP ScrollTrigger. Il controller aggiorna il pannello attivo e chiede al canvas di ridisegnare la scena.
- [`src/worldflight/FlightStage.tsx`](../src/worldflight/FlightStage.tsx) carica la scena in modo asincrono. [`UnicornScene.tsx`](../src/worldflight/UnicornScene.tsx) usa React Three Fiber e Three.js per spostare camera e oggetti nello stesso canvas, disegnare la scia e mostrare le immagini dell’archivio. [`FlightParticles.tsx`](../src/worldflight/FlightParticles.tsx) usa lo stesso canvas e lo stesso avanzamento per disperdere la sagoma dell’unicorno e ricomporre il cuore alato. Il rendering avviene quando serve. Gli schermi stretti usano inquadrature dedicate e una risoluzione del canvas contenuta.
- [`src/styles.css`](../src/styles.css) contiene la palette, il layout, la tipografia e gli adattamenti per desktop e mobile. I pannelli fuori scena sono inerti durante il viaggio 3D.

## Modalità lineare e menu

L’intestazione contiene il menu delle sei tappe (da `chapters` in [`src/content/index.ts`](../src/content/index.ts)) e il pulsante **Versione lineare** / **Torna al viaggio**. La scelta vive nello stato `mode` di [`src/App.tsx`](../src/App.tsx): in volo il wrapper ha la classe `flight-mode`, in lineare `linear-mode`, e il cambio mantiene la tappa che si sta leggendo.

La modalità lineare mostra tutte le sezioni nel flusso della pagina, compresa la bacheca, e non monta `FlightStage`: il chunk 3D non viene scaricato. Ci si arriva in tre modi: dal pulsante, automaticamente con `prefers-reduced-motion: reduce` e automaticamente se il viaggio non è disponibile — errore del loader GLB, `ErrorBoundary` della scena o `webglcontextlost` chiamano `onUnavailable`, che imposta `linear`. Da lì il pulsante resta visibile per tornare al viaggio. Entrambe le modalità usano gli stessi contenuti.

La regia e il ritmo del viaggio sono descritti nel [brief Scroll Craft](brief-scroll-craft.md).
