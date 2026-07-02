# Agroserro Soluções Agropecuárias

Site institucional da Agroserro — consultoria agropecuária e engenharia rural no Serro/MG.

**Publicado em:** https://oxdedebjj.github.io/agroserro-site/

## Stack

Site estático: HTML + CSS + JavaScript puros, sem build e sem backend. Abre direto pelo `index.html` ou por qualquer servidor estático.

## Arquivos

- `index.html` — estrutura, conteúdo, SEO (Open Graph, JSON-LD ProfessionalService)
- `styles.css` — design system (tokens de cor/tipografia/espaçamento) + estilos das seções
- `app.js` — menu, WhatsApp por linha de atendimento, formulário → WhatsApp, scroll spy e reveal
- `assets/` — logo otimizada e fotos em versões web

## WhatsApp por linha de atendimento

Os números ficam centralizados em `app.js` (`CONFIG.whatsapp`), somente dígitos com DDI+DDD:

- `credito` — Crédito rural (também é a linha dos botões genéricos, via `defaultLine`)
- `geo` — Georreferenciamento, topografia, laudos, CAR e ambiental
- `agro` — Consultoria agronômica

Cada botão do site usa `data-whatsapp` + `data-line` + `data-message` para abrir a conversa certa com mensagem pré-preenchida.

## Rodar localmente

Abra o `index.html` no navegador, ou:

```bash
npx serve . -l 4173
```

## Publicar alterações

O site é servido pelo GitHub Pages a partir da branch `main`:

```bash
git add -A && git commit -m "Descrição da mudança" && git push
```
