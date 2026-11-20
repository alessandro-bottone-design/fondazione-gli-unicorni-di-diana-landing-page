import { ArrowUpRight, Gift, HeartHandshake, MessageCircle, Phone, Rotate3d } from 'lucide-react'
import { contacts, solidarity, whatsapp } from '@/content'
import type { SolidarityProduct } from '@/content'

export interface GadgetGalleryProps {
  gadgets?: readonly SolidarityProduct[]
  selectedId: string
  onSelect: (id: string) => void
}

/** Compact 3D merch HUD overlay synced with the interactive models in UnicornScene. */
export function GadgetGallery({ gadgets = solidarity, selectedId, onSelect }: GadgetGalleryProps) {
  const items = gadgets.length > 0 ? gadgets : solidarity
  const active = items.find((item) => item.id === selectedId) ?? items[0]
  const activeKind = active.kind

  const solidaliItems = items.filter((item) => item.kind === 'solidale')
  const gratuitiItems = items.filter((item) => item.kind === 'gratuito')
  const visibleGroupItems = activeKind === 'gratuito' ? gratuitiItems : solidaliItems

  const whatsappText =
    active.kind === 'gratuito'
      ? `Ciao Rossella, vorrei informazioni per ricevere ${active.item} (gadget gratuito) degli Unicorni di Diana.`
      : `Ciao Rossella, vorrei informazioni per richiedere ${active.item} (${active.price}) degli Unicorni di Diana e sostenere i vostri progetti.`

  function selectKind(kind: 'solidale' | 'gratuito') {
    const firstOfKind = items.find((item) => item.kind === kind)
    if (firstOfKind) {
      onSelect(firstOfKind.id)
    }
  }

  return (
    <div className="merch-hud">
      <div className="merch-hud-top">
        <div className="merch-hud-heading">
          <h2 id="gadgets-title">
            Da portare <em>con te.</em>
          </h2>
          <p className="merch-hud-hint">
            <Rotate3d size={15} strokeWidth={1.7} />
            <span>
              Trascina per ruotare il modello 3D · Per tutti i gadget <strong>contatta direttamente Rossella</strong>
            </span>
          </p>
        </div>

        <div className="merch-kind-tabs" role="tablist" aria-label="Categoria gadget">
          <button
            type="button"
            role="tab"
            aria-selected={activeKind === 'solidale'}
            className={`merch-kind-tab${activeKind === 'solidale' ? ' is-active' : ''}`}
            onClick={() => selectKind('solidale')}
          >
            <HeartHandshake size={16} />
            <span>Gadget Solidali ({solidaliItems.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeKind === 'gratuito'}
            className={`merch-kind-tab${activeKind === 'gratuito' ? ' is-active' : ''}`}
            onClick={() => selectKind('gratuito')}
          >
            <Gift size={16} />
            <span>Spilla, Penna e Bracciale · Gratuiti ({gratuitiItems.length})</span>
          </button>
        </div>
      </div>

      <div className="merch-pills-row">
        <div
          className="merch-pills"
          role="group"
          aria-label={activeKind === 'gratuito' ? 'Scegli un gadget gratuito' : 'Scegli un gadget solidale'}
        >
          {visibleGroupItems.map((product) => {
            const isSelected = product.id === active.id
            return (
              <button
                key={product.id}
                type="button"
                className={`gadget-chip${isSelected ? ' is-selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => onSelect(product.id)}
              >
                <span>{product.label}</span>
                <span className="gadget-chip-price">{product.price}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="merch-hud-body">
        <div className="merch-hud-copy">
          <div className="merch-hud-meta">
            <h3>{active.label}</h3>
            <span className={`modal-card-price${active.kind === 'gratuito' ? ' modal-card-price--free' : ''}`}>
              {active.price}
            </span>
            {active.badge && <span className="modal-card-badge">{active.badge}</span>}
          </div>
          <p className="merch-hud-desc">{active.description}</p>
          {active.availabilityNote && <p className="merch-hud-note">{active.availabilityNote}</p>}
        </div>

        <div className="merch-hud-actions">
          <a
            className="button button-outline merch-hud-phone"
            href={`tel:${contacts.telephone}`}
          >
            <Phone size={17} />
            <span>Chiama Rossella</span>
          </a>
          <a
            className="button button-ink merch-hud-cta"
            href={whatsapp(whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} />
            <span>{active.kind === 'gratuito' ? 'Richiedi gratis a Rossella' : 'Contatta Rossella'}</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default GadgetGallery
