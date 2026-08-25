// Worker do site: /api/contact envia e-mail via Mailjet; o resto vai para os assets estáticos.
// Requer os secrets MAILJET_API_KEY e MAILJET_SECRET_KEY (Settings → Variables and secrets).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json({ error: 'Método não permitido' }, 405);
      }
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const name = String(data.name || '').trim().slice(0, 120);
  const email = String(data.email || '').trim().slice(0, 160);
  const phone = String(data.phone || '').trim().slice(0, 20);
  const message = String(data.message || '').trim().slice(0, 4000);

  const phoneDigits = phone.replace(/\D/g, '');
  if (!name || !message || phoneDigits.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Campos inválidos' }, 400);
  }

  // Link wa.me pronto para responder com um toque; DDI 55 se vier só DDD+número.
  const waNumber = phoneDigits.length <= 11 ? `55${phoneDigits}` : phoneDigits;

  if (!env.MAILJET_API_KEY || !env.MAILJET_SECRET_KEY) {
    console.error('Secrets MAILJET_API_KEY/MAILJET_SECRET_KEY não configurados no Worker');
    return json({ error: 'Configuração pendente' }, 502);
  }

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
          ReplyTo: { Email: email, Name: name },
          Subject: `Contato pelo site — ${name}`,
          TextPart: `Nome: ${name}\nE-mail: ${email}\nTelefone/WhatsApp: ${phone}\nResponder no WhatsApp: https://wa.me/${waNumber}\n\n${message}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Mailjet respondeu ${res.status}: ${body.slice(0, 500)}`);
    return json({ error: 'Falha ao enviar' }, 502);
  }
  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
