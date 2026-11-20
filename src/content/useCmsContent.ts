import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  baseSphereEvents,
  expandToSphereItems,
  featuredProjects as defaultProjects,
  solidarity as defaultGadgets,
  upcomingEvents as defaultUpcomingEvents,
} from './index'
import type {
  ArchiveEventItem,
  FeaturedProject,
  SolidarityProduct,
  UpcomingEvent,
} from './index'

export interface CmsContentState {
  projects: readonly FeaturedProject[]
  upcomingEvents: readonly UpcomingEvent[]
  gadgets: readonly SolidarityProduct[]
  archiveItems: readonly ArchiveEventItem[]
  sphereItems: ArchiveEventItem[]
  refresh: () => Promise<void>
}

export function useCmsContent(): CmsContentState {
  const [projects, setProjects] = useState<readonly FeaturedProject[]>(defaultProjects)
  const [upcomingEvents, setUpcomingEvents] = useState<readonly UpcomingEvent[]>(defaultUpcomingEvents)
  const [gadgets, setGadgets] = useState<readonly SolidarityProduct[]>(defaultGadgets)
  const [archiveItems, setArchiveItems] = useState<readonly ArchiveEventItem[]>(baseSphereEvents)

  const refresh = useCallback(async () => {
    try {
      const [projRes, upRes, gadRes, archRes] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('upcoming_events')
          .select('*')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('gadgets')
          .select('*')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('archive_events')
          .select('*')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true }),
      ])

      if (!projRes.error && projRes.data && projRes.data.length > 0) {
        setProjects(
          projRes.data.map((row) => ({
            id: String(row.id),
            title: String(row.title),
            badge: String(row.badge ?? 'Progetto in evidenza'),
            place: String(row.place ?? ''),
            summary: String(row.summary ?? ''),
            detail: String(row.detail ?? ''),
            imageSrc: String(row.image_src ?? '/media/archivio/donare-insieme.webp'),
            ctaLabel: String(row.cta_label ?? 'Scopri di più'),
            ctaUrl: String(row.cta_url ?? '#contatti'),
            sortOrder: Number(row.sort_order ?? 0),
            isVisible: Boolean(row.is_visible ?? true),
          })),
        )
      }

      if (!upRes.error && upRes.data) {
        setUpcomingEvents(
          upRes.data.map((row) => ({
            id: String(row.id),
            title: String(row.title),
            category: String(row.category ?? 'Incontro'),
            place: String(row.place ?? ''),
            dateLabel: String(row.date_label ?? ''),
            dateIso: row.date_iso ? String(row.date_iso) : undefined,
            summary: String(row.summary ?? ''),
            detail: String(row.detail ?? ''),
            imageSrc: String(row.image_src ?? '/media/marchio.webp'),
            ctaLabel: String(row.cta_label ?? 'Chiedi informazioni a Rossella'),
            ctaUrl: String(row.cta_url ?? '#contatti'),
            sortOrder: Number(row.sort_order ?? 0),
            isVisible: Boolean(row.is_visible ?? true),
          })),
        )
      }

      if (!gadRes.error && gadRes.data && gadRes.data.length > 0) {
        setGadgets(
          gadRes.data.map((row) => ({
            id: String(row.id),
            label: String(row.label),
            item: String(row.item),
            kind: row.kind === 'gratuito' ? 'gratuito' : 'solidale',
            icon: (row.icon as SolidarityProduct['icon']) ?? 'shirt',
            category: String(row.category ?? (row.kind === 'gratuito' ? 'Gadget gratuito' : 'Gadget solidale')),
            price: String(row.price ?? ''),
            badge: row.badge ? String(row.badge) : undefined,
            glb: String(row.glb ?? '/media/gadget/spilla.glb'),
            src: String(row.src ?? '/media/gadget/spilla.webp'),
            alt: String(row.alt ?? row.label),
            description: String(row.description ?? ''),
            availabilityNote: String(row.availability_note ?? ''),
          })),
        )
      }

      if (!archRes.error && archRes.data && archRes.data.length > 0) {
        setArchiveItems(
          archRes.data.map((row) => ({
            id: String(row.id),
            title: String(row.title),
            category: row.category ? String(row.category) : undefined,
            place: row.place ? String(row.place) : undefined,
            date: row.date_label ? String(row.date_label) : undefined,
            dateTime: row.date_iso ? String(row.date_iso) : undefined,
            summary: row.summary ? String(row.summary) : undefined,
            description: row.description ? String(row.description) : undefined,
            sourceLabel: row.source_label ? String(row.source_label) : undefined,
            url: row.url ? String(row.url) : undefined,
            src: String(row.src),
            fullSrc: String(row.full_src ?? row.src),
            alt: String(row.alt ?? row.title),
            isPlaceholder: Boolean(row.is_placeholder ?? false),
          })),
        )
      }
    } catch {
      // Fallback silently to bundled content when offline or unreachable
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    projects,
    upcomingEvents,
    gadgets,
    archiveItems,
    sphereItems: expandToSphereItems(archiveItems),
    refresh,
  }
}
