import React, { useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import type { FeaturedProject } from '@/content'

export interface ExpandableGalleryProps {
  images?: string[]
  projects?: readonly FeaturedProject[]
  className?: string
}

export const ExpandableGallery: React.FC<ExpandableGalleryProps> = ({
  images = [],
  projects,
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const items: FeaturedProject[] = projects
    ? [...projects]
    : images.map((src, index) => ({
        id: `img-${index}`,
        title: `Immagine ${index + 1}`,
        badge: 'Galleria',
        place: '',
        summary: '',
        detail: '',
        imageSrc: src,
        ctaLabel: '',
        ctaUrl: '',
      }))

  const openImage = (index: number) => {
    setSelectedIndex(index)
  }

  const closeImage = () => {
    setSelectedIndex(null)
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null && items.length > 0) {
      setSelectedIndex((selectedIndex + 1) % items.length)
    }
  }

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null && items.length > 0) {
      setSelectedIndex((selectedIndex - 1 + items.length) % items.length)
    }
  }

  const getFlexValue = (index: number) => {
    if (hoveredIndex === null) {
      return 1
    }
    return hoveredIndex === index ? 2.15 : 0.65
  }

  const activeItem = selectedIndex !== null ? items[selectedIndex] : null

  return (
    <div className={className}>
      {/* Horizontal Expandable Gallery */}
      <div className="expandable-gallery-row">
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index
          return (
            <m.article
              key={item.id}
              className={`expandable-project-card${isHovered ? ' is-hovered' : ''}`}
              style={{ flex: 1 }}
              animate={{ flex: getFlexValue(index) }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              onClick={() => openImage(index)}
              tabIndex={0}
              role="button"
              aria-label={`${item.title}, apri scheda progetto`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openImage(index)
                }
              }}
            >
              <img
                src={item.imageSrc}
                alt={item.title}
                className="expandable-project-img"
                loading="lazy"
              />
              <m.div
                className="expandable-project-overlay"
                initial={{ opacity: 0.45 }}
                animate={{ opacity: isHovered ? 0.25 : 0.52 }}
                transition={{ duration: 0.3 }}
              />
              <div className="expandable-project-content">
                <span className="expandable-project-badge">{item.badge}</span>
                <h3 className="expandable-project-title">{item.title}</h3>
                {item.place && (
                  <p className="expandable-project-place">
                    <MapPin size={14} strokeWidth={1.8} />
                    <span>{item.place}</span>
                  </p>
                )}
                <p className="expandable-project-summary">{item.summary}</p>
                <span className="expandable-project-more">
                  <span>Apri il progetto</span>
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </m.article>
          )
        })}
      </div>

      {/* Expanded View Modal */}
      <AnimatePresence>
        {selectedIndex !== null && activeItem && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="dialog-overlay expandable-modal-backdrop"
            onClick={closeImage}
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
          >
            {/* Previous Button */}
            {items.length > 1 && (
              <button
                type="button"
                className="icon-button expandable-modal-nav expandable-modal-nav--prev"
                onClick={goToPrev}
                aria-label="Progetto precedente"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Expanded Project Modal Card */}
            <m.div
              key={activeItem.id}
              className="dialog-content modal-card expandable-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.26 }}
            >
              <button
                type="button"
                className="icon-button dialog-close"
                onClick={closeImage}
                aria-label="Chiudi scheda progetto"
              >
                <X size={20} />
              </button>

              <p className="modal-card-category">{activeItem.badge}</p>
              <div className="modal-card-media modal-card-media--contain">
                <img src={activeItem.imageSrc} alt={activeItem.title} />
              </div>
              <h2>{activeItem.title}</h2>
              {activeItem.summary && <p>{activeItem.summary}</p>}
              {activeItem.detail && <p className="modal-card-detail">{activeItem.detail}</p>}
              {activeItem.place && (
                <div className="modal-card-note">
                  <MapPin size={16} strokeWidth={1.7} />
                  <div className="modal-card-note-body">
                    <span>{activeItem.place}</span>
                  </div>
                </div>
              )}
              {activeItem.ctaUrl && (
                <a
                  className="button button-ink modal-card-cta"
                  href={activeItem.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{activeItem.ctaLabel || 'Contatta Rossella'}</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
              <div className="expandable-modal-counter">
                {selectedIndex + 1} / {items.length}
              </div>
            </m.div>

            {/* Next Button */}
            {items.length > 1 && (
              <button
                type="button"
                className="icon-button expandable-modal-nav expandable-modal-nav--next"
                onClick={goToNext}
                aria-label="Progetto successivo"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExpandableGallery
