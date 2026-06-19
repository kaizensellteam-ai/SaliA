module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/SalIA/app/api/auth/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SalIA/node_modules/next/server.js [app-route] (ecmascript)");
;
;
const MAX_USES = 3;
function redisUrl(path) {
    return `${process.env.KV_REST_API_URL}${path}`;
}
function redisHeaders() {
    return {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json'
    };
}
async function redisGet(key) {
    const r = await fetch(redisUrl(`/get/${encodeURIComponent(key)}`), {
        headers: redisHeaders()
    });
    const data = await r.json();
    return data.result;
}
async function redisSet(key, value) {
    await fetch(redisUrl(`/set/${encodeURIComponent(key)}`), {
        method: 'POST',
        headers: redisHeaders(),
        body: JSON.stringify({
            value
        })
    });
}
async function redisSetEx(key, seconds, value) {
    await fetch(redisUrl(`/setex/${encodeURIComponent(key)}/${seconds}`), {
        method: 'POST',
        headers: redisHeaders(),
        body: JSON.stringify({
            value
        })
    });
}
function hashPassword(password) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])('sha256').update(password + 'salia_salt_2024').digest('hex');
}
function generateToken() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString('hex');
}
async function POST(req) {
    const { action, email, password } = await req.json();
    if (!action || !email || !password) return __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Champs manquants.'
    }, {
        status: 400
    });
    const emailLower = email.toLowerCase().trim();
    const userKey = `user:${emailLower}`;
    if (action === 'register') {
        const existing = await redisGet(userKey);
        if (existing) return __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Un compte existe déjà avec cet email.'
        }, {
            status: 409
        });
        const user = {
            password: hashPassword(password),
            uses: 0
        };
        await redisSet(userKey, JSON.stringify(user));
        const token = generateToken();
        await redisSetEx(`session:${token}`, 60 * 60 * 24 * 30, emailLower);
        return __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            token,
            uses: 0,
            maxUses: MAX_USES
        });
    }
    if (action === 'login') {
        const raw = await redisGet(userKey);
        if (!raw) return __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Email ou mot de passe incorrect.'
        }, {
            status: 401
        });
        const user = JSON.parse(raw);
        if (user.password !== hashPassword(password)) return __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Email ou mot de passe incorrect.'
        }, {
            status: 401
        });
        const token = generateToken();
        await redisSetEx(`session:${token}`, 60 * 60 * 24 * 30, emailLower);
        return __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            token,
            uses: user.uses,
            maxUses: MAX_USES
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Action inconnue.'
    }, {
        status: 400
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0-iyg48._.js.map