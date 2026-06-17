import crypto from "crypto";

const MAX_USES = 3;

function redisUrl(path) {
  return `${process.env.KV_REST_API_URL}${path}`;
}

function redisHeaders() {
  return {
    Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function redisGet(key) {
  const r = await fetch(redisUrl(`/get/${encodeURIComponent(key)}`), {
    headers: redisHeaders(),
  });
  const data = await r.json();
  return data.result;
}

async function redisSet(key, value) {
  await fetch(redisUrl(`/set/${encodeURIComponent(key)}`), {
    method: "POST",
    headers: redisHeaders(),
    body: JSON.stringify({ value }),
  });
}

async function redisSetEx(key, seconds, value) {
  await fetch(redisUrl(`/setex/${encodeURIComponent(key)}/${seconds}`), {
    method: "POST",
    headers: redisHeaders(),
    body: JSON.stringify({ value }),
  });
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "salia_salt_2024").digest("hex");
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, email, password } = req.body || {};

  if (!action || !email || !password) {
    return res.status(400).json({ error: "Champs manquants." });
  }

  const emailLower = email.toLowerCase().trim();
  const userKey = `user:${emailLower}`;

  if (action === "register") {
    const existing = await redisGet(userKey);
    if (existing) {
      return res.status(409).json({ error: "Un compte existe déjà avec cet email." });
    }

    const user = { password: hashPassword(password), uses: 0 };
    await redisSet(userKey, JSON.stringify(user));

    const token = generateToken();
    await redisSetEx(`session:${token}`, 60 * 60 * 24 * 30, emailLower);

    return res.status(200).json({ token, uses: 0, maxUses: MAX_USES });
  }

  if (action === "login") {
    const raw = await redisGet(userKey);
    if (!raw) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const user = JSON.parse(raw);
    if (user.password !== hashPassword(password)) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const token = generateToken();
    await redisSetEx(`session:${token}`, 60 * 60 * 24 * 30, emailLower);

    return res.status(200).json({ token, uses: user.uses, maxUses: MAX_USES });
  }

  return res.status(400).json({ error: "Action inconnue." });
}
