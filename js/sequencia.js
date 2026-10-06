/* Sequências longas 6–10 passos: olhar → arrastar → parear → ordenar → quiz → desafio → festa */
(function (global) {
  function embaralhar(arr) {
    const a = (arr || []).slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function falar(t, completo) {
    if (global.AmiguitoEducar) AmiguitoEducar.falar(t, { completo: !!completo });
    else if (global.AmiguitoFala) AmiguitoFala.falar(t, { completo: !!completo });
  }

  function progressoKey(id) { return "seq:" + id; }

  function lerProgresso(estado, id) {
    if (!estado) return null;
    if (!estado.sequenciasProgresso) estado.sequenciasProgresso = {};
    return estado.sequenciasProgresso[progressoKey(id)] || null;
  }

  function salvarProgresso(estado, id, dados) {
    if (!estado) return;
    if (!estado.sequenciasProgresso) estado.sequenciasProgresso = {};
    estado.sequenciasProgresso[progressoKey(id)] = dados;
    if (global.AmiguitoStorage) AmiguitoStorage.salvar(estado);
  }

  function limparProgresso(estado, id) {
    if (!estado || !estado.sequenciasProgresso) return;
    delete estado.sequenciasProgresso[progressoKey(id)];
    if (global.AmiguitoStorage) AmiguitoStorage.salvar(estado);
  }

  function barraHtml(i, total) {
    const pct = Math.round((i / Math.max(1, total)) * 100);
    return `<div class="seq-barra" aria-label="Passo ${i + 1} de ${total}">
      <span class="seq-barra__num">${i + 1}/${total}</span>
      <div class="seq-barra__trilho"><i style="width:${pct}%"></i></div>
    </div>`;
  }

  /** Passo: olhar (imagem + fala) */
  function passoOlhar(root, passo, ctx, next) {
    const chave = passo.midia || passo.chave;
    const fala = passo.fala || "Olha comigo esta figura!";
    const porque = passo.porque || "";
    function paint(htmlFig) {
      root.innerHTML = `
        ${AmiguitoEducar.fasesHtml("modelo")}
        ${AmiguitoEducar.coachHtml("")}
        <div class="seq-card card">
          ${htmlFig}
          <p class="jogo__pergunta">${AmiguitoEducar.escapar(passo.titulo || "Olha!")}</p>
          <button type="button" class="btn btn--primario btn--bloco" id="seq-next" data-fala="Continuar">Vi! Continuar 👀</button>
          ${porque ? AmiguitoEducar.porqueBox(porque) : ""}
        </div>`;
      AmiguitoEducar.setCoach(root, fala, true);
      root.querySelector("#seq-next").onclick = () => next({ ok: true });
    }
    if (global.AmiguitoMidia) {
      AmiguitoMidia.figurinha(chave, { alt: passo.titulo }).then(paint);
    } else {
      paint(`<div style="font-size:4rem;text-align:center">${passo.emoji || "✨"}</div>`);
    }
  }

  /** Passo: quiz sem revelar resposta no modelo */
  function passoQuiz(root, passo, ctx, next) {
    const nivel = ctx.nivel || 1;
    let ops = (passo.opcoes || []).slice();
    const certas = ops.filter((o) => o.certa);
    if (nivel === 1 && ops.length > 2) {
      const c = certas[0] || ops[0];
      const e = ops.find((o) => !o.certa) || ops[1];
      ops = embaralhar([c, e].filter(Boolean));
    } else {
      ops = embaralhar(ops);
    }
    const fala = passo.fala || passo.pergunta || "Toque na resposta.";
    const midia = passo.midia;
    function paint(htmlFig) {
      root.innerHTML = `
        ${AmiguitoEducar.fasesHtml("pratica")}
        ${AmiguitoEducar.coachHtml("")}
        <div class="seq-card card">
          ${htmlFig || ""}
          <p class="jogo__pergunta">${AmiguitoEducar.escapar(passo.pergunta || fala)}</p>
          <div class="jogo__opcoes" id="seq-ops">${ops.map((o, i) => {
            const label = o.emoji ? `${o.emoji} ${o.texto || ""}` : (o.texto || o.emoji || "?");
            const cor = o.cor ? `<span class="cor-swatch" style="background:${o.cor}"></span>` : "";
            return `<button type="button" class="opcao ${o.cor ? "opcao--cor" : ""}" data-i="${i}">${cor}${AmiguitoEducar.escapar(label)}</button>`;
          }).join("")}</div>
          ${AmiguitoEducar.porqueBox(passo.porque || "")}
        </div>`;
      AmiguitoEducar.setCoach(root, fala, true);
      const botoes = [...root.querySelectorAll("#seq-ops .opcao")];
      botoes.forEach((btn) => btn.addEventListener("click", () => {
        const op = ops[Number(btn.dataset.i)];
        botoes.forEach((b) => { b.disabled = true; });
        if (op && op.certa) {
          btn.classList.add("is-certa", "is-acerto-fx");
          AmiguitoEducar.acertoFesta(root, passo.porque, passo.msgOk || "Isso!");
          setTimeout(() => next({ ok: true }), 1100);
        } else {
          const certaBtn = botoes.find((b, i) => ops[i] && ops[i].certa);
          AmiguitoEducar.erroGentil(botoes, btn, certaBtn, root);
          setTimeout(() => {
            botoes.forEach((b) => { b.disabled = false; b.classList.remove("is-errada", "is-erro-fx", "is-certa", "is-acerto-fx", "edu-mostra-certo"); });
            AmiguitoEducar.setCoach(root, "Tenta de novo com carinho!", true);
          }, 1400);
        }
      }));
    }
    if (midia && global.AmiguitoMidia) {
      AmiguitoMidia.figurinha(midia, { w: 200, h: 140 }).then(paint);
    } else paint("");
  }

  /** Passo: arrastar (reusa educar) */
  function passoArrastar(root, passo, ctx, next) {
    AmiguitoEducar.montarArrastarSlots(root, {
      pecas: passo.pecas || [],
      slots: passo.slots || [],
      fala: passo.fala || "Arraste cada peça pro lugar.",
      porque: passo.porque || "",
      msgOk: passo.msgOk || "Encaixou!",
      meta: passo.meta,
      trilha: passo.trilha
    }, (res) => next({ ok: !!(res && res.sucesso) }));
  }

  /** Passo: parear (toque A, toque B) */
  function passoParear(root, passo, ctx, next) {
    const pares = (passo.pares || []).slice();
    const esq = embaralhar(pares.map((p, i) => ({ id: "e" + i, match: p.id, label: p.a, emoji: p.aEmoji })));
    const dir = embaralhar(pares.map((p, i) => ({ id: "d" + i, match: p.id, label: p.b, emoji: p.bEmoji })));
    let sel = null;
    let feitos = 0;
    root.innerHTML = `
      ${AmiguitoEducar.fasesHtml("pratica")}
      ${AmiguitoEducar.coachHtml("")}
      <div class="seq-card card">
        <p class="jogo__pergunta">${AmiguitoEducar.escapar(passo.titulo || "Combine os pares")}</p>
        <div class="seq-parear">
          <div class="seq-parear__col" id="seq-esq">${esq.map((x) =>
            `<button type="button" class="seq-chip" data-side="e" data-match="${x.match}" data-id="${x.id}">${x.emoji || ""} ${AmiguitoEducar.escapar(x.label)}</button>`
          ).join("")}</div>
          <div class="seq-parear__col" id="seq-dir">${dir.map((x) =>
            `<button type="button" class="seq-chip" data-side="d" data-match="${x.match}" data-id="${x.id}">${x.emoji || ""} ${AmiguitoEducar.escapar(x.label)}</button>`
          ).join("")}</div>
        </div>
        ${AmiguitoEducar.porqueBox(passo.porque || "")}
      </div>`;
    AmiguitoEducar.setCoach(root, passo.fala || "Toque num e depois no par.", true);
    root.querySelectorAll(".seq-chip").forEach((btn) => btn.addEventListener("click", () => {
      if (btn.dataset.done) return;
      if (!sel) {
        sel = btn;
        btn.classList.add("is-selecionada");
        AmiguitoEducar.setCoach(root, "Agora o par!", true);
        return;
      }
      if (sel === btn) { sel.classList.remove("is-selecionada"); sel = null; return; }
      if (sel.dataset.side === btn.dataset.side) {
        sel.classList.remove("is-selecionada");
        sel = btn;
        btn.classList.add("is-selecionada");
        return;
      }
      const ok = sel.dataset.match === btn.dataset.match;
      if (ok) {
        sel.dataset.done = btn.dataset.done = "1";
        sel.classList.add("is-certa"); btn.classList.add("is-certa");
        sel.classList.remove("is-selecionada");
        sel.disabled = btn.disabled = true;
        feitos += 1;
        if (global.AmiguitoSom) AmiguitoSom.sucesso();
        sel = null;
        if (feitos >= pares.length) {
          AmiguitoEducar.acertoFesta(root, passo.porque, "Pares combinados!");
          setTimeout(() => next({ ok: true }), 1000);
        } else {
          AmiguitoEducar.setCoach(root, "Mandou bem! Próximo par.", true);
        }
      } else {
        btn.classList.add("is-erro-fx");
        sel.classList.add("is-erro-fx");
        if (global.AmiguitoSom) AmiguitoSom.erro();
        AmiguitoEducar.setCoach(root, "Quase! Outro par.", true);
        const a = sel, b = btn;
        setTimeout(() => {
          a.classList.remove("is-selecionada", "is-erro-fx");
          b.classList.remove("is-erro-fx");
        }, 450);
        sel = null;
      }
    }));
  }

  /** Passo: ordenar/sort por categoria (tap piece then category) */
  function passoOrdenar(root, passo, ctx, next) {
    const itens = embaralhar(passo.itens || []);
    const cats = passo.categorias || [];
    AmiguitoEducar.montarArrastarSlots(root, {
      pecas: itens.map((it, i) => ({ id: "i" + i, match: it.cat, icone: it.emoji || it.label, label: it.label })),
      slots: cats.map((c) => ({ id: c.id, accept: c.id, label: c.label, icone: c.emoji || "⬜" })),
      fala: passo.fala || "Separe em grupos.",
      porque: passo.porque || "",
      msgOk: passo.msgOk || "Tudo no lugar!",
      meta: itens.length
    }, (res) => next({ ok: !!(res && res.sucesso) }));
  }

  /** Passo: desafio (quiz nível 3) */
  function passoDesafio(root, passo, ctx, next) {
    const p2 = Object.assign({}, passo, { fala: passo.fala || "Desafio! Você consegue?" });
    passoQuiz(root, p2, { nivel: 3 }, next);
  }

  const HANDLERS = {
    olhar: passoOlhar,
    watch: passoOlhar,
    quiz: passoQuiz,
    arrastar: passoArrastar,
    drag: passoArrastar,
    parear: passoParear,
    match: passoParear,
    ordenar: passoOrdenar,
    sort: passoOrdenar,
    desafio: passoDesafio,
    challenge: passoDesafio
  };

  /**
   * Inicia sequência. def = { id, titulo, trilha, passos: [...] }
   * callbacks: onComplete, onPasso
   */
  function iniciar(root, def, opts, callbacks) {
    opts = opts || {};
    callbacks = callbacks || {};
    const estado = opts.estado;
    const id = def.id;
    const passos = def.passos || [];
    const total = passos.length;
    let idx = 0;
    let acertos = 0;
    const saved = opts.continuar !== false ? lerProgresso(estado, id) : null;
    if (saved && saved.passo > 0 && saved.passo < total) {
      idx = saved.passo;
      acertos = saved.acertos || 0;
    }
    const ctx = { nivel: opts.nivel || 1, estado, id };

    function shell() {
      const wrap = document.createElement("div");
      wrap.className = "seq-shell";
      wrap.innerHTML = `
        ${barraHtml(idx, total)}
        ${AmiguitoEducar.niveisHtml ? "" : ""}
        <div id="seq-corpo"></div>
        <p class="seq-retomar" ${saved && saved.passo ? "" : "hidden"}>Continuando de onde parou 🚀</p>`;
      root.innerHTML = "";
      root.appendChild(wrap);
      return wrap.querySelector("#seq-corpo");
    }

    function run() {
      if (idx >= total) {
        limparProgresso(estado, id);
        if (callbacks.onComplete) callbacks.onComplete({ acertos, total, id, trilha: def.trilha });
        return;
      }
      salvarProgresso(estado, id, { passo: idx, acertos, total, updated: Date.now() });
      const corpo = shell();
      const passo = passos[idx];
      const tipo = passo.tipo || "quiz";
      const fn = HANDLERS[tipo] || passoQuiz;
      if (callbacks.onPasso) callbacks.onPasso(idx, passo);
      fn(corpo, passo, ctx, (res) => {
        if (res && res.ok) acertos += 1;
        idx += 1;
        setTimeout(run, 200);
      });
    }
    // ensure midia catalog warm
    const start = () => run();
    if (global.AmiguitoMidia) AmiguitoMidia.carregarCatalogo().then(start).catch(start);
    else start();
    return { id, total };
  }

  global.AmiguitoSequencia = {
    iniciar, lerProgresso, salvarProgresso, limparProgresso, embaralhar, HANDLERS
  };
})(window);
