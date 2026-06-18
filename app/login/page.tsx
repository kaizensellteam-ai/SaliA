'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

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
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 20px',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }} />
      {/* Glow */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 400, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(0,212,255,0.09) 0%, rgba(123,97,255,0.05) 40%, transparent 70%)',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 34, color: 'var(--text)', letterSpacing: -0.6, lineHeight: 1 }}>
            Sal<span style={{ color: 'var(--accent)' }}>i</span>A
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 5 }}>Analyse d'appels de vente par IA</div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--text)', marginTop: 10, marginBottom: 26, lineHeight: 1.3 }}
        >
          Accède à ton outil.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 28,
            boxShadow: '0 0 0 1px rgba(0,212,255,0.04), 0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--surface2)', borderRadius: 10, padding: 4 }}>
            {(['login', 'register'] as const).map((t) => (
              <motion.button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                animate={{ background: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? '#06090F' : 'var(--muted2)' }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1, padding: 9, border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13 }}
              >
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </motion.button>
            ))}
          </div>

          {/* Fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease }}
            >
              {[
                { label: 'Email', type: 'email', value: email, onChange: setEmail, placeholder: 'ton@email.com' },
                { label: 'Mot de passe', type: 'password', value: password, onChange: setPassword, placeholder: '••••••••' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--muted2)', marginBottom: 7 }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={e => f.onChange(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submit()}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                      borderRadius: 10, padding: '13px 16px', color: 'var(--text)',
                      fontFamily: "'Inter', sans-serif", fontSize: 14, outline: 'none',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.06)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              ))}

              <motion.button
                whileHover={{ scale: 1.015, boxShadow: '0 0 28px rgba(0,212,255,0.3)' }}
                whileTap={{ scale: 0.985 }}
                onClick={submit}
                disabled={loading}
                style={{
                  width: '100%', padding: 15, borderRadius: 12, border: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15,
                  background: 'linear-gradient(135deg, #00D4FF, #7B61FF)',
                  color: '#06090F', cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.4 : 1, marginTop: 4,
                }}
              >
                {loading ? '…' : tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </motion.button>

              {tab === 'register' && (
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 16, textAlign: 'center', lineHeight: 1.7, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  Chaque compte donne droit à <strong style={{ color: 'var(--accent)' }}>3 analyses</strong> à vie.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ marginTop: 14, borderRadius: 10, padding: '12px 16px', fontSize: 13, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        >
          <span>Propulsé par Claude</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted)', opacity: 0.4, display: 'inline-block' }} />
          <span>Kaizen Sell Team</span>
        </motion.div>
      </div>
    </main>
  )
}
