# Deploy e operação

Angular 22 estático, hospedado como Cloudflare Worker (plano free) com assets estáticos; formulário de contato em `worker/index.js` enviando via Mailjet, protegido por Turnstile, honeypot e rate limit por IP.

## Deploy (Workers Builds)

O repositório está conectado ao Worker `techwnlabs`. Configuração:

1. **Build** (Configurações → Build do Worker):
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
2. **Secrets** (Configurações → Variables and secrets, tipo Secret):
   - `MAILJET_API_KEY`
   - `MAILJET_SECRET_KEY`
   - `TURNSTILE_SECRET_KEY` (secret key do widget Turnstile)
3. **Turnstile**: criar o widget em Cloudflare → Turnstile para `tech.wnlabs.com.br`. A **site key** vai em `src/app/app.ts` (`turnstileSiteKey`); a **secret key** vai no secret acima.
4. **KV**: criar o namespace do rate limit e colocar o id em `wrangler.jsonc`:
   ```bash
   npx wrangler kv namespace create RATE_LIMIT
   ```
5. **Domínio**: aba Domínios → Adicionar domínio → `tech.wnlabs.com.br`. Antes, exporte o DNS da zona `wnlabs.com.br` (DNS → Exportar) e confira depois que os MX e o TXT de SPF continuam intactos — o e-mail em produção depende deles.

## Proteções do /api/contact

- Só `POST` com `Content-Type: application/json` e `Origin`/`Referer` de `tech.wnlabs.com.br` (ou localhost em dev)
- Token do Turnstile validado no worker antes de qualquer chamada à Mailjet
- Remetente, destinatário, assunto e reply-to fixos no código — nada do usuário controla cabeçalhos
- Limites: nome 100, e-mail 150, telefone 20, mensagem 2000 caracteres (rejeita acima)
- Honeypot (campo `company`): preenchido → descarte silencioso
- Rate limit: 3 envios por IP por hora (KV `RATE_LIMIT`), acima disso 429
- Erros da Mailjet nunca chegam ao cliente; ficam nos logs do worker

## Observações

- `public/assets/wnlabs-avatar-256.png` fica acessível em `https://tech.wnlabs.com.br/assets/wnlabs-avatar-256.png`.
