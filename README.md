# wnlabs — site institucional

Site da [WN Labs](https://tech.wnlabs.com.br) — desenvolvimento de software, dados e IA com conformidade e Direito Digital.

<!-- Adicionar screenshot da home aqui quando o site estiver no ar:
![Home do site](docs/screenshot.png)
-->

**Site:** https://tech.wnlabs.com.br

## Stack

- [Angular 22](https://angular.dev) — página única, estática
- SCSS, sem framework de UI
- Cloudflare Workers para hospedagem e API de contato
- Tipografia [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + JetBrains Mono

## Desenvolvimento

```bash
npm install
npm start        # http://localhost:4200 (sem o formulário)
npm run build    # saída em dist/techwnlabs/browser
npx wrangler dev # site + /api/contact locais, após o build
```

Instruções de deploy e operação em [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Marca

- Wordmark sempre em minúsculas: `wnlabs`
- Paleta: grafite `#23272F` (base), laranja `#E8722A` (acento), laranja escuro `#C25518` (texto sobre fundo claro), papel `#F6F4F1`
- Regra de contraste: `#E8722A` como texto só sobre fundo escuro; sobre fundo claro, texto e links usam `#C25518`
- Regras completas em `wnlabs-manual-da-marca.md`, no repositório de assets

Não mencionar redes/wi-fi/infraestrutura em nenhum texto do site.
