/* Yoga infantil — poses SVG + timer */
(function (global) {
  function svgPose(id) {
    const common = `fill="none" stroke="#2A2F33" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"`;
    const body = {
      gato: `<ellipse cx="50" cy="58" rx="28" ry="14" fill="#FFB4C8" stroke="#E8799A" stroke-width="2"/>
        <path d="M22 58 Q50 30 78 58" ${common}/>
        <circle cx="78" cy="52" r="10" fill="#FFC8D8" stroke="#E8799A" stroke-width="2"/>
        <text x="50" y="90" text-anchor="middle" font-size="12" fill="#5A6368">Arredonda as costas</text>`,
      cachorro: `<path d="M20 70 L50 30 L80 70" ${common}/>
        <circle cx="50" cy="28" r="8" fill="#A8E6CF" stroke="#5BB894" stroke-width="2"/>
        <text x="50" y="90" text-anchor="middle" font-size="12" fill="#5A6368">V invertido suave</text>`,
      arvore: `<line x1="50" y1="85" x2="50" y2="40" ${common}/>
        <line x1="50" y1="60" x2="68" y2="75" ${common}/>
        <circle cx="50" cy="28" r="10" fill="#FFE66D" stroke="#E6C12E" stroke-width="2"/>
        <line x1="50" y1="40" x2="35" y2="20" ${common}/><line x1="50" y1="40" x2="65" y2="20" ${common}/>
        <text x="50" y="96" text-anchor="middle" font-size="11" fill="#5A6368">Equilíbrio de árvore</text>`,
      borboleta: `<circle cx="50" cy="28" r="9" fill="#C5B4E3" stroke="#8F78C4" stroke-width="2"/>
        <path d="M50 38 L50 55" ${common}/>
        <path d="M50 55 Q25 45 20 65 Q35 70 50 55" fill="#FFB4C8" opacity="0.7" stroke="#E8799A" stroke-width="2"/>
        <path d="M50 55 Q75 45 80 65 Q65 70 50 55" fill="#7EC8E3" opacity="0.7" stroke="#3D9BC0" stroke-width="2"/>
        <text x="50" y="92" text-anchor="middle" font-size="11" fill="#5A6368">Bata as asinhas</text>`,
      estrela: `<circle cx="50" cy="30" r="9" fill="#FFE66D" stroke="#E6C12E" stroke-width="2"/>
        <line x1="50" y1="40" x2="50" y2="60" ${common}/>
        <line x1="50" y1="48" x2="22" y2="38" ${common}/><line x1="50" y1="48" x2="78" y2="38" ${common}/>
        <line x1="50" y1="60" x2="28" y2="85" ${common}/><line x1="50" y1="60" x2="72" y2="85" ${common}/>
        <text x="50" y="96" text-anchor="middle" font-size="11" fill="#5A6368">Abra como estrela</text>`,
      crianca: `<path d="M25 70 Q50 85 75 70" fill="#A8E6CF" stroke="#5BB894" stroke-width="2"/>
        <circle cx="35" cy="62" r="8" fill="#FFC8D8" stroke="#E8799A" stroke-width="2"/>
        <path d="M42 62 L80 55" ${common}/>
        <text x="50" y="94" text-anchor="middle" font-size="11" fill="#5A6368">Descanse com carinho</text>`,
      cobra: `<ellipse cx="50" cy="70" rx="32" ry="10" fill="#A8E6CF" opacity="0.5"/>
        <path d="M22 72 Q50 72 55 45" ${common}/>
        <circle cx="58" cy="38" r="9" fill="#7EC8E3" stroke="#3D9BC0" stroke-width="2"/>
        <text x="50" y="94" text-anchor="middle" font-size="11" fill="#5A6368">Peito suavemente pra cima</text>`,
      montanha: `<line x1="50" y1="82" x2="50" y2="40" ${common}/>
        <circle cx="50" cy="28" r="10" fill="#C5B4E3" stroke="#8F78C4" stroke-width="2"/>
        <line x1="50" y1="55" x2="32" y2="75" ${common}/><line x1="50" y1="55" x2="68" y2="75" ${common}/>
        <line x1="40" y1="82" x2="60" y2="82" ${common}/>
        <text x="50" y="96" text-anchor="middle" font-size="11" fill="#5A6368">Fique altinha e calma</text>`
    };
    return `<svg class="yoga-svg respirar" viewBox="0 0 100 100" role="img" aria-label="Ilustração da pose">${body[id] || body.montanha}</svg>`;
  }

  global.AmiguitoYoga = { svgPose };
})(window);
