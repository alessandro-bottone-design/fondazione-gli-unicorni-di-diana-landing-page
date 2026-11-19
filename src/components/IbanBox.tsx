import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Landmark } from 'lucide-react'
import { iban } from '@/content'

/** Reusable IBAN donation box with one-click clipboard copy. */
export function IbanBox({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
  }, [])

  async function copyIban() {
    let ok = false
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(iban.code)
        ok = true
      } catch {
        ok = false
      }
    }
    if (!ok) {
      const input = document.createElement('textarea')
      input.value = iban.code
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      ok = document.execCommand('copy')
      document.body.removeChild(input)
    }
    if (!ok) return
    setCopied(true)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className={`iban-box${compact ? ' iban-box--compact' : ''}`}>
      <div className="iban-box-info">
        <p className="iban-box-label">
          <Landmark size={15} strokeWidth={1.7} />
          <span>Bonifico · Intestato a <strong>{iban.beneficiary}</strong></span>
        </p>
        <code className="iban-box-code">{iban.code}</code>
      </div>
      <button
        type="button"
        className="iban-copy-btn"
        onClick={copyIban}
        aria-label={copied ? 'IBAN copiato negli appunti' : 'Copia IBAN negli appunti'}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        <span>{copied ? 'Copiato' : 'Copia IBAN'}</span>
      </button>
    </div>
  )
}
