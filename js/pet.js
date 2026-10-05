/* SVG dos personagens + lógica de necessidades */
(function (global) {
  function svgLuna(humor) {
    const olhos = humor === "dormindo"
      ? `<path d="M28 42 Q34 38 40 42" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
         <path d="M60 42 Q66 38 72 42" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : humor === "triste"
      ? `<ellipse cx="34" cy="44" rx="5" ry="6" fill="#2D3436"/>
         <ellipse cx="66" cy="44" rx="5" ry="6" fill="#2D3436"/>
         <path d="M40 62 Q50 58 60 62" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="34" cy="42" rx="5.5" ry="7" fill="#2D3436"/>
         <ellipse cx="66" cy="42" rx="5.5" ry="7" fill="#2D3436"/>
         <circle cx="36" cy="40" r="2" fill="#fff"/>
         <circle cx="68" cy="40" r="2" fill="#fff"/>
         <path d="M40 60 Q50 68 60 60" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

    return `<svg class="pet-svg" viewBox="0 0 100 100" role="img" aria-label="Luna, a gatinha">
      <ellipse cx="50" cy="92" rx="28" ry="6" fill="rgba(0,0,0,0.08)"/>
      <ellipse cx="50" cy="58" rx="32" ry="28" fill="#FFB4C8"/>
      <circle cx="50" cy="42" r="26" fill="#FFC8D8"/>
      <path d="M28 28 L22 8 L38 22 Z" fill="#FFB4C8"/>
      <path d="M72 28 L78 8 L62 22 Z" fill="#FFB4C8"/>
      <path d="M30 26 L26 14 L36 22 Z" fill="#FFE0EC"/>
      <path d="M70 26 L74 14 L64 22 Z" fill="#FFE0EC"/>
      ${olhos}
      <ellipse cx="50" cy="52" rx="4" ry="3" fill="#F28BA6"/>
      <line x1="50" y1="55" x2="50" y2="58" stroke="#F28BA6" stroke-width="1.5"/>
      <line x1="50" y1="56" x2="40" y2="60" stroke="#2D3436" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="50" y1="56" x2="60" y2="60" stroke="#2D3436" stroke-width="1.2" stroke-linecap="round"/>
      <ellipse cx="22" cy="48" rx="5" ry="4" fill="#FFB4C8" opacity="0.7"/>
      <ellipse cx="78" cy="48" rx="5" ry="4" fill="#FFB4C8" opacity="0.7"/>
      ${humor === "dormindo" ? `<text x="72" y="28" font-size="12" fill="#9B84C7">z</text><text x="80" y="20" font-size="9" fill="#9B84C7">z</text>` : ""}
    </svg>`;
  }

  function svgPipoca(humor) {
    const olhos = humor === "dormindo"
      ? `<path d="M30 44 Q36 40 42 44" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
         <path d="M58 44 Q64 40 70 44" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : humor === "triste"
      ? `<circle cx="36" cy="44" r="5" fill="#2D3436"/>
         <circle cx="64" cy="44" r="5" fill="#2D3436"/>
         <path d="M42 62 Q50 57 58 62" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : `<circle cx="36" cy="42" r="5.5" fill="#2D3436"/>
         <circle cx="64" cy="42" r="5.5" fill="#2D3436"/>
         <circle cx="38" cy="40" r="2" fill="#fff"/>
         <circle cx="66" cy="40" r="2" fill="#fff"/>
         <path d="M42 58 Q50 66 58 58" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
         <ellipse cx="28" cy="54" rx="5" ry="3.5" fill="#F5A623" opacity="0.5"/>
         <ellipse cx="72" cy="54" rx="5" ry="3.5" fill="#F5A623" opacity="0.5"/>`;

    return `<svg class="pet-svg" viewBox="0 0 100 100" role="img" aria-label="Pipoca, o cachorrinho">
      <ellipse cx="50" cy="92" rx="28" ry="6" fill="rgba(0,0,0,0.08)"/>
      <ellipse cx="50" cy="60" rx="30" ry="26" fill="#FFD07A"/>
      <circle cx="50" cy="42" r="25" fill="#FFE0A0"/>
      <ellipse cx="22" cy="38" rx="10" ry="14" fill="#E8A84A"/>
      <ellipse cx="78" cy="38" rx="10" ry="14" fill="#E8A84A"/>
      <ellipse cx="22" cy="40" rx="6" ry="9" fill="#FFE0A0"/>
      <ellipse cx="78" cy="40" rx="6" ry="9" fill="#FFE0A0"/>
      ${olhos}
      <ellipse cx="50" cy="52" rx="7" ry="5" fill="#3D2914"/>
      <circle cx="47" cy="51" r="1.5" fill="#fff" opacity="0.5"/>
      <path d="M50 57 L50 62" stroke="#3D2914" stroke-width="2" stroke-linecap="round"/>
      <path d="M78 68 Q90 55 88 78 Q80 85 72 75" fill="#E8A84A"/>
      ${humor === "dormindo" ? `<text x="72" y="28" font-size="12" fill="#9B84C7">z</text>` : ""}
    </svg>`;
  }

  function svgFogo(humor) {
    const olhos = humor === "dormindo"
      ? `<path d="M32 44 Q38 40 44 44" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
         <path d="M56 44 Q62 40 68 44" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : humor === "triste"
      ? `<ellipse cx="38" cy="44" rx="5" ry="6" fill="#2D3436"/>
         <ellipse cx="62" cy="44" rx="5" ry="6" fill="#2D3436"/>
         <path d="M42 62 Q50 57 58 62" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="38" cy="42" rx="5.5" ry="7" fill="#2D3436"/>
         <ellipse cx="62" cy="42" rx="5.5" ry="7" fill="#2D3436"/>
         <circle cx="40" cy="40" r="2" fill="#fff"/>
         <circle cx="64" cy="40" r="2" fill="#fff"/>
         <path d="M42 58 Q50 66 58 58" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

    return `<svg class="pet-svg" viewBox="0 0 100 100" role="img" aria-label="Fogo, o dragãozinho">
      <ellipse cx="50" cy="92" rx="28" ry="6" fill="rgba(0,0,0,0.08)"/>
      <path d="M18 50 Q8 40 14 30 Q22 38 22 48 Z" fill="#6BC4A0"/>
      <path d="M82 50 Q92 40 86 30 Q78 38 78 48 Z" fill="#6BC4A0"/>
      <ellipse cx="50" cy="58" rx="30" ry="26" fill="#A8E6CF"/>
      <circle cx="50" cy="42" r="24" fill="#C5F5E0"/>
      <path d="M42 18 L50 6 L58 18" fill="#6BC4A0"/>
      <path d="M46 18 L50 10 L54 18" fill="#FFE66D"/>
      ${olhos}
      <ellipse cx="50" cy="52" rx="4" ry="3" fill="#2D3436"/>
      <circle cx="30" cy="72" r="3" fill="#6BC4A0"/>
      <circle cx="50" cy="78" r="3" fill="#6BC4A0"/>
      <circle cx="70" cy="72" r="3" fill="#6BC4A0"/>
      <path d="M72 70 Q85 60 82 82 Q70 88 68 75" fill="#6BC4A0"/>
      ${humor === "feliz" ? `<path d="M55 50 Q62 48 60 54" fill="#FF8A65" opacity="0.7"/>` : ""}
      ${humor === "dormindo" ? `<text x="72" y="26" font-size="12" fill="#9B84C7">z</text>` : ""}
    </svg>`;
  }

  function renderSvg(id, humor) {
    if (id === "luna") return svgLuna(humor);
    if (id === "pipoca") return svgPipoca(humor);
    return svgFogo(humor);
  }

  function humorDe(necessidades) {
    const media = (necessidades.fome + necessidades.humor + necessidades.energia + necessidades.carinho) / 4;
    if (necessidades.energia < 25) return "dormindo";
    if (media < 35) return "triste";
    if (media > 70) return "feliz";
    return "neutro";
  }

  function necessidadeMaisBaixa(n) {
    const pares = [
      ["fome", n.fome],
      ["humor", n.humor],
      ["energia", n.energia],
      ["carinho", n.carinho]
    ];
    pares.sort((a, b) => a[1] - b[1]);
    return pares[0][0];
  }

  function classeBarra(valor) {
    if (valor >= 60) return "is-bom";
    if (valor >= 30) return "is-medio";
    return "is-baixo";
  }

  const LABELS = {
    fome: "Fome",
    humor: "Humor",
    energia: "Energia",
    carinho: "Carinho"
  };

  function renderBarras(n) {
    return Object.keys(LABELS).map((k) => `
      <div class="necessidade" role="group" aria-label="${LABELS[k]}: ${n[k]}%">
        <span>${LABELS[k]}</span>
        <div class="necessidade__barra">
          <div class="necessidade__preenchimento ${classeBarra(n[k])}" style="width:${n[k]}%"></div>
        </div>
        <span aria-hidden="true">${n[k]}%</span>
      </div>
    `).join("");
  }

  global.AmiguitoPet = {
    renderSvg,
    humorDe,
    necessidadeMaisBaixa,
    renderBarras,
    LABELS
  };
})(window);
