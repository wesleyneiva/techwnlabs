# techwnlabs

Site institucional da WN Labs — `wnlabs.com.br`. Angular 20 estático, hospedado no Cloudflare Pages (plano free), formulário de contato via Pages Function + Mailjet.

## Desenvolvimento

```bash
npm install
npm start        # http://localhost:4200
npm run build    # saída em dist/techwnlabs/browser
```

O formulário (`/api/contact`) só funciona no Cloudflare Pages — localmente é possível testar com `npx wrangler pages dev dist/techwnlabs/browser`.

## Deploy no Cloudflare Pages

1. **Antes de tudo: exporte o DNS da zona** `wnlabs.com.br` (botão Exportar no painel). O e-mail em produção depende dos registros MX e do TXT de SPF — confira que continuam intactos depois do deploy.
2. Workers & Pages → Create → Pages → conectar este repositório GitHub.
3. Configuração de build:
   - Framework preset: **Angular**
   - Build command: `npm run build`
   - Build output directory: `dist/techwnlabs/browser`
4. Em **Settings → Environment variables**, criar (Production):
   - `MAILJET_API_KEY`
   - `MAILJET_SECRET_KEY`
   (chaves da conta Mailjet já usada no envio de e-mail do domínio)
5. Custom domain: `wnlabs.com.br` (e `www` se quiser). O Pages cria um CNAME — ele **não** deve tocar nos registros MX/TXT existentes, mas confira com o export do passo 1.

## Observações

- `public/assets/wnlabs-avatar-256.png` precisa continuar acessível em `https://wnlabs.com.br/assets/wnlabs-avatar-256.png` — a assinatura de e-mail aponta para essa URL.
- Marca: wordmark sempre minúsculo (`wnlabs`), azul `#1F6FC4`, tipografia Space Grotesk. Regras completas em `wnlabs-manual-da-marca.md` no repositório de assets.
- Não mencionar redes/wi-fi/infraestrutura em nenhum texto do site.
