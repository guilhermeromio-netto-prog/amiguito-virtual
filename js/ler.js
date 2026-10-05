/* Trilha Quero ler — letra/som/figura, sílabas, palavras */
(function (global) {
  function shuffle(a) {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [x[i], x[j]] = [x[j], x[i]];
    }
    return x;
  }

  function montarLetras(root, dados, onDone, falar) {
    const letras = shuffle(dados.letras).slice(0, 6);
    let i = 0;
    function paint() {
      if (i >= letras.length) {
        onDone({ sucesso: true, msg: "Letras concluídas! Você é uma estrela!" });
        return;
      }
      const L = letras[i];
      const distratores = shuffle(dados.letras.filter((x) => x.letra !== L.letra)).slice(0, 3);
      const opts = shuffle([L, ...distratores]);
      root.innerHTML = `
        <div class="letra-card">
          <div class="letra-gigante" aria-hidden="true">${L.letra}</div>
          <span class="letra-emoji" aria-hidden="true">${L.emoji}</span>
        </div>
        <div class="replay-bar">
          <button type="button" class="btn btn--sol btn--sm" id="btn-ouvir-letra" data-fala="${L.fala}">🗣️ Ouvir</button>
        </div>
        <p class="subtitulo" style="text-align:center">Toque na figurinha certa</p>
        <div class="pic-grid" role="group" aria-label="Escolha a figura">
          ${opts.map((o) => `
            <button type="button" class="pic-btn" data-letra="${o.letra}" data-fala="${o.fala}" aria-label="${o.fala}">
              ${o.emoji}<small>${o.letra}</small>
            </button>`).join("")}
        </div>`;
      falar(L.fala);
      root.querySelector("#btn-ouvir-letra").addEventListener("click", () => falar(L.fala, { force: true }));
      root.querySelectorAll(".pic-btn").forEach((b) => b.addEventListener("click", () => {
        const ok = b.dataset.letra === L.letra;
        b.classList.add(ok ? "is-certa" : "is-errada");
        if (ok) {
          AmiguitoSom && AmiguitoSom.sucesso();
          falar("Isso! " + L.fala);
          i += 1;
          setTimeout(paint, 700);
        } else {
          AmiguitoSom && AmiguitoSom.erro();
          falar("Quase! Tenta de novo");
        }
      }));
    }
    paint();
  }

  function montarSilabas(root, dados, onDone, falar) {
    const itens = shuffle(dados.silabas).slice(0, 5);
    let i = 0;
    function paint() {
      if (i >= itens.length) {
        onDone({ sucesso: true, msg: "Sílabas mandou bem!" });
        return;
      }
      const S = itens[i];
      root.innerHTML = `
        <div class="letra-card">
          <span class="letra-emoji">${S.emoji}</span>
          <div class="letra-gigante" style="font-size:3rem">${S.alvo}</div>
        </div>
        <div class="replay-bar">
          <button type="button" class="btn btn--sol btn--sm" id="btn-ouvir" data-fala="${S.fala}">🗣️ Ouvir</button>
        </div>
        <div class="pic-grid">
          ${shuffle(S.opcoes).map((o) => `
            <button type="button" class="pic-btn" data-v="${o}" data-fala="${o}" aria-label="${o}" style="font-size:2rem;font-weight:900">
              ${o}
            </button>`).join("")}
        </div>`;
      falar(S.fala);
      root.querySelector("#btn-ouvir").addEventListener("click", () => falar(S.fala, { force: true }));
      root.querySelectorAll(".pic-btn").forEach((b) => b.addEventListener("click", () => {
        const ok = b.dataset.v === S.alvo;
        b.classList.add(ok ? "is-certa" : "is-errada");
        if (ok) {
          AmiguitoSom && AmiguitoSom.sucesso();
          i += 1;
          setTimeout(paint, 650);
        } else {
          AmiguitoSom && AmiguitoSom.erro();
          falar("Quase!");
        }
      }));
    }
    paint();
  }

  function montarPalavras(root, dados, onDone, falar) {
    const itens = shuffle(dados.palavras).slice(0, 5);
    let i = 0;
    function paint() {
      if (i >= itens.length) {
        onDone({ sucesso: true, msg: "Palavras com figurinha: sucesso!" });
        return;
      }
      const P = itens[i];
      const figs = shuffle([P.emoji, ...P.distratores]).slice(0, 4);
      root.innerHTML = `
        <div class="letra-card">
          <div class="letra-gigante" style="font-size:2.4rem">${P.palavra}</div>
        </div>
        <div class="replay-bar">
          <button type="button" class="btn btn--sol btn--sm" id="btn-ouvir" data-fala="${P.fala}">🗣️ Ouvir palavra</button>
        </div>
        <p class="subtitulo" style="text-align:center">Toque na figurinha</p>
        <div class="pic-grid">
          ${figs.map((e) => `
            <button type="button" class="pic-btn" data-e="${e}" data-fala="figurinha" aria-label="Figurinha">
              ${e}
            </button>`).join("")}
        </div>`;
      falar("Onde está " + P.fala + "?");
      root.querySelector("#btn-ouvir").addEventListener("click", () => falar(P.fala, { force: true }));
      root.querySelectorAll(".pic-btn").forEach((b) => b.addEventListener("click", () => {
        const ok = b.dataset.e === P.emoji;
        b.classList.add(ok ? "is-certa" : "is-errada");
        if (ok) {
          AmiguitoSom && AmiguitoSom.sucesso();
          falar("Isso! " + P.fala);
          i += 1;
          setTimeout(paint, 700);
        } else {
          AmiguitoSom && AmiguitoSom.erro();
          falar("Quase! Ouve de novo");
        }
      }));
    }
    paint();
  }

  function montar(tipo, root, dados, onDone, falar) {
    if (tipo === "silabas") return montarSilabas(root, dados, onDone, falar);
    if (tipo === "palavras") return montarPalavras(root, dados, onDone, falar);
    return montarLetras(root, dados, onDone, falar);
  }

  global.AmiguitoLer = { montar };
})(window);
