/* Geografia infantil — mapas SVG originais + figurinhas */
(function (global) {
  function shuffle(a) {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [x[i], x[j]] = [x[j], x[i]];
    }
    return x;
  }
  function falar(t) { if (window.AmiguitoFala) AmiguitoFala.falar(t); }

  function mapaBrasilSvg(destaque) {
    // Simplified regions as blobs (original kid map, not accurate borders)
    const regs = {
      norte: { d: "M40,20 Q70,10 95,28 Q100,50 75,55 Q50,60 30,48 Q20,35 40,20", fill: "#2ECC71" },
      nordeste: { d: "M95,28 Q120,25 130,50 Q125,70 100,68 Q85,60 75,55 Q90,40 95,28", fill: "#F39C12" },
      centro: { d: "M50,55 Q75,52 100,68 Q95,90 70,95 Q45,90 40,70 Q42,60 50,55", fill: "#E74C3C" },
      sudeste: { d: "M100,68 Q120,70 125,90 Q115,105 90,100 Q80,90 70,95 Q85,80 100,68", fill: "#3498DB" },
      sul: { d: "M70,95 Q90,100 95,115 Q80,125 60,120 Q55,108 70,95", fill: "#9B59B6" }
    };
    const parts = Object.keys(regs).map((id) => {
      const r = regs[id];
      const on = destaque === id;
      return `<path class="geo-regiao" data-id="${id}" data-fala="${id}" d="${r.d}" fill="${r.fill}" opacity="${on ? 1 : 0.75}" stroke="#fff" stroke-width="${on ? 3 : 1.5}" style="cursor:pointer;${on ? "filter:drop-shadow(0 0 6px #FFE66D)" : ""}"/>`;
    }).join("");
    return `<svg class="mapa-svg" viewBox="0 0 150 140" role="img" aria-label="Mapa do Brasil em regiões">
      <rect width="150" height="140" rx="16" fill="#E8F6FC"/>
      <text x="75" y="14" text-anchor="middle" font-size="9" font-weight="700" fill="#5B4B8A">Brasil</text>
      ${parts}
      <circle cx="118" cy="88" r="3" fill="#FFE66D" stroke="#5B4B8A"/><text x="122" y="90" font-size="7" fill="#5B4B8A">Rio</text>
      <circle cx="55" cy="42" r="3" fill="#2ECC71" stroke="#fff"/><text x="58" y="40" font-size="7" fill="#1B1440">Amazônia</text>
    </svg>`;
  }

  function mapaMundosSvg(destaque) {
    const blobs = [
      { id: "america", cx: 35, cy: 55, rx: 18, ry: 28, fill: "#2ECC71", label: "América" },
      { id: "europa", cx: 78, cy: 38, rx: 12, ry: 10, fill: "#3498DB", label: "Europa" },
      { id: "africa", cx: 78, cy: 68, rx: 14, ry: 18, fill: "#F39C12", label: "África" },
      { id: "asia", cx: 115, cy: 45, rx: 22, ry: 16, fill: "#E74C3C", label: "Ásia" },
      { id: "oceania", cx: 125, cy: 95, rx: 12, ry: 8, fill: "#9B59B6", label: "Oceania" }
    ];
    return `<svg class="mapa-svg" viewBox="0 0 150 120" role="img" aria-label="Mapa do mundo simplificado">
      <rect width="150" height="120" rx="16" fill="#D6F0FF"/>
      <ellipse cx="75" cy="60" rx="68" ry="48" fill="#7EC8E3" opacity="0.35"/>
      ${blobs.map((b) => {
        const on = destaque === b.id;
        return `<ellipse class="geo-regiao" data-id="${b.id}" data-fala="${b.label}" cx="${b.cx}" cy="${b.cy}" rx="${b.rx}" ry="${b.ry}" fill="${b.fill}" opacity="${on?1:0.8}" stroke="#fff" stroke-width="${on?3:1.5}" style="cursor:pointer"/>
          <text x="${b.cx}" y="${b.cy + 3}" text-anchor="middle" font-size="6" font-weight="700" fill="#fff">${b.label.slice(0,3)}</text>`;
      }).join("")}
    </svg>`;
  }

  const REGIOES = [
    { id: "norte", nome: "Norte", emoji: "🌳", fala: "Norte. Floresta Amazônia!", pista: "floresta" },
    { id: "nordeste", nome: "Nordeste", emoji: "🏖️", fala: "Nordeste. Muita praia!", pista: "praia" },
    { id: "centro", nome: "Centro-Oeste", emoji: "🐂", fala: "Centro-Oeste. Pantanal e cerrado!", pista: "pantanal" },
    { id: "sudeste", nome: "Sudeste", emoji: "🏙️", fala: "Sudeste. Rio e São Paulo!", pista: "cidade" },
    { id: "sul", nome: "Sul", emoji: "🧉", fala: "Sul. Chimarrão e friozinho!", pista: "frio" }
  ];

  const LUGARES = [
    { id: "amazonia", nome: "Amazônia", emoji: "🦜", regiao: "norte", fala: "Amazônia. Floresta enorme!" },
    { id: "rio", nome: "Rio", emoji: "⛰️", regiao: "sudeste", fala: "Rio de Janeiro. Cristo e praia!" },
    { id: "praia", nome: "Praia", emoji: "🏖️", regiao: "nordeste", fala: "Praia. Areia e mar!" },
    { id: "pantanal", nome: "Pantanal", emoji: "🐊", regiao: "centro", fala: "Pantanal. Muitos animais!" },
    { id: "curitiba", nome: "Sul", emoji: "🌲", regiao: "sul", fala: "Sul do Brasil. Natureza e frio!" }
  ];

  const CONTINENTES = [
    { id: "america", nome: "América", emoji: "🌎", fala: "América. Nosso continente!" },
    { id: "europa", nome: "Europa", emoji: "🏰", fala: "Europa. Castelos e países!" },
    { id: "africa", nome: "África", emoji: "🦁", fala: "África. Leões e savana!" },
    { id: "asia", nome: "Ásia", emoji: "🐼", fala: "Ásia. Pandas e montanhas!" },
    { id: "oceania", nome: "Oceania", emoji: "🦘", fala: "Oceania. Cangurus!" }
  ];

  const ANIMAIS = [
    { id: "onca", nome: "Onça", emoji: "🐆", onde: "america", fala: "Onça. Vive nas Américas!" },
    { id: "leao", nome: "Leão", emoji: "🦁", onde: "africa", fala: "Leão. Vive na África!" },
    { id: "panda", nome: "Panda", emoji: "🐼", onde: "asia", fala: "Panda. Vive na Ásia!" },
    { id: "canguru", nome: "Canguru", emoji: "🦘", onde: "oceania", fala: "Canguru. Vive na Oceania!" },
    { id: "tucano", nome: "Tucano", emoji: "🦜", onde: "america", fala: "Tucano. Vive no Brasil!" }
  ];

  function picGrid(opts, onPick) {
    return opts.map((o) => `
      <button type="button" class="pic-btn" data-id="${o.id}" data-fala="${o.fala || o.nome}" aria-label="${o.nome}">
        <span class="pic-btn__emoji">${o.emoji2 || o.emoji}</span>
        <small>${o.nome}</small>
      </button>`).join("");
  }

  function montarBrasilRegioes(root, onDone) {
    const alvo = REGIOES[Math.floor(Math.random() * REGIOES.length)];
    root.innerHTML = `
      <div class="geo-cena">
        ${mapaBrasilSvg(null)}
        <div class="replay-bar">
          <button type="button" class="btn btn--sol btn--sm" id="btn-ouvir" data-fala="${alvo.fala}">🗣️ Ouvir</button>
        </div>
        <p class="subtitulo" style="text-align:center">Toque no mapa: <strong>${alvo.emoji} ${alvo.nome}</strong></p>
      </div>`;
    falar("Ache a região. " + alvo.fala);
    root.querySelector("#btn-ouvir").addEventListener("click", () => falar(alvo.fala));
    root.querySelectorAll(".geo-regiao").forEach((el) => {
      el.addEventListener("click", () => {
        const ok = el.dataset.id === alvo.id;
        if (ok) {
          AmiguitoSom && AmiguitoSom.sucesso();
          falar("Isso! " + alvo.nome);
          root.querySelector(".geo-cena").innerHTML = mapaBrasilSvg(alvo.id) + `<p class="titulo-tela" style="text-align:center;font-size:1.2rem;margin-top:0.5rem">${alvo.emoji} ${alvo.nome}!</p>`;
          setTimeout(() => onDone({ sucesso: true, msg: "Brasilzinho: " + alvo.nome + "!", tema: "geo" }), 700);
        } else {
          AmiguitoSom && AmiguitoSom.erro();
          falar("Quase! Tenta outra parte");
        }
      });
    });
  }

  function montarLugares(root, onDone) {
    const L = shuffle(LUGARES)[0];
    const opts = shuffle([L, ...shuffle(LUGARES.filter((x) => x.id !== L.id)).slice(0, 3)]);
    root.innerHTML = `
      <div class="letra-card">
        <span class="letra-emoji" style="font-size:3.5rem">${L.emoji}</span>
      </div>
      <div class="replay-bar"><button type="button" class="btn btn--sol btn--sm" id="btn-ouvir" data-fala="${L.fala}">🗣️</button></div>
      <p class="subtitulo" style="text-align:center">Onde fica isso no Brasil?</p>
      <div class="pic-grid">${picGrid(opts.map((o) => ({ ...o, fala: o.nome })))}</div>`;
    // Wait - the question is place matching region by tapping region name pics
    // Better: show place, ask which region emoji
    const regOpts = shuffle(REGIOES).slice(0, 4);
    if (!regOpts.find((r) => r.id === L.regiao)) regOpts[0] = REGIOES.find((r) => r.id === L.regiao);
    root.innerHTML = `
      <div class="letra-card"><span class="letra-emoji" style="font-size:3.5rem">${L.emoji}</span></div>
      <div class="replay-bar"><button type="button" class="btn btn--sol btn--sm" id="btn-ouvir" data-fala="${L.fala}">🗣️ Ouvir</button></div>
      <p class="subtitulo" style="text-align:center">Toque na região</p>
      <div class="pic-grid">${picGrid(shuffle(regOpts))}</div>`;
    falar(L.fala + " Qual região?");
    root.querySelector("#btn-ouvir").addEventListener("click", () => falar(L.fala));
    root.querySelectorAll(".pic-btn").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.id === L.regiao;
      b.classList.add(ok ? "is-certa" : "is-errada");
      if (ok) {
        AmiguitoSom && AmiguitoSom.sucesso();
        falar("Certo!");
        setTimeout(() => onDone({ sucesso: true, msg: L.nome + " no mapa!", tema: "geo" }), 500);
      } else { AmiguitoSom && AmiguitoSom.erro(); falar("Quase!"); }
    }));
  }

  function montarContinentes(root, onDone) {
    const C = shuffle(CONTINENTES)[0];
    root.innerHTML = `
      <div class="geo-cena">${mapaMundosSvg(null)}</div>
      <div class="replay-bar"><button type="button" class="btn btn--sol btn--sm" id="btn-ouvir" data-fala="${C.fala}">🗣️</button></div>
      <p class="subtitulo" style="text-align:center">Toque: ${C.emoji} ${C.nome}</p>`;
    falar("Ache no mapa. " + C.fala);
    root.querySelector("#btn-ouvir").addEventListener("click", () => falar(C.fala));
    root.querySelectorAll(".geo-regiao").forEach((el) => {
      el.addEventListener("click", () => {
        if (el.dataset.id === C.id) {
          AmiguitoSom && AmiguitoSom.sucesso();
          falar("Isso! " + C.nome);
          root.querySelector(".geo-cena").innerHTML = mapaMundosSvg(C.id);
          setTimeout(() => onDone({ sucesso: true, msg: "Volta ao mundo: " + C.nome + "!", tema: "geo" }), 600);
        } else { AmiguitoSom && AmiguitoSom.erro(); falar("Quase!"); }
      });
    });
  }

  function montarAnimaisMundo(root, onDone) {
    const A = shuffle(ANIMAIS)[0];
    const emoji = A.emoji;
    const opts = shuffle(CONTINENTES).slice(0, 4);
    if (!opts.find((c) => c.id === A.onde)) opts[0] = CONTINENTES.find((c) => c.id === A.onde);
    root.innerHTML = `
      <div class="letra-card"><span class="letra-emoji" style="font-size:4rem">${emoji}</span></div>
      <div class="replay-bar"><button type="button" class="btn btn--sol btn--sm" id="btn-ouvir" data-fala="${A.fala}">🗣️</button></div>
      <p class="subtitulo" style="text-align:center">Onde esse animal vive?</p>
      <div class="pic-grid">${picGrid(shuffle(opts))}</div>`;
    falar(A.fala);
    root.querySelector("#btn-ouvir").addEventListener("click", () => falar(A.fala));
    root.querySelectorAll(".pic-btn").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.id === A.onde;
      b.classList.add(ok ? "is-certa" : "is-errada");
      if (ok) {
        AmiguitoSom && AmiguitoSom.sucesso();
        setTimeout(() => onDone({ sucesso: true, msg: A.nome + " em casa!", tema: "geo" }), 500);
      } else { AmiguitoSom && AmiguitoSom.erro(); falar("Quase!"); }
    }));
  }

  /** Arrastar figurinha até o continente/região */
  function montarArrastar(root, onDone) {
    const A = shuffle(ANIMAIS)[0];
    const emoji = A.emoji;
    const alvos = shuffle(CONTINENTES).slice(0, 3);
    if (!alvos.find((c) => c.id === A.onde)) alvos[0] = CONTINENTES.find((c) => c.id === A.onde);
    root.innerHTML = `
      <p class="subtitulo" style="text-align:center">Arraste o animal até o continente</p>
      <div class="drag-fonte">
        <div class="drag-item" id="drag-animal" draggable="true" data-fala="${A.fala}" aria-grabbed="false">${emoji}</div>
      </div>
      <div class="drag-alvos">
        ${shuffle(alvos).map((c) => `<div class="drag-alvo" data-id="${c.id}" data-fala="${c.nome}" aria-label="${c.nome}"><span>${c.emoji}</span><small>${c.nome}</small></div>`).join("")}
      </div>
      <div class="replay-bar"><button type="button" class="btn btn--sol btn--sm" id="btn-ouvir">🗣️</button>
      <button type="button" class="btn btn--fantasma btn--sm" id="btn-tap-help">Ou toque no certo</button></div>`;
    falar("Leve o animal. " + A.fala);
    root.querySelector("#btn-ouvir").addEventListener("click", () => falar(A.fala));
    const item = root.querySelector("#drag-animal");
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", A.onde);
      item.setAttribute("aria-grabbed", "true");
    });
    item.addEventListener("dragend", () => item.setAttribute("aria-grabbed", "false"));
    root.querySelectorAll(".drag-alvo").forEach((alvo) => {
      alvo.addEventListener("dragover", (e) => { e.preventDefault(); alvo.classList.add("is-over"); });
      alvo.addEventListener("dragleave", () => alvo.classList.remove("is-over"));
      alvo.addEventListener("drop", (e) => {
        e.preventDefault();
        alvo.classList.remove("is-over");
        const ok = alvo.dataset.id === A.onde;
        if (ok) {
          alvo.classList.add("is-certo");
          alvo.appendChild(item);
          AmiguitoSom && AmiguitoSom.sucesso();
          falar("Chegou!");
          setTimeout(() => onDone({ sucesso: true, msg: "Viagem completa!", tema: "geo" }), 550);
        } else {
          AmiguitoSom && AmiguitoSom.erro();
          falar("Quase! Outro continente");
        }
      });
      // tap fallback for touch without drag
      alvo.addEventListener("click", () => {
        if (alvo.dataset.id === A.onde) {
          alvo.classList.add("is-certo");
          AmiguitoSom && AmiguitoSom.sucesso();
          setTimeout(() => onDone({ sucesso: true, msg: "Viagem completa!", tema: "geo" }), 500);
        } else {
          AmiguitoSom && AmiguitoSom.erro();
          falar("Quase!");
        }
      });
    });
    root.querySelector("#btn-tap-help").addEventListener("click", () => falar("Toque no continente certo"));
  }

  function montar(id, root, onDone) {
    const map = {
      "geo-brasil": montarBrasilRegioes,
      "geo-lugares": montarLugares,
      "geo-continentes": montarContinentes,
      "geo-animais": montarAnimaisMundo,
      "geo-arrastar": montarArrastar
    };
    (map[id] || montarBrasilRegioes)(root, onDone);
  }

  global.AmiguitoGeo = { montar, mapaBrasilSvg, mapaMundosSvg, REGIOES, CONTINENTES };
})(window);
