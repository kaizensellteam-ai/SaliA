'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const
const spring = { type: 'spring' as const, stiffness: 280, damping: 26 }

const pillars = ['Posture', 'Écoute', 'Objections', 'Closing', 'Relance']

export default function Login() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState<string | null>(null)

  async function submit() {
    if (!email || !password) return setError('Remplis tous les champs.')
    if (tab === 'register' && password.length < 6) return setError('Minimum 6 caractères.')
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: tab, email, password }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erreur.')
      localStorage.setItem('salia_token', data.token)
      localStorage.setItem('salia_uses', String(data.uses))
      router.push('/')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue.')
    } finally { setLoading(false) }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* Signature orange top bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', transformOrigin: 'left', zIndex: 100 }}
      />

      {/* Subtle vignette */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(249,115,22,0.04) 0%, transparent 60%)' }} />

      {/* LEFT — Editorial brand panel */}
      <div style={{ flex: '0 0 55%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', borderRight: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: 3, textTransform: 'uppercase' }}>
            SalIA — IA Vente
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>
            v2.0
          </div>
        </motion.div>

        {/* Massive headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 80, lineHeight: 0.92, letterSpacing: -3, color: 'var(--text)', marginBottom: 8 }}>
              CLOSE
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 80, lineHeight: 0.92, letterSpacing: -3, color: 'var(--accent)', marginBottom: 32 }}>
              PLUS.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}
          >
            <div style={{ width: 40, height: 2, background: 'var(--accent)' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Transcription → Analyse → Victoire
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.8, maxWidth: 420, marginBottom: 48 }}
          >
            SalIA lit ta transcription d'appel, détecte tes erreurs de posture, tes objections ratées et ton closing raté — et te donne un plan d'action en 90 secondes.
          </motion.p>

          {/* Pillars */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {pillars.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.07, ease }}
                whileHover={{ y: -2, borderColor: 'rgba(249,115,22,0.5)' }}
                style={{
                  padding: '7px 16px', border: '1px solid var(--border2)',
                  borderRadius: 0, fontFamily: 'var(--font-mono)',
                  fontSize: 11, color: 'var(--text2)', letterSpacing: 0.5,
                  cursor: 'default', transition: 'border-color .2s',
                }}
              >
                {p}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom stat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: 'flex', gap: 40 }}
        >
          {[['200+', 'techniques de vente'], ['90s', "temps d'analyse"], ['3', 'analyses offertes']].map(([num, label]) => (
            <div key={num}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: 'var(--accent)', letterSpacing: -1 }}>{num}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* RIGHT — Auth form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 56px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ width: '100%', maxWidth: 360 }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border2)', marginBottom: 36 }}>
            {(['login', 'register'] as const).map(t => (
              <motion.button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                style={{
                  flex: 1, paddingBottom: 14, background: 'transparent', border: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1.5,
                  textTransform: 'uppercase', cursor: 'pointer',
                  color: tab === t ? 'var(--accent)' : 'var(--text3)',
                  position: 'relative',
                }}
              >
                {t === 'login' ? 'Connexion' : 'Inscription'}
                {tab === t && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--accent)' }}
                    transition={spring}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.h2
                style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, color: 'var(--text)', letterSpacing: -0.5, marginBottom: 4 }}
              >
                {tab === 'login' ? 'Bon retour.' : 'Commence.'}
              </motion.h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', letterSpacing: 0.5, marginBottom: 32 }}>
                {tab === 'login' ? 'Analyse ton prochain appel.' : '3 analyses gratuites à vie.'}
              </p>

              {[
                { label: 'EMAIL', type: 'email', val: email, set: setEmail, ph: 'ton@email.com', id: 'email' },
                { label: 'MOT DE PASSE', type: 'password', val: password, set: setPassword, ph: '••••••••', id: 'pass' },
              ].map((f, i) => (
                <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: focused === f.id ? 'var(--accent)' : 'var(--text3)', marginBottom: 8, transition: 'color .2s' }}>
                    {f.label}
                  </div>
                  <input
                    type={f.type} value={f.val}
                    onChange={e => f.set(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submit()}
                    onFocus={() => setFocused(f.id)}
                    onBlur={() => setFocused(null)}
                    placeholder={f.ph}
                    style={{
                      width: '100%', background: 'transparent',
                      border: 'none', borderBottom: `1px solid ${focused === f.id ? 'var(--accent)' : 'var(--border2)'}`,
                      padding: '10px 0', color: 'var(--text)', fontSize: 15,
                      outline: 'none', transition: 'border-color .2s',
                      boxShadow: focused === f.id ? '0 2px 0 0 rgba(249,115,22,0.15)' : 'none',
                    }}
                  />
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={!loading ? { x: 4 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                onClick={submit}
                disabled={loading}
                style={{
                  width: '100%', marginTop: 8, padding: '16px 0',
                  background: 'var(--accent)', border: 'none', borderRadius: 0,
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14,
                  letterSpacing: 1, textTransform: 'uppercase', color: '#0a0702',
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1, position: 'relative', overflow: 'hidden',
                }}
              >
                {loading && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                  />
                )}
                {loading ? 'Chargement…' : tab === 'login' ? 'Se connecter →' : 'Créer mon accès →'}
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ marginTop: 16, padding: '10px 14px', background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: 13, display: 'flex', gap: 8 }}
              >
                <span>⚠</span>{error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1, display: 'flex', gap: 16 }}
          >
            <span>Claude Opus</span><span>·</span><span>Kaizen Sell Team</span>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
