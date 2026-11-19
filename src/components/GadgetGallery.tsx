import { ArrowUpRight, MessageCircle, Rotate3d } from 'lucide-react'
import { iban, solidarity, whatsapp } from '@/content'
import { IbanBox } from '@/components/IbanBox'

export interface GadgetGalleryProps {
  selectedId: string
  onSelect: (id: string) => void
}

/** Compact 3D merch HUD overlay synced with the interactive models in UnicornScene. */
export function GadgetGallery({ selectedId, onSelect }: GadgetGalleryProps) {
  const active = solidarity.find((item) => item.id === selectedId) ?? solidarity[0]

  return (
    <div className="merch-hud">
      <div className="merch-hud-top">
        <div className="merch-hud-heading">
          <h2 id="gadgets-title">Da portare <em>con te.</em></h2>
          <p className="merch-hud-hint">
            <Rotate3d size={15} strokeWidth={1.7} />
            <span>Trascina per ruotare o clicca un modello 3D · {iban.proceedsNote}</span>
          </p>
        </div>

        <div className="merch-pills" role="group" aria-label="Scegli un articolo solidale">
          {solidarity.map((product) => {
            const isSelected = product.id === active.id
            return (
              <button
                key={product.id}
                type="button"
                className={`gadget-chip${isSelected ? ' is-selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => onSelect(product.id)}
              >
                {product.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="merch-hud-body">
        <div className="merch-hud-copy">
          <div className="merch-hud-meta">
            <h3>{active.label}</h3>
            <span className="modal-card-price">{active.price}</span>
            {active.badge && <span className="modal-card-badge">{active.badge}</span>}
          </div>
          <p className="merch-hud-desc">{active.description}</p>
        </div>

        <div className="merch-hud-actions">
          <IbanBox compact />
          <a
            className="button button-ink merch-hud-cta"
            href={whatsapp(`Ciao Rossella, vorrei informazioni per acquistare ${active.item} (${active.price}) degli Unicorni di Diana e sostenere i vostri progetti.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} />
            <span>Chiedi a Rossella</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default GadgetGallery
