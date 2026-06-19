'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const
const spring = { type: 'spring', stiffness: 300, damping: 30 }
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
      minHeight: '100vh', background: 'var(--bg)',
      fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden',
    }}>

      {/* Animated background orbs */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed', top: '-10%', right: '10%', width: 600, height: 600,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        style={{
          position: 'fixed', bottom: '0%', left: '-5%', width: 500, height: 500,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(123,97,255,0.05) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px', height: 60,
          background: 'rgba(8,10,15,0.8)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={spring}
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20,
            color: 'var(--text)', letterSpacing: -0.3,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'default',
          }}
        >
          <motion.span
            whileHover={{ rotate: 10 }}
            transition={spring}
            style={{
              width: 26, height: 26, borderRadius: 6,
              background: 'linear-gradient(135deg, var(--accent), #A07830)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#1a1000', fontWeight: 800,
            }}
          >S</motion.span>
          Sal<span style={{ color: 'var(--accent)' }}>i</span>A
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 80, height: 4, borderRadius: 4, background: 'var(--surface3)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease, delay: 0.5 }}
                style={{ height: '100%', background: usageColor, borderRadius: 4 }}
              />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
              {remaining > 0
                ? <><span style={{ color: usageColor, fontWeight: 600 }}>{remaining}</span> analyse{remaining > 1 ? 's' : ''}</>
                : <span style={{ color: '#EF4444' }}>Épuisé</span>
              }
            </span>
          </div>

          <motion.button
            whileHover={{ color: 'var(--text)', borderColor: 'rgba(255,255,255,0.2)', scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            transition={spring}
            style={{
              background: 'transparent', border: '1px solid var(--border2)',
              color: 'var(--text3)', fontSize: 12, padding: '6px 14px',
              borderRadius: 6, cursor: 'pointer',
            }}
          >
            Déconnexion
          </motion.button>
        </div>
      </motion.nav>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 52 }}
        >
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={spring}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', cursor: 'default' }}
              >
                <motion.span
                  animate={{ color: ['var(--accent)', 'var(--accent2)', 'var(--accent)'] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
                  style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 0.5 }}
                >{s.n}</motion.span>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{s.label}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease }}
                  style={{ width: 32, height: 1, background: 'var(--border2)', transformOrigin: 'left' }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 42,
              color: 'var(--text)', lineHeight: 1.18, letterSpacing: -1, marginBottom: 16,
            }}
          >
            Analyse ton appel.<br />
            <motion.span
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'linear-gradient(90deg, var(--accent), #fff, var(--accent))',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >Progresse à chaque call.</motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
            style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}
          >
            Colle ta transcription ci-dessous. SalIA identifie tes forces, tes lacunes et te donne un plan d'action concret.
          </motion.p>
        </div>

        {/* Transcript card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          animate-hover={{ scale: 1.002 }}
          style={{
            background: 'var(--surface)',
            border: `1px solid ${focused ? 'rgba(201,168,76,0.35)' : 'var(--border2)'}`,
            borderRadius: 16, overflow: 'hidden',
            boxShadow: focused ? '0 0 0 4px rgba(201,168,76,0.07), 0 20px 60px rgba(0,0,0,0.4)' : '0 8px 40px rgba(0,0,0,0.3)',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            marginBottom: 16,
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <motion.div
                animate={transcript.length > 200
                  ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                  : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 1.5, repeat: transcript.length > 200 ? Infinity : 0 }}
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: transcript.length > 200 ? 'var(--green)' : 'var(--border2)',
                  boxShadow: transcript.length > 200 ? '0 0 8px rgba(34,197,94,0.6)' : 'none',
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: 0.5 }}>
                TRANSCRIPTION D'APPEL
              </span>
            </div>
            <motion.span
              key={transcript.length}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}
            >
              {transcript.length > 0 ? `${transcript.length.toLocaleString('fr')} car.` : 'vide'}
            </motion.span>
          </div>

          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={"Colle ici la transcription complète de ton appel de vente…\n\n[00:00] Vendeur : Bonjour, comment tu vas ?\n[00:05] Prospect : Bien, merci. J'ai vu votre message…\n…"}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              padding: '20px', color: 'var(--text)', fontSize: 13.5, lineHeight: 1.8,
              resize: 'vertical', minHeight: 260, fontFamily: 'var(--font-body)',
            }}
          />

          <div style={{
            padding: '12px 20px', borderTop: '1px solid var(--border)',
            background: 'var(--surface2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>
              Horodatages, noms de speakers, retranscription brute — tout est accepté.
            </span>
            <AnimatePresence mode="wait">
              {transcript.length > 0 && transcript.length < 200 && (
                <motion.span
                  key="short"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  style={{ fontSize: 11, color: 'var(--yellow)' }}
                >
                  Encore {200 - transcript.length} car. minimum
                </motion.span>
              )}
              {transcript.length >= 200 && (
                <motion.span
                  key="ready"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={spring}
                  style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500 }}
                >
                  ✓ Prêt pour l'analyse
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.52, ease }}
        >
          <motion.button
            whileHover={remaining > 0 && !loading ? {
              scale: 1.02,
              boxShadow: '0 0 40px rgba(201,168,76,0.3), 0 0 80px rgba(201,168,76,0.1)',
              y: -2,
            } : {}}
            whileTap={remaining > 0 && !loading ? { scale: 0.98 } : {}}
            onClick={generate}
            disabled={loading || remaining === 0}
            transition={spring}
            style={{
              width: '100%', padding: '17px 0', borderRadius: 12, border: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
              background: remaining > 0
                ? 'linear-gradient(135deg, var(--accent) 0%, #A07830 100%)'
                : 'var(--surface3)',
              color: remaining > 0 ? '#1a1000' : 'var(--text3)',
              cursor: remaining > 0 && !loading ? 'pointer' : 'not-allowed',
              opacity: loading ? 0.8 : 1,
              letterSpacing: 0.3, position: 'relative', overflow: 'hidden',
            }}
          >
            {loading && (
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
              />
            )}
            {loading ? '⏳  Analyse en cours…'
              : remaining === 0 ? 'Toutes les analyses ont été utilisées'
              : '⚡  Générer mon feedback'}
          </motion.button>

          {remaining > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)', marginTop: 10 }}
            >
              Il te reste <strong style={{ color: 'var(--accent)' }}>{remaining} analyse{remaining > 1 ? 's' : ''}</strong> sur {MAX_USES}
            </motion.p>
          )}
        </motion.div>

        {/* Status */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.3, ease }}
              style={{
                marginTop: 16, borderRadius: 10, padding: '14px 18px',
                fontSize: 13, lineHeight: 1.65,
                display: 'flex', alignItems: 'flex-start', gap: 12,
                ...(status.type === 'error'
                  ? { background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.18)', color: '#FCA5A5' }
                  : status.type === 'loading'
                  ? { background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)', color: 'var(--accent)' }
                  : { background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.18)', color: '#86EFAC' }
                ),
              }}
            >
              <motion.span
                animate={status.type === 'loading' ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: 15, marginTop: 1, flexShrink: 0, display: 'inline-block' }}
              >
                {status.type === 'error' ? '⚠' : status.type === 'loading' ? '⟳' : '✓'}
              </motion.span>
              <span>{status.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{
            marginTop: 48, paddingTop: 28, borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 11, color: 'var(--text3)',
          }}
        >
          {['Propulsé par Claude Opus', 'La Bible de la Vente', 'Kaizen Sell Team'].map((t, i) => (
            <motion.span key={i} whileHover={{ color: 'var(--text2)' }} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
              {i > 0 && <span style={{ opacity: 0.3 }}>·</span>}
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
