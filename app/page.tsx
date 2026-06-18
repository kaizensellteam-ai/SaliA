'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const
const MAX_USES = 3

const steps = [
  { n: '01', label: 'Colle ta transcription' },
  { n: '02', label: 'Lance l\'analyse' },
  { n: '03', label: 'Télécharge ton rapport' },
]

export default function Home() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [uses, setUses] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState<{ type: 'loading' | 'error' | 'success'; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('salia_token')
    if (!t) { router.push('/login'); return }
    setToken(t)
    setUses(parseInt(localStorage.getItem('salia_uses') || '0'))
  }, [router])

  const remaining = MAX_USES - uses

  function logout() {
    localStorage.removeItem('salia_token')
    localStorage.removeItem('salia_uses')
    router.push('/login')
  }

  async function generate() {
    if (!transcript.trim()) return setStatus({ type: 'error', msg: 'La transcription est vide.' })
    if (transcript.length < 200) return setStatus({ type: 'error', msg: 'La transcription semble trop courte (min. 200 caractères).' })

    setLoading(true)
    setStatus({ type: 'loading', msg: 'SalIA analyse ton appel… Ça prend 60 à 90 secondes.' })

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
      setStatus({ type: 'success', msg: 'Rapport généré et téléchargé. Ouvre le fichier .html dans ton navigateur.' })
    } catch (err: unknown) {
      setStatus({ type: 'error', msg: err instanceof Error ? err.message : 'Erreur inconnue.' })
    } finally {
      setLoading(false)
    }
  }

  if (!token) return null

  const pct = (uses / MAX_USES) * 100
  const usageColor = remaining === 0 ? '#EF4444' : remaining === 1 ? '#F59E0B' : '#22C55E'

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      fontFamily: 'var(--font-body)',
      position: 'relative',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(ellipse 60% 50% at 70% 20%, rgba(201,168,76,0.04) 0%, transparent 60%)',
      }} />

      {/* Top nav */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px', height: 60,
          background: 'rgba(8,10,15,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20,
          color: 'var(--text)', letterSpacing: -0.3, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'linear-gradient(135deg, var(--accent), #A07830)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: '#1a1000', fontWeight: 800,
          }}>S</span>
          Sal<span style={{ color: 'var(--accent)' }}>i</span>A
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Usage indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 80, height: 4, borderRadius: 4, background: 'var(--surface3)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: usageColor,
                borderRadius: 4, transition: 'width 0.4s ease',
              }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
              {remaining > 0
                ? <><span style={{ color: usageColor, fontWeight: 600 }}>{remaining}</span> analyse{remaining > 1 ? 's' : ''}</>
                : <span style={{ color: '#EF4444' }}>Épuisé</span>
              }
            </span>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'transparent', border: '1px solid var(--border2)',
              color: 'var(--text3)', fontSize: 12, padding: '6px 14px',
              borderRadius: 6, cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = 'var(--text)'; (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = 'var(--text3)'; (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
          >
            Déconnexion
          </button>
        </div>
      </motion.nav>

      {/* Main content */}
      <div style={{
        maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px',
        position: 'relative', zIndex: 1,
      }}>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 48, justifyContent: 'center' }}
        >
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px' }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--accent)',
                  fontFamily: 'monospace', letterSpacing: 0.5,
                }}>{s.n}</span>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 32, height: 1, background: 'var(--border2)' }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Hero headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38,
            color: 'var(--text)', lineHeight: 1.18, letterSpacing: -1,
            marginBottom: 14,
          }}>
            Analyse ton appel.<br />
            <span style={{
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Progresse à chaque call.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
            Colle ta transcription ci-dessous. SalIA identifie tes forces, tes lacunes et te donne un plan d'action concret.
          </p>
        </motion.div>

        {/* Transcript card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
          style={{
            background: 'var(--surface)',
            border: `1px solid ${focused ? 'rgba(201,168,76,0.3)' : 'var(--border2)'}`,
            borderRadius: 16, overflow: 'hidden',
            boxShadow: focused ? '0 0 0 4px rgba(201,168,76,0.06)' : 'none',
            transition: 'border-color 0.25s, box-shadow 0.25s',
            marginBottom: 16,
          }}
        >
          {/* Card header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: transcript.length > 200 ? 'var(--green)' : 'var(--border2)',
                boxShadow: transcript.length > 200 ? '0 0 6px rgba(34,197,94,0.5)' : 'none',
                transition: 'all 0.3s',
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: 0.5 }}>
                TRANSCRIPTION D'APPEL
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>
              {transcript.length > 0 ? `${transcript.length.toLocaleString('fr')} car.` : 'vide'}
            </span>
          </div>

          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={"Colle ici la transcription complète de ton appel de vente…\n\n[00:00] Vendeur : Bonjour, comment tu vas ?\n[00:05] Prospect : Bien, merci. J'ai vu votre message…\n…"}
            style={{
              width: '100%', background: 'transparent',
              border: 'none', outline: 'none',
              padding: '20px', color: 'var(--text)',
              fontSize: 13.5, lineHeight: 1.8,
              resize: 'vertical', minHeight: 260,
              fontFamily: 'var(--font-body)',
            }}
          />

          {/* Card footer */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>
              Horodatages, noms de speakers, retranscription brute — tout est accepté.
            </span>
            {transcript.length > 0 && transcript.length < 200 && (
              <span style={{ fontSize: 11, color: 'var(--yellow)' }}>
                Encore {200 - transcript.length} car. minimum
              </span>
            )}
            {transcript.length >= 200 && (
              <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>
                ✓ Prêt pour l'analyse
              </span>
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38, ease }}
        >
          <motion.button
            whileHover={remaining > 0 && !loading ? { opacity: 0.9, y: -1 } : {}}
            whileTap={remaining > 0 && !loading ? { scale: 0.99 } : {}}
            onClick={generate}
            disabled={loading || remaining === 0}
            style={{
              width: '100%', padding: '17px 0', borderRadius: 12, border: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
              background: remaining > 0
                ? 'linear-gradient(135deg, var(--accent) 0%, #A07830 100%)'
                : 'var(--surface3)',
              color: remaining > 0 ? '#1a1000' : 'var(--text3)',
              cursor: remaining > 0 && !loading ? 'pointer' : 'not-allowed',
              opacity: loading ? 0.7 : 1,
              letterSpacing: 0.3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {loading && (
              <span style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                animation: 'shimmer 1.5s infinite',
              }} />
            )}
            {loading ? '⏳  Analyse en cours…'
              : remaining === 0 ? 'Toutes les analyses ont été utilisées'
              : '⚡  Générer mon feedback'}
          </motion.button>

          {remaining > 0 && (
            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)', marginTop: 10 }}>
              Il te reste <strong style={{ color: 'var(--accent)' }}>{remaining} analyse{remaining > 1 ? 's' : ''}</strong> sur {MAX_USES}
            </p>
          )}
        </motion.div>

        {/* Status */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
              style={{
                marginTop: 16, borderRadius: 10,
                padding: '14px 18px', fontSize: 13, lineHeight: 1.65,
                display: 'flex', alignItems: 'flex-start', gap: 12,
                ...(status.type === 'error'
                  ? { background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.18)', color: '#FCA5A5' }
                  : status.type === 'loading'
                  ? { background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)', color: 'var(--accent)' }
                  : { background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.18)', color: '#86EFAC' }
                ),
              }}
            >
              <span style={{ fontSize: 15, marginTop: 1, flexShrink: 0 }}>
                {status.type === 'error' ? '⚠' : status.type === 'loading' ? '⟳' : '✓'}
              </span>
              <span>{status.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            marginTop: 48, paddingTop: 28,
            borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 11, color: 'var(--text3)',
          }}
        >
          <span>Propulsé par Claude Opus</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>La Bible de la Vente</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>Kaizen Sell Team</span>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  )
}
