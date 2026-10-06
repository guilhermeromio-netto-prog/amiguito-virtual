/* Minigames Pro — bolhas, esconde, memória, dança, alimentar, fantasia */
(function (global) {
  function registrarJogo(estado, id) {
    if (!estado.jogosJogados.includes(id)) estado.jogosJogados.push(id);
    AmiguitoStorage.ganharXp(estado, 5);
  }

  function montarAlimentar(root, onDone) {
    const comidas = [
      { e: "🍎", ok: true }, { e: "🐟", ok: true }, { e: "🍪", ok: true },
      { e: "🪨", ok: false }, { e: "👟", ok: false }
    ];
    let acertos = 0;
    root.innerHTML = `
      <div class="jogo-hud"><span>Leve comida gostosa até a boquinha!</span><span id="jg-pts">0/3</span></div>
      <div class="progresso-foguete" aria-hidden="true"><span class="progresso-foguete__ico">🚀</span><div class="progresso-foguete__trilho"><div class="progresso-foguete__fill" style="width:0%"></div></div></div>
      <div class="boca-alvo" id="boca-alvo" aria-label="Boquinha do amiguito">😋</div>
      <div class="comida-bandeja" id="bandeja"></div>
      <p class="subtitulo" style="text-align:center;margin-top:0.5rem">Toque na comida certa (3 vezes)</p>`;
    const bandeja = root.querySelector("#bandeja");
    const boca = root.querySelector("#boca-alvo");
    function desenhar() {
      bandeja.innerHTML = "";
      AmiguitoEnsinar.embaralhar(comidas).forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "comida-item";
        b.textContent = c.e;
        b.setAttribute("aria-label", c.ok ? "Comida gostosa" : "Não é comida");
        b.addEventListener("click", () => {
          if (c.ok) {
            b.classList.add("is-certo", "is-acerto-fx");
            acertos += 1;
            root.querySelector("#jg-pts").textContent = acertos + "/3";
            boca.textContent = "😄";
            boca.classList.add("is-nham");
            setTimeout(() => boca.classList.remove("is-nham"), 450);
            if (window.AmiguitoSom) AmiguitoSom.sting("alimentar");
            if (window.AmiguitoPet) AmiguitoPet.soltarParticulas(["🍪","✨","🍎","⭐"], { count: 5, grande: true });
            // progress fill
            const fill = root.querySelector(".progresso-foguete__fill");
            if (fill) fill.style.width = Math.round((acertos/3)*100) + "%";
            if (acertos >= 3) {
              if (window.AmiguitoSom) AmiguitoSom.combo();
              setTimeout(() => onDone({ sucesso: true, msg: "Barriguinha feliz!" }), 450);
            }
          } else {
            b.classList.add("is-erro-fx");
            boca.textContent = "😝";
            if (window.AmiguitoSom) AmiguitoSom.erro();
            setTimeout(() => { boca.textContent = "😋"; }, 400);
          }
        });
        bandeja.appendChild(b);
      });
    }
    desenhar();
  }

  function montarBolhas(root, onDone) {
    let pontos = 0;
    const meta = 8;
    root.innerHTML = `
      <div class="jogo-hud"><span>Estoure bolhas e pegue estrelas!</span><span id="jg-pts">0/${meta}</span></div>
      <div class="jogo-area" id="arena" role="application" aria-label="Área do jogo"></div>`;
    const arena = root.querySelector("#arena");
    let vivos = 0;
    const timer = setInterval(() => {
      if (pontos >= meta) return;
      if (vivos > 6) return;
      const el = document.createElement("button");
      el.type = "button";
      const ehEstrela = Math.random() > 0.55;
      el.className = ehEstrela ? "estrela-jogo" : "bolha";
      el.textContent = ehEstrela ? "⭐" : "🫧";
      el.setAttribute("aria-label", ehEstrela ? "Estrela" : "Bolha");
      el.style.left = (8 + Math.random() * 72) + "%";
      el.style.top = (10 + Math.random() * 65) + "%";
      vivos += 1;
      const life = setTimeout(() => { el.remove(); vivos -= 1; }, 2800);
      el.addEventListener("click", () => {
        clearTimeout(life);
        el.remove();
        vivos -= 1;
        pontos += 1;
            if (window.AmiguitoSom) AmiguitoSom.tap();
        root.querySelector("#jg-pts").textContent = pontos + "/" + meta;
        if (pontos >= meta) {
          clearInterval(timer);
          onDone({ sucesso: true, msg: "Você pegou todas!" });
        }
      });
      arena.appendChild(el);
    }, 550);
    root._cleanup = () => clearInterval(timer);
  }

  function montarEsconde(root, onDone, petEmoji) {
    const portas = [0, 1, 2, 3];
    const segredo = Math.floor(Math.random() * 4);
    let tentativas = 0;
    root.innerHTML = `
      <div class="jogo-hud"><span>Cadê o amiguito?</span><span id="jg-pts">Toque numa porta</span></div>
      <div class="porta-grid" id="portas"></div>`;
    const grid = root.querySelector("#portas");
    portas.forEach((i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "porta";
      b.textContent = "🚪";
      b.setAttribute("aria-label", "Porta " + (i + 1));
      b.addEventListener("click", () => {
        if (b.classList.contains("is-aberta")) return;
        b.classList.add("is-aberta");
        tentativas += 1;
        if (i === segredo) {
          b.textContent = petEmoji || "🐾";
          setTimeout(() => onDone({ sucesso: true, msg: "Achei você!" }), 450);
        } else {
          b.textContent = "✨";
          if (tentativas >= 3) {
            // revela
            [...grid.children][segredo].textContent = petEmoji || "🐾";
            [...grid.children][segredo].classList.add("is-aberta");
            setTimeout(() => onDone({ sucesso: true, msg: "Era essa! Você conseguiu!" }), 600);
          }
        }
      });
      grid.appendChild(b);
    });
  }

  function montarMemoria(root, onDone, desafio) {
    const pares = desafio
      ? ["🐶", "🐱", "🐉", "⭐"]
      : ["🐶", "🐱", "⭐"];
    const cartas = AmiguitoEnsinar.embaralhar(pares.concat(pares));
    let viradas = [];
    let bloqueio = false;
    let feitos = 0;
    root.innerHTML = `
      <div class="jogo-hud"><span>Ache os pares!</span><span id="jg-pts">0/${pares.length}</span></div>
      <div class="memoria-grid" id="mem"></div>`;
    const mem = root.querySelector("#mem");
    cartas.forEach((emoji, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "memoria-carta";
      b.dataset.emoji = emoji;
      b.dataset.idx = String(idx);
      b.textContent = "?";
      b.setAttribute("aria-label", "Carta virada");
      b.addEventListener("click", () => {
        if (bloqueio || b.classList.contains("is-virada") || b.classList.contains("is-par")) return;
        b.classList.add("is-virada");
        b.textContent = emoji;
        viradas.push(b);
        if (viradas.length < 2) return;
        bloqueio = true;
        const [a, c] = viradas;
        if (a.dataset.emoji === c.dataset.emoji) {
          a.classList.add("is-par");
          c.classList.add("is-par");
          feitos += 1;
          root.querySelector("#jg-pts").textContent = feitos + "/" + pares.length;
          viradas = [];
          bloqueio = false;
          if (window.AmiguitoSom) AmiguitoSom.sucesso();
          if (window.AmiguitoPet) AmiguitoPet.soltarParticulas(["⭐","✨"], { count: 4, grande: true });
          if (feitos >= pares.length) { if (window.AmiguitoSom) AmiguitoSom.combo(); setTimeout(() => onDone({ sucesso: true, msg: "Memória de ouro!" }), 350); }
        } else {
          setTimeout(() => {
            a.classList.remove("is-virada");
            c.classList.remove("is-virada");
            a.textContent = "?";
            c.textContent = "?";
            viradas = [];
            bloqueio = false;
          }, 650);
        }
      });
      mem.appendChild(b);
    });
  }

  function montarDanca(root, onDone) {
    const cores = [
      { c: "#FFB4C8", e: "💗" },
      { c: "#7EC8E3", e: "💙" },
      { c: "#A8E6CF", e: "💚" },
      { c: "#FFE66D", e: "💛" }
    ];
    const seq = [];
    let passo = 0;
    let mostrando = false;
    root.innerHTML = `
      <div class="jogo-hud"><span>Repita a sequência!</span><span id="jg-pts">Nível 1</span></div>
      <div class="ritmo-pads" id="pads"></div>
      <p class="subtitulo" style="text-align:center" id="jg-msg">Observe…</p>`;
    const pads = root.querySelector("#pads");
    const botoes = cores.map((cor, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ritmo-pad";
      b.style.background = cor.c;
      b.textContent = cor.e;
      b.dataset.i = String(i);
      b.setAttribute("aria-label", "Pad " + (i + 1));
      b.addEventListener("click", () => {
        if (mostrando) return;
        piscar(b);
        if (Number(b.dataset.i) === seq[passo]) {
          passo += 1;
          if (passo >= seq.length) {
            if (seq.length >= 4) {
              onDone({ sucesso: true, msg: "Dançou demais!" });
              return;
            }
            root.querySelector("#jg-msg").textContent = "Mandou bem! Próxima…";
            setTimeout(proximaRodada, 500);
          }
        } else {
          root.querySelector("#jg-msg").textContent = "Ops! Vamos de novo com carinho…";
          passo = 0;
          setTimeout(mostrarSeq, 700);
        }
      });
      pads.appendChild(b);
      return b;
    });

    function piscar(b) {
      b.classList.add("is-ativo");
      setTimeout(() => b.classList.remove("is-ativo"), 280);
    }
    function mostrarSeq() {
      mostrando = true;
      root.querySelector("#jg-msg").textContent = "Observe…";
      let i = 0;
      const t = setInterval(() => {
        if (i >= seq.length) {
          clearInterval(t);
          mostrando = false;
          passo = 0;
          root.querySelector("#jg-msg").textContent = "Sua vez!";
          return;
        }
        piscar(botoes[seq[i]]);
        i += 1;
      }, 550);
    }
    function proximaRodada() {
      seq.push(Math.floor(Math.random() * 4));
      root.querySelector("#jg-pts").textContent = "Nível " + seq.length;
      mostrarSeq();
    }
    proximaRodada();
  }

  function montarFantasia(root, onDone, estado, dados, renderPet) {
    root.innerHTML = `
      <div class="jogo-hud"><span>Vista o amiguito!</span><span>Toque nos itens</span></div>
      <div id="fantasia-pet" style="display:flex;justify-content:center;margin:0.5rem 0"></div>
      <div class="acessorios-grade" id="accs"></div>
      <p style="margin-top:0.85rem"><button type="button" class="btn btn--primario btn--bloco" id="btn-pronto">Ficou lindo! Pronto</button></p>`;
    const accs = root.querySelector("#accs");
    function refresh() {
      root.querySelector("#fantasia-pet").innerHTML = renderPet(estado.acessorios);
      accs.querySelectorAll(".acessorio").forEach((b) => {
        b.classList.toggle("is-ativo", estado.acessorios.includes(b.dataset.id));
      });
    }
    dados.acessorios.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "acessorio" + (estado.acessorios.includes(a.id) ? " is-ativo" : "");
      b.dataset.id = a.id;
      b.innerHTML = `${a.emoji}<span>${a.nome}</span>`;
      b.addEventListener("click", () => {
        const i = estado.acessorios.indexOf(a.id);
        if (i >= 0) estado.acessorios.splice(i, 1);
        else {
          if (estado.acessorios.length >= 3) estado.acessorios.shift();
          estado.acessorios.push(a.id);
        }
        refresh();
      });
      accs.appendChild(b);
    });
    refresh();
    root.querySelector("#btn-pronto").addEventListener("click", () => {
      onDone({ sucesso: true, msg: "Que fantasia linda!" });
    });
  }

  global.AmiguitoJogos = {
    registrarJogo, montarAlimentar, montarBolhas, montarEsconde,
    montarMemoria, montarDanca, montarFantasia
  };
})(window);
