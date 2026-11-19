import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// shadcn/ui Dialog anatomy, styled with the foundation's own tokens.
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  variant?: 'drawer' | 'card'
}

export function DialogContent({
  className = '',
  variant = 'drawer',
  children,
  ...props
}: DialogContentProps) {
  const reduced = useReducedMotion()
  const initial = reduced
    ? false
    : variant === 'card'
      ? { scale: 0.96, y: 12, opacity: 0 }
      : { x: 24, opacity: 0 }
  const animate = variant === 'card' ? { scale: 1, y: 0, opacity: 1 } : { x: 0, opacity: 1 }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay" />
      <DialogPrimitive.Content className={cn('dialog-content', className)} asChild {...props}>
        <m.div
          initial={initial}
          animate={animate}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          <DialogPrimitive.Close className="icon-button dialog-close" aria-label="Chiudi pannello">
            <X size={24} />
          </DialogPrimitive.Close>
          {children}
        </m.div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
