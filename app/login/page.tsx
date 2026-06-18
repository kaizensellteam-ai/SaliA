'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

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
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg)',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle noise texture overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)',
      }} />

      {/* LEFT — Brand panel */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease }}
        style={{
          flex: '0 0 52%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '52px 64px',
          borderRight: '1px solid var(--border)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26,
            color: 'var(--text)', letterSpacing: -0.5,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent), #A07830)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#1a1000',
            }}>S</span>
            Sal<span style={{ color: 'var(--accent)' }}>i</span>A
          </div>
        </div>

        {/* Main copy */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'var(--accent-dim)', border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'block' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              IA pour les closers
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 42,
            color: 'var(--text)', lineHeight: 1.15, letterSpacing: -1.2, marginBottom: 20,
          }}>
            Transforme chaque appel<br />
            en <span style={{
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>victoire</span>.
          </h1>

          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75, maxWidth: 380, marginBottom: 40 }}>
            SalIA analyse ta transcription d'appel et te donne un feedback précis sur ta posture, tes objections et ton closing — en moins de 90 secondes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'var(--accent-dim)', border: '1px solid rgba(201,168,76,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, color: 'var(--accent)', flexShrink: 0,
                }}>{f.icon}</span>
                <span style={{ fontSize: 14, color: 'var(--text2)' }}>{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            borderLeft: '2px solid var(--accent)',
            paddingLeft: 18,
          }}
        >
          <p style={{ fontSize: 14, color: 'var(--text2)', fontStyle: 'italic', lineHeight: 1.65, marginBottom: 10 }}>
            "La vente est un transfert de certitude. SalIA me montre exactement où je perds cette certitude sur chaque appel."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), #A07830)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#1a1000',
            }}>KS</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Kaizen Sell Team</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Top performers · +40% closing rate</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* RIGHT — Auth form */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '52px 64px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
            color: 'var(--text)', marginBottom: 6, letterSpacing: -0.4,
          }}>
            {tab === 'login' ? 'Bon retour.' : 'Crée ton accès.'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 28 }}>
            {tab === 'login' ? 'Connecte-toi pour analyser ton prochain appel.' : '3 analyses offertes pour commencer.'}
          </p>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: 28,
            background: 'var(--surface)', borderRadius: 10,
            padding: 4, border: '1px solid var(--border)',
          }}>
            {(['login', 'register'] as const).map((t) => (
              <motion.button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                animate={{
                  background: tab === t ? 'var(--surface3)' : 'transparent',
                  color: tab === t ? 'var(--text)' : 'var(--text3)',
                  borderColor: tab === t ? 'var(--border2)' : 'transparent',
                }}
                transition={{ duration: 0.2 }}
                style={{
                  flex: 1, padding: '9px 0', border: '1px solid transparent',
                  borderRadius: 7, cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
                }}
              >
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </motion.button>
            ))}
          </div>

          {/* Fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease }}
            >
              {[
                { label: 'Adresse email', type: 'email', value: email, onChange: setEmail, placeholder: 'ton@email.com' },
                { label: 'Mot de passe', type: 'password', value: password, onChange: setPassword, placeholder: '••••••••' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text2)', marginBottom: 7, letterSpacing: 0.2 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={e => f.onChange(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submit()}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', background: 'var(--surface)',
                      border: '1px solid var(--border2)',
                      borderRadius: 9, padding: '12px 14px',
                      color: 'var(--text)', fontSize: 14,
                      outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'rgba(201,168,76,0.45)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)'
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.12)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              ))}

              <motion.button
                whileHover={{ opacity: 0.92 }}
                whileTap={{ scale: 0.98 }}
                onClick={submit}
                disabled={loading}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 9, border: 'none',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                  background: 'linear-gradient(135deg, var(--accent), #A07830)',
                  color: '#1a1000', cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.6 : 1, marginTop: 6,
                  letterSpacing: 0.2,
                }}
              >
                {loading ? 'Connexion…' : tab === 'login' ? 'Se connecter →' : 'Créer mon compte →'}
              </motion.button>

              {tab === 'register' && (
                <p style={{
                  fontSize: 11, color: 'var(--text3)', marginTop: 14,
                  textAlign: 'center', lineHeight: 1.6,
                }}>
                  Chaque compte inclut <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>3 analyses gratuites</strong> à vie.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  marginTop: 14, borderRadius: 8, padding: '11px 14px', fontSize: 13,
                  background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: 14 }}>⚠</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{
            marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 11, color: 'var(--text3)',
          }}>
            <span>Propulsé par</span>
            <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Claude Opus</span>
            <span>·</span>
            <span>Kaizen Sell Team</span>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
