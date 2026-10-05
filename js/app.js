/* Amiguito Virtual — SPA hash · byGui */
(function () {
  "use strict";

  let DADOS = null;
  let estado = null;
  let falaAtual = "";
  let animacaoPet = "";
  let jogoAtivo = null; // { licaoId, indice, acertos }

  const $ = (sel, el = document) => el.querySelector(sel);
  const conteudo = $("#conteudo");
  const nav = $("#nav-principal");
  const btnSom = $("#btn-som");
  const toastEl = $("#toast");

  async function iniciar() {
    try {
      const res = await fetch("dados.json", { cache: "no-store" });
      if (!res.ok) throw new Error("dados.json " + res.status);
      DADOS = await res.json();
    } catch (e) {
      conteudo.innerHTML = `<div class="card vazio"><span class="vazio__icone">😿</span><p>Não consegui carregar o Amiguito. Verifique a conexão e recarregue.</p></div>`;
      return;
    }

    estado = AmiguitoStorage.aplicarDecaimento(AmiguitoStorage.carregar());
    AmiguitoStorage.salvar(estado);
    atualizarBotaoSom();

    btnSom.addEventListener("click", alternarSom);
    window.addEventListener("hashchange", rotear);
    rotear();

    // Decai suave a cada minuto enquanto a aba está aberta
    setInterval(() => {
      if (!estado.personagemId) return;
      estado = AmiguitoStorage.aplicarDecaimento(estado);
      AmiguitoStorage.salvar(estado);
      if (rotaAtual() === "casa") renderCasa();
    }, 60000);
  }

  function rotaAtual() {
    const h = (location.hash || "#/").replace(/^#\/?/, "");
    return h.split("?")[0] || "";
  }

  function rotear() {
    if (!DADOS) return;
    const r = rotaAtual();

    if (!estado.personagemId && r !== "" && r !== "inicio") {
      location.hash = "#/";
      return;
    }

    nav.hidden = !estado.personagemId;
    destacarNav(r);

    if (!estado.personagemId || r === "" || r === "inicio") {
      renderBoasVindas();
    } else if (r === "casa") {
      renderCasa();
    } else if (r === "ensinar") {
      renderEnsinar();
    } else if (r.startsWith("ensinar/")) {
      renderJogo(r.split("/")[1]);
    } else if (r === "aprender") {
      renderAprender();
    } else if (r === "trofeus") {
      renderTrofeus();
    } else {
      location.hash = "#/casa";
    }

    conteudo.focus({ preventScroll: true });
  }

  function destacarNav(r) {
    const base = r.split("/")[0] || "casa";
    nav.querySelectorAll(".nav__item").forEach((a) => {
      a.classList.toggle("is-ativo", a.dataset.rota === base);
    });
  }

  function personagem() {
    return DADOS.personagens.find((p) => p.id === estado.personagemId);
  }

  function desbloquearTrofeu(id) {
    if (!estado.trofeus.includes(id)) {
      estado.trofeus.push(id);
      const t = DADOS.trofeus.find((x) => x.id === id);
      if (t) mostrarToast(`Troféu: ${t.icone} ${t.nome}!`);
    }
  }

  function mostrarToast(msg) {
    toastEl.hidden = false;
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add("is-visivel"));
    clearTimeout(mostrarToast._t);
    mostrarToast._t = setTimeout(() => {
      toastEl.classList.remove("is-visivel");
      setTimeout(() => { toastEl.hidden = true; }, 280);
    }, 2600);
  }

  function alternarSom() {
    estado.somAtivo = !estado.somAtivo;
    AmiguitoStorage.salvar(estado);
    atualizarBotaoSom();
    if (estado.somAtivo) bip();
  }

  function atualizarBotaoSom() {
    btnSom.setAttribute("aria-pressed", String(!!estado.somAtivo));
    btnSom.setAttribute("aria-label", estado.somAtivo ? "Desativar sons" : "Ativar sons");
    btnSom.innerHTML = `<span aria-hidden="true">${estado.somAtivo ? "🔊" : "🔇"}</span>`;
  }

  function bip() {
    if (!estado.somAtivo) return;
    try {
      const ctx = bip._ctx || (bip._ctx = new (window.AudioContext || window.webkitAudioContext)());
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 660;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      o.stop(ctx.currentTime + 0.2);
    } catch (_) { /* sem áudio */ }
  }

  /* ========== TELAS ========== */

  function renderBoasVindas() {
    nav.hidden = true;
    const jaTem = !!estado.personagemId;
    conteudo.innerHTML = `
      <section class="bemvindo" aria-labelledby="titulo-bemvindo">
        <span class="bemvindo__emoji" aria-hidden="true">🐾</span>
        <h2 id="titulo-bemvindo" class="titulo-tela">Amiguito Virtual</h2>
        <p class="subtitulo">Escolha um amiguinho pra cuidar, ensinar e aprender juntos!</p>
        <div class="personagens" role="list">
          ${DADOS.personagens.map((p) => `
            <button type="button" class="persona ${estado.personagemId === p.id ? "is-escolhida" : ""}"
              data-id="${p.id}" role="listitem" aria-pressed="${estado.personagemId === p.id}">
              <div class="persona__arte persona__arte--${p.id}">${AmiguitoPet.renderSvg(p.id, "feliz")}</div>
              <div>
                <div class="persona__nome">${p.nome}</div>
                <div class="persona__desc">${p.descricao}</div>
              </div>
            </button>
          `).join("")}
        </div>
        ${jaTem ? `
          <p style="margin-top:1.25rem">
            <a class="btn btn--primario btn--bloco" href="#/casa">Continuar com ${personagem().nome}</a>
          </p>
          <div class="painel-config">
            <p>Quer recomeçar do zero?</p>
            <button type="button" class="btn btn--fantasma" id="btn-reset">Apagar progresso</button>
          </div>
        ` : `
          <p class="subtitulo" style="margin-top:1.25rem">Toque num personagem para começar ✨</p>
        `}
      </section>
    `;

    conteudo.querySelectorAll(".persona").forEach((btn) => {
      btn.addEventListener("click", () => escolherPersonagem(btn.dataset.id));
    });
    const reset = $("#btn-reset");
    if (reset) reset.addEventListener("click", confirmarReset);
  }

  function escolherPersonagem(id) {
    if (estado.personagemId && estado.personagemId !== id) {
      if (!confirm("Trocar de amiguito reinicia o carinho e o progresso dele. Continuar?")) return;
      estado = AmiguitoStorage.resetar();
    }
    estado.personagemId = id;
    estado.necessidades = { fome: 80, humor: 80, energia: 80, carinho: 80 };
    estado.ultimaAtualizacao = Date.now();
    desbloquearTrofeu("primeiro-amigo");
    AmiguitoStorage.salvar(estado);
    bip();
    falaAtual = AmiguitoIA.falar(personagem(), "saudacao");
    location.hash = "#/casa";
  }

  function confirmarReset() {
    if (!confirm("Tem certeza? Isso apaga todo o progresso do Amiguito.")) return;
    estado = AmiguitoStorage.resetar();
    AmiguitoStorage.salvar(estado);
    falaAtual = "";
    mostrarToast("Progresso apagado. Escolha de novo!");
    renderBoasVindas();
  }

  function renderCasa() {
    estado = AmiguitoStorage.aplicarDecaimento(estado);
    AmiguitoStorage.salvar(estado);
    const p = personagem();
    const humor = AmiguitoPet.humorDe(estado.necessidades);
    const baixa = AmiguitoPet.necessidadeMaisBaixa(estado.necessidades);
    const precisaAjuda = estado.necessidades[baixa] < 40;

    if (!falaAtual) {
      falaAtual = precisaAjuda
        ? AmiguitoIA.falar(p, "pedido", { necessidade: baixa })
        : AmiguitoIA.falar(p, "saudacao");
    }

    const classeArte = humor === "feliz" ? "is-feliz" : humor === "triste" ? "is-triste" : humor === "dormindo" ? "is-dormindo" : "";

    conteudo.innerHTML = `
      <section aria-labelledby="titulo-casa">
        <div class="nivel" aria-label="Nível ${estado.nivel}">⭐ Nível ${estado.nivel} · ${estado.xp}/${AmiguitoStorage.xpParaNivel(estado.nivel)} XP</div>
        <h2 id="titulo-casa" class="titulo-tela">Casa da ${p.nome}</h2>
        <p class="subtitulo">Cuide bem do seu amiguito!</p>

        <div class="card pet-cena">
          <div class="balao" role="status">
            <span class="balao__rotulo">Amiguito fala</span>
            ${escapar(falaAtual)}
          </div>
          <div class="pet-cena__arte pet-cena__arte--${p.id} ${classeArte} ${animacaoPet}" style="background:linear-gradient(145deg, ${p.cor}55, ${p.cor})">
            ${AmiguitoPet.renderSvg(p.id, humor)}
          </div>
        </div>

        <div class="necessidades" aria-label="Necessidades">
          ${AmiguitoPet.renderBarras(estado.necessidades)}
        </div>

        <div class="acoes" role="group" aria-label="Ações de cuidado">
          <button type="button" class="acao" data-acao="alimentar"><span class="acao__icone" aria-hidden="true">🍎</span>Alimentar</button>
          <button type="button" class="acao" data-acao="brincar"><span class="acao__icone" aria-hidden="true">🎾</span>Brincar</button>
          <button type="button" class="acao" data-acao="dormir"><span class="acao__icone" aria-hidden="true">😴</span>Descansar</button>
          <button type="button" class="acao" data-acao="carinho"><span class="acao__icone" aria-hidden="true">💕</span>Carinho</button>
        </div>
      </section>
    `;

    conteudo.querySelectorAll(".acao").forEach((btn) => {
      btn.addEventListener("click", () => cuidar(btn.dataset.acao));
    });
    animacaoPet = "";
  }

  function cuidar(acao) {
    const n = estado.necessidades;
    const map = {
      alimentar: { fome: 28, humor: 5 },
      brincar: { humor: 28, energia: -8, carinho: 8 },
      dormir: { energia: 35, fome: -5 },
      carinho: { carinho: 30, humor: 12 }
    };
    const delta = map[acao];
    if (!delta) return;

    Object.keys(delta).forEach((k) => {
      n[k] = AmiguitoStorage.clamp(n[k] + delta[k]);
    });

    estado.cuidadosFeitos += 1;
    estado.ultimaAtualizacao = Date.now();
    AmiguitoStorage.ganharXp(estado, 3);

    falaAtual = AmiguitoIA.falar(personagem(), "cuidado", {
      acao,
      listasExtras: { falasCuidado: DADOS.falasCuidado }
    });
    // Ajustar fala genérica do carinho por personagem
    if (acao === "carinho") {
      const carinhoFalas = {
        luna: "Purr… que carinho gostoso!",
        pipoca: "Au! Meu rabinho abanou todo!",
        fogo: "Que abraço quentinho! Obrigada!"
      };
      falaAtual = carinhoFalas[estado.personagemId] || falaAtual;
    }

    animacaoPet = "is-feliz";
    bip();

    if (estado.cuidadosFeitos >= 10) desbloquearTrofeu("cuidador");
    if (n.carinho >= 100) desbloquearTrofeu("coracao-cheio");
    if (estado.nivel >= 5) desbloquearTrofeu("nivel-5");

    AmiguitoStorage.salvar(estado);
    mostrarToast(acao === "alimentar" ? "Nhoc nhoc! 🍎" : acao === "brincar" ? "Que diversão! 🎾" : acao === "dormir" ? "Zzz… 😴" : "Muito amor! 💕");
    renderCasa();
  }

  function renderEnsinar() {
    conteudo.innerHTML = `
      <section aria-labelledby="titulo-ensinar">
        <h2 id="titulo-ensinar" class="titulo-tela">Ensinar</h2>
        <p class="subtitulo">Você ensina o amiguito — e aprende junto!</p>
        <div class="grade-licoes">
          ${DADOS.licoes.map((l) => {
            const feita = estado.licoesCompletas.includes(l.id);
            return `
              <button type="button" class="licao ${feita ? "is-feita" : ""}" data-id="${l.id}">
                <span class="licao__icone licao__icone--${l.tipo}" aria-hidden="true">${l.icone}</span>
                <span>
                  <span class="licao__titulo">${l.titulo}${feita ? " ✓" : ""}</span>
                  <span class="licao__meta">${l.descricao}</span>
                </span>
              </button>
            `;
          }).join("")}
        </div>
      </section>
    `;
    conteudo.querySelectorAll(".licao").forEach((btn) => {
      btn.addEventListener("click", () => {
        location.hash = `#/ensinar/${btn.dataset.id}`;
      });
    });
  }

  function renderJogo(licaoId) {
    const licao = DADOS.licoes.find((l) => l.id === licaoId);
    if (!licao) {
      location.hash = "#/ensinar";
      return;
    }

    if (!jogoAtivo || jogoAtivo.licaoId !== licaoId) {
      jogoAtivo = { licaoId, indice: 0, acertos: 0 };
    }

    if (jogoAtivo.indice >= licao.perguntas.length) {
      finalizarLicao(licao);
      return;
    }

    const pergunta = AmiguitoEnsinar.montarPergunta(licao, jogoAtivo.indice);
    const p = personagem();

    conteudo.innerHTML = `
      <section class="jogo" aria-labelledby="titulo-jogo">
        <p><a class="btn btn--fantasma" href="#/ensinar">← Voltar</a></p>
        <h2 id="titulo-jogo" class="titulo-tela" style="margin-top:1rem">${licao.icone} ${licao.titulo}</h2>
        <p class="subtitulo">Pergunta ${pergunta.indice + 1} de ${pergunta.total}</p>
        <div class="card">
          <div class="balao" style="margin-bottom:1rem">
            <span class="balao__rotulo">Amiguito fala</span>
            Me ensina essa? Eu estou prestando muita atenção!
          </div>
          <p class="jogo__pergunta">${escapar(pergunta.pergunta)}</p>
          <div class="jogo__opcoes" role="group" aria-label="Opções">
            ${pergunta.opcoes.map((op, i) => `
              <button type="button" class="opcao ${op.cor ? "opcao--cor" : ""}" data-i="${i}">
                ${op.cor ? `<span class="cor-swatch" style="background:${op.cor}" aria-hidden="true"></span>` : ""}
                ${escapar(op.texto)}
              </button>
            `).join("")}
          </div>
        </div>
      </section>
    `;

    const botoes = [...conteudo.querySelectorAll(".opcao")];
    botoes.forEach((btn) => {
      btn.addEventListener("click", () => {
        const op = pergunta.opcoes[Number(btn.dataset.i)];
        const certa = AmiguitoEnsinar.verificar(op);
        botoes.forEach((b) => { b.disabled = true; });
        btn.classList.add(certa ? "is-certa" : "is-errada");
        if (certa) {
          jogoAtivo.acertos += 1;
          bip();
          mostrarToast(AmiguitoIA.falar(p, "certo", { listasExtras: DADOS }));
        } else {
          const certaBtn = botoes.find((b, i) => pergunta.opcoes[i].certa);
          if (certaBtn) certaBtn.classList.add("is-certa");
          mostrarToast(AmiguitoIA.falar(p, "errado", { listasExtras: DADOS }));
        }
        setTimeout(() => {
          jogoAtivo.indice += 1;
          renderJogo(licaoId);
        }, 900);
      });
    });
  }

  function finalizarLicao(licao) {
    const p = personagem();
    const nova = !estado.licoesCompletas.includes(licao.id);
    if (nova) estado.licoesCompletas.push(licao.id);
    AmiguitoStorage.ganharXp(estado, 12);
    desbloquearTrofeu("professora");
    if (estado.licoesCompletas.length >= DADOS.licoes.length) desbloquearTrofeu("sabia");
    if (estado.nivel >= 5) desbloquearTrofeu("nivel-5");
    AmiguitoStorage.salvar(estado);

    const fala = AmiguitoIA.falar(p, "elogio");
    conteudo.innerHTML = `
      <section class="jogo" aria-labelledby="fim-licao">
        <div class="card">
          <div style="font-size:3rem;margin-bottom:0.5rem" aria-hidden="true">🎉</div>
          <h2 id="fim-licao" class="titulo-tela">Lição concluída!</h2>
          <p class="subtitulo">Você acertou ${jogoAtivo.acertos} de ${licao.perguntas.length}</p>
          <div class="balao" style="text-align:left;margin:1rem auto;max-width:360px">
            <span class="balao__rotulo">Amiguito fala</span>
            ${escapar(fala)}
          </div>
          <p style="margin-top:1rem">
            <a class="btn btn--primario" href="#/ensinar">Mais lições</a>
            <a class="btn btn--secundario" href="#/casa" style="margin-left:0.5rem">Ir pra casa</a>
          </p>
        </div>
      </section>
    `;
    jogoAtivo = null;
    bip();
  }

  function renderAprender() {
    const p = personagem();
    const dica = AmiguitoAprender.dicaDoDia(DADOS.dicas, estado);
    AmiguitoStorage.salvar(estado);
    const missoes = AmiguitoAprender.missoesDisponiveis(DADOS.missoes, estado.missoesFeitas).slice(0, 3);
    // Se ciclou, mostrar as 3 primeiras não marcadas "hoje" — simplifica: mostra pendentes ou todas

    conteudo.innerHTML = `
      <section aria-labelledby="titulo-aprender">
        <h2 id="titulo-aprender" class="titulo-tela">${p.nome} ensina você</h2>
        <p class="subtitulo">Missões curtinhas e uma dica do dia!</p>

        <div class="dica-dia" role="status">
          <div class="dica-dia__rotulo">💡 Dica do dia</div>
          <p><strong>${escapar(dica)}</strong></p>
        </div>

        <div class="balao" style="margin-bottom:1rem">
          <span class="balao__rotulo">Amiguito fala</span>
          Eu preparei umas missõezinhas pra você. Topa?
        </div>

        ${missoes.map((m) => {
          const feita = estado.missoesFeitas.includes(m.id);
          return `
            <article class="missao">
              <div class="missao__titulo">${m.emoji} ${escapar(m.titulo)}${feita ? " ✓" : ""}</div>
              <p class="missao__texto">${escapar(m.texto)}</p>
              <button type="button" class="btn ${feita ? "btn--fantasma" : "btn--menta"} btn--bloco btn-missao"
                data-id="${m.id}" ${feita ? "disabled" : ""}>
                ${feita ? "Missão feita!" : "Pronto, fiz!"}
              </button>
            </article>
          `;
        }).join("")}
      </section>
    `;

    conteudo.querySelectorAll(".btn-missao:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", () => {
        AmiguitoAprender.completarMissao(estado, btn.dataset.id);
        desbloquearTrofeu("missao-feita");
        if (estado.missoesFeitas.length >= 5) desbloquearTrofeu("missao-mestre");
        if (estado.nivel >= 5) desbloquearTrofeu("nivel-5");
        AmiguitoStorage.salvar(estado);
        falaAtual = AmiguitoIA.falar(p, "elogio");
        bip();
        mostrarToast("Missão completa! ⭐");
        renderAprender();
      });
    });
  }

  function renderTrofeus() {
    const p = personagem();
    conteudo.innerHTML = `
      <section aria-labelledby="titulo-trofeus">
        <h2 id="titulo-trofeus" class="titulo-tela">Troféus</h2>
        <p class="subtitulo">Seus adesivos e conquistas com ${p.nome}</p>

        <div class="stats" aria-label="Estatísticas">
          <div class="stat"><div class="stat__num">${estado.nivel}</div><div class="stat__label">Nível</div></div>
          <div class="stat"><div class="stat__num">${estado.cuidadosFeitos}</div><div class="stat__label">Cuidados</div></div>
          <div class="stat"><div class="stat__num">${estado.licoesCompletas.length + estado.missoesFeitas.length}</div><div class="stat__label">Aprendizados</div></div>
        </div>

        <div class="trofeus-grade" role="list">
          ${DADOS.trofeus.map((t) => {
            const ok = estado.trofeus.includes(t.id);
            return `
              <div class="trofeu ${ok ? "is-desbloqueado" : ""}" role="listitem"
                aria-label="${t.nome}${ok ? ", desbloqueado" : ", bloqueado"}">
                <span class="trofeu__icone" aria-hidden="true">${ok ? t.icone : "🔒"}</span>
                <div class="trofeu__nome">${escapar(t.nome)}</div>
                <div class="trofeu__desc">${escapar(t.desc)}</div>
              </div>
            `;
          }).join("")}
        </div>

        <div class="painel-config">
          <p>Começar de novo com outro amiguito?</p>
          <a class="btn btn--fantasma" href="#/">Trocar personagem</a>
        </div>
      </section>
    `;
  }

  function escapar(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
