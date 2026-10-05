/* Amiguinhos SVG · Rumi Zoe Mira Emily Léozinho Void Nova Pixi Sol */
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

  function zzMark(humor) {
    return humor === "dormindo" ? `<text x="74" y="24" font-size="12" fill="#9B84C7" font-weight="700">z</text>` : "";
  }

  function kidBase(opts) {
    return `<svg class="pet-svg" viewBox="0 0 100 100" role="img" aria-label="${opts.label}">
      <ellipse cx="50" cy="94" rx="28" ry="4" fill="rgba(0,0,0,0.08)"/>
      <ellipse cx="50" cy="72" rx="24" ry="20" fill="${opts.camiseta}"/>
      <circle cx="50" cy="42" r="24" fill="${opts.pele}"/>
      ${opts.cabeloPath}
      ${olhos(opts.humor, 40, 60, 42)}
      <ellipse cx="32" cy="48" rx="4" ry="3" fill="#F5A9A9" opacity="0.45"/>
      <ellipse cx="68" cy="48" rx="4" ry="3" fill="#F5A9A9" opacity="0.45"/>
      ${opts.zz || ""}${accSvg(opts.acc)}
    </svg>`;
  }

  function svgRumi(humor, acc) {
    const cabelo = `
      <path d="M26 40 Q20 12 50 8 Q80 12 74 40 Q78 22 50 16 Q22 22 26 40" fill="#7B5BBF"/>
      <path d="M28 38 Q30 55 24 70 Q20 58 26 42" fill="#7B5BBF"/>
      <path d="M72 38 Q70 55 76 70 Q80 58 74 42" fill="#7B5BBF"/>
      <circle cx="22" cy="48" r="6" fill="#9B7EDE"/><circle cx="78" cy="48" r="6" fill="#9B7EDE"/>`;
    return kidBase({ humor, pele:"#F5D0B0", camiseta:"#E8D9FF", cabeloPath:cabelo, label:"Rumi, cabelo roxo", zz: zzMark(humor), acc });
  }
  function svgZoe(humor, acc) {
    const cabelo = `
      <path d="M28 38 Q22 14 50 12 Q78 14 72 38 Q70 22 50 20 Q30 22 28 38" fill="#2C3E50"/>
      <path d="M30 36 Q32 48 34 52 Q28 48 30 36" fill="#2C3E50"/>
      <path d="M70 36 Q68 48 66 52 Q72 48 70 36" fill="#2C3E50"/>`;
    return kidBase({ humor, pele:"#E8B895", camiseta:"#B8D4FF", cabeloPath:cabelo, label:"Zoe, cabelo curto", zz: zzMark(humor), acc });
  }
  function svgMira(humor, acc) {
    const cabelo = `
      <path d="M26 38 Q18 10 50 6 Q82 10 74 38 Q80 18 50 14 Q20 18 26 38" fill="#C0392B"/>
      <path d="M24 42 Q18 60 22 78 Q28 62 28 44" fill="#C0392B"/>
      <path d="M76 42 Q82 60 78 78 Q72 62 72 44" fill="#C0392B"/>
      <path d="M40 12 Q50 2 60 12" fill="#E85D4C"/>`;
    return kidBase({ humor, pele:"#F0C8A0", camiseta:"#FFD4C8", cabeloPath:cabelo, label:"Mira, cabelo vermelho", zz: zzMark(humor), acc });
  }
  function svgEmily(humor, acc) {
    const cabelo = `
      <path d="M26 40 Q20 10 50 8 Q80 10 74 40 Q78 20 50 16 Q22 20 26 40" fill="#F06292"/>
      <path d="M25 44 Q16 65 20 80 Q30 66 30 46" fill="#F06292"/>
      <path d="M75 44 Q84 65 80 80 Q70 66 70 46" fill="#F06292"/>
      <circle cx="18" cy="52" r="7" fill="#FF8FB8"/><circle cx="82" cy="52" r="7" fill="#FF8FB8"/>
      <text x="58" y="18" font-size="10">🎀</text>`;
    return kidBase({ humor, pele:"#F5D0B0", camiseta:"#FFE0EC", cabeloPath:cabelo, label:"Emily, cabelo rosa", zz: zzMark(humor), acc });
  }
  function svgLeozinho(humor, acc) {
    const cabelo = `
      <path d="M28 36 Q24 12 50 10 Q76 12 72 36 Q74 20 50 18 Q26 20 28 36" fill="#0288D1"/>
      <path d="M32 20 L36 8 L40 20" fill="#4FC3F7"/>
      <path d="M48 16 L50 5 L52 16" fill="#4FC3F7"/>
      <path d="M60 20 L64 8 L68 20" fill="#4FC3F7"/>`;
    return kidBase({ humor, pele:"#E8B895", camiseta:"#B3E5FC", cabeloPath:cabelo, label:"Léozinho, cabelo azul", zz: zzMark(humor), acc });
  }
  /** Void: soft mysterious space — dark soft hair + gentle teal glow, never scary */
  function svgVoid(humor, acc) {
    const glow = `<circle cx="50" cy="42" r="28" fill="#7E57C2" opacity="0.12"/>
      <circle cx="18" cy="30" r="3" fill="#80DEEA" opacity="0.7"/>
      <circle cx="82" cy="28" r="2.5" fill="#B39DDB" opacity="0.8"/>
      <circle cx="70" cy="14" r="2" fill="#80DEEA" opacity="0.6"/>`;
    const cabelo = `
      ${glow}
      <path d="M26 40 Q18 10 50 6 Q82 10 74 40 Q80 20 50 14 Q20 20 26 40" fill="#2A2F4A"/>
      <path d="M28 38 Q26 58 30 72 Q22 60 28 40" fill="#2A2F4A"/>
      <path d="M72 38 Q74 58 70 72 Q78 60 72 40" fill="#2A2F4A"/>
      <path d="M34 18 Q40 10 46 18" fill="#5C6BC0" opacity="0.85"/>
      <path d="M54 16 Q60 8 66 16" fill="#26A69A" opacity="0.55"/>
      <circle cx="22" cy="46" r="5" fill="#3949AB" opacity="0.9"/>
      <circle cx="78" cy="46" r="5" fill="#3949AB" opacity="0.9"/>
      <text x="12" y="22" font-size="10">✨</text>`;
    return kidBase({ humor, pele:"#D7BFA6", camiseta:"#E8EAF6", cabeloPath:cabelo, label:"Void, cabelo escuro suave", zz: zzMark(humor), acc });
  }
  function svgNova(humor, acc) {
    const cabelo = `
      <path d="M26 40 Q20 12 50 7 Q80 12 74 40 Q78 22 50 15 Q22 22 26 40" fill="#D7D3E8"/>
      <path d="M27 42 Q22 62 28 78 Q32 60 32 44" fill="#C5CAE9"/>
      <path d="M73 42 Q78 62 72 78 Q68 60 68 44" fill="#C5CAE9"/>
      <path d="M42 10 L50 2 L58 10 L50 8 Z" fill="#FFF59D"/>
      <circle cx="20" cy="50" r="6" fill="#E1BEE7"/><circle cx="80" cy="50" r="6" fill="#E1BEE7"/>
      <text x="64" y="20" font-size="11">💫</text>`;
    return kidBase({ humor, pele:"#F5D0B0", camiseta:"#F3E5F5", cabeloPath:cabelo, label:"Nova, cabelo prateado", zz: zzMark(humor), acc });
  }
  function svgPixi(humor, acc) {
    const cabelo = `
      <path d="M26 38 Q18 12 50 8 Q82 12 74 38 Q78 20 50 16 Q22 20 26 38" fill="#2BBBAD"/>
      <path d="M24 44 Q14 58 18 74 Q28 60 30 46" fill="#26A69A"/>
      <path d="M76 44 Q86 58 82 74 Q72 60 70 46" fill="#26A69A"/>
      <path d="M36 14 Q42 4 48 14" fill="#80CBC4"/>
      <path d="M52 12 Q58 2 64 12" fill="#80CBC4"/>
      <circle cx="18" cy="48" r="6" fill="#4DB6AC"/><circle cx="82" cy="48" r="6" fill="#4DB6AC"/>
      <text x="8" y="70" font-size="12">🍃</text>`;
    return kidBase({ humor, pele:"#E8B895", camiseta:"#E0F2F1", cabeloPath:cabelo, label:"Pixi, cabelo verde menta", zz: zzMark(humor), acc });
  }
  function svgSol(humor, acc) {
    const cabelo = `
      <path d="M26 40 Q20 14 50 10 Q80 14 74 40 Q76 24 50 20 Q24 24 26 40" fill="#F4A261"/>
      <path d="M30 22 L28 8 L36 20" fill="#FFD54F"/>
      <path d="M46 16 L50 4 L54 16" fill="#FFD54F"/>
      <path d="M64 20 L72 8 L70 22" fill="#FFD54F"/>
      <path d="M22 48 Q16 62 24 70 Q28 58 26 48" fill="#E76F51"/>
      <path d="M78 48 Q84 62 76 70 Q72 58 74 48" fill="#E76F51"/>
      <circle cx="20" cy="44" r="5" fill="#FFB74D"/><circle cx="80" cy="44" r="5" fill="#FFB74D"/>
      <text x="68" y="78" font-size="12">☀️</text>`;
    return kidBase({ humor, pele:"#F0C8A0", camiseta:"#FFF8E1", cabeloPath:cabelo, label:"Sol, cabelo dourado", zz: zzMark(humor), acc });
  }

  function renderSvg(id, humor, acessorios) {
    const map = {
      rumi: svgRumi, zoe: svgZoe, mira: svgMira, emily: svgEmily, leozinho: svgLeozinho,
      void: svgVoid, nova: svgNova, pixi: svgPixi, sol: svgSol
    };
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
