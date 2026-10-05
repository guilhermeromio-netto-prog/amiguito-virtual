/* Amiguito Pro — SPA hash · byGui */
(function () {
  "use strict";

  let DADOS = null;
  let estado = null;
  let falaAtual = "";
  let animacaoPet = "";
  let jogoAtivo = null;
  let yogaTimer = null;
  let pendenteRota = null; // { rotaId, passoId }

  const conteudo = document.getElementById("conteudo");
  const nav = document.getElementById("nav-principal");
  const btnSom = document.getElementById("btn-som");
  const toastEl = document.getElementById("toast");
  const streakBadge = document.getElementById("streak-badge");
  const confete = document.getElementById("confete");

  async function iniciar() {
    try {
      const res = await fetch("dados.json", { cache: "no-store" });
      if (!res.ok) throw new Error("dados " + res.status);
      DADOS = await res.json();
    } catch (e) {
      conteudo.innerHTML = `<div class="card vazio"><span class="vazio__icone">😿</span><p>Não consegui carregar o Amiguito Pro. Recarregue a página.</p></div>`;
      return;
    }
    estado = AmiguitoStorage.aplicarDecaimento(AmiguitoStorage.carregar());
    AmiguitoStorage.salvar(estado);
    atualizarChrome();
    btnSom.addEventListener("click", alternarSom);
    window.addEventListener("hashchange", rotear);
    rotear();
    setInterval(() => {
      if (!estado.personagemId) return;
      estado = AmiguitoStorage.aplicarDecaimento(estado);
      AmiguitoStorage.salvar(estado);
      if (rotaAtual() === "casa") renderCasa();
    }, 60000);
  }

  function rotaAtual() {
    return (location.hash || "#/").replace(/^#\/?/, "").split("?")[0] || "";
  }

  function partesRota() {
    return rotaAtual().split("/").filter(Boolean);
  }

  function rotear() {
    if (!DADOS) return;
    if (yogaTimer) { clearInterval(yogaTimer); yogaTimer = null; }
    const r = rotaAtual();
    const p = partesRota();
    if (!estado.personagemId && r && r !== "inicio") {
      location.hash = "#/";
      return;
    }
    nav.hidden = !estado.personagemId;
    destacarNav(p[0] || "casa");
    atualizarChrome();

    if (!estado.personagemId || !r || r === "inicio") return renderBoasVindas();
    if (p[0] === "casa") return renderCasa();
    if (p[0] === "brincar" && p[1]) return renderJogo(p[1]);
    if (p[0] === "brincar") return renderBrincar();
    if (p[0] === "roteiros" && p[1]) return renderRota(p[1]);
    if (p[0] === "roteiros") return renderRoteiros();
    if (p[0] === "mais") return renderMais();
    if (p[0] === "ensinar" && p[1]) return renderLicao(p[1], !!p[2]);
    if (p[0] === "ensinar") return renderEnsinar();
    if (p[0] === "aprender") return renderAprender();
    if (p[0] === "yoga" && p[1]) return renderYogaPose(p[1]);
    if (p[0] === "yoga") return renderYoga();
    if (p[0] === "canto") return renderCanto();
    if (p[0] === "trofeus") return renderTrofeus();
    location.hash = "#/casa";
  }

  function destacarNav(base) {
    const map = { casa: "casa", brincar: "brincar", roteiros: "roteiros", mais: "mais", ensinar: "mais", aprender: "mais", yoga: "mais", trofeus: "mais", canto: "mais" };
    const alvo = map[base] || "casa";
    nav.querySelectorAll(".nav__item").forEach((a) => a.classList.toggle("is-ativo", a.dataset.rota === alvo));
  }

  function personagem() {
    return DADOS.personagens.find((x) => x.id === estado.personagemId);
  }

  function nomeExibir() {
    return estado.nomePet || (personagem() && personagem().nome) || "Amiguito";
  }

  function atualizarChrome() {
    btnSom.setAttribute("aria-pressed", String(!!estado.somAtivo));
    btnSom.setAttribute("aria-label", estado.somAtivo ? "Desativar sons" : "Ativar sons");
    btnSom.innerHTML = `<span aria-hidden="true">${estado.somAtivo ? "🔊" : "🔇"}</span>`;
    if (estado.personagemId && estado.streak > 0) {
      streakBadge.hidden = false;
      streakBadge.textContent = `🔥 ${estado.streak}d`;
    } else streakBadge.hidden = true;
  }

  function desbloquearTrofeu(id) {
    if (estado.trofeus.includes(id)) return;
    estado.trofeus.push(id);
    const t = DADOS.trofeus.find((x) => x.id === id);
    if (t) {
      mostrarToast(`Troféu: ${t.icone} ${t.nome}!`);
      celebrar();
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

  function celebrar() {
    confete.innerHTML = "";
    ["🎉", "⭐", "💖", "✨", "🌟", "🎈"].forEach((e, i) => {
      const s = document.createElement("span");
      s.textContent = e;
      s.style.left = (10 + Math.random() * 80) + "%";
      s.style.animationDelay = (i * 60) + "ms";
      confete.appendChild(s);
      setTimeout(() => s.remove(), 1800);
    });
  }

  function alternarSom() {
    estado.somAtivo = !estado.somAtivo;
    AmiguitoStorage.salvar(estado);
    atualizarChrome();
    if (estado.somAtivo) bip(660);
  }

  function bip(freq) {
    if (!estado.somAtivo) return;
    try {
      const ctx = bip._ctx || (bip._ctx = new (window.AudioContext || window.webkitAudioContext)());
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq || 660;
      g.gain.value = 0.045;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      o.stop(ctx.currentTime + 0.18);
    } catch (_) {}
  }

  function escapar(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function linkVoltar(href, label) {
    return `<p class="voltar"><a class="btn btn--fantasma btn--sm" href="${href}">← ${label || "Voltar"}</a></p>`;
  }

  /* ===== Boas-vindas ===== */
  function renderBoasVindas() {
    nav.hidden = true;
    const ja = !!estado.personagemId;
    conteudo.innerHTML = `
      <section class="bemvindo" aria-labelledby="t-bv">
        <span class="selo-pro">✨ Amiguito Pro</span>
        <span class="bemvindo__emoji" aria-hidden="true">🐾</span>
        <h2 id="t-bv" class="titulo-tela">Oi! Vamos brincar?</h2>
        <p class="subtitulo">Escolha um amiguinho, dê um nome e cuidem, brinquem e aprendam juntos!</p>
        <div class="personagens" role="list">
          ${DADOS.personagens.map((p) => `
            <button type="button" class="persona ${estado.personagemId === p.id ? "is-escolhida" : ""}" data-id="${p.id}" role="listitem">
              <div class="persona__arte persona__arte--${p.id}">${AmiguitoPet.renderSvg(p.id, "feliz", [])}</div>
              <div><div class="persona__nome">${p.nome}</div><div class="persona__desc">${p.descricao}</div></div>
            </button>`).join("")}
        </div>
        <div class="campo-nome">
          <label for="nome-pet">Nome do amiguito (opcional)</label>
          <input id="nome-pet" maxlength="12" autocomplete="off" placeholder="Ex: Mel, Bolt, Lua"
            value="${escapar(estado.nomePet || "")}" aria-describedby="nome-ajuda">
          <p id="nome-ajuda" class="subtitulo" style="margin:0.4rem 0 0;font-size:0.8rem">Máximo 12 letrinhas. Pode deixar o nome original!</p>
        </div>
        ${ja ? `
          <p style="margin-top:1.1rem"><a class="btn btn--primario btn--bloco" href="#/casa">Continuar com ${escapar(nomeExibir())}</a></p>
          <div class="painel-config"><p>Recomeçar do zero?</p>
            <button type="button" class="btn btn--fantasma" id="btn-reset">Apagar progresso</button></div>
        ` : `
          <p style="margin-top:1.1rem"><button type="button" class="btn btn--primario btn--bloco" id="btn-comecar" disabled>Escolha um amiguito ✨</button></p>
        `}
      </section>`;

    let escolhido = estado.personagemId;
    const input = conteudo.querySelector("#nome-pet");
    const btnStart = conteudo.querySelector("#btn-comecar");

    conteudo.querySelectorAll(".persona").forEach((btn) => {
      btn.addEventListener("click", () => {
        escolhido = btn.dataset.id;
        conteudo.querySelectorAll(".persona").forEach((b) => b.classList.toggle("is-escolhida", b.dataset.id === escolhido));
        if (btnStart) btnStart.disabled = false;
        bip(720);
      });
    });

    function aplicarEscolha() {
      const nome = (input.value || "").trim().slice(0, 12);
      if (estado.personagemId && estado.personagemId !== escolhido) {
        if (!confirm("Trocar de amiguito reinicia o carinho dele. Continuar?")) return;
        const som = estado.somAtivo;
        estado = AmiguitoStorage.resetar();
        estado.somAtivo = som;
      }
      estado.personagemId = escolhido;
      if (nome) {
        estado.nomePet = nome;
        desbloquearTrofeu("nomeada");
      }
      estado.necessidades = { fome: 85, humor: 85, energia: 85, carinho: 85 };
      estado.ultimaAtualizacao = Date.now();
      desbloquearTrofeu("primeiro-amigo");
      if (estado.streak >= 3) desbloquearTrofeu("streak-3");
      AmiguitoStorage.salvar(estado);
      falaAtual = AmiguitoIA.falar(personagem(), "saudacao");
      bip();
      location.hash = "#/casa";
    }

    if (btnStart) btnStart.addEventListener("click", () => { if (escolhido) aplicarEscolha(); });
    // Se já tem personagem e mudou só o nome
    if (ja) {
      input.addEventListener("change", () => {
        estado.nomePet = (input.value || "").trim().slice(0, 12);
        if (estado.nomePet) desbloquearTrofeu("nomeada");
        AmiguitoStorage.salvar(estado);
        mostrarToast("Nome salvo!");
      });
    }
    const reset = conteudo.querySelector("#btn-reset");
    if (reset) reset.addEventListener("click", () => {
      if (!confirm("Apagar todo o progresso?")) return;
      estado = AmiguitoStorage.resetar();
      AmiguitoStorage.salvar(estado);
      falaAtual = "";
      mostrarToast("Progresso apagado!");
      renderBoasVindas();
    });
  }

  /* ===== Casa ===== */
  function renderCasa() {
    estado = AmiguitoStorage.aplicarDecaimento(estado);
    AmiguitoStorage.salvar(estado);
    const p = personagem();
    const humor = AmiguitoPet.humorDe(estado.necessidades);
    const baixa = AmiguitoPet.necessidadeMaisBaixa(estado.necessidades);
    if (!falaAtual) {
      falaAtual = estado.necessidades[baixa] < 40
        ? AmiguitoIA.falar(p, "pedido", { necessidade: baixa })
        : AmiguitoIA.falar(p, "saudacao");
    }
    const classe = humor === "feliz" || humor === "empolgado" ? "is-feliz" : humor === "triste" ? "is-triste" : humor === "dormindo" ? "is-dormindo" : "";
    const extra = animacaoPet === "is-empolgado" ? "is-empolgado" : animacaoPet;

    conteudo.innerHTML = `
      <section aria-labelledby="t-casa">
        <span class="selo-pro">✨ Amiguito Pro</span>
        <div class="nivel">⭐ Nível ${estado.nivel} · ${estado.xp}/${AmiguitoStorage.xpParaNivel(estado.nivel)} XP</div>
        <h2 id="t-casa" class="titulo-tela">Casa d${/a$/i.test(nomeExibir()) || nomeExibir() === "Luna" ? "a" : "o"} ${escapar(nomeExibir())}</h2>
        <p class="subtitulo">Cuide com carinho — sessões curtidas são perfeitas!</p>
        <div class="balao" role="status"><span class="balao__rotulo">Amiguito fala</span>${escapar(falaAtual)}</div>
        ${AmiguitoPet.renderQuarto(AmiguitoPet.renderSvg(p.id, humor, estado.acessorios), `${classe} ${extra}`, p.cor)}
        <div class="necessidades">${AmiguitoPet.renderBarras(estado.necessidades)}</div>
        <div class="acoes" role="group" aria-label="Cuidar">
          <button type="button" class="acao" data-acao="alimentar"><span class="acao__icone" aria-hidden="true">🍎</span>Alimentar</button>
          <button type="button" class="acao" data-acao="brincar"><span class="acao__icone" aria-hidden="true">🎾</span>Brincar</button>
          <button type="button" class="acao" data-acao="dormir"><span class="acao__icone" aria-hidden="true">😴</span>Descansar</button>
          <button type="button" class="acao" data-acao="carinho"><span class="acao__icone" aria-hidden="true">💕</span>Carinho</button>
        </div>
        <p style="margin-top:0.9rem"><a class="btn btn--secundario btn--bloco" href="#/roteiros">🗺️ Ver roteiros de hoje</a></p>
      </section>`;

    conteudo.querySelectorAll(".acao").forEach((b) => b.addEventListener("click", () => cuidar(b.dataset.acao)));
    animacaoPet = "";
  }

  function cuidar(acao) {
    const n = estado.necessidades;
    const map = {
      alimentar: { fome: 30, humor: 6 },
      brincar: { humor: 30, energia: -8, carinho: 8 },
      dormir: { energia: 38, fome: -4 },
      carinho: { carinho: 32, humor: 14 }
    };
    const delta = map[acao];
    if (!delta) return;
    Object.keys(delta).forEach((k) => { n[k] = AmiguitoStorage.clamp(n[k] + delta[k]); });
    estado.cuidadosFeitos += 1;
    estado.ultimaAtualizacao = Date.now();
    AmiguitoStorage.ganharXp(estado, 3);
    const carinhoFalas = { luna: "Purr… que carinho gostoso!", pipoca: "Au! Meu rabinho abanou todo!", fogo: "Que abraço quentinho!" };
    falaAtual = acao === "carinho" ? carinhoFalas[estado.personagemId] : AmiguitoIA.falar(personagem(), "cuidado", { acao, listasExtras: { falasCuidado: DADOS.falasCuidado } });
    animacaoPet = acao === "carinho" ? "is-empolgado" : "is-feliz";
    bip(acao === "carinho" ? 880 : 660);
    if (acao === "carinho") setTimeout(() => AmiguitoPet.soltarParticulas(["💖", "💕", "✨", "⭐"]), 50);
    if (estado.cuidadosFeitos >= 10) desbloquearTrofeu("cuidador");
    if (n.carinho >= 100) desbloquearTrofeu("coracao-cheio");
    if (estado.nivel >= 5) desbloquearTrofeu("nivel-5");
    if (estado.streak >= 3) desbloquearTrofeu("streak-3");
    AmiguitoStorage.salvar(estado);
    maybeCompletarPassoCuidado(acao);
    mostrarToast(acao === "alimentar" ? "Nhoc nhoc! 🍎" : acao === "brincar" ? "Que diversão! 🎾" : acao === "dormir" ? "Zzz… 😴" : "Muito amor! 💕");
    renderCasa();
  }

  function maybeCompletarPassoCuidado(acao) {
    if (!pendenteRota) return;
    const rota = DADOS.roteiros.find((r) => r.id === pendenteRota.rotaId);
    if (!rota) return;
    const passo = rota.passos.find((p) => p.id === pendenteRota.passoId);
    if (passo && passo.tipo === "cuidado") {
      AmiguitoRoteiros.marcarPasso(estado, pendenteRota.rotaId, pendenteRota.passoId, rota.passos);
      if (AmiguitoStorage.progressoRota(estado, pendenteRota.rotaId).completo) desbloquearTrofeu("roteiro");
      AmiguitoStorage.salvar(estado);
      mostrarToast("Passo do roteiro ✔");
      pendenteRota = null;
    }
  }

  /* ===== Brincar ===== */
  function renderBrincar() {
    conteudo.innerHTML = `
      <section aria-labelledby="t-br">
        <h2 id="t-br" class="titulo-tela">Brincar</h2>
        <p class="subtitulo">Minigames rápidos e cheios de elogios!</p>
        <div class="grade-cards">
          ${DADOS.jogos.map((j) => `
            <a class="card-link" href="#/brincar/${j.id}">
              <span class="card-link__icone ${j.cor}" aria-hidden="true">${j.icone}</span>
              <span><span class="card-link__titulo">${j.titulo}</span>
              <span class="card-link__meta">${j.desc}</span></span>
            </a>`).join("")}
        </div>
      </section>`;
  }

  function renderJogo(id) {
    const meta = DADOS.jogos.find((j) => j.id === id);
    if (!meta) { location.hash = "#/brincar"; return; }
    const p = personagem();
    conteudo.innerHTML = `
      <section aria-labelledby="t-jg">
        ${linkVoltar("#/brincar", "Jogos")}
        <h2 id="t-jg" class="titulo-tela">${meta.icone} ${meta.titulo}</h2>
        <p class="subtitulo">${meta.desc}</p>
        <div id="jogo-root"></div>
      </section>`;
    const root = document.getElementById("jogo-root");
    const onDone = (res) => {
      if (root._cleanup) root._cleanup();
      AmiguitoJogos.registrarJogo(estado, id);
      if (estado.jogosJogados.length >= 3) desbloquearTrofeu("jogadora");
      AmiguitoStorage.ganharXp(estado, 4);
      AmiguitoStorage.salvar(estado);
      bip(880);
      celebrar();
      mostrarToast(res.msg || "Mandou bem!");
      completarPassoSeJogo(id);
      root.innerHTML = `<div class="card" style="text-align:center">
        <div style="font-size:2.5rem">🎉</div>
        <p class="titulo-tela" style="font-size:1.25rem">${escapar(res.msg || "Você conseguiu!")}</p>
        <div class="balao" style="text-align:left;margin:0.75rem 0"><span class="balao__rotulo">Amiguito fala</span>${escapar(AmiguitoIA.falar(p, "elogio"))}</div>
        <a class="btn btn--primario" href="#/brincar">Mais jogos</a>
        <a class="btn btn--fantasma" href="#/casa" style="margin-left:0.4rem">Casa</a>
      </div>`;
    };

    if (id === "alimentar") AmiguitoJogos.montarAlimentar(root, onDone);
    else if (id === "bolhas") AmiguitoJogos.montarBolhas(root, onDone);
    else if (id === "esconde") AmiguitoJogos.montarEsconde(root, onDone, p.emoji);
    else if (id === "memoria") AmiguitoJogos.montarMemoria(root, onDone, false);
    else if (id === "danca") AmiguitoJogos.montarDanca(root, onDone);
    else if (id === "fantasia") {
      AmiguitoJogos.montarFantasia(root, (res) => {
        AmiguitoStorage.salvar(estado);
        onDone(res);
      }, estado, DADOS, (acc) => AmiguitoPet.renderSvg(p.id, "feliz", acc));
    } else location.hash = "#/brincar";
  }

  function completarPassoSeJogo(jogoId) {
    if (!pendenteRota) return;
    const rota = DADOS.roteiros.find((r) => r.id === pendenteRota.rotaId);
    if (!rota) return;
    const passo = rota.passos.find((x) => x.id === pendenteRota.passoId);
    if (passo && passo.tipo === "jogo" && passo.ref === jogoId) {
      AmiguitoRoteiros.marcarPasso(estado, pendenteRota.rotaId, pendenteRota.passoId, rota.passos);
      if (AmiguitoStorage.progressoRota(estado, pendenteRota.rotaId).completo) desbloquearTrofeu("roteiro");
      AmiguitoStorage.salvar(estado);
      pendenteRota = null;
    }
  }

  /* ===== Ensinar / Inglês ===== */
  function renderEnsinar() {
    conteudo.innerHTML = `
      <section aria-labelledby="t-en">
        ${linkVoltar("#/mais", "Mais")}
        <h2 id="t-en" class="titulo-tela">Ensinar</h2>
        <p class="subtitulo">Você ensina o amiguito — e aprende junto! Tem inglês também 🌍</p>
        <div class="dicas-idioma" role="group" aria-label="Dicas de idioma">
          <button type="button" class="chip ${estado.idiomaDica === "pt" ? "is-ativo" : ""}" data-idioma="pt">PT</button>
          <button type="button" class="chip ${estado.idiomaDica === "en" ? "is-ativo" : ""}" data-idioma="en">EN</button>
          <button type="button" class="chip ${estado.idiomaDica === "ambos" ? "is-ativo" : ""}" data-idioma="ambos">PT + EN</button>
        </div>
        <div class="grade-cards">
          ${DADOS.licoes.map((l) => {
            const feita = estado.licoesCompletas.includes(l.id);
            return `<a class="card-link" href="#/ensinar/${l.id}">
              <span class="card-link__icone licao__icone--${l.tipo} bg-${l.tipo === "ingles" ? "lavanda" : l.tipo === "cores" ? "rosa" : l.tipo === "numeros" ? "ceu" : l.tipo === "gentileza" ? "sol" : "menta"}" aria-hidden="true">${l.icone}</span>
              <span><span class="card-link__titulo">${l.titulo}${feita ? " ✓" : ""}</span>
              <span class="card-link__meta">${l.descricao}</span></span>
            </a>`;
          }).join("")}
          <a class="card-link" href="#/canto">
            <span class="card-link__icone bg-sol" aria-hidden="true">🎤</span>
            <span><span class="card-link__titulo">Cantinho Hello!</span>
            <span class="card-link__meta">Repita palavrinhas em inglês</span></span>
          </a>
        </div>
      </section>`;
    conteudo.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => {
      estado.idiomaDica = c.dataset.idioma;
      AmiguitoStorage.salvar(estado);
      renderEnsinar();
    }));
  }

  function renderLicao(licaoId, desafio) {
    const licao = DADOS.licoes.find((l) => l.id === licaoId);
    if (!licao) { location.hash = "#/ensinar"; return; }
    if (!jogoAtivo || jogoAtivo.licaoId !== licaoId || jogoAtivo.desafio !== !!desafio) {
      jogoAtivo = { licaoId, indice: 0, acertos: 0, desafio: !!desafio };
    }
    const total = desafio ? Math.min(6, licao.perguntas.length + 2) : licao.perguntas.length;
    if (jogoAtivo.indice >= total) return finalizarLicao(licao, desafio);

    const pergunta = AmiguitoEnsinar.montarPergunta(licao, jogoAtivo.indice, desafio);
    const idioma = estado.idiomaDica || "pt";
    let tituloP = pergunta.pergunta;
    let hint = "";
    if (idioma === "en" && pergunta.perguntaEn) tituloP = pergunta.perguntaEn;
    if (idioma === "ambos" && pergunta.perguntaEn) hint = pergunta.perguntaEn;

    conteudo.innerHTML = `
      <section class="jogo" aria-labelledby="t-jogo">
        ${linkVoltar("#/ensinar", "Lições")}
        <h2 id="t-jogo" class="titulo-tela">${licao.icone} ${licao.titulo}${desafio ? " · Desafio" : ""}</h2>
        <p class="subtitulo">Pergunta ${jogoAtivo.indice + 1} de ${total}</p>
        <div class="card">
          <div class="balao" style="margin-bottom:0.85rem;text-align:left">
            <span class="balao__rotulo">Amiguito fala</span>
            Me ensina essa? Estou prestando muita atenção!
          </div>
          <p class="jogo__pergunta">${escapar(tituloP)}${hint ? `<span class="hint-en">${escapar(hint)}</span>` : ""}</p>
          <div class="jogo__opcoes" role="group" aria-label="Opções">
            ${pergunta.opcoes.map((op, i) => {
              let label = op.texto;
              if (idioma === "en" && op.textoEn) label = op.textoEn;
              if (idioma === "ambos" && op.textoEn) label = `${op.texto} · ${op.textoEn}`;
              return `<button type="button" class="opcao ${op.cor ? "opcao--cor" : ""}" data-i="${i}">
                ${op.cor ? `<span class="cor-swatch" style="background:${op.cor}" aria-hidden="true"></span>` : ""}
                ${escapar(label)}
              </button>`;
            }).join("")}
          </div>
          ${desafio ? "" : `<p style="margin-top:0.85rem"><a class="btn btn--fantasma btn--sm" href="#/ensinar/${licaoId}/desafio">Modo desafio (opcional)</a></p>`}
        </div>
      </section>`;

    const botoes = [...conteudo.querySelectorAll(".opcao")];
    botoes.forEach((btn) => btn.addEventListener("click", () => {
      const op = pergunta.opcoes[Number(btn.dataset.i)];
      const certa = AmiguitoEnsinar.verificar(op);
      botoes.forEach((b) => { b.disabled = true; });
      btn.classList.add(certa ? "is-certa" : "is-errada");
      if (certa) {
        jogoAtivo.acertos += 1;
        bip(880);
        mostrarToast(AmiguitoIA.falar(personagem(), "certo", { listasExtras: DADOS }));
      } else {
        const certaBtn = botoes.find((b, i) => pergunta.opcoes[i].certa);
        if (certaBtn) certaBtn.classList.add("is-certa");
        mostrarToast(AmiguitoIA.falar(personagem(), "errado", { listasExtras: DADOS }));
      }
      setTimeout(() => { jogoAtivo.indice += 1; renderLicao(licaoId, desafio); }, 850);
    }));
  }

  function finalizarLicao(licao, desafio) {
    const nova = !estado.licoesCompletas.includes(licao.id);
    if (nova) estado.licoesCompletas.push(licao.id);
    AmiguitoStorage.ganharXp(estado, desafio ? 16 : 12);
    desbloquearTrofeu("professora");
    if (licao.tipo === "ingles") desbloquearTrofeu("bilingue");
    if (estado.licoesCompletas.length >= 4) desbloquearTrofeu("sabia");
    if (estado.nivel >= 5) desbloquearTrofeu("nivel-5");
    // rota
    if (pendenteRota) {
      const rota = DADOS.roteiros.find((r) => r.id === pendenteRota.rotaId);
      const passo = rota && rota.passos.find((x) => x.id === pendenteRota.passoId);
      if (passo && (passo.tipo === "licao" || passo.tipo === "desafio") && passo.ref === licao.id) {
        AmiguitoRoteiros.marcarPasso(estado, pendenteRota.rotaId, pendenteRota.passoId, rota.passos);
        if (AmiguitoStorage.progressoRota(estado, pendenteRota.rotaId).completo) desbloquearTrofeu("roteiro");
        pendenteRota = null;
      }
    }
    AmiguitoStorage.salvar(estado);
    celebrar();
    bip(988);
    const total = desafio ? Math.min(6, licao.perguntas.length + 2) : licao.perguntas.length;
    conteudo.innerHTML = `
      <section class="jogo">
        <div class="card">
          <div style="font-size:3rem" aria-hidden="true">🎉</div>
          <h2 class="titulo-tela">Lição concluída!</h2>
          <p class="subtitulo">Você acertou ${jogoAtivo.acertos} de ${total}. ${escapar(nomeExibir())} está orgulhoso(a)!</p>
          <div class="balao" style="text-align:left;margin:1rem auto;max-width:360px">
            <span class="balao__rotulo">Amiguito fala</span>${escapar(AmiguitoIA.falar(personagem(), "elogio"))}
          </div>
          <a class="btn btn--primario" href="#/ensinar">Mais lições</a>
          <a class="btn btn--secundario" href="#/casa" style="margin-left:0.4rem">Casa</a>
        </div>
      </section>`;
    jogoAtivo = null;
  }

  function renderCanto() {
    let i = 0;
    const frases = DADOS.callResponse;
    function paint() {
      const f = frases[i % frases.length];
      conteudo.innerHTML = `
        <section class="jogo" aria-labelledby="t-canto">
          ${linkVoltar("#/ensinar", "Lições")}
          <h2 id="t-canto" class="titulo-tela">🎤 Cantinho Hello!</h2>
          <p class="subtitulo">${escapar(f.dica)}</p>
          <div class="card">
            <p style="font-size:2.2rem;font-weight:900;margin:1rem 0">${escapar(f.en)}</p>
            <button type="button" class="btn btn--sol btn--bloco" id="btn-repita">Eu repeti! 👏</button>
            <button type="button" class="btn btn--fantasma btn--bloco" id="btn-prox" style="margin-top:0.5rem">Próxima palavrinha</button>
          </div>
        </section>`;
      conteudo.querySelector("#btn-repita").addEventListener("click", () => {
        bip(784);
        mostrarToast("Hello, estrela! 🌟");
        AmiguitoStorage.ganharXp(estado, 2);
        if (pendenteRota) {
          const rota = DADOS.roteiros.find((r) => r.id === pendenteRota.rotaId);
          const passo = rota && rota.passos.find((x) => x.id === pendenteRota.passoId);
          if (passo && passo.tipo === "canto") {
            AmiguitoRoteiros.marcarPasso(estado, pendenteRota.rotaId, pendenteRota.passoId, rota.passos);
            if (AmiguitoStorage.progressoRota(estado, pendenteRota.rotaId).completo) desbloquearTrofeu("roteiro");
            pendenteRota = null;
            mostrarToast("Passo do roteiro ✔");
          }
        }
        AmiguitoStorage.salvar(estado);
      });
      conteudo.querySelector("#btn-prox").addEventListener("click", () => { i += 1; paint(); });
    }
    paint();
  }

  /* ===== Yoga ===== */
  function renderYoga() {
    conteudo.innerHTML = `
      <section aria-labelledby="t-yo">
        ${linkVoltar("#/mais", "Mais")}
        <h2 id="t-yo" class="titulo-tela">Yoga Suave</h2>
        <p class="subtitulo">Poses de animal pra alongar e respirar. É brincadeira — pare se sentir desconforto. Não é orientação médica.</p>
        <div class="grade-cards">
          ${DADOS.yoga.map((y) => `
            <a class="card-link" href="#/yoga/${y.id}">
              <span class="card-link__icone bg-menta" aria-hidden="true">${y.emoji}</span>
              <span><span class="card-link__titulo">${y.nome}</span>
              <span class="card-link__meta">${y.segundos}s · toque pra começar</span></span>
            </a>`).join("")}
        </div>
      </section>`;
  }

  function renderYogaPose(id) {
    const pose = DADOS.yoga.find((y) => y.id === id);
    if (!pose) { location.hash = "#/yoga"; return; }
    let resto = pose.segundos;
    conteudo.innerHTML = `
      <section aria-labelledby="t-pose">
        ${linkVoltar("#/yoga", "Poses")}
        <h2 id="t-pose" class="titulo-tela">${pose.emoji} ${pose.nome}</h2>
        <div class="yoga-pose">
          ${AmiguitoYoga.svgPose(pose.id)}
          <p style="font-weight:800;margin:0.5rem 0 0.75rem">${escapar(pose.instrucao)}</p>
          <div class="timer-anel" id="timer" style="--progresso:0%"><span id="timer-num">${resto}</span></div>
          <button type="button" class="btn btn--menta" id="btn-yoga-start">Começar respiração</button>
          <p class="subtitulo" style="margin-top:0.75rem;font-size:0.8rem">Brincadeira suave. Pare se sentir desconforto. Não é orientação médica.</p>
        </div>
      </section>`;

    const timerEl = conteudo.querySelector("#timer");
    const numEl = conteudo.querySelector("#timer-num");
    conteudo.querySelector("#btn-yoga-start").addEventListener("click", (ev) => {
      ev.target.disabled = true;
      ev.target.textContent = "Respirando…";
      yogaTimer = setInterval(() => {
        resto -= 1;
        const pct = Math.round(((pose.segundos - resto) / pose.segundos) * 100);
        timerEl.style.setProperty("--progresso", pct + "%");
        numEl.textContent = String(Math.max(0, resto));
        if (resto <= 0) {
          clearInterval(yogaTimer);
          yogaTimer = null;
          if (!estado.yogaFeitas.includes(pose.id)) estado.yogaFeitas.push(pose.id);
          AmiguitoStorage.ganharXp(estado, 6);
          if (estado.yogaFeitas.length >= 3) desbloquearTrofeu("yogi");
          if (pendenteRota) {
            const rota = DADOS.roteiros.find((r) => r.id === pendenteRota.rotaId);
            const passo = rota && rota.passos.find((x) => x.id === pendenteRota.passoId);
            if (passo && passo.tipo === "yoga" && passo.ref === pose.id) {
              AmiguitoRoteiros.marcarPasso(estado, pendenteRota.rotaId, pendenteRota.passoId, rota.passos);
              if (AmiguitoStorage.progressoRota(estado, pendenteRota.rotaId).completo) desbloquearTrofeu("roteiro");
              pendenteRota = null;
            }
          }
          AmiguitoStorage.salvar(estado);
          bip(660);
          celebrar();
          mostrarToast("Pose concluída! 🧘");
          ev.target.textContent = "Feito com carinho ✨";
        }
      }, 1000);
    });
  }

  /* ===== Roteiros ===== */
  function renderRoteiros() {
    conteudo.innerHTML = `
      <section aria-labelledby="t-rot">
        <h2 id="t-rot" class="titulo-tela">Roteiros</h2>
        <p class="subtitulo">Caminhos curtinhos pra mentes afiadas de 3–4 anos. Um passo de cada vez!</p>
        <div class="grade-cards">
          ${DADOS.roteiros.map((r) => {
            const prog = AmiguitoStorage.progressoRota(estado, r.id);
            const p = AmiguitoRoteiros.pct(prog, r.passos.length);
            return `<a class="card-link" href="#/roteiros/${r.id}">
              <span class="card-link__icone ${r.cor}" aria-hidden="true">${r.icone}</span>
              <span style="flex:1">
                <span class="card-link__titulo">${r.titulo}${prog.completo ? " ✓" : ""}</span>
                <span class="card-link__meta">${r.desc}</span>
                <div class="rota-progresso" aria-label="${p}% completo"><i style="width:${p}%"></i></div>
              </span>
            </a>`;
          }).join("")}
        </div>
      </section>`;
  }

  function renderRota(id) {
    const rota = DADOS.roteiros.find((r) => r.id === id);
    if (!rota) { location.hash = "#/roteiros"; return; }
    const prog = AmiguitoStorage.progressoRota(estado, id);
    const p = AmiguitoRoteiros.pct(prog, rota.passos.length);
    conteudo.innerHTML = `
      <section aria-labelledby="t-rota">
        ${linkVoltar("#/roteiros", "Roteiros")}
        <h2 id="t-rota" class="titulo-tela">${rota.icone} ${rota.titulo}</h2>
        <p class="subtitulo">${rota.desc}</p>
        <div class="rota-progresso" aria-label="${p}%"><i style="width:${p}%"></i></div>
        <div class="passos">
          ${rota.passos.map((passo) => {
            const st = AmiguitoRoteiros.estadoPasso(prog, rota.passos, passo.id);
            const cls = st === "feito" ? "is-feito" : st === "atual" ? "is-atual" : "is-bloqueado";
            const stars = "⭐".repeat(passo.estrelas || 1);
            return `<div class="passo ${cls}">
              <div class="passo__num">${st === "feito" ? "✓" : rota.passos.indexOf(passo) + 1}</div>
              <div>
                <div style="font-weight:900">${escapar(passo.titulo)}</div>
                <div class="estrelas" aria-label="${passo.estrelas} estrelas">${stars}</div>
              </div>
              ${st === "atual" ? `<button type="button" class="btn btn--primario btn--sm btn-passo" data-id="${passo.id}">Ir</button>`
                : st === "feito" ? `<span class="estrelas">✔</span>`
                : `<span aria-hidden="true">🔒</span>`}
            </div>`;
          }).join("")}
        </div>
        ${prog.completo ? `<div class="card" style="margin-top:1rem;text-align:center"><div style="font-size:2rem">🏆</div><p class="titulo-tela" style="font-size:1.2rem">Roteiro completo!</p></div>` : ""}
      </section>`;

    conteudo.querySelectorAll(".btn-passo").forEach((b) => b.addEventListener("click", () => {
      const passo = rota.passos.find((x) => x.id === b.dataset.id);
      if (!passo) return;
      pendenteRota = { rotaId: id, passoId: passo.id };
      if (passo.tipo === "licao") location.hash = `#/ensinar/${passo.ref}`;
      else if (passo.tipo === "desafio") location.hash = `#/ensinar/${passo.ref}/desafio`;
      else if (passo.tipo === "jogo") location.hash = `#/brincar/${passo.ref}`;
      else if (passo.tipo === "yoga") location.hash = `#/yoga/${passo.ref}`;
      else if (passo.tipo === "canto") location.hash = "#/canto";
      else if (passo.tipo === "cuidado") location.hash = "#/casa";
      else if (passo.tipo === "missao") {
        // completa direto com confirmação fofa
        if (confirm(passo.titulo + "\n\nQuando fizer, toque OK!")) {
          AmiguitoRoteiros.marcarPasso(estado, id, passo.id, rota.passos);
          if (!estado.missoesFeitas.includes(passo.ref)) estado.missoesFeitas.push(passo.ref);
          if (AmiguitoStorage.progressoRota(estado, id).completo) desbloquearTrofeu("roteiro");
          desbloquearTrofeu("missao-feita");
          AmiguitoStorage.salvar(estado);
          pendenteRota = null;
          celebrar();
          renderRota(id);
        }
      }
    }));
  }

  /* ===== Mais / Aprender / Troféus ===== */
  function renderMais() {
    conteudo.innerHTML = `
      <section aria-labelledby="t-mais">
        <h2 id="t-mais" class="titulo-tela">Mais</h2>
        <p class="subtitulo">Lições, missões, yoga e troféus</p>
        <div class="grade-cards">
          <a class="card-link" href="#/ensinar"><span class="card-link__icone bg-lavanda" aria-hidden="true">📚</span>
            <span><span class="card-link__titulo">Ensinar & Inglês</span><span class="card-link__meta">Cores, números, Hello!</span></span></a>
          <a class="card-link" href="#/aprender"><span class="card-link__icone bg-sol" aria-hidden="true">✨</span>
            <span><span class="card-link__titulo">${escapar(nomeExibir())} ensina você</span><span class="card-link__meta">Missões e dica do dia</span></span></a>
          <a class="card-link" href="#/yoga"><span class="card-link__icone bg-menta" aria-hidden="true">🧘</span>
            <span><span class="card-link__titulo">Yoga Suave</span><span class="card-link__meta">Poses de animal</span></span></a>
          <a class="card-link" href="#/trofeus"><span class="card-link__icone bg-rosa" aria-hidden="true">🏆</span>
            <span><span class="card-link__titulo">Troféus</span><span class="card-link__meta">Adesivos e conquistas</span></span></a>
          <a class="card-link" href="#/"><span class="card-link__icone bg-ceu" aria-hidden="true">🐾</span>
            <span><span class="card-link__titulo">Trocar / nome</span><span class="card-link__meta">Personagem e apelido</span></span></a>
        </div>
      </section>`;
  }

  function renderAprender() {
    const p = personagem();
    const dica = AmiguitoAprender.dicaDoDia(DADOS.dicas, estado);
    AmiguitoStorage.salvar(estado);
    const missoes = AmiguitoAprender.missoesDisponiveis(DADOS.missoes, estado.missoesFeitas).slice(0, 3);
    conteudo.innerHTML = `
      <section aria-labelledby="t-ap">
        ${linkVoltar("#/mais", "Mais")}
        <h2 id="t-ap" class="titulo-tela">${escapar(nomeExibir())} ensina você</h2>
        <p class="subtitulo">Missõezinhas e uma dica do dia!</p>
        <div class="dica-dia"><div class="dica-dia__rotulo">💡 Dica do dia</div><p><strong>${escapar(dica)}</strong></p></div>
        <div class="balao" style="margin-bottom:1rem"><span class="balao__rotulo">Amiguito fala</span>Preparei missõezinhas pra você. Topa?</div>
        ${missoes.map((m) => {
          const feita = estado.missoesFeitas.includes(m.id);
          return `<article class="missao">
            <div class="missao__titulo">${m.emoji} ${escapar(m.titulo)}${feita ? " ✓" : ""}</div>
            <p class="missao__texto">${escapar(m.texto)}</p>
            <button type="button" class="btn ${feita ? "btn--fantasma" : "btn--menta"} btn--bloco btn-missao" data-id="${m.id}" ${feita ? "disabled" : ""}>
              ${feita ? "Missão feita!" : "Pronto, fiz!"}
            </button>
          </article>`;
        }).join("")}
      </section>`;
    conteudo.querySelectorAll(".btn-missao:not([disabled])").forEach((btn) => btn.addEventListener("click", () => {
      AmiguitoAprender.completarMissao(estado, btn.dataset.id);
      desbloquearTrofeu("missao-feita");
      if (estado.missoesFeitas.length >= 5) desbloquearTrofeu("missao-mestre");
      if (pendenteRota) {
        const rota = DADOS.roteiros.find((r) => r.id === pendenteRota.rotaId);
        const passo = rota && rota.passos.find((x) => x.id === pendenteRota.passoId);
        if (passo && passo.tipo === "missao") {
          AmiguitoRoteiros.marcarPasso(estado, pendenteRota.rotaId, pendenteRota.passoId, rota.passos);
          if (AmiguitoStorage.progressoRota(estado, pendenteRota.rotaId).completo) desbloquearTrofeu("roteiro");
          pendenteRota = null;
        }
      }
      AmiguitoStorage.salvar(estado);
      bip();
      celebrar();
      mostrarToast("Missão completa! ⭐");
      renderAprender();
    }));
  }

  function renderTrofeus() {
    conteudo.innerHTML = `
      <section aria-labelledby="t-tr">
        ${linkVoltar("#/mais", "Mais")}
        <h2 id="t-tr" class="titulo-tela">Troféus</h2>
        <p class="subtitulo">Adesivos e conquistas com ${escapar(nomeExibir())}</p>
        <div class="stats">
          <div class="stat"><div class="stat__num">${estado.nivel}</div><div class="stat__label">Nível</div></div>
          <div class="stat"><div class="stat__num">${estado.streak}</div><div class="stat__label">Dias</div></div>
          <div class="stat"><div class="stat__num">${estado.trofeus.length}</div><div class="stat__label">Troféus</div></div>
        </div>
        <div class="trofeus-grade" role="list">
          ${DADOS.trofeus.map((t) => {
            const ok = estado.trofeus.includes(t.id);
            return `<div class="trofeu ${ok ? "is-desbloqueado" : ""}" role="listitem" aria-label="${t.nome}${ok ? ", desbloqueado" : ", bloqueado"}">
              <span class="trofeu__icone" aria-hidden="true">${ok ? t.icone : "🔒"}</span>
              <div class="trofeu__nome">${escapar(t.nome)}</div>
              <div class="trofeu__desc">${escapar(t.desc)}</div>
            </div>`;
          }).join("")}
        </div>
        <div class="painel-config">
          <p>Começar de novo?</p>
          <a class="btn btn--fantasma" href="#/">Trocar personagem</a>
        </div>
      </section>`;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
