'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const
const spring = { type: 'spring', stiffness: 300, damping: 30 }

const features = [
  { icon: '◆', text: 'Analyse ta posture, ton écoute, ton closing' },
  { icon: '◆', text: 'Plan d\'action personnalisé par appel' },
  { icon: '◆', text: 'Basé sur 200+ techniques de vente éprouvées' },
]

export default function Login() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  async function submit() {
    if (!email || !password) return setError('Remplis tous les champs.')
    if (tab === 'register' && password.length < 6) return setError('Le mot de passe doit faire au moins 6 caractères.')
    setLoading(true)
    setError('')
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg)', fontFamily: 'var(--font-body)',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed', top: '10%', left: '5%', width: 500, height: 500,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'fixed', bottom: '5%', right: '10%', width: 400, height: 400,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(123,97,255,0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        style={{
          position: 'fixed', top: '50%', left: '50%', width: 300, height: 300,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Grid lines */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* LEFT panel */}
      <div style={{
        flex: '0 0 52%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '52px 64px',
        borderRight: '1px solid var(--border)', position: 'relative', zIndex: 1,
      }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26,
            color: 'var(--text)', letterSpacing: -0.5,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <motion.span
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={spring}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, var(--accent), #A07830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#1a1000', cursor: 'default',
              }}
            >S</motion.span>
            Sal<span style={{ color: 'var(--accent)' }}>i</span>A
          </div>
        </motion.div>

        {/* Main copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'var(--accent-dim)', border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 28,
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'block' }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              IA pour les closers
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44,
              color: 'var(--text)', lineHeight: 1.15, letterSpacing: -1.2, marginBottom: 20,
            }}
          >
            Transforme chaque appel<br />
            en{' '}
            <motion.span
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'linear-gradient(90deg, var(--accent), #fff, var(--accent))',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >victoire</motion.span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75, maxWidth: 380, marginBottom: 40 }}
          >
            SalIA analyse ta transcription d'appel et te donne un feedback précis sur ta posture, tes objections et ton closing — en moins de 90 secondes.
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.12, ease }}
                whileHover={{ x: 6 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'default' }}
              >
                <motion.span
                  whileHover={{ rotate: 45, scale: 1.2 }}
                  transition={spring}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: 'var(--accent-dim)', border: '1px solid rgba(201,168,76,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, color: 'var(--accent)', flexShrink: 0,
                  }}
                >{f.icon}</motion.span>
                <span style={{ fontSize: 14, color: 'var(--text2)' }}>{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease }}
          whileHover={{ x: 4 }}
          style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 18, cursor: 'default' }}
        >
          <p style={{ fontSize: 14, color: 'var(--text2)', fontStyle: 'italic', lineHeight: 1.65, marginBottom: 10 }}>
            "La vente est un transfert de certitude. SalIA me montre exactement où je perds cette certitude sur chaque appel."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={spring}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), #A07830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#1a1000',
              }}
            >KS</motion.div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Kaizen Sell Team</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Top performers · +40% closing rate</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT — Auth form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '52px 64px', position: 'relative', zIndex: 1,
        }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24,
              color: 'var(--text)', marginBottom: 6, letterSpacing: -0.4,
            }}>
              {tab === 'login' ? 'Bon retour.' : 'Crée ton accès.'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 28 }}>
              {tab === 'login' ? 'Connecte-toi pour analyser ton prochain appel.' : '3 analyses offertes pour commencer.'}
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38, ease }}
            style={{
              display: 'flex', gap: 0, marginBottom: 28,
              background: 'var(--surface)', borderRadius: 10,
              padding: 4, border: '1px solid var(--border)',
            }}
          >
            {(['login', 'register'] as const).map((t) => (
              <motion.button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                animate={{
                  background: tab === t ? 'var(--surface3)' : 'transparent',
                  color: tab === t ? 'var(--text)' : 'var(--text3)',
                }}
                whileHover={{ color: 'var(--text)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                style={{
                  flex: 1, padding: '9px 0',
                  border: tab === t ? '1px solid var(--border2)' : '1px solid transparent',
                  borderRadius: 7, cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
                }}
              >
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </motion.button>
            ))}
          </motion.div>

          {/* Fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease }}
            >
              {[
                { label: 'Adresse email', type: 'email', value: email, onChange: setEmail, placeholder: 'ton@email.com', id: 'email' },
                { label: 'Mot de passe', type: 'password', value: password, onChange: setPassword, placeholder: '••••••••', id: 'password' },
              ].map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ marginBottom: 16 }}
                >
                  <motion.label
                    animate={{ color: focusedField === f.id ? 'var(--accent)' : 'var(--text2)' }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 7, letterSpacing: 0.2 }}
                  >
                    {f.label}
                  </motion.label>
                  <motion.div
                    animate={{
                      boxShadow: focusedField === f.id ? '0 0 0 3px rgba(201,168,76,0.12)' : '0 0 0 0px transparent',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ borderRadius: 9 }}
                  >
                    <input
                      type={f.type}
                      value={f.value}
                      onChange={e => f.onChange(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submit()}
                      onFocus={() => setFocusedField(f.id)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={f.placeholder}
                      style={{
                        width: '100%', background: 'var(--surface)',
                        border: `1px solid ${focusedField === f.id ? 'rgba(201,168,76,0.45)' : 'var(--border2)'}`,
                        borderRadius: 9, padding: '12px 14px',
                        color: 'var(--text)', fontSize: 14,
                        outline: 'none', transition: 'border-color 0.2s',
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 30px rgba(201,168,76,0.25)' } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                onClick={submit}
                disabled={loading}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 9, border: 'none',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                  background: 'linear-gradient(135deg, var(--accent), #A07830)',
                  color: '#1a1000', cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1, marginTop: 6, letterSpacing: 0.2,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {loading && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    }}
                  />
                )}
                {loading ? 'Connexion…' : tab === 'login' ? 'Se connecter →' : 'Créer mon compte →'}
              </motion.button>

              {tab === 'register' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontSize: 11, color: 'var(--text3)', marginTop: 14, textAlign: 'center', lineHeight: 1.6 }}
                >
                  Chaque compte inclut <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>3 analyses gratuites</strong> à vie.
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22 }}
                style={{
                  marginTop: 14, borderRadius: 8, padding: '11px 14px', fontSize: 13,
                  background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span>⚠</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontSize: 11, color: 'var(--text3)',
            }}
          >
            <span>Propulsé par</span>
            <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Claude Opus</span>
            <span>·</span>
            <span>Kaizen Sell Team</span>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
