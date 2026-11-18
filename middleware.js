// Login do sistema interno. Roda na Vercel antes de qualquer página,
// então ninguém vê o site sem entrar com usuário e senha.
//
// Para trocar o acesso sem mexer no código, defina na Vercel
// (Settings → Environment Variables): AUTH_USER e AUTH_PASS.
// Sem essas variáveis vale o usuário "stack" e a senha cujo SHA-256 está abaixo.

export const config = { matcher: "/:path*" };

const DEFAULT_USER = "stack";
const DEFAULT_PASS_SHA256 = "c08704821faea65c64e0f8506439af045f8bf51d41896353cef34037da39cae8";
const COOKIE = "stack_sessao";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function credentials() {
  const env = (typeof process !== "undefined" && process.env) || {};
  return { user: env.AUTH_USER || DEFAULT_USER, pass: env.AUTH_PASS || null };
}

async function passHash() {
  const { pass } = credentials();
  return pass ? sha256(pass) : DEFAULT_PASS_SHA256;
}

async function sessionToken() {
  const { user } = credentials();
  return sha256(`${user}:${await passHash()}:stack-comercial-sessao-v1`);
}

function readCookie(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function redirect(to, extraHeaders = {}) {
  return new Response(null, { status: 303, headers: { Location: to, "Cache-Control": "no-store", ...extraHeaders } });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const secure = url.protocol === "https:" ? "; Secure" : "";

  if (url.pathname === "/logout") {
    return redirect("/login", { "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}` });
  }

  if (url.pathname === "/login") {
    if (request.method === "POST") {
      const form = await request.formData();
      const user = String(form.get("user") || "").trim();
      const pass = String(form.get("pass") || "");
      const ok = safeEqual(user.toLowerCase(), credentials().user.toLowerCase()) && safeEqual(await sha256(pass), await passHash());
      if (!ok) return redirect("/login?erro=1");
      return redirect("/", {
        "Set-Cookie": `${COOKIE}=${await sessionToken()}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; SameSite=Lax${secure}`,
      });
    }
    return new Response(loginPage(url.searchParams.has("erro")), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  if (safeEqual(readCookie(request, COOKIE) || "", await sessionToken())) return; // segue para o site

  return redirect("/login");
}

function loginPage(error) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Entrar · Stack Comercial</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@700&family=Manrope:wght@500;600;700&display=swap">
<style>
:root{--bg:#f5f6f9;--surface:#fff;--line:#e3e6ee;--fg:#161a26;--muted:#5d6478;--accent:#3346d3;--on-accent:#fff;--low:#c43d3d;--low-soft:#fbe6e6;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#0f1118;--surface:#171a24;--line:#2a2e3e;--fg:#e9ebf3;--muted:#9aa1b6;--accent:#8b98ff;--on-accent:#0f1118;--low:#f07c7c;--low-soft:#3a1d22;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);color:var(--fg);font-family:"Manrope",system-ui,sans-serif;padding:24px 16px}
form{width:100%;max-width:360px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:28px;display:flex;flex-direction:column;gap:16px}
.brand{display:flex;align-items:center;gap:10px}
.logo{width:36px;height:36px;border-radius:10px;background:var(--accent);color:var(--on-accent);display:flex;align-items:center;justify-content:center;font-family:"Sora",sans-serif;font-weight:700}
h1{font-family:"Sora",sans-serif;font-size:1.25rem;margin:0}
p{margin:0;color:var(--muted);font-size:14px}
label{display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:14px}
input{font:inherit;font-size:15px;padding:11px 12px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--fg)}
input:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
button{font:inherit;font-weight:700;font-size:15px;padding:12px;border-radius:999px;border:0;background:var(--accent);color:var(--on-accent);cursor:pointer}
.err{background:var(--low-soft);color:var(--low);border-radius:10px;padding:10px 12px;font-size:14px;font-weight:600}
</style>
</head>
<body>
<form method="post" action="/login">
  <div class="brand"><span class="logo">S</span><h1>Stack Comercial</h1></div>
  <p>Sistema interno. Entre com o acesso da equipe.</p>
  ${error ? '<div class="err" role="alert">Usuário ou senha incorretos.</div>' : ""}
  <label for="user">Usuário<input id="user" name="user" autocomplete="username" required autofocus></label>
  <label for="pass">Senha<input id="pass" name="pass" type="password" autocomplete="current-password" required></label>
  <button type="submit">Entrar</button>
</form>
</body>
</html>`;
}
