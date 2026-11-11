# Aggiornare contenuti e asset

## Testi, eventi e recapiti

Modifica [`src/content/index.ts`](../src/content/index.ts) per aggiornare le voci qui sotto. I testi principali delle sezioni sono in [`src/App.tsx`](../src/App.tsx).

| Dato | Uso |
| --- | --- |
| `contacts` | Numero mostrato, numero internazionale e indirizzi di Instagram e Facebook. Mantieni coerenti `phone` e `telephone`. |
| `donation` | Collegamenti informativi per sangue e midollo osseo |
| `events` | Schede eventi e relativi collegamenti. La prima voce è quella in evidenza. |
| `archiveMedia` | Nome base, titolo e didascalia delle immagini. L’ordine alimenta sia la bacheca sia la scena. |
| `gifts` e `solidarity` | Oggetti in omaggio e articoli solidali. L’azione di ciascun articolo solidale apre WhatsApp con un testo specifico. |

I collegamenti WhatsApp precompilano un testo e lasciano l’invio al visitatore. Per verificare una modifica basta controllare destinatario e testo nella schermata di composizione.

## Risorse web e originali

| Risorsa web | Origine o uso |
| --- | --- |
| `public/media/diana.webp` | Ritratto in `assets/foto/DIANA hr.jpg`. È usato nel ritratto 3D e nella versione lineare. |
| `public/media/marchio.webp`, `silhouette.webp` | Immagini ottimizzate del marchio e della silhouette. I PDF di origine e le varianti sono in `assets/marchi/`. |
| `public/media/scena-unicorni.glb` | Esportazione web della scena `assets/3d/Unicorni.blend`. |
| `public/media/scena-sinistra.webp`, `scena-destra.webp` e `unicorno-poster.webp` | Render per la versione lineare. |
| `public/media/archivio/` | Immagini web derivate da `assets/foto/` e `assets/campagne/`, più il pieghevole sul midollo osseo. |
| `public/media/draco/` | Decoder usati per caricare il GLB compresso. |

Per sostituire una locandina, conserva una versione leggibile in `public/media/archivio/<nome>.webp` e una miniatura in `public/media/archivio/<nome>-thumb.webp`. Il dialogo carica la prima, mentre il canvas e la griglia usano la miniatura. Aggiorna il nome in `archiveMedia` solo quando cambi il nome dei file. Il montaggio 3D è disposto per cinque immagini. Per cambiare il numero di immagini, aggiorna anche le posizioni desktop e mobile in [`UnicornScene.tsx`](../src/worldflight/UnicornScene.tsx).

Per aggiornare la scena, conserva l’originale in `assets/3d/`, esporta un GLB per il web e verifica che i nodi `UnicornoSinistra` e `UnicornoDestra` corrispondano ai riferimenti del loader. Se usi la compressione Draco, controlla l’export con i decoder inclusi. Aggiorna anche i render statici quando cambia l’inquadratura e prova il sito con il GLB bloccato.

Gli originali, le esportazioni archiviate in `assets/derivati/` e il [PDF operativo con il budget](../assets/documenti/Progetto_Fondazione_Gli_Unicorni_di_Diana.pdf) sono inclusi nel repository pubblico. Restano nella cartella sorgente `assets/`, fuori da `public/` e dai file serviti dalla build.

## Attribuzioni e licenze

- L’hero attribuisce **Unicorn 3D** a Soufiane Oujihi e indica che il modello è adattato. Conserva attribuzione e collegamento alla licenza quando sostituisci o rielabori la scena. [Modello di origine](https://sketchfab.com/3d-models/unicorn-3d-c89d06fe31694234bee10e42c2919299) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- I tre file Draco corrispondono alle copie glTF del pacchetto Three.js 0.183.2. Il testo Apache 2.0 accompagna i decoder. [Licenza Draco](../public/media/draco/LICENSE.txt) · [Sorgente della variante glTF](https://github.com/google/draco/tree/554628821c3448319d7d4ae48db170b8c63e1aaf)
- Inter e Newsreader sono inclusi tramite Fontsource. I pacchetti npm includono le rispettive licenze SIL Open Font License 1.1. [Inter](https://github.com/rsms/inter) · [Newsreader](https://github.com/productiontype/Newsreader)
