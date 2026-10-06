/* Imagens open-web (Wikimedia/Wikipedia REST) + fallback SVG — byGui */
(function (global) {
  let CATALOGO = null;
  let carregando = null;

  function escapar(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function svgFallback(chave, emoji) {
    const e = emoji || "✨";
    const label = escapar(chave || "figura");
    return `<svg class="midia-svg-fallback" viewBox="0 0 160 120" role="img" aria-label="${label}">
      <defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#EEF2FF"/><stop offset="100%" stop-color="#FDF4FF"/>
      </linearGradient></defs>
      <rect width="160" height="120" rx="16" fill="url(#mg)" stroke="#C7D2FE" stroke-width="3"/>
      <text x="80" y="68" text-anchor="middle" font-size="42">${e}</text>
    </svg>`;
  }

  function carregarCatalogo() {
    if (CATALOGO) return Promise.resolve(CATALOGO);
    if (carregando) return carregando;
    carregando = fetch("data/midia-catalogo.json")
      .then((r) => (r.ok ? r.json() : {}))
      .then((j) => { CATALOGO = j || {}; return CATALOGO; })
      .catch(() => { CATALOGO = {}; return CATALOGO; });
    return carregando;
  }

  function get(chave) {
    if (!CATALOGO) return null;
    return CATALOGO[chave] || null;
  }

  /** HTML de figura com atribuição; onerror → SVG */
  function figurinhaHtml(chave, opts) {
    opts = opts || {};
    const meta = get(chave) || {};
    const emoji = opts.emoji || meta.emoji || "✨";
    const alt = escapar(opts.alt || meta.titulo || chave || "figurinha");
    const src = meta.src || "";
    const credit = meta.credito || "Figura educativa";
    const page = meta.pagina || "";
    const id = "midia-" + Math.random().toString(36).slice(2, 8);
    if (!src) {
      return `<figure class="midia-fig" data-chave="${escapar(chave)}">
        ${svgFallback(chave, emoji)}
        <figcaption class="midia-credito">${escapar(credit)} · fallback</figcaption>
      </figure>`;
    }
    return `<figure class="midia-fig" data-chave="${escapar(chave)}">
      <img id="${id}" class="midia-img" src="${escapar(src)}" alt="${alt}" loading="lazy"
        referrerpolicy="no-referrer" width="${opts.w || 240}" height="${opts.h || 180}"
        onerror="this.style.display='none';var f=this.nextElementSibling;if(f)f.hidden=false;">
      <div class="midia-fallback" hidden>${svgFallback(chave, emoji)}</div>
      <figcaption class="midia-credito">
        <span aria-hidden="true">📷</span>
        ${page ? `<a href="${escapar(page)}" target="_blank" rel="noopener noreferrer">${escapar(credit)}</a>` : escapar(credit)}
      </figcaption>
    </figure>`;
  }

  /** Pré-render async: garante catálogo e devolve HTML */
  function figurinha(chave, opts) {
    return carregarCatalogo().then(() => figurinhaHtml(chave, opts));
  }

  global.AmiguitoMidia = {
    carregarCatalogo, get, figurinhaHtml, figurinha, svgFallback, escapar
  };
})(window);
