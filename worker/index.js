// Worker do site: /api/contact envia e-mail via Mailjet; o resto vai para os assets estáticos.
// Secrets necessários (Settings → Variables and secrets):
//   MAILJET_API_KEY, MAILJET_SECRET_KEY, TURNSTILE_SECRET_KEY
// Binding KV necessário: RATE_LIMIT (ver wrangler.jsonc).

const ALLOWED_ORIGINS = new Set([
  'https://tech.wnlabs.com.br',
  'http://localhost:4200',
  'http://localhost:8787',
]);

const MAX_NAME = 100;
const MAX_EMAIL = 150;
const MAX_PHONE = 20;
const MAX_MESSAGE = 2000;
const RATE_LIMIT_MAX = 3; // envios por IP por hora

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      // d) só POST
      if (request.method !== 'POST') {
        return json({ error: 'Método não permitido' }, 405);
      }
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  // d) Content-Type e origem
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return json({ error: 'Requisição inválida' }, 400);
  }

  const origin = request.headers.get('Origin') || '';
  const referer = request.headers.get('Referer') || '';
  const originOk =
    ALLOWED_ORIGINS.has(origin) ||
    (!origin && [...ALLOWED_ORIGINS].some((o) => referer.startsWith(o + '/')));
  if (!originOk) {
    return json({ error: 'Origem não permitida' }, 403);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Requisição inválida' }, 400);
  }

  // f) honeypot: se veio preenchido, descarta em silêncio respondendo sucesso
  if (String(data.company || '').trim() !== '') {
    return json({ ok: true });
  }

  // e) limites de tamanho — acima do limite rejeita, não trunca
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const phone = String(data.phone || '').trim();
  const message = String(data.message || '').trim();
  const token = String(data.turnstileToken || '');

  if (
    name.length === 0 || name.length > MAX_NAME ||
    email.length === 0 || email.length > MAX_EMAIL ||
    phone.length > MAX_PHONE ||
    message.length === 0 || message.length > MAX_MESSAGE
  ) {
    return json({ error: 'Campos inválidos' }, 400);
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Campos inválidos' }, 400);
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  // a) Turnstile ANTES de qualquer chamada à Mailjet
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error('Secret TURNSTILE_SECRET_KEY não configurado no Worker');
    return json({ error: 'Configuração pendente' }, 502);
  }
  const verified = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip);
  if (!verified) {
    return json({ error: 'Verificação anti-spam falhou' }, 403);
  }

  // c) rate limit: 3 envios por IP por hora (janela fixa por bucket de hora)
  if (env.RATE_LIMIT) {
    const bucket = Math.floor(Date.now() / 3_600_000);
    const key = `rl:${ip}:${bucket}`;
    const count = parseInt((await env.RATE_LIMIT.get(key)) || '0', 10);
    if (count >= RATE_LIMIT_MAX) {
      return json({ error: 'Muitos envios. Tente novamente mais tarde.' }, 429);
    }
    await env.RATE_LIMIT.put(key, String(count + 1), { expirationTtl: 3700 });
  } else {
    console.error('Binding KV RATE_LIMIT ausente — rate limit inativo');
  }

  if (!env.MAILJET_API_KEY || !env.MAILJET_SECRET_KEY) {
    console.error('Secrets MAILJET_API_KEY/MAILJET_SECRET_KEY não configurados no Worker');
    return json({ error: 'Configuração pendente' }, 502);
  }

  // Link wa.me pronto para responder com um toque; DDI 55 se vier só DDD+número.
  const waNumber = phoneDigits.length <= 11 ? `55${phoneDigits}` : phoneDigits;

  // b) remetente, destinatário e assunto FIXOS. O reply-to usa o e-mail do
  // cliente (já validado por regex e tamanho) para o "Responder" funcionar —
  // não participa de SPF/DKIM nem desvia o destino. O restante do que o
  // usuário digitou entra somente no corpo, higienizado.
  const body = [
    `Nome: ${sanitize(name)}`,
    `E-mail: ${sanitize(email)}`,
    `Telefone/WhatsApp: ${sanitize(phone)}`,
    `Responder no WhatsApp: https://wa.me/${waNumber}`,
    '',
    sanitize(message, true),
  ].join('\n');

  const auth = btoa(`${env.MAILJET_API_KEY}:${env.MAILJET_SECRET_KEY}`);
  const res = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: 'contato@wnlabs.com.br', Name: 'Site WN Labs' },
          To: [{ Email: 'contato@wnlabs.com.br', Name: 'WN Labs' }],
          ReplyTo: { Email: email, Name: sanitize(name) },
          Subject: 'Contato pelo site',
          TextPart: body,
        },
      ],
    }),
  });

  // g) erro da Mailjet nunca chega ao cliente — log no worker, resposta genérica
  if (!res.ok) {
    const detail = await res.text();
    console.error(`Mailjet respondeu ${res.status}: ${detail.slice(0, 500)}`);
    return json({ error: 'Falha ao enviar' }, 502);
  }
  return json({ ok: true });
}

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    if (!res.ok) {
      console.error(`Turnstile siteverify respondeu ${res.status}`);
      return false;
    }
    const result = await res.json();
    if (!result.success) {
      console.error(`Turnstile recusou o token: ${(result['error-codes'] || []).join(', ')}`);
    }
    return result.success === true;
  } catch (err) {
    console.error(`Erro ao validar Turnstile: ${err}`);
    return false;
  }
}

// Remove caracteres de controle; keepNewlines preserva quebras de linha da mensagem.
function sanitize(value, keepNewlines = false) {
  let out = '';
  for (const ch of value.replace(/\r\n?/g, '\n')) {
    const code = ch.charCodeAt(0);
    if (code === 10) {
      out += keepNewlines ? '\n' : ' ';
    } else if (code >= 32 && code !== 127) {
      out += ch;
    }
  }
  return out;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
