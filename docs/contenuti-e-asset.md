# Aggiornare contenuti e asset

## Testi, eventi e recapiti

Modifica [`src/content/index.ts`](../src/content/index.ts) per aggiornare le voci qui sotto. I testi principali delle sezioni sono in [`src/App.tsx`](../src/App.tsx).

| Dato | Uso |
| --- | --- |
| `contacts` | Numero mostrato, numero internazionale e indirizzi di Instagram e Facebook. Mantieni coerenti `phone` e `telephone`. |
| `donation` | Collegamenti informativi per sangue e midollo osseo |
| `events` | Schede eventi e relativi collegamenti. La prima voce è quella in evidenza. |
| `archiveMedia` | Nome base, titolo e didascalia delle immagini. L’ordine alimenta sia la bacheca sia la scena. |
| `solidarity` | Articoli solidali (nome, prezzo ufficiale, eventuale badge come `Novità`, descrizione e immagine). L’azione di ciascun articolo apre WhatsApp con testo e prezzo precompilati. |
| `iban` | Codice IBAN, intestatario (`GLI UNICORNI DI DIANA ODV`) e nota sul ricavato mostrati nelle schede articolo e nella sezione Contatti. |

I collegamenti WhatsApp precompilano un testo e lasciano l’invio al visitatore. Per verificare una modifica basta controllare destinatario e testo nella schermata di composizione.

## Risorse web e originali

I percorsi in `assets/` fanno riferimento al progetto sorgente.

| Risorsa web | Origine o uso |
| --- | --- |
| `public/media/ritratto-diana.webp` | Ritratto di Diana (916×1020, WebP qualità 80, 62 KB) per la trama 3D e la versione lineare. L’originale PNG è in `originali/`, fuori dalla pubblicazione. Il nome è tutto in minuscolo: su un host case-sensitive `Diana.webp` non troverebbe il file. |
| `public/media/marchio.webp`, `silhouette.webp` | Immagini ottimizzate del marchio e della silhouette. I PDF di origine e le varianti sono in `assets/marchi/`. |
| `public/media/scena-unicorni.glb` | Esportazione web della scena `assets/3d/Unicorni.blend`. |
| `public/media/unicorno-poster.webp` | Poster di caricamento mostrato da `FlightStage` durante l’attesa del chunk 3D e del modello GLB. |
| `public/media/scena-sinistra.webp` e `scena-destra.webp` | Render degli unicorni mostrati nell’apertura della versione lineare. |
| `public/media/*-line.webp` | Illustrazioni di Lovable ottimizzate in WebP. Il viaggio campiona i tratti della testa dell’unicorno e del cuore alato per le point cloud. |
| `public/media/archivio/` | Immagini web derivate da `assets/foto/` e `assets/campagne/`, più il pieghevole sul midollo osseo. |
| `public/media/gadget/` | Modelli 3D ottimizzati in `.glb` Draco (`t-shirt.glb`, `felpa.glb`, `cappello.glb`, `libro.glb`) caricati nella tappa `#gadget` da `MerchStage3D.tsx`, ricavati dai file sorgente `.fbx` archiviati in `originali/`. |
| `public/media/draco/` | Decoder usati per caricare il GLB compresso. |

Per sostituire una locandina, conserva una versione leggibile in `public/media/archivio/<nome>.webp` e una miniatura in `public/media/archivio/<nome>-thumb.webp`. Il dialogo carica la prima, mentre il canvas e la griglia usano la miniatura. Aggiorna il nome in `archiveMedia` solo quando cambi il nome dei file. Il montaggio 3D è disposto per cinque immagini. Per cambiare il numero di immagini, aggiorna anche le posizioni desktop e mobile in [`UnicornScene.tsx`](../src/worldflight/UnicornScene.tsx).

Due incontri — il liceo Labriola e «La cucina delle mamme» — non hanno ancora una fotografia: nella sfera usano `public/media/silhouette.webp` come **segnaposto dichiarato**, con `isPlaceholder: true` che fa comparire la nota «Immagine segnaposto» nella scheda. Quando arriva la foto, salvala in `public/media/archivio/<nome>.webp` con la sua `-thumb.webp` e sostituisci `src`, `fullSrc`, `alt` della voce in `src/content/index.ts`, togliendo `isPlaceholder`.

Il pieghevole `public/media/archivio/guida-midollo.pdf` pesa 2,3 MB ma viene scaricato solo quando il visitatore lo apre: non entra nel caricamento iniziale della pagina.

Per aggiornare la scena, conserva l’originale in `assets/3d/`, esporta un GLB per il web e verifica che i nodi `UnicornoSinistra` e `UnicornoDestra` corrispondano ai riferimenti del loader. Se usi la compressione Draco, controlla l’export con i decoder inclusi. Aggiorna anche i render statici quando cambia l’inquadratura e prova il sito con il GLB bloccato.

Gli originali e le esportazioni archiviate restano nel progetto sorgente. In questa consegna le risorse web si trovano in `public/`.

## Attribuzioni e licenze

- L’hero attribuisce **Unicorn 3D** a Soufiane Oujihi e indica che il modello è adattato. Conserva attribuzione e collegamento alla licenza quando sostituisci o rielabori la scena. [Modello di origine](https://sketchfab.com/3d-models/unicorn-3d-c89d06fe31694234bee10e42c2919299) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- I tre file Draco corrispondono alle copie glTF del pacchetto Three.js 0.183.2. Il testo Apache 2.0 accompagna i decoder. [Licenza Draco](../public/media/draco/LICENSE.txt) · [Sorgente della variante glTF](https://github.com/google/draco/tree/554628821c3448319d7d4ae48db170b8c63e1aaf)
- Fraunces e Manrope sono serviti localmente tramite Fontsource. I pacchetti npm includono le rispettive licenze SIL Open Font License 1.1.
