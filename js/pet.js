/* SVG expressivos + quarto + partículas */
(function (global) {
  function olhos(humor, cx1, cx2, cy) {
    if (humor === "dormindo") {
      return `<path class="olho" d="M${cx1-6} ${cy} Q${cx1} ${cy-4} ${cx1+6} ${cy}" stroke="#2A2F33" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        <path d="M${cx2-6} ${cy} Q${cx2} ${cy-4} ${cx2+6} ${cy}" stroke="#2A2F33" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
    }
    if (humor === "triste") {
      return `<g class="olho-pisca"><ellipse cx="${cx1}" cy="${cy+2}" rx="6.5" ry="7.5" fill="#2A2F33"/><circle cx="${cx1+2}" cy="${cy}" r="2.2" fill="#fff"/></g>
        <g class="olho-pisca"><ellipse cx="${cx2}" cy="${cy+2}" rx="6.5" ry="7.5" fill="#2A2F33"/><circle cx="${cx2+2}" cy="${cy}" r="2.2" fill="#fff"/></g>
        <path d="M${cx1+4} ${cy+22} Q${(cx1+cx2)/2} ${cy+16} ${cx2-4} ${cy+22}" stroke="#2A2F33" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    }
    if (humor === "empolgado") {
      return `<g class="olho-pisca"><ellipse cx="${cx1}" cy="${cy}" rx="7.5" ry="9" fill="#2A2F33"/><circle cx="${cx1+2.5}" cy="${cy-2}" r="2.8" fill="#fff"/><circle cx="${cx1-2}" cy="${cy+2}" r="1.2" fill="#fff"/></g>
        <g class="olho-pisca"><ellipse cx="${cx2}" cy="${cy}" rx="7.5" ry="9" fill="#2A2F33"/><circle cx="${cx2+2.5}" cy="${cy-2}" r="2.8" fill="#fff"/><circle cx="${cx2-2}" cy="${cy+2}" r="1.2" fill="#fff"/></g>
        <path d="M${cx1+2} ${cy+20} Q${(cx1+cx2)/2} ${cy+32} ${cx2-2} ${cy+20}" stroke="#2A2F33" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        <path d="M${cx1-10} ${cy-14} Q${cx1-4} ${cy-20} ${cx1+2} ${cy-14}" stroke="#2A2F33" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M${cx2-2} ${cy-14} Q${cx2+4} ${cy-20} ${cx2+10} ${cy-14}" stroke="#2A2F33" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    }
    // feliz / neutro — olhos grandes
    const boca = humor === "feliz"
      ? `<path d="M${cx1+2} ${cy+18} Q${(cx1+cx2)/2} ${cy+30} ${cx2-2} ${cy+18}" stroke="#2A2F33" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
      : `<path d="M${cx1+6} ${cy+20} Q${(cx1+cx2)/2} ${cy+24} ${cx2-6} ${cy+20}" stroke="#2A2F33" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    return `<g class="olho-pisca"><ellipse cx="${cx1}" cy="${cy}" rx="7" ry="8.5" fill="#2A2F33"/><circle cx="${cx1+2.2}" cy="${cy-2}" r="2.6" fill="#fff"/><circle cx="${cx1-1.5}" cy="${cy+2}" r="1.1" fill="#fff"/></g>
      <g class="olho-pisca"><ellipse cx="${cx2}" cy="${cy}" rx="7" ry="8.5" fill="#2A2F33"/><circle cx="${cx2+2.2}" cy="${cy-2}" r="2.6" fill="#fff"/><circle cx="${cx2-1.5}" cy="${cy+2}" r="1.1" fill="#fff"/></g>
      ${boca}`;
  }

  function acessoriosSvg(ids) {
    if (!ids || !ids.length) return "";
    let s = "";
    if (ids.includes("coroa")) s += `<g transform="translate(32,2)"><text font-size="28">👑</text></g>`;
    if (ids.includes("chapeu")) s += `<g transform="translate(30,0)"><text font-size="26">🎩</text></g>`;
    if (ids.includes("oculos")) s += `<g transform="translate(26,34)"><text font-size="28">👓</text></g>`;
    if (ids.includes("laco")) s += `<g transform="translate(58,8)"><text font-size="22">🎀</text></g>`;
    if (ids.includes("flor")) s += `<g transform="translate(12,18)"><text font-size="20">🌸</text></g>`;
    if (ids.includes("cachecol")) s += `<g transform="translate(34,68)"><text font-size="22">🧣</text></g>`;
    return s;
  }

  function svgLuna(humor, acc) {
    const zz = humor === "dormindo" ? `<text x="74" y="26" font-size="14" fill="#9B84C7" font-weight="700">z</text><text x="84" y="16" font-size="10" fill="#9B84C7">z</text>` : "";
    return `<svg class="pet-svg" viewBox="0 0 100 100" role="img" aria-label="Luna, a gatinha">
      <ellipse cx="50" cy="93" rx="30" ry="5" fill="rgba(0,0,0,0.08)"/>
      <ellipse cx="50" cy="60" rx="34" ry="30" fill="#FFB4C8"/>
      <circle cx="50" cy="40" r="28" fill="#FFC8D8"/>
      <path d="M26 26 L18 4 L40 20 Z" fill="#FFB4C8"/><path d="M74 26 L82 4 L60 20 Z" fill="#FFB4C8"/>
      <path d="M28 24 L24 10 L38 20 Z" fill="#FFE0EC"/><path d="M72 24 L76 10 L62 20 Z" fill="#FFE0EC"/>
      ${olhos(humor, 36, 64, 40)}
      ${humor !== "triste" && humor !== "dormindo" ? "" : ""}
      <ellipse cx="50" cy="52" rx="4.5" ry="3.2" fill="#E8799A"/>
      <line x1="50" y1="55" x2="50" y2="59" stroke="#E8799A" stroke-width="1.6"/>
      <line x1="50" y1="57" x2="38" y2="62" stroke="#2A2F33" stroke-width="1.3" stroke-linecap="round"/>
      <line x1="50" y1="57" x2="62" y2="62" stroke="#2A2F33" stroke-width="1.3" stroke-linecap="round"/>
      <ellipse cx="20" cy="48" rx="6" ry="4.5" fill="#FF9EBA" opacity="0.55"/>
      <ellipse cx="80" cy="48" rx="6" ry="4.5" fill="#FF9EBA" opacity="0.55"/>
      ${zz}${acessoriosSvg(acc)}
    </svg>`;
  }

  function svgPipoca(humor, acc) {
    const zz = humor === "dormindo" ? `<text x="74" y="26" font-size="14" fill="#9B84C7" font-weight="700">z</text>` : "";
    return `<svg class="pet-svg" viewBox="0 0 100 100" role="img" aria-label="Pipoca, o cachorrinho">
      <ellipse cx="50" cy="93" rx="30" ry="5" fill="rgba(0,0,0,0.08)"/>
      <ellipse cx="50" cy="62" rx="32" ry="28" fill="#FFD07A"/>
      <circle cx="50" cy="40" r="27" fill="#FFE0A0"/>
      <ellipse cx="20" cy="36" rx="11" ry="16" fill="#E8A84A"/><ellipse cx="80" cy="36" rx="11" ry="16" fill="#E8A84A"/>
      <ellipse cx="20" cy="38" rx="6.5" ry="10" fill="#FFE0A0"/><ellipse cx="80" cy="38" rx="6.5" ry="10" fill="#FFE0A0"/>
      ${olhos(humor, 37, 63, 40)}
      <ellipse cx="50" cy="52" rx="8" ry="5.5" fill="#3D2914"/>
      <circle cx="47" cy="50.5" r="1.6" fill="#fff" opacity="0.55"/>
      <path d="M78 70 Q92 55 90 80 Q80 88 70 76" fill="#E8A84A"/>
      ${humor === "feliz" || humor === "empolgado" ? `<ellipse cx="26" cy="54" rx="5" ry="3.5" fill="#F5A623" opacity="0.45"/><ellipse cx="74" cy="54" rx="5" ry="3.5" fill="#F5A623" opacity="0.45"/>` : ""}
      ${zz}${acessoriosSvg(acc)}
    </svg>`;
  }

  function svgFogo(humor, acc) {
    const zz = humor === "dormindo" ? `<text x="74" y="24" font-size="14" fill="#9B84C7" font-weight="700">z</text>` : "";
    return `<svg class="pet-svg" viewBox="0 0 100 100" role="img" aria-label="Fogo, o dragãozinho">
      <ellipse cx="50" cy="93" rx="30" ry="5" fill="rgba(0,0,0,0.08)"/>
      <path d="M16 50 Q6 38 14 26 Q24 36 22 48 Z" fill="#5BB894"/><path d="M84 50 Q94 38 86 26 Q76 36 78 48 Z" fill="#5BB894"/>
      <ellipse cx="50" cy="60" rx="32" ry="28" fill="#A8E6CF"/>
      <circle cx="50" cy="40" r="26" fill="#C5F5E0"/>
      <path d="M40 16 L50 2 L60 16" fill="#5BB894"/><path d="M45 16 L50 8 L55 16" fill="#FFE66D"/>
      ${olhos(humor, 38, 62, 40)}
      <ellipse cx="50" cy="52" rx="4.5" ry="3.2" fill="#2A2F33"/>
      <circle cx="30" cy="72" r="3.2" fill="#5BB894"/><circle cx="50" cy="78" r="3.2" fill="#5BB894"/><circle cx="70" cy="72" r="3.2" fill="#5BB894"/>
      <path d="M72 70 Q88 58 84 84 Q70 90 66 76" fill="#5BB894"/>
      ${humor === "feliz" || humor === "empolgado" ? `<path d="M54 50 Q64 46 62 54" fill="#FF8A65" opacity="0.75"/>` : ""}
      ${zz}${acessoriosSvg(acc)}
    </svg>`;
  }

  function renderSvg(id, humor, acessorios) {
    if (id === "luna") return svgLuna(humor, acessorios);
    if (id === "pipoca") return svgPipoca(humor, acessorios);
    return svgFogo(humor, acessorios);
  }

  function humorDe(n) {
    const media = (n.fome + n.humor + n.energia + n.carinho) / 4;
    if (n.energia < 22) return "dormindo";
    if (media < 32) return "triste";
    if (media > 88 && n.humor > 80) return "empolgado";
    if (media > 68) return "feliz";
    return "neutro";
  }

  function necessidadeMaisBaixa(n) {
    return [["fome", n.fome], ["humor", n.humor], ["energia", n.energia], ["carinho", n.carinho]]
      .sort((a, b) => a[1] - b[1])[0][0];
  }

  function classeBarra(v) {
    if (v >= 60) return "is-bom";
    if (v >= 30) return "is-medio";
    return "is-baixo";
  }

  const LABELS = { fome: "Fome", humor: "Humor", energia: "Energia", carinho: "Carinho" };

  function renderBarras(n) {
    return Object.keys(LABELS).map((k) => `
      <div class="necessidade" role="group" aria-label="${LABELS[k]}: ${n[k]}%">
        <span>${LABELS[k]}</span>
        <div class="necessidade__barra"><div class="necessidade__preenchimento ${classeBarra(n[k])}" style="width:${n[k]}%"></div></div>
        <span aria-hidden="true">${n[k]}%</span>
      </div>`).join("");
  }

  function renderQuarto(petHtml, classeArte, cor) {
    return `<div class="quarto" aria-hidden="false">
      <div class="quarto__janela"></div>
      <div class="quarto__movel"></div>
      <div class="quarto__planta" aria-hidden="true">🪴</div>
      <div class="quarto__tapete"></div>
      <div class="pet-cena">
        <div class="pet-cena__arte pet-bob ${classeArte}" style="background:linear-gradient(145deg, ${cor}66, ${cor})" id="pet-arte">
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
