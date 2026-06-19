import { createHash, randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

const MAX_USES = 3
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY!

function headers() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
  }
}

async function getUser(email: string) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=*`, { headers: headers() })
  const data = await r.json()
  return data[0] || null
}

async function createUser(email: string, password: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: 'POST',
    headers: { ...headers(), 'Prefer': 'return=minimal' },
    body: JSON.stringify({ email, password }),
  })
}

async function createSession(token: string, email: string) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
    method: 'POST',
    headers: { ...headers(), 'Prefer': 'return=minimal' },
    body: JSON.stringify({ token, email, expires_at: expires }),
  })
}

function hashPassword(password: string) {
  return createHash('sha256').update(password + 'salia_salt_2024').digest('hex')
}

export async function POST(req: NextRequest) {
  const { action, email, password } = await req.json()

  if (!action || !email || !password)
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })

  const emailLower = email.toLowerCase().trim()

  if (action === 'register') {
    const existing = await getUser(emailLower)
    if (existing) return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 })

    await createUser(emailLower, hashPassword(password))

    const token = randomBytes(32).toString('hex')
    await createSession(token, emailLower)
    return NextResponse.json({ token, uses: 0, maxUses: MAX_USES })
  }

  if (action === 'login') {
    const user = await getUser(emailLower)
    if (!user) return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 })
    if (user.password !== hashPassword(password))
      return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 })

    const token = randomBytes(32).toString('hex')
    await createSession(token, emailLower)
    return NextResponse.json({ token, uses: user.uses, maxUses: MAX_USES })
  }

  return NextResponse.json({ error: 'Action inconnue.' }, { status: 400 })
}
