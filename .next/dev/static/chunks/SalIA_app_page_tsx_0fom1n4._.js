(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/SalIA/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SalIA/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SalIA/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SalIA/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SalIA/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SalIA/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const ease = [
    0.22,
    1,
    0.36,
    1
];
const MAX_USES = 3;
const steps = [
    {
        n: '01',
        label: 'Colle ta transcription'
    },
    {
        n: '02',
        label: 'Lance l\'analyse'
    },
    {
        n: '03',
        label: 'Télécharge ton rapport'
    }
];
function Home() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uses, setUses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [transcript, setTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const t = localStorage.getItem('salia_token');
            if (!t) {
                router.push('/login');
                return;
            }
            setToken(t);
            setUses(parseInt(localStorage.getItem('salia_uses') || '0'));
        }
    }["Home.useEffect"], [
        router
    ]);
    const remaining = MAX_USES - uses;
    function logout() {
        localStorage.removeItem('salia_token');
        localStorage.removeItem('salia_uses');
        router.push('/login');
    }
    async function generate() {
        if (!transcript.trim()) return setStatus({
            type: 'error',
            msg: 'La transcription est vide.'
        });
        if (transcript.length < 200) return setStatus({
            type: 'error',
            msg: 'La transcription semble trop courte (min. 200 caractères).'
        });
        setLoading(true);
        setStatus({
            type: 'loading',
            msg: 'SalIA analyse ton appel… Ça prend 60 à 90 secondes.'
        });
        try {
            const templateRes = await fetch('/template.html');
            if (!templateRes.ok) throw new Error('Template introuvable.');
            const template = await templateRes.text();
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transcript,
                    template,
                    token
                })
            });
            if (res.status === 401) {
                router.push('/login');
                return;
            }
            if (!res.ok) {
                const err = await res.json().catch(()=>({
                        error: 'Erreur serveur.'
                    }));
                throw new Error(err.error || 'Erreur serveur.');
            }
            const html = await res.text();
            const blob = new Blob([
                html
            ], {
                type: 'text/html;charset=utf-8'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `salia-feedback-${new Date().toISOString().slice(0, 10)}.html`;
            document.body.appendChild(a);
            a.click();
            setTimeout(()=>{
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 500);
            const newUses = uses + 1;
            localStorage.setItem('salia_uses', String(newUses));
            setUses(newUses);
            setStatus({
                type: 'success',
                msg: 'Rapport généré et téléchargé. Ouvre le fichier .html dans ton navigateur.'
            });
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err instanceof Error ? err.message : 'Erreur inconnue.'
            });
        } finally{
            setLoading(false);
        }
    }
    if (!token) return null;
    const pct = uses / MAX_USES * 100;
    const usageColor = remaining === 0 ? '#EF4444' : remaining === 1 ? '#F59E0B' : '#22C55E';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            minHeight: '100vh',
            background: 'var(--bg)',
            fontFamily: 'var(--font-body)',
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 0,
                    backgroundImage: 'radial-gradient(ellipse 60% 50% at 70% 20%, rgba(201,168,76,0.04) 0%, transparent 60%)'
                }
            }, void 0, false, {
                fileName: "[project]/SalIA/app/page.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].nav, {
                initial: {
                    opacity: 0,
                    y: -12
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 0.5,
                    ease
                },
                style: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    height: 60,
                    background: 'rgba(8,10,15,0.85)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            fontSize: 20,
                            color: 'var(--text)',
                            letterSpacing: -0.3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    width: 26,
                                    height: 26,
                                    borderRadius: 6,
                                    background: 'linear-gradient(135deg, var(--accent), #A07830)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 11,
                                    color: '#1a1000',
                                    fontWeight: 800
                                },
                                children: "S"
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            "Sal",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'var(--accent)'
                                },
                                children: "i"
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 127,
                                columnNumber: 14
                            }, this),
                            "A"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SalIA/app/page.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 80,
                                            height: 4,
                                            borderRadius: 4,
                                            background: 'var(--surface3)',
                                            overflow: 'hidden'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: '100%',
                                                width: `${pct}%`,
                                                background: usageColor,
                                                borderRadius: 4,
                                                transition: 'width 0.4s ease'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/SalIA/app/page.tsx",
                                            lineNumber: 134,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 12,
                                            color: 'var(--text3)',
                                            whiteSpace: 'nowrap'
                                        },
                                        children: remaining > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: usageColor,
                                                        fontWeight: 600
                                                    },
                                                    children: remaining
                                                }, void 0, false, {
                                                    fileName: "[project]/SalIA/app/page.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 21
                                                }, this),
                                                " analyse",
                                                remaining > 1 ? 's' : ''
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#EF4444'
                                            },
                                            children: "Épuisé"
                                        }, void 0, false, {
                                            fileName: "[project]/SalIA/app/page.tsx",
                                            lineNumber: 143,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: logout,
                                style: {
                                    background: 'transparent',
                                    border: '1px solid var(--border2)',
                                    color: 'var(--text3)',
                                    fontSize: 12,
                                    padding: '6px 14px',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    transition: 'color 0.2s, border-color 0.2s'
                                },
                                onMouseEnter: (e)=>{
                                    e.target.style.color = 'var(--text)';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                },
                                onMouseLeave: (e)=>{
                                    e.target.style.color = 'var(--text3)';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                                },
                                children: "Déconnexion"
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SalIA/app/page.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SalIA/app/page.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: 760,
                    margin: '0 auto',
                    padding: '60px 24px 80px',
                    position: 'relative',
                    zIndex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 16
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.5,
                            delay: 0.1,
                            ease
                        },
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0,
                            marginBottom: 48,
                            justifyContent: 'center'
                        },
                        children: steps.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            padding: '8px 16px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    color: 'var(--accent)',
                                                    fontFamily: 'monospace',
                                                    letterSpacing: 0.5
                                                },
                                                children: s.n
                                            }, void 0, false, {
                                                fileName: "[project]/SalIA/app/page.tsx",
                                                lineNumber: 179,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 12,
                                                    color: 'var(--text3)'
                                                },
                                                children: s.label
                                            }, void 0, false, {
                                                fileName: "[project]/SalIA/app/page.tsx",
                                                lineNumber: 183,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this),
                                    i < steps.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 32,
                                            height: 1,
                                            background: 'var(--border2)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/SalIA/app/page.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.55,
                            delay: 0.15,
                            ease
                        },
                        style: {
                            textAlign: 'center',
                            marginBottom: 48
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 800,
                                    fontSize: 38,
                                    color: 'var(--text)',
                                    lineHeight: 1.18,
                                    letterSpacing: -1,
                                    marginBottom: 14
                                },
                                children: [
                                    "Analyse ton appel.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 31
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        },
                                        children: "Progresse à chaque call."
                                    }, void 0, false, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 15,
                                    color: 'var(--text2)',
                                    lineHeight: 1.7,
                                    maxWidth: 480,
                                    margin: '0 auto'
                                },
                                children: "Colle ta transcription ci-dessous. SalIA identifie tes forces, tes lacunes et te donne un plan d'action concret."
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SalIA/app/page.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 24
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.6,
                            delay: 0.25,
                            ease
                        },
                        style: {
                            background: 'var(--surface)',
                            border: `1px solid ${focused ? 'rgba(201,168,76,0.3)' : 'var(--border2)'}`,
                            borderRadius: 16,
                            overflow: 'hidden',
                            boxShadow: focused ? '0 0 0 4px rgba(201,168,76,0.06)' : 'none',
                            transition: 'border-color 0.25s, box-shadow 0.25s',
                            marginBottom: 16
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 20px',
                                    borderBottom: '1px solid var(--border)',
                                    background: 'var(--surface2)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: transcript.length > 200 ? 'var(--green)' : 'var(--border2)',
                                                    boxShadow: transcript.length > 200 ? '0 0 6px rgba(34,197,94,0.5)' : 'none',
                                                    transition: 'all 0.3s'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/SalIA/app/page.tsx",
                                                lineNumber: 238,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: 'var(--text2)',
                                                    letterSpacing: 0.5
                                                },
                                                children: "TRANSCRIPTION D'APPEL"
                                            }, void 0, false, {
                                                fileName: "[project]/SalIA/app/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 237,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--text3)',
                                            fontFamily: 'monospace'
                                        },
                                        children: transcript.length > 0 ? `${transcript.length.toLocaleString('fr')} car.` : 'vide'
                                    }, void 0, false, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 248,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: transcript,
                                onChange: (e)=>setTranscript(e.target.value),
                                onFocus: ()=>setFocused(true),
                                onBlur: ()=>setFocused(false),
                                placeholder: "Colle ici la transcription complète de ton appel de vente…\n\n[00:00] Vendeur : Bonjour, comment tu vas ?\n[00:05] Prospect : Bien, merci. J'ai vu votre message…\n…",
                                style: {
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    padding: '20px',
                                    color: 'var(--text)',
                                    fontSize: 13.5,
                                    lineHeight: 1.8,
                                    resize: 'vertical',
                                    minHeight: 260,
                                    fontFamily: 'var(--font-body)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '12px 20px',
                                    borderTop: '1px solid var(--border)',
                                    background: 'var(--surface2)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--text3)'
                                        },
                                        children: "Horodatages, noms de speakers, retranscription brute — tout est accepté."
                                    }, void 0, false, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 276,
                                        columnNumber: 13
                                    }, this),
                                    transcript.length > 0 && transcript.length < 200 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--yellow)'
                                        },
                                        children: [
                                            "Encore ",
                                            200 - transcript.length,
                                            " car. minimum"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 280,
                                        columnNumber: 15
                                    }, this),
                                    transcript.length >= 200 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--green)',
                                            fontWeight: 500
                                        },
                                        children: "✓ Prêt pour l'analyse"
                                    }, void 0, false, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 285,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SalIA/app/page.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 14
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.5,
                            delay: 0.38,
                            ease
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                whileHover: remaining > 0 && !loading ? {
                                    opacity: 0.9,
                                    y: -1
                                } : {},
                                whileTap: remaining > 0 && !loading ? {
                                    scale: 0.99
                                } : {},
                                onClick: generate,
                                disabled: loading || remaining === 0,
                                style: {
                                    width: '100%',
                                    padding: '17px 0',
                                    borderRadius: 12,
                                    border: 'none',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    background: remaining > 0 ? 'linear-gradient(135deg, var(--accent) 0%, #A07830 100%)' : 'var(--surface3)',
                                    color: remaining > 0 ? '#1a1000' : 'var(--text3)',
                                    cursor: remaining > 0 && !loading ? 'pointer' : 'not-allowed',
                                    opacity: loading ? 0.7 : 1,
                                    letterSpacing: 0.3,
                                    position: 'relative',
                                    overflow: 'hidden'
                                },
                                children: [
                                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                                            animation: 'shimmer 1.5s infinite'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 318,
                                        columnNumber: 15
                                    }, this),
                                    loading ? '⏳  Analyse en cours…' : remaining === 0 ? 'Toutes les analyses ont été utilisées' : '⚡  Générer mon feedback'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 298,
                                columnNumber: 11
                            }, this),
                            remaining > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    textAlign: 'center',
                                    fontSize: 11,
                                    color: 'var(--text3)',
                                    marginTop: 10
                                },
                                children: [
                                    "Il te reste ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        style: {
                                            color: 'var(--accent)'
                                        },
                                        children: [
                                            remaining,
                                            " analyse",
                                            remaining > 1 ? 's' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SalIA/app/page.tsx",
                                        lineNumber: 331,
                                        columnNumber: 27
                                    }, this),
                                    " sur ",
                                    MAX_USES
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 330,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SalIA/app/page.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                y: -6
                            },
                            transition: {
                                duration: 0.3,
                                ease
                            },
                            style: {
                                marginTop: 16,
                                borderRadius: 10,
                                padding: '14px 18px',
                                fontSize: 13,
                                lineHeight: 1.65,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                                ...status.type === 'error' ? {
                                    background: 'var(--red-dim)',
                                    border: '1px solid rgba(239,68,68,0.18)',
                                    color: '#FCA5A5'
                                } : status.type === 'loading' ? {
                                    background: 'rgba(201,168,76,0.06)',
                                    border: '1px solid rgba(201,168,76,0.18)',
                                    color: 'var(--accent)'
                                } : {
                                    background: 'var(--green-dim)',
                                    border: '1px solid rgba(34,197,94,0.18)',
                                    color: '#86EFAC'
                                }
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 15,
                                        marginTop: 1,
                                        flexShrink: 0
                                    },
                                    children: status.type === 'error' ? '⚠' : status.type === 'loading' ? '⟳' : '✓'
                                }, void 0, false, {
                                    fileName: "[project]/SalIA/app/page.tsx",
                                    lineNumber: 356,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: status.msg
                                }, void 0, false, {
                                    fileName: "[project]/SalIA/app/page.tsx",
                                    lineNumber: 359,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/SalIA/app/page.tsx",
                            lineNumber: 339,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/SalIA/app/page.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        transition: {
                            duration: 0.5,
                            delay: 0.6
                        },
                        style: {
                            marginTop: 48,
                            paddingTop: 28,
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            fontSize: 11,
                            color: 'var(--text3)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Propulsé par Claude Opus"
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 376,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.3
                                },
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "La Bible de la Vente"
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 378,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.3
                                },
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Kaizen Sell Team"
                            }, void 0, false, {
                                fileName: "[project]/SalIA/app/page.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SalIA/app/page.tsx",
                        lineNumber: 365,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SalIA/app/page.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `
            }, void 0, false, {
                fileName: "[project]/SalIA/app/page.tsx",
                lineNumber: 384,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SalIA/app/page.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s(Home, "1qzPWX+k1ZVX6/TTW5wlCpHA7Yc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$SalIA$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=SalIA_app_page_tsx_0fom1n4._.js.map