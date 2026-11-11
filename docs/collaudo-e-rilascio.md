# Collaudo, deploy e rollback

## Preparare una build

Usa Node.js 24 e installa dal lockfile. Controlla TypeScript e avvia un’anteprima di `dist/`.

```sh
npm ci
npm run check
npm run build
npm run preview
```

## Checklist

Ripeti i controlli sulla build locale e sulla preview Vercel.

- Percorri il viaggio dall’hero ai contatti su desktop e viewport mobile. Scorri anche all’indietro. Controlla leggibilità dei pannelli, inquadratura dell’archivio e inviti finali.
- Apri direttamente `/#eventi` e `/#contatti`. Usa il menu, Torna all’inizio e Indietro del browser. Prova il cambio di modalità a metà viaggio e controlla che rimanga la stessa tappa.
- Usa Tab, Invio ed Esc. Apri una scheda evento e una locandina, poi verifica che il focus torni al controllo che aveva aperto il dialogo. Nel viaggio 3D i controlli delle altre tappe devono restare fuori dalla sequenza di Tab.
- Emula il movimento ridotto. Ripeti poi il caricamento bloccando `/media/scena-unicorni.glb` negli strumenti di sviluppo. Controlla che la versione lineare sia utilizzabile in entrambi i casi.
- Controlla Instagram, Facebook e `tel:`. Per WhatsApp verifica il numero e i quattro testi degli articoli solidali, senza inviare messaggi. Apri i collegamenti informativi e il pieghevole.
- Verifica in Network che immagini, GLB, decoder Draco e pieghevole siano caricati dal percorso previsto. Controlla che `dist/` non contenga gli originali o il PDF operativo e che l’host non serva il budget.

## Primo rilascio su Vercel

Il repository di consegna è pubblico. Verifica l’inventario del commit, pubblica `main` e annota lo SHA. Configura il progetto nel team **ABDesign** e collegalo al repository. Usa preset Vite, Node.js 24, `npm ci`, `npm run build` e `dist` come directory di output. [Repository GitHub](https://github.com/alessandro-bottone-design/fondazione-gli-unicorni-di-diana-landing-page) · [Vite su Vercel](https://vercel.com/docs/frameworks/frontend/vite)

Crea una **Preview** per lo SHA pubblicato e completa la checklist. Promuovi lo stesso commit in **Production** sull’URL `.vercel.app`. La promozione di una preview può ricompilare il progetto nell’ambiente Production. Dopo la promozione ricontrolla SHA, URL, pagina e richieste degli asset. Annota gli URL di preview e produzione nel resoconto del rilascio. Il dominio della Fondazione si gestisce separatamente. [Promuovere una preview](https://vercel.com/docs/deployments/promoting-a-deployment)

Per aggiornamenti successivi, usa un branch di lavoro e verifica la preview prima del merge su `main`. Con l’integrazione Git attiva, un aggiornamento del branch di produzione può avviare la pubblicazione automatica. [Integrazione Git su Vercel](https://vercel.com/docs/git)

## Rollback

Se una pubblicazione successiva introduce una regressione, individua l’ultimo deployment Production verificato nella dashboard del progetto. Usa **Instant Rollback** quando è disponibile, poi riprova l’URL e registra lo SHA ripristinato. Il rollback cambia il deployment servito, mentre il branch Git richiede un fix o un revert esplicito. Per il primo rilascio può non esserci un deployment precedente. [Instant Rollback](https://vercel.com/docs/instant-rollback)
