import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog'

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface SphericalPosition {
  theta: number
  phi: number
  radius: number
}

export interface WorldPosition extends Position3D {
  scale: number
  zIndex: number
  isVisible: boolean
  fadeOpacity: number
  originalIndex: number
}

export interface ImageData {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
  category?: string
  place?: string
  date?: string
  dateTime?: string
  summary?: string
  fullSrc?: string
  sourceLabel?: string
  url?: string
  isPlaceholder?: boolean
}

export interface SphereImageGridProps {
  images?: ImageData[]
  containerSize?: number
  sphereRadius?: number
  dragSensitivity?: number
  momentumDecay?: number
  maxRotationSpeed?: number
  baseImageScale?: number
  hoverScale?: number
  perspective?: number
  autoRotate?: boolean
  autoRotateSpeed?: number
  className?: string
}

interface RotationState {
  x: number
  y: number
  z: number
}

interface VelocityState {
  x: number
  y: number
}

const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180)

function normalizeAngle(angle: number) {
  let value = angle
  while (value > 180) value -= 360
  while (value < -180) value += 360
  return value
}

const SphereImageGrid: React.FC<SphereImageGridProps> = ({
  images = [],
  containerSize = 400,
  sphereRadius,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseImageScale = 0.14,
  hoverScale = 1.2,
  perspective = 1000,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  className = '',
}) => {
  const reducedMotion = useReducedMotion()
  const [rotation, setRotation] = useState<RotationState>({ x: 14, y: 18, z: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const velocity = useRef<VelocityState>({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const isHoveredRef = useRef(false)
  const isModalOpenRef = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const dragDistance = useRef(0)
  const animationFrame = useRef<number | null>(null)

  const actualSphereRadius = sphereRadius || containerSize * 0.42
  const baseImageSize = containerSize * baseImageScale

  isHoveredRef.current = hoveredIndex !== null
  isModalOpenRef.current = selectedImage !== null

  // The sphere repeats the same events to fill its bubbles, so the keyboard
  // fallback lists each event once.
  const uniqueImages = useMemo(() => {
    const seen = new Set<string>()
    return images.filter((image) => {
      const key = image.title ?? image.alt ?? image.id
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [images])

  const clampRotationSpeed = useCallback(
    (speed: number) => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, speed)),
    [maxRotationSpeed],
  )

  const imagePositions = useMemo<SphericalPosition[]>(() => {
    const count = images.length
    if (!count) return []
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const angleIncrement = (2 * Math.PI) / goldenRatio
    const positions: SphericalPosition[] = []

    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count
      const inclination = Math.acos(1 - 2 * t)
      const azimuth = angleIncrement * i

      let phi = inclination * (180 / Math.PI)
      let theta = (azimuth * (180 / Math.PI)) % 360

      const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35
      phi = phi < 90 ? Math.max(5, phi - poleBonus) : Math.min(175, phi + poleBonus)
      phi = 15 + (phi / 180) * 150

      // Deterministic pseudo-jitter avoids layout jumps across renders.
      const thetaJitter = Math.sin(i * 12.9898) * 7
      const phiJitter = Math.cos(i * 78.233) * 4
      theta = (theta + thetaJitter) % 360
      phi = Math.max(8, Math.min(172, phi + phiJitter))

      positions.push({ theta, phi, radius: actualSphereRadius })
    }

    return positions
  }, [images.length, actualSphereRadius])

  const worldPositions = useMemo<WorldPosition[]>(() => {
    const positions = imagePositions.map((pos, index) => {
      const thetaRad = degreesToRadians(pos.theta)
      const phiRad = degreesToRadians(pos.phi)
      const rotXRad = degreesToRadians(rotation.x)
      const rotYRad = degreesToRadians(rotation.y)

      let x = pos.radius * Math.sin(phiRad) * Math.cos(thetaRad)
      let y = pos.radius * Math.cos(phiRad)
      let z = pos.radius * Math.sin(phiRad) * Math.sin(thetaRad)

      const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad)
      const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad)
      x = x1
      z = z1

      const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad)
      const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad)
      y = y2
      z = z2

      const fadeZoneStart = -10
      const fadeZoneEnd = -30
      const isVisible = z > fadeZoneEnd
      const fadeOpacity = z <= fadeZoneStart
        ? Math.max(0, (z - fadeZoneEnd) / (fadeZoneStart - fadeZoneEnd))
        : 1

      const isPoleImage = pos.phi < 30 || pos.phi > 150
      const distanceFromCenter = Math.hypot(x, y)
      const distanceRatio = Math.min(distanceFromCenter / actualSphereRadius, 1)
      const distancePenalty = isPoleImage ? 0.4 : 0.7
      const centerScale = Math.max(0.3, 1 - distanceRatio * distancePenalty)
      const depthScale = (z + actualSphereRadius) / (2 * actualSphereRadius)
      const scale = centerScale * Math.max(0.5, 0.8 + depthScale * 0.3)

      return {
        x,
        y,
        z,
        scale,
        zIndex: Math.round(1000 + z),
        isVisible,
        fadeOpacity,
        originalIndex: index,
      }
    })

    const adjusted = [...positions]
    for (let i = 0; i < adjusted.length; i++) {
      const pos = adjusted[i]
      if (!pos.isVisible) continue

      let adjustedScale = pos.scale
      const imageSize = baseImageSize * adjustedScale

      for (let j = 0; j < adjusted.length; j++) {
        if (i === j) continue
        const other = adjusted[j]
        if (!other.isVisible) continue

        const otherSize = baseImageSize * other.scale
        const distance = Math.hypot(pos.x - other.x, pos.y - other.y)
        const minDistance = (imageSize + otherSize) / 2 + Math.max(14, containerSize * 0.036)

        if (distance < minDistance && distance > 0) {
          const overlap = minDistance - distance
          const reduction = Math.max(0.42, 1 - (overlap / minDistance) * 0.58)
          adjustedScale = Math.min(adjustedScale, adjustedScale * reduction)
        }
      }

      adjusted[i] = { ...pos, scale: Math.max(0.28, adjustedScale) }
    }

    return adjusted
  }, [imagePositions, rotation, actualSphereRadius, baseImageSize, containerSize])

  const applyDragDelta = useCallback(
    (deltaX: number, deltaY: number) => {
      dragDistance.current += Math.hypot(deltaX, deltaY)
      const dx = clampRotationSpeed(-deltaY * dragSensitivity)
      const dy = clampRotationSpeed(deltaX * dragSensitivity)

      velocity.current = { x: dx, y: dy }
      setRotation((prev) => ({
        x: normalizeAngle(prev.x + dx),
        y: normalizeAngle(prev.y + dy),
        z: prev.z,
      }))
    },
    [clampRotationSpeed, dragSensitivity],
  )

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    isDraggingRef.current = true
    setIsDragging(true)
    dragDistance.current = 0
    velocity.current = { x: 0, y: 0 }
    lastMousePos.current = { x: event.clientX, y: event.clientY }
  }, [])

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    isDraggingRef.current = true
    setIsDragging(true)
    dragDistance.current = 0
    velocity.current = { x: 0, y: 0 }
    lastMousePos.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (!isDraggingRef.current) return
      const deltaX = event.clientX - lastMousePos.current.x
      const deltaY = event.clientY - lastMousePos.current.y
      lastMousePos.current = { x: event.clientX, y: event.clientY }
      applyDragDelta(deltaX, deltaY)
    }

    function handleTouchMove(event: TouchEvent) {
      if (!isDraggingRef.current) return
      const touch = event.touches[0]
      if (!touch) return
      event.preventDefault()
      const deltaX = touch.clientX - lastMousePos.current.x
      const deltaY = touch.clientY - lastMousePos.current.y
      lastMousePos.current = { x: touch.clientX, y: touch.clientY }
      applyDragDelta(deltaX, deltaY)
    }

    function stopDragging() {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      setIsDragging(false)
      requestAnimationFrame(() => {
        dragDistance.current = 0
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopDragging)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', stopDragging)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', stopDragging)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', stopDragging)
    }
  }, [applyDragDelta])

  useEffect(() => {
    function animate() {
      if (!isDraggingRef.current) {
        const vx = velocity.current.x * momentumDecay
        const vy = velocity.current.y * momentumDecay
        velocity.current = {
          x: Math.abs(vx) < 0.01 ? 0 : vx,
          y: Math.abs(vy) < 0.01 ? 0 : vy,
        }

        const shouldAutoRotate =
          autoRotate && !reducedMotion && !isHoveredRef.current && !isModalOpenRef.current
        const stepX = clampRotationSpeed(velocity.current.x)
        const stepY = clampRotationSpeed(velocity.current.y) + (shouldAutoRotate ? autoRotateSpeed : 0)

        if (Math.abs(stepX) >= 0.01 || Math.abs(stepY) >= 0.01) {
          setRotation((prev) => ({
            x: normalizeAngle(prev.x + stepX),
            y: normalizeAngle(prev.y + stepY),
            z: prev.z,
          }))
        }
      }

      animationFrame.current = requestAnimationFrame(animate)
    }

    animationFrame.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [autoRotate, autoRotateSpeed, clampRotationSpeed, momentumDecay, reducedMotion])

  if (!images.length) return null

  return (
    <>
      <div
        className={`relative select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
        style={{
          width: containerSize,
          height: containerSize,
          perspective: `${perspective}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        aria-label="Sfera interattiva degli eventi, trascina per ruotare"
      >
        <div className="relative w-full h-full">
          {images.map((image, index) => {
            const position = worldPositions[index]
            if (!position || !position.isVisible) return null

            const imageSize = baseImageSize * position.scale
            const isHovered = hoveredIndex === index
            const finalScale = isHovered ? Math.min(hoverScale, hoverScale / position.scale) : 1

            return (
              <button
                key={image.id}
                type="button"
                aria-label={
                  image.title
                    ? `${image.title}${image.isPlaceholder ? ' (foto in arrivo)' : ''}, apri i dettagli`
                    : image.alt
                }
                className={`sphere-node${image.isPlaceholder ? ' sphere-node--placeholder' : ''} group absolute cursor-pointer select-none transition-transform duration-200 ease-out`}
                style={{
                  width: `${imageSize}px`,
                  height: `${imageSize}px`,
                  left: `${containerSize / 2 + position.x}px`,
                  top: `${containerSize / 2 + position.y}px`,
                  opacity: position.fadeOpacity,
                  transform: `translate(-50%, -50%) scale(${finalScale})`,
                  zIndex: position.zIndex,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                onClick={() => {
                  if (dragDistance.current > 8) return
                  setSelectedImage(image)
                }}
              >
                <span className="sphere-node-ring block w-full h-full rounded-full overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
                    draggable={false}
                    loading={index < 7 ? 'eager' : 'lazy'}
                  />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <details className="archive-index">
        <summary>Elenco degli eventi ({uniqueImages.length})</summary>
        <ul>
          {uniqueImages.map((image) => {
            const meta = [image.category, image.date ?? image.place].filter(Boolean).join(' · ')
            return (
              <li key={image.id}>
                <button type="button" onClick={() => setSelectedImage(image)}>
                  <span className="archive-index-title">{image.title ?? image.alt}</span>
                  {(meta || image.isPlaceholder) && (
                    <span className="archive-index-meta">
                      {meta}
                      {image.isPlaceholder && (
                        <span className="archive-index-badge">Foto in arrivo</span>
                      )}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </details>

      <Dialog open={selectedImage !== null} onOpenChange={(open) => { if (!open) setSelectedImage(null) }}>
        <DialogContent variant="card" className="modal-card sphere-dialog">
          {selectedImage && (
            <>
              <p className="modal-card-category">{selectedImage.category ?? 'Archivio'}</p>
              <div className="modal-card-media modal-card-media--contain">
                <img
                  src={selectedImage.fullSrc ?? selectedImage.src}
                  alt={selectedImage.alt}
                />
              </div>
              <DialogTitle>{selectedImage.title ?? selectedImage.alt}</DialogTitle>
              <DialogDescription>{selectedImage.summary ?? selectedImage.description ?? selectedImage.alt}</DialogDescription>
              {selectedImage.description && <p className="modal-card-detail">{selectedImage.description}</p>}
              {selectedImage.isPlaceholder && (
                <p className="modal-card-detail">Immagine segnaposto: la fotografia dell’incontro non è ancora disponibile.</p>
              )}
              {(selectedImage.place || selectedImage.date) && (
                <div className="modal-card-note">
                  <MapPin size={16} strokeWidth={1.7} />
                  <div className="modal-card-note-body">
                    {selectedImage.place && <span>{selectedImage.place}</span>}
                    {selectedImage.date && (
                      <time dateTime={selectedImage.dateTime}>{selectedImage.date}</time>
                    )}
                  </div>
                </div>
              )}
              <a
                className="button button-ink modal-card-cta"
                href={selectedImage.url ?? selectedImage.fullSrc ?? selectedImage.src}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{selectedImage.sourceLabel ?? 'Apri l’immagine a grandezza originale'}</span>
                <ArrowUpRight size={16} />
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SphereImageGrid
