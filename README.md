# techwnlabs

Site institucional da WN Labs — `tech.wnlabs.com.br`. Angular 22 estático, hospedado como Cloudflare Worker (plano free) com assets estáticos; formulário de contato em `worker/index.js` enviando via Mailjet.

## Desenvolvimento

```bash
npm install
npm start        # http://localhost:4200 (sem o formulário)
npm run build    # saída em dist/techwnlabs/browser
npx wrangler dev # site + /api/contact locais, após o build
```

## Deploy (Workers Builds)

O repositório já está conectado ao Worker `techwnlabs`. Configuração:

1. **Build** (Configurações → Build do Worker):
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
2. **Secrets** (Configurações → Variables and secrets, tipo Secret):
   - `MAILJET_API_KEY`
   - `MAILJET_SECRET_KEY`
   (chaves da conta Mailjet já usada no envio de e-mail do domínio)
3. **Domínio**: aba Domínios → Adicionar domínio → `tech.wnlabs.com.br`. Antes, exporte o DNS da zona `wnlabs.com.br` (DNS → Exportar) e confira depois que os MX e o TXT de SPF continuam intactos — o e-mail em produção depende deles.

## Observações

- `public/assets/wnlabs-avatar-256.png` fica acessível em `https://tech.wnlabs.com.br/assets/wnlabs-avatar-256.png`. A assinatura de e-mail apontava para o apex (`wnlabs.com.br/assets/...`) — atualizar a assinatura para a URL do subdomínio, ou criar um redirect no apex.
- Marca: wordmark sempre minúsculo (`wnlabs`), azul `#1F6FC4`, tipografia Space Grotesk. Regras completas em `wnlabs-manual-da-marca.md` no repositório de assets.
- Não mencionar redes/wi-fi/infraestrutura em nenhum texto do site.
