# Fondazione Gli Unicorni di Diana

Landing per la sensibilizzazione alla donazione di sangue e midollo osseo. Il viaggio parte dal ritratto di Diana e attraversa la storia della Fondazione, le informazioni per donare, gli eventi e gli articoli solidali. Si chiude con i contatti della Fondazione.

## Avvio locale

Servono **Node.js 24** e npm. Dalla radice della cartella:

```sh
npm ci
npm run dev
```

Apri l’URL indicato da Vite. Usa il menu per provare le singole tappe o scegliere la versione lineare. Per provare i file che verranno pubblicati:

```sh
npm run check
npm run build
npm run preview
```

La build scrive in `dist/`. La landing funziona con file statici e link esterni e non richiede credenziali, variabili d’ambiente o un database.

## Dove intervenire

| Percorso | Cosa contiene |
| --- | --- |
| [`src/content/`](src/content/) | Recapiti, collegamenti, eventi, didascalie e voci degli articoli solidali |
| [`src/components/`](src/components/) | Componenti della pagina, disegni SVG e dialoghi |
| [`src/worldflight/`](src/worldflight/) | Tappe, posizione della camera, caricamento WebGL e sincronizzazione con lo scroll |
| [`src/App.tsx`](src/App.tsx) e [`src/styles.css`](src/styles.css) | Struttura della landing, testi delle sezioni e stili |
| [`public/media/`](public/media/) | Immagini, modello 3D, decoder e pieghevole serviti dal sito |
| [`assets/`](assets/) | Originali, derivati di lavorazione e PDF operativo archiviati nel repository pubblico |
| [`docs/`](docs/) | Istruzioni per mantenere, verificare e pubblicare la landing |

Gli originali e il PDF con il budget in `assets/` sono consultabili su GitHub. La build statica include solo il codice compilato e le risorse web di `public/`.

## Documentazione

- [Architettura della landing](docs/architettura.md)
- [Aggiornare contenuti e asset](docs/contenuti-e-asset.md)
- [Collaudo, deploy e rollback](docs/collaudo-e-rilascio.md)
- [Brief Scroll Craft](docs/brief-scroll-craft.md)
