# Fondazione Gli Unicorni di Diana

Landing per la sensibilizzazione alla donazione di sangue e midollo osseo. Il viaggio parte dal ritratto di Diana e attraversa la storia della Fondazione, le informazioni per donare, gli eventi e gli articoli solidali. Si chiude con i contatti della Fondazione.

## Contenuto della consegna

- `dist/` contiene la build pronta per un hosting statico. Pubblica il contenuto della cartella alla radice del sito.
- `src/` e `public/` contengono il progetto modificabile e i media usati dalla landing.
- `docs/` raccoglie le istruzioni di manutenzione e collaudo.

Per vedere la build già compilata in locale, avvia un server HTTP dalla radice del progetto.

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Apri [localhost:8080](http://localhost:8080/).

## Modifica e ricompilazione

Servono **Node.js 24** e npm. Dalla radice della cartella:

```sh
npm ci
npm run dev
```

Apri l’URL indicato da Vite. Il menu nell’intestazione porta alle sei tappe e il pulsante **Versione lineare** mostra la stessa pagina in flusso normale, senza scena 3D: si attiva da solo se il sistema chiede movimento ridotto, se WebGL non è disponibile o se il modello 3D non si carica. Per provare i file che verranno pubblicati:

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
| [`src/components/`](src/components/) | Componenti della pagina e dialoghi |
| [`src/worldflight/`](src/worldflight/) | Tappe, posizione della camera, caricamento WebGL e sincronizzazione con lo scroll |
| [`src/App.tsx`](src/App.tsx) e [`src/styles.css`](src/styles.css) | Struttura della landing, testi delle sezioni e stili |
| [`public/media/`](public/media/) | Immagini, modello 3D, decoder e pieghevole serviti dal sito |
| [`docs/`](docs/) | Istruzioni per mantenere, verificare e pubblicare la landing |

Gli originali di lavorazione sono conservati nel progetto sorgente. La cartella `public/` contiene le risorse usate dalla landing, incluso il modello 3D esportato per il web.

## Documentazione

- [Architettura della landing](docs/architettura.md)
- [Aggiornare contenuti e asset](docs/contenuti-e-asset.md)
- [Collaudo, deploy e rollback](docs/collaudo-e-rilascio.md)
- [Brief Scroll Craft](docs/brief-scroll-craft.md)
