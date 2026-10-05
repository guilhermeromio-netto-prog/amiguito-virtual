# Amiguito Virtual · byGui

Bichinho virtual pra crianças (~5–10 anos) **cuidarem, ensinarem e aprenderem juntos**.

Site estático (HTML/CSS/JS), sem conta, sem anúncios, sem chat aberto e sem dados na nuvem — tudo fica no navegador (`localStorage`).

## Personagens

| Amiguito | Quem é |
|----------|--------|
| **Luna** | Gatinha curiosa e carinhosa |
| **Pipoca** | Cachorrinho brincalhão e leal |
| **Fogo** | Dragãozinho gentil e corajoso |

## O que dá pra fazer

1. **Casa** — alimentar, brincar, descansar e dar carinho (barras de fome, humor, energia e carinho)
2. **Ensinar** — cores, números, palavrinhas e gentileza
3. **Aprender** — missões curtas + dica do dia (o amiguito ensina de volta)
4. **Troféus** — adesivos e conquistas

## Como abrir

- **Online:** https://guilhermeromio-netto-prog.github.io/amiguito-virtual/
- **Local:** abra `index.html` num servidor estático simples (ex.: `python3 -m http.server 8080`)

## Stack

- HTML + CSS + JS puro (sem build, sem npm, sem React)
- Dados em `dados.json`
- Deploy: GitHub Pages via Actions (`.github/workflows/pages.yml`)

## Privacidade e segurança

- Sem rastreamento, sem cookies de terceiros
- Sons desligados por padrão
- Progresso só no aparelho; dá pra apagar em Troféus / tela inicial
- Fala roteirizada (“Amiguito fala”) — sem IA online nesta versão

## Estrutura

```
index.html
css/estilo.css
js/storage.js   # localStorage + decaimento
js/ia.js        # fala roteirizada (extensível)
js/pet.js       # SVG + necessidades
js/ensinar.js   # lições
js/aprender.js  # missões e dica do dia
js/app.js       # SPA hash
dados.json
```

## Assinatura

Feito com carinho · **byGui**
