import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import type { ComponentProps } from 'react'

// shadcn/ui Dialog anatomy, styled with the foundation's own tokens.
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export function DialogContent({ className = '', children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  const reduced = useReducedMotion()

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay" />
      <DialogPrimitive.Content className={`dialog-content ${className}`} asChild {...props}>
        <m.div initial={reduced ? false : { x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.24, ease: 'easeOut' }}>
          <DialogPrimitive.Close className="icon-button dialog-close" aria-label="Chiudi pannello">
            <X size={24} />
          </DialogPrimitive.Close>
          {children}
        </m.div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
