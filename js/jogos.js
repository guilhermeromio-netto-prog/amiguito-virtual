/* Minigames Pro — score, recorde, moedas · estilo sessão curta */
(function (global) {
  function registrarJogo(estado, id) {
    if (!estado.jogosJogados.includes(id)) estado.jogosJogados.push(id);
  }

  function recompensa(estado, jogoId, score, opts) {
    opts = opts || {};
    registrarJogo(estado, jogoId);
    const xp = opts.xp != null ? opts.xp : Math.max(4, Math.min(14, Math.round(score / 3) + 4));
    const coins = opts.coins != null ? opts.coins : Math.max(2, Math.min(18, Math.round(score / 2) + 2));
    const nivelInfo = AmiguitoStorage.ganharXp(estado, xp);
    AmiguitoStorage.ganharMoedas(estado, coins);
    const recorde = AmiguitoStorage.registrarScore(estado, jogoId, score);
    AmiguitoStorage.salvar(estado);
    return { xp, coins, recorde, score, nivelInfo, high: (estado.highScores || {})[jogoId] || score };
  }

  function hud(titulo, pts, recorde) {
    return `<div class="jogo-hud jogo-hud--pro">
      <span class="jogo-hud__tit">${titulo}</span>
      <span id="jg-pts" class="jogo-hud__pts">${pts}</span>
      <span class="jogo-hud__hi" title="Recorde">🏆 <b id="jg-hi">${recorde || 0}</b></span>
    </div>
    <div class="progresso-foguete" aria-hidden="true"><span class="progresso-foguete__ico">🚀</span><div class="progresso-foguete__trilho"><div class="progresso-foguete__fill" id="jg-fill" style="width:0%"></div></div></div>`;
  }

  function setFill(root, pct) {
    const f = root.querySelector("#jg-fill");
    if (f) f.style.width = Math.max(0, Math.min(100, pct)) + "%";
  }

  /** Lanche — escolher comida certa */
  function montarAlimentar(root, onDone, estado) {
    const comidas = [
      { e: "🍎", ok: true }, { e: "🍪", ok: true }, { e: "🍌", ok: true }, { e: "🧀", ok: true },
      { e: "🪨", ok: false }, { e: "👟", ok: false }, { e: "🔑", ok: false }
    ];
    let score = 0;
    const meta = 5;
    const hi = (estado.highScores && estado.highScores.alimentar) || 0;
    root.innerHTML = hud("🍎 Lanche!", `0/${meta}`, hi) +
      `<div class="boca-alvo" id="boca-alvo" aria-label="Boquinha">😋</div>
       <div class="comida-bandeja" id="bandeja"></div>
       <p class="subtitulo" style="text-align:center">Toque na comida gostosa!</p>`;
    const bandeja = root.querySelector("#bandeja");
    const boca = root.querySelector("#boca-alvo");
    function round() {
      bandeja.innerHTML = "";
      AmiguitoEnsinar.embaralhar(comidas).slice(0, 5).forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "comida-item comida-item--grande";
        b.textContent = c.e;
        b.setAttribute("aria-label", c.ok ? "Comida" : "Não comer");
        b.addEventListener("click", () => {
          if (c.ok) {
            score += 1;
            boca.textContent = "😄";
            boca.classList.add("is-nham");
            setTimeout(() => boca.classList.remove("is-nham"), 400);
            if (AmiguitoSom) AmiguitoSom.sting("alimentar");
            if (AmiguitoPet) AmiguitoPet.soltarParticulas(["🍎", "✨"], { count: 5, grande: true });
            root.querySelector("#jg-pts").textContent = score + "/" + meta;
            setFill(root, (score / meta) * 100);
            if (score >= meta) {
              const r = recompensa(estado, "alimentar", score * 10);
              setTimeout(() => onDone({ sucesso: true, msg: "Barriguinha feliz!", score: r.score, coins: r.coins, recorde: r.recorde, nivelInfo: r.nivelInfo }), 350);
            } else round();
          } else {
            b.classList.add("is-erro-fx");
            boca.textContent = "😝";
            if (AmiguitoSom) AmiguitoSom.erro();
            setTimeout(() => { boca.textContent = "😋"; }, 350);
          }
        });
        bandeja.appendChild(b);
      });
    }
    round();
  }

  /** Chuva de comida — toque nos lanches que caem */
  function montarChuva(root, onDone, estado) {
    let score = 0;
    let lives = 3;
    const duracao = 18000;
    const hi = (estado.highScores && estado.highScores.chuva) || 0;
    root.innerHTML = hud("🌧️ Chuva de lanche", "0", hi) +
      `<div class="jogo-lives" id="jg-lives">❤️❤️❤️</div>
       <div class="jogo-area jogo-area--chuva" id="arena" role="application" aria-label="Chuva"></div>`;
    const arena = root.querySelector("#arena");
    const start = Date.now();
    let ended = false;
    function fim() {
      if (ended) return;
      ended = true;
      clearInterval(spawn);
      const r = recompensa(estado, "chuva", score);
      onDone({ sucesso: true, msg: "Chuva terminou! Pontos: " + score, score: r.score, coins: r.coins, recorde: r.recorde, nivelInfo: r.nivelInfo });
    }
    function atualizarVidas() {
      root.querySelector("#jg-lives").textContent = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
    }
    const bons = ["🍎", "🍪", "🍌", "🧀", "🍇"];
    const ruins = ["🪨", "👟", "📎"];
    const spawn = setInterval(() => {
      if (ended) return;
      const elapsed = Date.now() - start;
      setFill(root, (elapsed / duracao) * 100);
      if (elapsed >= duracao || lives <= 0) return fim();
      const bom = Math.random() > 0.28;
      const el = document.createElement("button");
      el.type = "button";
      el.className = "queda-item" + (bom ? "" : " queda-item--ruim");
      el.textContent = bom ? bons[Math.floor(Math.random() * bons.length)] : ruins[Math.floor(Math.random() * ruins.length)];
      el.style.left = (8 + Math.random() * 75) + "%";
      el.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
      el.setAttribute("aria-label", bom ? "Pegar" : "Evitar");
      const gone = setTimeout(() => {
        if (!el.isConnected) return;
        el.remove();
        if (bom) {
          lives -= 1;
          atualizarVidas();
          if (AmiguitoSom) AmiguitoSom.erro();
          if (lives <= 0) fim();
        }
      }, 3200);
      el.addEventListener("click", () => {
        clearTimeout(gone);
        el.remove();
        if (bom) {
          score += 1;
          root.querySelector("#jg-pts").textContent = String(score);
          if (AmiguitoSom) AmiguitoSom.tap();
        } else {
          lives -= 1;
          atualizarVidas();
          if (AmiguitoSom) AmiguitoSom.erro();
          if (lives <= 0) fim();
        }
      });
      arena.appendChild(el);
    }, 480);
    root._cleanup = () => { ended = true; clearInterval(spawn); };
  }

  /** Limpeza — toque nas sujeiras */
  function montarLimpeza(root, onDone, estado) {
    let score = 0;
    const total = 8;
    const hi = (estado.highScores && estado.highScores.limpeza) || 0;
    root.innerHTML = hud("🧼 Banho rápido", `0/${total}`, hi) +
      `<div class="jogo-area jogo-area--banho" id="arena" aria-label="Limpar">
         <div class="banho-amigo" aria-hidden="true">🛁</div>
       </div>
       <p class="subtitulo" style="text-align:center">Toque nas sujeirinhas!</p>`;
    const arena = root.querySelector("#arena");
    const sujos = ["💩", "🦠", "💧", "🍃", "🫧"];
    for (let i = 0; i < total; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sujeira";
      b.textContent = sujos[i % sujos.length];
      b.style.left = (10 + (i % 4) * 22 + Math.random() * 6) + "%";
      b.style.top = (18 + Math.floor(i / 4) * 32 + Math.random() * 8) + "%";
      b.setAttribute("aria-label", "Limpar");
      b.addEventListener("click", () => {
        if (b.dataset.done) return;
        b.dataset.done = "1";
        b.classList.add("is-limpo");
        score += 1;
        root.querySelector("#jg-pts").textContent = score + "/" + total;
        setFill(root, (score / total) * 100);
        if (AmiguitoSom) AmiguitoSom.sucesso();
        if (AmiguitoPet) AmiguitoPet.soltarParticulas(["✨", "💧", "🧼"], { count: 4, grande: true });
        setTimeout(() => b.remove(), 280);
        if (score >= total) {
          const r = recompensa(estado, "limpeza", score * 8, { coins: 8 });
          setTimeout(() => onDone({ sucesso: true, msg: "Limpinho e cheiroso!", score: r.score, coins: r.coins, recorde: r.recorde, higiene: true, nivelInfo: r.nivelInfo }), 300);
        }
      });
      arena.appendChild(b);
    }
  }

  function montarBolhas(root, onDone, estado) {
    let pontos = 0;
    const meta = 12;
    const hi = (estado.highScores && estado.highScores.bolhas) || 0;
    root.innerHTML = hud("🫧 Estrelas!", `0/${meta}`, hi) +
      `<div class="jogo-area" id="arena" role="application"></div>`;
    const arena = root.querySelector("#arena");
    let vivos = 0;
    const timer = setInterval(() => {
      if (pontos >= meta) return;
      if (vivos > 7) return;
      const el = document.createElement("button");
      el.type = "button";
      const ehEstrela = Math.random() > 0.5;
      el.className = ehEstrela ? "estrela-jogo" : "bolha";
      el.textContent = ehEstrela ? "⭐" : "🫧";
      el.style.left = (8 + Math.random() * 72) + "%";
      el.style.top = (10 + Math.random() * 65) + "%";
      vivos += 1;
      const life = setTimeout(() => { el.remove(); vivos -= 1; }, 2600);
      el.addEventListener("click", () => {
        clearTimeout(life);
        el.remove();
        vivos -= 1;
        pontos += ehEstrela ? 2 : 1;
        if (AmiguitoSom) AmiguitoSom.tap();
        root.querySelector("#jg-pts").textContent = pontos + "/" + meta;
        setFill(root, (pontos / meta) * 100);
        if (pontos >= meta) {
          clearInterval(timer);
          const r = recompensa(estado, "bolhas", pontos);
          onDone({ sucesso: true, msg: "Brilhou!", score: r.score, coins: r.coins, recorde: r.recorde, nivelInfo: r.nivelInfo });
        }
      });
      arena.appendChild(el);
    }, 480);
    root._cleanup = () => clearInterval(timer);
  }

  function montarEsconde(root, onDone, estado) {
    let tentativas = 0;
    const segredo = Math.floor(Math.random() * 4);
    const hi = (estado.highScores && estado.highScores.esconde) || 0;
    root.innerHTML = hud("🚪 Cadê?", "?", hi) +
      `<div class="portas" id="portas"></div>`;
    const box = root.querySelector("#portas");
    [0, 1, 2, 3].forEach((i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "porta porta--grande";
      b.textContent = "🚪";
      b.setAttribute("aria-label", "Porta " + (i + 1));
      b.addEventListener("click", () => {
        tentativas += 1;
        if (i === segredo) {
          b.textContent = "🎉";
          const score = Math.max(5, 40 - tentativas * 8);
          if (AmiguitoSom) AmiguitoSom.combo();
          const r = recompensa(estado, "esconde", score);
          setTimeout(() => onDone({ sucesso: true, msg: "Achei você!", score: r.score, coins: r.coins, recorde: r.recorde, nivelInfo: r.nivelInfo }), 400);
        } else {
          b.textContent = "🙈";
          b.disabled = true;
          if (AmiguitoSom) AmiguitoSom.erro();
        }
      });
      box.appendChild(b);
    });
  }

  function montarMemoria(root, onDone, estado, desafio) {
    const pares = desafio
      ? ["🚀", "⭐", "🌙", "🪐", "👽", "☄️"]
      : ["🚀", "⭐", "🌙", "🪐"];
    let cartas = pares.concat(pares);
    cartas = AmiguitoEnsinar.embaralhar(cartas).map((e, i) => ({ id: i, e, aberta: false, feita: false }));
    let abertas = [];
    let feitos = 0;
    let moves = 0;
    const hi = (estado.highScores && estado.highScores.memoria) || 0;
    root.innerHTML = hud("🃏 Memória", "0", hi) + `<div class="memoria-grade" id="grade"></div>`;
    const grade = root.querySelector("#grade");
    function paint() {
      grade.innerHTML = "";
      cartas.forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "memoria-carta" + (c.feita ? " is-feita" : c.aberta ? " is-aberta" : "");
        b.textContent = c.aberta || c.feita ? c.e : "❓";
        b.disabled = c.feita || c.aberta;
        b.addEventListener("click", () => {
          if (abertas.length >= 2 || c.aberta || c.feita) return;
          c.aberta = true;
          abertas.push(c);
          paint();
          if (abertas.length < 2) return;
          moves += 1;
          if (abertas[0].e === abertas[1].e) {
            abertas[0].feita = abertas[1].feita = true;
            feitos += 1;
            abertas = [];
            if (AmiguitoSom) AmiguitoSom.sucesso();
            if (AmiguitoPet) AmiguitoPet.soltarParticulas(["⭐", "✨"], { count: 4, grande: true });
            root.querySelector("#jg-pts").textContent = String(feitos);
            setFill(root, (feitos / pares.length) * 100);
            paint();
            if (feitos >= pares.length) {
              const score = Math.max(10, 80 - moves * 3) + (desafio ? 20 : 0);
              const r = recompensa(estado, "memoria", score);
              setTimeout(() => onDone({ sucesso: true, msg: "Memória de ouro!", score: r.score, coins: r.coins, recorde: r.recorde, nivelInfo: r.nivelInfo }), 300);
            }
          } else {
            if (AmiguitoSom) AmiguitoSom.erro();
            setTimeout(() => {
              abertas.forEach((x) => { x.aberta = false; });
              abertas = [];
              paint();
            }, 550);
          }
        });
        grade.appendChild(b);
      });
    }
    paint();
  }

  function montarDanca(root, onDone, estado) {
    const pads = ["🔴", "🟢", "🔵", "🟡"];
    let seq = [];
    let step = 0;
    let round = 0;
    const meta = 4;
    const hi = (estado.highScores && estado.highScores.danca) || 0;
    root.innerHTML = hud("🥁 Dança", `0/${meta}`, hi) +
      `<p class="subtitulo" id="danca-msg" style="text-align:center">Olhe a sequência!</p>
       <div class="ritmo-grade" id="pads"></div>`;
    const box = root.querySelector("#pads");
    const msg = root.querySelector("#danca-msg");
    pads.forEach((p, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ritmo-pad ritmo-pad--grande";
      b.textContent = p;
      b.dataset.i = String(i);
      b.addEventListener("click", () => {
        if (msg.dataset.lock === "1") return;
        if (Number(b.dataset.i) === seq[step]) {
          step += 1;
          if (AmiguitoSom) AmiguitoSom.tap();
          b.classList.add("is-acerto-fx");
          setTimeout(() => b.classList.remove("is-acerto-fx"), 200);
          if (step >= seq.length) {
            round += 1;
            root.querySelector("#jg-pts").textContent = round + "/" + meta;
            setFill(root, (round / meta) * 100);
            if (round >= meta) {
              const r = recompensa(estado, "danca", round * 15);
              onDone({ sucesso: true, msg: "Dançou demais!", score: r.score, coins: r.coins, recorde: r.recorde, nivelInfo: r.nivelInfo });
            } else proxima();
          }
        } else {
          if (AmiguitoSom) AmiguitoSom.erro();
          msg.textContent = "Ops! De novo…";
          step = 0;
          mostrarSeq();
        }
      });
      box.appendChild(b);
    });
    function mostrarSeq() {
      msg.dataset.lock = "1";
      msg.textContent = "Olhe!";
      let i = 0;
      const t = setInterval(() => {
        box.querySelectorAll(".ritmo-pad").forEach((p) => p.classList.remove("is-flash"));
        if (i >= seq.length) {
          clearInterval(t);
          msg.dataset.lock = "0";
          msg.textContent = "Sua vez!";
          return;
        }
        const pad = box.querySelector(`.ritmo-pad[data-i="${seq[i]}"]`);
        if (pad) pad.classList.add("is-flash");
        if (AmiguitoSom) AmiguitoSom.contagem();
        i += 1;
      }, 520);
    }
    function proxima() {
      seq.push(Math.floor(Math.random() * 4));
      step = 0;
      mostrarSeq();
    }
    proxima();
  }

  function montarFantasia(root, onDone, estado, dados) {
    root.innerHTML = `
      <div class="jogo-hud"><span>🧑‍🚀 Traje</span><span>⭐ ${estado.moedas || 0}</span></div>
      <div id="fantasia-pet" class="fantasia-preview"></div>
      <div class="acessorios-grade" id="accs"></div>
      <button type="button" class="btn btn--primario btn--bloco" id="btn-pronto">Pronto! ✨</button>`;
    function paint() {
      if (AmiguitoPet) {
        root.querySelector("#fantasia-pet").innerHTML = AmiguitoPet.renderRetrato(estado.personagemId || "rumi", {
          humor: "feliz", acessorios: estado.acessorios, w: 160, h: 160, className: "pet-retrato"
        });
      }
      const box = root.querySelector("#accs");
      box.innerHTML = "";
      (dados.acessorios || AmiguitoEconomia.LOJA.acessorios).forEach((a) => {
        const unlocked = (estado.acessoriosDesbloqueados || []).includes(a.id) || a.preco === 0;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "acessorio" + (estado.acessorios.includes(a.id) ? " is-ativo" : "") + (!unlocked ? " is-locked" : "");
        b.innerHTML = `<span>${a.emoji || a.icone || "⭐"}</span><small>${unlocked ? (a.nome || a.id) : "🔒"}</small>`;
        b.addEventListener("click", () => {
          if (!unlocked) {
            if (AmiguitoSom) AmiguitoSom.erro();
            return;
          }
          AmiguitoEconomia.equiparAcessorio(estado, a.id);
          AmiguitoStorage.salvar(estado);
          if (AmiguitoSom) AmiguitoSom.tap();
          paint();
        });
        box.appendChild(b);
      });
    }
    paint();
    root.querySelector("#btn-pronto").addEventListener("click", () => {
      const r = recompensa(estado, "fantasia", 20, { xp: 6, coins: 3 });
      onDone({ sucesso: true, msg: "Que fantasia linda!", score: r.score, coins: r.coins, recorde: r.recorde, nivelInfo: r.nivelInfo });
    });
  }

  function montar(id, root, onDone, ctx) {
    ctx = ctx || {};
    const estado = ctx.estado || global.AmiguitoEstado;
    const dados = ctx.dados || {};
    if (root._cleanup) try { root._cleanup(); } catch (_) {}
    if (id === "alimentar") return montarAlimentar(root, onDone, estado);
    if (id === "chuva") return montarChuva(root, onDone, estado);
    if (id === "limpeza") return montarLimpeza(root, onDone, estado);
    if (id === "bolhas") return montarBolhas(root, onDone, estado);
    if (id === "esconde") return montarEsconde(root, onDone, estado);
    if (id === "memoria") return montarMemoria(root, onDone, estado, !!ctx.desafio);
    if (id === "danca") return montarDanca(root, onDone, estado);
    if (id === "fantasia") return montarFantasia(root, onDone, estado, dados);
    onDone({ sucesso: false, msg: "Jogo em construção" });
  }

  global.AmiguitoJogos = { montar, recompensa };
})(window);
