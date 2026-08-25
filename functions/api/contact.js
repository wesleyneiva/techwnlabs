// Cloudflare Pages Function — recebe o formulário e envia via Mailjet.
// Requer as variáveis MAILJET_API_KEY e MAILJET_SECRET_KEY no painel do Pages.
export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const name = String(data.name || '').trim().slice(0, 120);
  const email = String(data.email || '').trim().slice(0, 160);
  const message = String(data.message || '').trim().slice(0, 4000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Campos inválidos' }, 400);
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
          TextPart: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
        },
      ],
    }),
  });

  if (!res.ok) {
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
