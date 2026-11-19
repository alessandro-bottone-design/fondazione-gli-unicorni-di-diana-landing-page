import { useState } from 'react'
import { ArrowUpRight, Info, MessageCircle } from 'lucide-react'
import { solidarity, whatsapp } from '@/content'
import type { SolidarityProduct } from '@/content'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { TiltedGridHero } from '@/components/ui/tilted-grid-hero'

type GalleryItem = SolidarityProduct & { title: string }

const galleryItems: GalleryItem[] = solidarity.map((product) => ({
  ...product,
  title: product.label,
}))

export function GadgetGallery() {
  const [selectedProduct, setSelectedProduct] = useState<SolidarityProduct | null>(null)

  return (
    <div className="gadget-showcase">
      <div className="gadget-showcase-head">
        <h2 id="gadgets-title">Da portare<br /> <em>con te.</em></h2>
        <p>Acquisti solidali per sostenere le attività degli Unicorni di Diana. Clicca un articolo per aprire la scheda.</p>
      </div>

      <TiltedGridHero
        images={galleryItems}
        aspectRatio={4 / 3}
        tileHeight={45}
        axis={50}
        curve={74}
        fade={10}
        speed={4.5}
        gap={7}
        paused={selectedProduct !== null}
        bandLabel="Galleria degli articoli solidali, clicca un prodotto per vedere i dettagli"
        onImageClick={(item) => setSelectedProduct(item)}
        className="gadget-ribbon w-full"
      />

      <Dialog open={selectedProduct !== null} onOpenChange={(open) => { if (!open) setSelectedProduct(null) }}>
        <DialogContent variant="card" className="modal-card gadget-dialog">
          {selectedProduct && (
            <>
              <p className="modal-card-category">{selectedProduct.category}</p>
              <div className="modal-card-media">
                <img src={selectedProduct.src} alt={selectedProduct.alt} />
              </div>
              <DialogTitle>{selectedProduct.label}</DialogTitle>
              <DialogDescription>{selectedProduct.description}</DialogDescription>
              <p className="modal-card-note">
                <Info size={16} strokeWidth={1.7} />
                <span>{selectedProduct.availabilityNote}</span>
              </p>
              <a
                className="button button-ink modal-card-cta"
                href={whatsapp(`Ciao Rossella, vorrei informazioni per acquistare ${selectedProduct.item} degli Unicorni di Diana e sostenere le vostre attività.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                <span>Chiedi a Rossella su WhatsApp</span>
                <ArrowUpRight size={16} />
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GadgetGallery
