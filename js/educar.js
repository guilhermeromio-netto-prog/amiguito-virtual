/* Motor pedagógico visual — mostra → guia → pratica → celebra (áudio + ícones) */
(function (global) {
  const FASES = [
    { id: "modelo", icone: "👀", nome: "Olha" },
    { id: "guia", icone: "🧭", nome: "Guia" },
    { id: "pratica", icone: "🖐️", nome: "Faz" },
    { id: "festa", icone: "🎉", nome: "Festa" }
  ];

  function falar(texto, opts) {
    opts = opts || {};
    if (global.AmiguitoFala) {
      AmiguitoFala.falar(texto, Object.assign({ completo: !!opts.completo, force: !!opts.force }, opts));
    }
  }

  function coachHtml(fala, opts) {
    opts = opts || {};
    return `<div class="edu-coach" id="edu-coach" role="status">
      <img src="img/astronauta-guia.png" width="56" height="56" alt="" class="edu-coach__avatar">
      <div class="edu-coach__bubble">
        <strong class="edu-coach__label">Educador</strong>
        <p class="edu-coach__fala" id="edu-coach-fala">${escapar(fala || "")}</p>
      </div>
      <button type="button" class="btn btn--icone" id="edu-coach-replay" aria-label="Ouvir de novo" data-fala="Ouvir">🗣️</button>
    </div>`;
  }

  function fasesHtml(faseAtiva) {
    return `<ol class="edu-fases" aria-label="Passos da lição">
      ${FASES.map((f) => `<li class="edu-fase ${f.id === faseAtiva ? "is-ativa" : ""}" data-fase="${f.id}">
        <span aria-hidden="true">${f.icone}</span><span class="edu-fase__nome">${f.nome}</span>
      </li>`).join("")}
    </ol>`;
  }

  function niveisHtml(nivel) {
    return `<div class="edu-niveis" role="group" aria-label="Nível">
      ${[1, 2, 3].map((n) => `<button type="button" class="edu-nivel ${nivel === n ? "is-ativo" : ""}" data-nivel="${n}" aria-pressed="${nivel === n}" data-fala="Nível ${n}">
        ${n === 1 ? "🌱" : n === 2 ? "🌿" : "🌳"} <span>${n}</span>
      </button>`).join("")}
    </div>`;
  }

  function escapar(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function setCoach(root, texto, speak) {
    const el = root.querySelector("#edu-coach-fala");
    if (el) el.textContent = texto;
    const btn = root.querySelector("#edu-coach-replay");
    if (btn) {
      btn.onclick = () => falar(texto, { completo: true, force: true });
    }
    if (speak !== false) falar(texto, { completo: true });
  }

  function setFase(root, fase) {
    root.querySelectorAll(".edu-fase").forEach((li) => {
      li.classList.toggle("is-ativa", li.dataset.fase === fase);
    });
  }

  function porqueBox(texto) {
    return `<div class="edu-porque" id="edu-porque" hidden>
      <span aria-hidden="true">💡</span>
      <p><strong>Por quê?</strong> <span id="edu-porque-txt">${escapar(texto)}</span></p>
    </div>`;
  }

  function mostrarPorque(root, texto) {
    const box = root.querySelector("#edu-porque");
    const txt = root.querySelector("#edu-porque-txt");
    if (txt) txt.textContent = texto;
    if (box) {
      box.hidden = false;
      box.classList.add("is-visivel");
    }
    if (texto) falar("Por quê? " + texto, { completo: true });
  }

  /** Erro gentil: destaca o certo, sem vergonha */
  function erroGentil(opcoesEls, escolhida, certaEl, root) {
    if (global.AmiguitoSom) AmiguitoSom.erro();
    if (escolhida) {
      escolhida.classList.add("is-errada", "is-erro-fx");
      escolhida.classList.remove("is-certa");
    }
    if (certaEl) {
      certaEl.classList.add("is-certa", "is-acerto-fx", "edu-mostra-certo");
    }
    setCoach(root, "Quase! Olha a certa brilhando. Vamos de novo com carinho.", true);
    if (global.AmiguitoPet) AmiguitoPet.soltarParticulas(["💙", "✨"], { count: 4, grande: true });
  }

  function acertoFesta(root, porque, msg) {
    if (global.AmiguitoSom) AmiguitoSom.sucesso();
    if (global.AmiguitoPet) AmiguitoPet.soltarParticulas(["⭐", "🎉", "✨"], { count: 8, grande: true });
    setFase(root, "festa");
    setCoach(root, msg || "Mandou bem!", true);
    if (porque) setTimeout(() => mostrarPorque(root, porque), 450);
  }

  /** Drag & drop simples (pointer) peça → slot */
  function montarArrastarSlots(root, config, onDone) {
    const pecas = AmiguitoEnsinar.embaralhar(config.pecas.slice());
    const slots = config.slots;
    root.innerHTML = `
      ${fasesHtml("pratica")}
      ${coachHtml(config.fala || "Arraste cada peça pro lugar certo.")}
      <div class="edu-drag">
        <div class="edu-slots" id="edu-slots">
          ${slots.map((s) => `<div class="edu-slot" data-id="${s.id}" data-accept="${s.accept}" aria-label="${s.label}">
            <span class="edu-slot__label">${s.icone || ""} ${s.label}</span>
            <div class="edu-slot__drop"></div>
          </div>`).join("")}
        </div>
        <div class="edu-pecas" id="edu-pecas">
          ${pecas.map((p) => `<button type="button" class="edu-peca" draggable="true" data-id="${p.id}" data-match="${p.match}" aria-label="${p.label}">${p.icone || p.label}</button>`).join("")}
        </div>
      </div>
      ${porqueBox(config.porque || "")}
      <p class="subtitulo" style="text-align:center">Toque numa peça e depois no lugar — ou arraste.</p>`;
    setCoach(root, config.fala || "Arraste cada peça pro lugar certo.", true);
    let selecionada = null;
    let feitos = 0;
    const total = config.meta != null
      ? config.meta
      : pecas.filter((pc) => slots.some((s) => s.accept === pc.match)).length;

    function tentar(pecaEl, slotEl) {
      if (!pecaEl || !slotEl || pecaEl.dataset.done) return;
      const ok = pecaEl.dataset.match === slotEl.dataset.accept;
      if (!ok) {
        pecaEl.classList.add("is-erro-fx");
        slotEl.classList.add("is-erro-fx");
        if (AmiguitoSom) AmiguitoSom.erro();
        setCoach(root, "Hmm, outro lugar. Tenta de novo!", true);
        setTimeout(() => {
          pecaEl.classList.remove("is-erro-fx");
          slotEl.classList.remove("is-erro-fx");
        }, 400);
        return;
      }
      pecaEl.dataset.done = "1";
      pecaEl.disabled = true;
      pecaEl.classList.add("is-certa", "is-acerto-fx");
      const drop = slotEl.querySelector(".edu-slot__drop");
      drop.textContent = pecaEl.textContent;
      slotEl.classList.add("is-preenchido", "is-acertou");
      feitos += 1;
      if (AmiguitoSom) AmiguitoSom.sucesso();
      setCoach(root, "Encaixou! " + feitos + " de " + total, true);
      if (feitos >= total) {
        acertoFesta(root, config.porque, config.msgOk || "Puzzle completo!");
        setTimeout(() => onDone({ sucesso: true, msg: config.msgOk || "Puzzle completo!", porque: config.porque, trilha: config.trilha }), 1200);
      }
    }

    root.querySelectorAll(".edu-peca").forEach((peca) => {
      peca.addEventListener("click", () => {
        root.querySelectorAll(".edu-peca").forEach((p) => p.classList.remove("is-selecionada"));
        if (peca.dataset.done) return;
        peca.classList.add("is-selecionada");
        selecionada = peca;
        setCoach(root, "Agora toque no lugar certo.", true);
      });
      peca.addEventListener("dragstart", (ev) => {
        selecionada = peca;
        ev.dataTransfer.setData("text/plain", peca.dataset.id);
      });
    });
    root.querySelectorAll(".edu-slot").forEach((slot) => {
      slot.addEventListener("click", () => {
        if (selecionada) tentar(selecionada, slot);
        selecionada = null;
        root.querySelectorAll(".edu-peca").forEach((p) => p.classList.remove("is-selecionada"));
      });
      slot.addEventListener("dragover", (ev) => { ev.preventDefault(); slot.classList.add("is-over"); });
      slot.addEventListener("dragleave", () => slot.classList.remove("is-over"));
      slot.addEventListener("drop", (ev) => {
        ev.preventDefault();
        slot.classList.remove("is-over");
        const id = ev.dataTransfer.getData("text/plain");
        const peca = root.querySelector(`.edu-peca[data-id="${id}"]`);
        tentar(peca, slot);
      });
    });
  }

  /** Quiz em 4 fases: modelo → guia → prática → festa */
  function montarQuizFases(root, pergunta, opts, onDone) {
    opts = opts || {};
    const nivel = opts.nivel || 1;
    let fase = "modelo";
    const porque = pergunta.porque || opts.porque || "Porque isso ajuda a gente a entender o mundo!";
    const opcoesBase = pergunta.opcoes.slice();
    // Tier: 1 = 2 opções (certa + 1), 2 = todas, 3 = todas embaralhadas + tempo sugerido
    let opcoes = opcoesBase.slice();
    if (nivel === 1) {
      const certa = opcoes.find((o) => o.certa) || opcoes[0];
      const errada = opcoes.find((o) => !o.certa) || opcoes[1];
      opcoes = AmiguitoEnsinar.embaralhar([certa, errada].filter(Boolean));
    } else {
      opcoes = AmiguitoEnsinar.embaralhar(opcoes);
    }

    function paint() {
      const certa = opcoesBase.find((o) => o.certa);
      // Pedagogy: NEVER show the correct answer in modelo/guia — only the method
      const modeloVisual = `<div class="edu-modelo-metodo" aria-hidden="true">
          <span style="font-size:2.4rem">👀</span>
          <p class="edu-modelo-txt">Olha a pergunta. Depois você escolhe sozinha.</p>
        </div>`;

      root.innerHTML = `
        ${fasesHtml(fase)}
        ${coachHtml("")}
        <div class="edu-card card">
          <p class="jogo__pergunta" id="edu-q">${escapar(pergunta.pergunta)}</p>
          <div id="edu-corpo"></div>
          ${porqueBox(porque)}
        </div>`;

      const corpo = root.querySelector("#edu-corpo");
      if (fase === "modelo") {
        setFase(root, "modelo");
        setCoach(root, "Olha a pergunta comigo. Ainda não responda — só observar!", true);
        corpo.innerHTML = `<div class="edu-modelo">${modeloVisual}
          <button type="button" class="btn btn--primario btn--bloco" id="edu-next" data-fala="Continuar">Vi! Continuar 👀</button></div>`;
        root.querySelector("#edu-next").onclick = () => { fase = "guia"; paint(); };
      } else if (fase === "guia") {
        setFase(root, "guia");
        setCoach(root, "Eu te guio com a voz. A resposta certa você descobre!", true);
        corpo.innerHTML = `<div class="edu-guia-dica" aria-hidden="true">🧭✨</div>
          <button type="button" class="btn btn--primario btn--bloco" id="edu-next" data-fala="Estou pronta">Estou pronta! 🖐️</button>`;
        root.querySelector("#edu-next").onclick = () => { fase = "pratica"; paint(); };
      } else if (fase === "pratica") {
        setFase(root, "pratica");
        setCoach(root, pergunta.pergunta, true);
        corpo.innerHTML = `<div class="jogo__opcoes" id="edu-ops">${opcoes.map((op, i) => {
          const label = op.texto;
          return `<button type="button" class="opcao ${op.cor ? "opcao--cor" : ""}" data-i="${i}">${op.cor ? `<span class="cor-swatch" style="background:${op.cor}"></span>` : ""}${escapar(label)}</button>`;
        }).join("")}</div>`;
        const botoes = [...corpo.querySelectorAll(".opcao")];
        botoes.forEach((btn) => {
          btn.addEventListener("click", () => {
            const op = opcoes[Number(btn.dataset.i)];
            const ok = !!(op && op.certa);
            botoes.forEach((b) => { b.disabled = true; });
            if (ok) {
              btn.classList.add("is-certa", "is-acerto-fx");
              acertoFesta(root, porque, "Isso! Você conseguiu!");
              setTimeout(() => onDone({ sucesso: true, porque, msg: "Acertou!" }), 1400);
            } else {
              const certaBtn = botoes.find((b, i) => opcoes[i].certa);
              erroGentil(botoes, btn, certaBtn, root);
              setTimeout(() => {
                fase = "guia";
                paint();
              }, 1600);
            }
          });
        });
      }
    }
    paint();
  }

  global.AmiguitoEducar = {
    FASES, falar, coachHtml, fasesHtml, niveisHtml, setCoach, setFase,
    porqueBox, mostrarPorque, erroGentil, acertoFesta,
    montarArrastarSlots, montarQuizFases, escapar
  };
})(window);
