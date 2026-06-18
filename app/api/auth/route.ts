import { createHash, randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

const MAX_USES = 3

function redisUrl(path: string) {
  return `${process.env.KV_REST_API_URL}${path}`
}

function redisHeaders() {
  return {
    Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

async function redisGet(key: string) {
  const r = await fetch(redisUrl(`/get/${encodeURIComponent(key)}`), { headers: redisHeaders() })
  const data = await r.json()
  return data.result
}

async function redisSet(key: string, value: string) {
  await fetch(redisUrl(`/set/${encodeURIComponent(key)}`), {
    method: 'POST', headers: redisHeaders(), body: JSON.stringify({ value }),
  })
}

async function redisSetEx(key: string, seconds: number, value: string) {
  await fetch(redisUrl(`/setex/${encodeURIComponent(key)}/${seconds}`), {
    method: 'POST', headers: redisHeaders(), body: JSON.stringify({ value }),
  })
}

function hashPassword(password: string) {
  return createHash('sha256').update(password + 'salia_salt_2024').digest('hex')
}

function generateToken() {
  return randomBytes(32).toString('hex')
}

export async function POST(req: NextRequest) {
  const { action, email, password } = await req.json()

  if (!action || !email || !password)
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })

  const emailLower = email.toLowerCase().trim()
  const userKey = `user:${emailLower}`

  if (action === 'register') {
    const existing = await redisGet(userKey)
    if (existing) return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 })

    const user = { password: hashPassword(password), uses: 0 }
    await redisSet(userKey, JSON.stringify(user))

    const token = generateToken()
    await redisSetEx(`session:${token}`, 60 * 60 * 24 * 30, emailLower)
    return NextResponse.json({ token, uses: 0, maxUses: MAX_USES })
  }

  if (action === 'login') {
    const raw = await redisGet(userKey)
    if (!raw) return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 })

    const user = JSON.parse(raw)
    if (user.password !== hashPassword(password))
      return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 })

    const token = generateToken()
    await redisSetEx(`session:${token}`, 60 * 60 * 24 * 30, emailLower)
    return NextResponse.json({ token, uses: user.uses, maxUses: MAX_USES })
  }

  return NextResponse.json({ error: 'Action inconnue.' }, { status: 400 })
}
