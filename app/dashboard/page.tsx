'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const
const spring = { type: 'spring' as const, stiffness: 280, damping: 26 }
const MAX_USES = 3

const FAKE_REPORT = `RAPPORT D'ANALYSE — SalIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCORE GLOBAL ················ 74/100

─── POSTURE & AUTORITÉ ────────────
Score : 85/100  ████████░░
Tu maintiens une posture d'expert
solide. Ton ton est assertif sans
être agressif. Tu ne coupes jamais
la parole — c'est un vrai point fort.

─── GESTION DES OBJECTIONS ────────
Score : 68/100  ██████░░░░
3 objections détectées. Tu en as
géré 2 correctement. Sur "c'est
trop cher" tu es passé en mode
justification au lieu de creuser
la douleur. Erreur classique.

─── ÉCOUTE ACTIVE ─────────────────
Score : 80/100  ████████░░
Tu poses de bonnes questions mais
tu n'utilises pas assez le silence.
3 fois tu as répondu trop vite après
une hésitation du prospect.

─── CLOSING ───────────────────────
Score : 45/100  ████░░░░░░
Le closing arrive 8 minutes trop
tôt. Le prospect n'avait pas encore
exprimé sa douleur principale.
Tu as tenté de closer sur le prix
avant de closer sur la valeur.

─── PLAN D'ACTION ─────────────────
① Attends le 3ème signal d'intérêt
  avant de parler du prix.
② Sur "c'est trop cher" — réponds
  "trop cher par rapport à quoi ?"
③ Utilise 3 secondes de silence
  après chaque question ouverte.
④ Pose la question de clôture APRÈS
  confirmation de la valeur perçue.

─── PROCHAINE ÉTAPE ───────────────
Travaille le module CLOSING du
playbook. Focus : identifier le
bon moment pour proposer.`

function IntroAnimation({ textareaRef, onComplete }: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onComplete: () => void
}) {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pause' | 'shrink'>('typing')
  const [targetY, setTargetY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fast typewriter
    let i = 0
    const speed = 18
    const interval = setInterval(() => {
      i += 3
      setDisplayed(FAKE_REPORT.slice(0, i))
      if (i >= FAKE_REPORT.length) {
        clearInterval(interval)
        setDisplayed(FAKE_REPORT)
        setTimeout(() => setPhase('pause'), 400)
        setTimeout(() => {
          // Calculate where textarea is relative to card center
          if (textareaRef.current && cardRef.current) {
            const ta = textareaRef.current.getBoundingClientRect()
            const card = cardRef.current.getBoundingClientRect()
            const taCenterY = ta.top + ta.height / 2
            const cardCenterY = card.top + card.height / 2
            setTargetY(taCenterY - cardCenterY)
          }
          setPhase('shrink')
        }, 1000)
        setTimeout(onComplete, 2200)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [textareaRef, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,7,2,0.92)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <motion.div
        ref={cardRef}
        animate={
          phase === 'shrink'
            ? { scale: 0.04, y: targetY, opacity: 0 }
            : { scale: 1, y: 0, opacity: 1 }
        }
        transition={
          phase === 'shrink'
            ? { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.4, ease }
        }
        style={{
          width: '90vw', maxWidth: 680,
          maxHeight: '82vh',
          background: 'var(--surface)',
          border: '1px solid var(--border2)',
          borderTop: '3px solid var(--accent)',
          overflow: 'hidden',
          transformOrigin: 'center center',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--surface2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 2 }}>
              SALIA — GÉNÉRATION EN COURS
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)' }}>
            {Math.round((displayed.length / FAKE_REPORT.length) * 100)}%
          </span>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px 28px',
          overflowY: 'auto',
          maxHeight: 'calc(82vh - 52px)',
        }}>
          <pre style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.75,
            color: 'var(--text)',
            whiteSpace: 'pre-wrap',
            margin: 0,
          }}>
            {displayed}
            {phase === 'typing' && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ color: 'var(--accent)' }}
              >▋</motion.span>
            )}
          </pre>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [uses, setUses] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState<{ type: 'loading' | 'error' | 'success'; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [showIntro, setShowIntro] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const t = localStorage.getItem('salia_token')
    if (!t) { router.push('/login'); return }
    setToken(t)
    setUses(parseInt(localStorage.getItem('salia_uses') || '0'))

    // Show intro only once per session
    if (!sessionStorage.getItem('salia_intro_seen')) {
      setShowIntro(true)
      sessionStorage.setItem('salia_intro_seen', '1')
    }
  }, [router])

  const remaining = MAX_USES - uses
  const ready = transcript.length >= 200

  function logout() {
    localStorage.removeItem('salia_token')
    localStorage.removeItem('salia_uses')
    router.push('/login')
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTranscript(e.target.value)
    setCharCount(e.target.value.length)
  }

  async function generate() {
    if (!transcript.trim()) return setStatus({ type: 'error', msg: 'La transcription est vide.' })
    if (!ready) return setStatus({ type: 'error', msg: 'Transcription trop courte (min. 200 caractères).' })
    setLoading(true)
    setStatus({ type: 'loading', msg: 'Analyse en cours… 60 à 90 secondes.' })
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
      a.download = `salia-${new Date().toISOString().slice(0, 10)}.html`
      document.body.appendChild(a); a.click()
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 500)
      const newUses = uses + 1
      localStorage.setItem('salia_uses', String(newUses))
      setUses(newUses)
      setStatus({ type: 'success', msg: 'Rapport téléchargé. Ouvre le fichier .html dans ton navigateur.' })
    } catch (err: unknown) {
      setStatus({ type: 'error', msg: err instanceof Error ? err.message : 'Erreur inconnue.' })
    } finally { setLoading(false) }
  }

  if (!token) return null

  const usageColor = remaining === 0 ? '#ef4444' : remaining === 1 ? '#fbbf24' : '#22c55e'

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)', position: 'relative' }}>

      {/* Intro animation */}
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation
            textareaRef={textareaRef}
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      {/* Signature top bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', transformOrigin: 'left', zIndex: 100 }}
      />

      {/* Vignette */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(249,115,22,0.04), transparent)' }} />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px', height: 58,
          background: 'rgba(10,7,2,0.9)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: 3, textTransform: 'uppercase' }}>
          SalIA
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>ANALYSES</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: MAX_USES }).map((_, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.08, ...spring }}
                  style={{ width: 8, height: 8, background: i < uses ? 'var(--border2)' : usageColor, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                />
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: usageColor, letterSpacing: 0.5 }}>{remaining}/{MAX_USES}</div>
          </div>
          <motion.button whileHover={{ color: 'var(--text)', x: 2 }} whileTap={{ scale: 0.97 }} onClick={logout}
            style={{ background: 'transparent', border: 'none', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer' }}
          >Quitter →</motion.button>
        </div>
      </motion.nav>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 48px 100px', position: 'relative', zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}
        >
          <div style={{ width: 32, height: 2, background: 'var(--accent)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 3, textTransform: 'uppercase' }}>Analyse d'appel de vente</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.15, ease }}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(52px, 8vw, 88px)', lineHeight: 0.93, letterSpacing: -3, color: 'var(--text)', marginBottom: 28 }}
        >
          ANALYSE<br /><span style={{ color: 'var(--accent)' }}>TON APPEL.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.28, ease }}
          style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, maxWidth: 520, marginBottom: 56 }}
        >
          Colle ta transcription. SalIA identifie tes forces, tes lacunes et te génère un plan d'action en 90 secondes.
        </motion.p>

        {/* Transcript block */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.35, ease }}
          style={{
            border: `1px solid ${focused ? 'var(--accent)' : 'var(--border2)'}`,
            borderTop: `3px solid ${focused ? 'var(--accent)' : ready ? '#22c55e' : 'var(--border2)'}`,
            background: 'var(--surface)', transition: 'border-color .25s', marginBottom: 4,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: focused ? 'var(--accent)' : 'var(--text3)', transition: 'color .2s', textTransform: 'uppercase' }}>
              Transcription
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AnimatePresence mode="wait">
                {ready ? (
                  <motion.span key="ready" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={spring}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#22c55e', letterSpacing: 1 }}>✓ PRÊT</motion.span>
                ) : charCount > 0 ? (
                  <motion.span key="short" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--yellow)', letterSpacing: 0.5 }}>{200 - charCount} car. manquants</motion.span>
                ) : null}
              </AnimatePresence>
              <motion.span key={charCount} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)' }}>{charCount.toLocaleString('fr')}</motion.span>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={transcript}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={"[00:00] Vendeur : Bonjour, comment tu vas ?\n[00:05] Prospect : Bien, j'ai vu votre message…\n…\n\nColle ici la transcription complète de ton appel."}
            style={{
              width: '100%', minHeight: 280, padding: '20px', background: 'transparent',
              border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13.5,
              lineHeight: 1.85, resize: 'vertical', fontFamily: 'var(--font-mono)',
            }}
          />

          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5 }}>
            Formats acceptés — horodatages, noms de speakers, transcription brute
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.48, ease }}>
          <motion.button
            whileHover={remaining > 0 && !loading ? { x: 6, boxShadow: '8px 0 40px rgba(249,115,22,0.25)' } : {}}
            whileTap={remaining > 0 && !loading ? { scale: 0.98 } : {}}
            onClick={generate} disabled={loading || remaining === 0}
            style={{
              width: '100%', padding: '20px 0', background: remaining > 0 ? 'var(--accent)' : 'var(--surface2)',
              border: 'none', borderRadius: 0, fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 16, letterSpacing: 1, textTransform: 'uppercase',
              color: remaining > 0 ? '#0a0702' : 'var(--text3)',
              cursor: remaining > 0 && !loading ? 'pointer' : 'not-allowed',
              opacity: loading ? 0.75 : 1, position: 'relative', overflow: 'hidden',
            }}
          >
            {loading && (
              <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.3, repeat: Infinity }}
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
              />
            )}
            {loading ? '⏳  Analyse en cours…' : remaining === 0 ? 'Quota épuisé' : '⚡  Générer mon rapport →'}
          </motion.button>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5 }}>
              {remaining > 0 ? `${remaining} analyse${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''} sur ${MAX_USES}` : 'Aucune analyse restante'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5 }}>Résultat en 60–90 secondes</span>
          </div>
        </motion.div>

        {/* Status */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 12, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
              style={{
                marginTop: 16, padding: '14px 20px',
                borderLeft: `3px solid ${status.type === 'error' ? '#ef4444' : status.type === 'loading' ? 'var(--accent)' : '#22c55e'}`,
                background: status.type === 'error' ? 'var(--red-dim)' : status.type === 'loading' ? 'var(--accent-dim)' : 'var(--green-dim)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <motion.span
                animate={status.type === 'loading' ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: status.type === 'error' ? '#fca5a5' : status.type === 'loading' ? 'var(--accent)' : '#86efac', display: 'inline-block', flexShrink: 0 }}
              >
                {status.type === 'error' ? '⚠' : status.type === 'loading' ? '⟳' : '✓'}
              </motion.span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: status.type === 'error' ? '#fca5a5' : status.type === 'loading' ? 'var(--accent)' : '#86efac' }}>
                {status.msg}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>KAIZEN SELL TEAM — 2025</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>CLAUDE OPUS · LA BIBLE DE LA VENTE</span>
        </motion.div>
      </div>
    </main>
  )
}
