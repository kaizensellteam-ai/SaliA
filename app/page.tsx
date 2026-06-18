'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function Home() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [uses, setUses] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState<{ type: 'loading' | 'error' | 'success'; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('salia_token')
    if (!t) { router.push('/login'); return }
    setToken(t)
    setUses(parseInt(localStorage.getItem('salia_uses') || '0'))
  }, [router])

  const remaining = 3 - uses

  function logout() {
    localStorage.removeItem('salia_token')
    localStorage.removeItem('salia_uses')
    router.push('/login')
  }

  async function generate() {
    if (!transcript.trim()) return setStatus({ type: 'error', msg: 'La transcription est vide.' })
    if (transcript.length < 200) return setStatus({ type: 'error', msg: "La transcription semble trop courte." })

    setLoading(true)
    setStatus({ type: 'loading', msg: 'SalIA analyse ton appel… (60–90 secondes)' })

    try {
      const templateRes = await fetch('/template.html')
      if (!templateRes.ok) throw new Error('Template introuvable.')
      const template = await templateRes.text()

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, template, token }),
      })

      if (res.status === 401) { router.push('/login'); return }
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur serveur.' }))
        throw new Error(err.error || 'Erreur serveur.')
      }

      const html = await res.text()
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `salia-feedback-${new Date().toISOString().slice(0, 10)}.html`
      document.body.appendChild(a)
      a.click()
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 500)

      const newUses = uses + 1
      localStorage.setItem('salia_uses', String(newUses))
      setUses(newUses)
      setStatus({ type: 'success', msg: '✅ Feedback généré et téléchargé ! Ouvre le fichier .html dans ton navigateur.' })
    } catch (err: unknown) {
      setStatus({ type: 'error', msg: '❌ ' + (err instanceof Error ? err.message : 'Erreur inconnue.') })
    } finally {
      setLoading(false)
    }
  }

  if (!token) return null

  const badgeColor = remaining === 0 ? '#EF4444' : remaining === 1 ? '#F59E0B' : '#10B981'
  const badgeBg = remaining === 0 ? 'rgba(239,68,68,0.09)' : remaining === 1 ? 'rgba(245,158,11,0.09)' : 'rgba(16,185,129,0.09)'
  const badgeBorder = remaining === 0 ? 'rgba(239,68,68,0.28)' : remaining === 1 ? 'rgba(245,158,11,0.28)' : 'rgba(16,185,129,0.28)'

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 20px',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }} />
      {/* Glow */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 700, height: 500, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(0,212,255,0.09) 0%, rgba(123,97,255,0.05) 40%, transparent 70%)',
      }} />

      <div style={{ width: '100%', maxWidth: 680, position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}
        >
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 34, color: 'var(--text)', letterSpacing: -0.6, lineHeight: 1 }}>
              Sal<span style={{ color: 'var(--accent)' }}>i</span>A
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 5 }}>Analyse d'appels de vente par IA</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px',
              borderRadius: 20, fontSize: 11, fontWeight: 500,
              background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: badgeColor, display: 'inline-block' }} />
              {remaining > 0 ? `${remaining} analyse${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}` : 'Compte épuisé'}
            </div>
            <motion.button
              whileHover={{ color: '#E8EDF2' }}
              onClick={logout}
              style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.09)',
                color: 'var(--muted)', fontFamily: "'Inter', sans-serif",
                fontSize: 11, padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
              }}
            >
              Déconnexion
            </motion.button>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.1, ease }}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: -0.5, color: 'var(--text)', lineHeight: 1.27, marginBottom: 9 }}
        >
          Transforme chaque appel<br />en <span style={{ color: 'var(--accent)' }}>plan d'action</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          style={{ fontSize: 14, color: 'var(--muted2)', marginBottom: 24, lineHeight: 1.7 }}
        >
          Colle ta transcription ci-dessous — SalIA analyse ta posture, tes objections et ton closing en moins de 90 secondes.
        </motion.p>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.28, ease }}
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 18, padding: 26, marginBottom: 12,
            boxShadow: '0 0 0 1px rgba(0,212,255,0.05), 0 6px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.045)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 1.6, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 3, height: 12, background: 'linear-gradient(to bottom, #00D4FF, #7B61FF)', borderRadius: 2, display: 'block' }} />
            Transcription de l'appel
          </div>
          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder={"Colle ici la transcription complète de ton appel de vente…\n\n[00:00] Vendeur : Bonjour, comment tu vas ?\n[00:05] Prospect : Bien merci, et toi ?\n…"}
            style={{
              width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '16px 18px', color: 'var(--text)',
              fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.7,
              resize: 'vertical', outline: 'none', minHeight: 240,
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.06)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>La transcription peut être brute — horodatages, noms, etc.</span>
            <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace' }}>{transcript.length.toLocaleString('fr')} car.</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          whileHover={remaining > 0 ? { scale: 1.016, boxShadow: '0 0 30px rgba(0,212,255,0.3), 0 0 70px rgba(123,97,255,0.14)' } : {}}
          whileTap={remaining > 0 ? { scale: 0.985 } : {}}
          onClick={generate}
          disabled={loading || remaining === 0}
          style={{
            width: '100%', padding: 17, borderRadius: 13, border: 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15,
            background: 'linear-gradient(135deg, #00D4FF, #7B61FF)',
            color: '#06090F', cursor: remaining > 0 && !loading ? 'pointer' : 'not-allowed',
            opacity: remaining === 0 || loading ? 0.35 : 1,
          }}
        >
          {loading ? '⏳ Analyse en cours…' : '⚡ Générer mon feedback'}
        </motion.button>

        {/* Status */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
              style={{
                marginTop: 14, borderRadius: 12, padding: '14px 18px', fontSize: 13, lineHeight: 1.6,
                fontFamily: "'JetBrains Mono', monospace",
                ...(status.type === 'error' ? { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' } :
                   status.type === 'loading' ? { background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: 'var(--accent)' } :
                   { background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--green)' })
              }}
            >
              {status.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.54 }}
          style={{ marginTop: 22, textAlign: 'center', fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        >
          <span>Propulsé par Claude</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted)', opacity: 0.4, display: 'inline-block' }} />
          <span>La Bible de la Vente</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted)', opacity: 0.4, display: 'inline-block' }} />
          <span>Kaizen Sell Team</span>
        </motion.div>

      </div>
    </main>
  )
}
