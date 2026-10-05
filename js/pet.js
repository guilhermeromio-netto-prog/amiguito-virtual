/* Amiguinhos SVG (crianças) · Rumi Zoe Mira Emily Léozinho */
(function (global) {
  function olhos(humor, cx1, cx2, cy) {
    if (humor === "dormindo") {
      return `<path d="M${cx1-7} ${cy} Q${cx1} ${cy-5} ${cx1+7} ${cy}" stroke="#2A2F33" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M${cx2-7} ${cy} Q${cx2} ${cy-5} ${cx2+7} ${cy}" stroke="#2A2F33" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    }
    if (humor === "triste") {
      return `<g class="olho-pisca"><ellipse cx="${cx1}" cy="${cy+1}" rx="6" ry="7" fill="#2A2F33"/><circle cx="${cx1+2}" cy="${cy-1}" r="2" fill="#fff"/></g>
        <g class="olho-pisca"><ellipse cx="${cx2}" cy="${cy+1}" rx="6" ry="7" fill="#2A2F33"/><circle cx="${cx2+2}" cy="${cy-1}" r="2" fill="#fff"/></g>
        <path d="M${cx1+3} ${cy+20} Q${(cx1+cx2)/2} ${cy+14} ${cx2-3} ${cy+20}" stroke="#2A2F33" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    }
    const boca = (humor === "feliz" || humor === "empolgado")
      ? `<path d="M${cx1+2} ${cy+16} Q${(cx1+cx2)/2} ${cy+28} ${cx2-2} ${cy+16}" stroke="#2A2F33" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      : `<path d="M${cx1+5} ${cy+18} Q${(cx1+cx2)/2} ${cy+22} ${cx2-5} ${cy+18}" stroke="#2A2F33" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    const brow = humor === "empolgado"
      ? `<path d="M${cx1-8} ${cy-12} Q${cx1} ${cy-18} ${cx1+8} ${cy-12}" stroke="#2A2F33" stroke-width="2" fill="none"/>
         <path d="M${cx2-8} ${cy-12} Q${cx2} ${cy-18} ${cx2+8} ${cy-12}" stroke="#2A2F33" stroke-width="2" fill="none"/>` : "";
    return `${brow}
      <g class="olho-pisca"><ellipse cx="${cx1}" cy="${cy}" rx="6.5" ry="8" fill="#2A2F33"/><circle cx="${cx1+2}" cy="${cy-2}" r="2.4" fill="#fff"/><circle cx="${cx1-1.5}" cy="${cy+2}" r="1" fill="#fff"/></g>
      <g class="olho-pisca"><ellipse cx="${cx2}" cy="${cy}" rx="6.5" ry="8" fill="#2A2F33"/><circle cx="${cx2+2}" cy="${cy-2}" r="2.4" fill="#fff"/><circle cx="${cx2-1.5}" cy="${cy+2}" r="1" fill="#fff"/></g>
      ${boca}`;
  }

  function accSvg(ids) {
    if (!ids || !ids.length) return "";
    let s = "";
    if (ids.includes("coroa")) s += `<text x="36" y="14" font-size="22">👑</text>`;
    if (ids.includes("capacete")) s += `<text x="32" y="18" font-size="24">👨‍🚀</text>`;
    if (ids.includes("oculos")) s += `<text x="28" y="42" font-size="26">🕶️</text>`;
    if (ids.includes("laco")) s += `<text x="62" y="20" font-size="18">🎀</text>`;
    if (ids.includes("estrela")) s += `<text x="10" y="28" font-size="18">⭐</text>`;
    if (ids.includes("foguete")) s += `<text x="68" y="78" font-size="18">🚀</text>`;
    return s;
  }

  function kidBase(opts) {
    const { humor, cabelo, pele, camiseta, cabeloPath, shortHair, zz, acc } = opts;
    return `<svg class="pet-svg" viewBox="0 0 100 100" role="img" aria-label="${opts.label}">
      <ellipse cx="50" cy="94" rx="28" ry="4" fill="rgba(0,0,0,0.08)"/>
      <ellipse cx="50" cy="72" rx="24" ry="20" fill="${camiseta}"/>
      <circle cx="50" cy="42" r="24" fill="${pele}"/>
      ${cabeloPath}
      ${olhos(humor, 40, 60, 42)}
      <ellipse cx="32" cy="48" rx="4" ry="3" fill="#F5A9A9" opacity="0.45"/>
      <ellipse cx="68" cy="48" rx="4" ry="3" fill="#F5A9A9" opacity="0.45"/>
      ${zz || ""}${accSvg(acc)}
    </svg>`;
  }

  function svgRumi(humor, acc) {
    const zz = humor === "dormindo" ? `<text x="74" y="24" font-size="12" fill="#9B84C7" font-weight="700">z</text>` : "";
    const cabelo = `
      <path d="M26 40 Q20 12 50 8 Q80 12 74 40 Q78 22 50 16 Q22 22 26 40" fill="#7B5BBF"/>
      <path d="M28 38 Q30 55 24 70 Q20 58 26 42" fill="#7B5BBF"/>
      <path d="M72 38 Q70 55 76 70 Q80 58 74 42" fill="#7B5BBF"/>
      <circle cx="22" cy="48" r="6" fill="#9B7EDE"/><circle cx="78" cy="48" r="6" fill="#9B7EDE"/>`;
    return kidBase({ humor, pele:"#F5D0B0", camiseta:"#E8D9FF", cabeloPath:cabelo, label:"Rumi, cabelo roxo", zz, acc });
  }
  function svgZoe(humor, acc) {
    const zz = humor === "dormindo" ? `<text x="74" y="24" font-size="12" fill="#9B84C7" font-weight="700">z</text>` : "";
    const cabelo = `
      <path d="M28 38 Q22 14 50 12 Q78 14 72 38 Q70 22 50 20 Q30 22 28 38" fill="#2C3E50"/>
      <path d="M30 36 Q32 48 34 52 Q28 48 30 36" fill="#2C3E50"/>
      <path d="M70 36 Q68 48 66 52 Q72 48 70 36" fill="#2C3E50"/>`;
    return kidBase({ humor, pele:"#E8B895", camiseta:"#B8D4FF", cabeloPath:cabelo, label:"Zoe, cabelo curto", zz, acc });
  }
  function svgMira(humor, acc) {
    const zz = humor === "dormindo" ? `<text x="74" y="24" font-size="12" fill="#9B84C7" font-weight="700">z</text>` : "";
    const cabelo = `
      <path d="M26 38 Q18 10 50 6 Q82 10 74 38 Q80 18 50 14 Q20 18 26 38" fill="#C0392B"/>
      <path d="M24 42 Q18 60 22 78 Q28 62 28 44" fill="#C0392B"/>
      <path d="M76 42 Q82 60 78 78 Q72 62 72 44" fill="#C0392B"/>
      <path d="M40 12 Q50 2 60 12" fill="#E85D4C"/>`;
    return kidBase({ humor, pele:"#F0C8A0", camiseta:"#FFD4C8", cabeloPath:cabelo, label:"Mira, cabelo vermelho", zz, acc });
  }
  function svgEmily(humor, acc) {
    const zz = humor === "dormindo" ? `<text x="74" y="24" font-size="12" fill="#9B84C7" font-weight="700">z</text>` : "";
    const cabelo = `
      <path d="M26 40 Q20 10 50 8 Q80 10 74 40 Q78 20 50 16 Q22 20 26 40" fill="#F06292"/>
      <path d="M25 44 Q16 65 20 80 Q30 66 30 46" fill="#F06292"/>
      <path d="M75 44 Q84 65 80 80 Q70 66 70 46" fill="#F06292"/>
      <circle cx="18" cy="52" r="7" fill="#FF8FB8"/><circle cx="82" cy="52" r="7" fill="#FF8FB8"/>
      <text x="58" y="18" font-size="10">🎀</text>`;
    return kidBase({ humor, pele:"#F5D0B0", camiseta:"#FFE0EC", cabeloPath:cabelo, label:"Emily, cabelo rosa", zz, acc });
  }
  function svgLeozinho(humor, acc) {
    const zz = humor === "dormindo" ? `<text x="74" y="24" font-size="12" fill="#9B84C7" font-weight="700">z</text>` : "";
    const cabelo = `
      <path d="M28 36 Q24 12 50 10 Q76 12 72 36 Q74 20 50 18 Q26 20 28 36" fill="#0288D1"/>
      <path d="M32 20 L36 8 L40 20" fill="#4FC3F7"/>
      <path d="M48 16 L50 5 L52 16" fill="#4FC3F7"/>
      <path d="M60 20 L64 8 L68 20" fill="#4FC3F7"/>`;
    return kidBase({ humor, pele:"#E8B895", camiseta:"#B3E5FC", cabeloPath:cabelo, label:"Léozinho, cabelo azul", zz, acc });
  }

  function renderSvg(id, humor, acessorios) {
    const map = { rumi: svgRumi, zoe: svgZoe, mira: svgMira, emily: svgEmily, leozinho: svgLeozinho };
    const fn = map[id] || svgRumi;
    return fn(humor, acessorios || []);
  }

  function humorDe(n) {
    const media = (n.humor + n.energia + n.carinho + n.diversao) / 4;
    if (n.energia < 22) return "dormindo";
    if (media < 32) return "triste";
    if (media > 88 && n.humor > 80) return "empolgado";
    if (media > 68) return "feliz";
    return "neutro";
  }

  function necessidadeMaisBaixa(n) {
    return [["humor", n.humor], ["energia", n.energia], ["carinho", n.carinho], ["diversao", n.diversao]]
      .sort((a, b) => a[1] - b[1])[0][0];
  }

  function classeBarra(v) {
    if (v >= 60) return "is-bom";
    if (v >= 30) return "is-medio";
    return "is-baixo";
  }

  const LABELS = { humor: "Humor", energia: "Energia", carinho: "Carinho", diversao: "Diversão" };

  function renderBarras(n) {
    return Object.keys(LABELS).map((k) => `
      <div class="necessidade" role="group" aria-label="${LABELS[k]}: ${n[k]}%">
        <span>${LABELS[k]}</span>
        <div class="necessidade__barra"><div class="necessidade__preenchimento ${classeBarra(n[k])}" style="width:${n[k]}%"></div></div>
        <span aria-hidden="true">${n[k]}%</span>
      </div>`).join("");
  }

  function renderQuarto(petHtml, classeArte) {
    const stars = Array.from({ length: 8 }, (_, i) =>
      `<span class="estrela-fundo" style="left:${10 + i * 11}%;top:${8 + (i % 3) * 12}%;animation-delay:${i * 0.2}s">✦</span>`
    ).join("");
    return `<div class="quarto">
      <div class="quarto__estrelas">${stars}</div>
      <div class="quarto__janela" aria-hidden="true"></div>
      <div class="quarto__painel" aria-hidden="true"></div>
      <div class="quarto__tapete"></div>
      <div class="pet-cena">
        <div class="pet-cena__arte pet-bob ${classeArte}" id="pet-arte">
          <div class="particulas" id="particulas"></div>
          ${petHtml}
        </div>
      </div>
    </div>`;
  }

  function soltarParticulas(emojis) {
    const box = document.getElementById("particulas");
    if (!box) return;
    (emojis || ["💖", "⭐", "✨"]).forEach((e, i) => {
      const s = document.createElement("span");
      s.className = "particula";
      s.textContent = e;
      s.style.left = (25 + Math.random() * 50) + "%";
      s.style.bottom = (20 + Math.random() * 20) + "%";
      s.style.animationDelay = (i * 80) + "ms";
      box.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    });
  }

  global.AmiguitoPet = {
    renderSvg, humorDe, necessidadeMaisBaixa, renderBarras, renderQuarto, soltarParticulas, LABELS
  };
})(window);
