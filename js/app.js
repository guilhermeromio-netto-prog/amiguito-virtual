/* Amiguito Pro · Missão Espacial · byGui */
(function () {
  "use strict";
  let DADOS = null, estado = null, falaAtual = "", animacaoPet = "", jogoAtivo = null, yogaTimer = null, pendenteRota = null;
  const conteudo = document.getElementById("conteudo");
  const nav = document.getElementById("nav-principal");
  const btnSom = document.getElementById("btn-som");
  const toastEl = document.getElementById("toast");
  const streakBadge = document.getElementById("streak-badge");
  const confete = document.getElementById("confete");
  const btnFalar = document.getElementById("btn-falar");
  const btnFiguras = document.getElementById("btn-figuras");
  const guiaSeta = document.getElementById("guia-seta");
  let ultimaFala = "";
  let guiaAlvoSel = null;

  async function iniciar() {
    try {
      const res = await fetch("dados.json", { cache: "no-store" });
      if (!res.ok) throw new Error("dados");
      DADOS = await res.json();
    } catch (e) {
      conteudo.innerHTML = `<div class="card" style="text-align:center;padding:2rem"><img src="img/astronauta-guia.png" width="96" height="96" alt="Menina astronauta dando joinha"><p style="margin-top:1rem">Não consegui carregar. Recarregue a página.</p></div>`;
      return;
    }
    estado = AmiguitoStorage.aplicarDecaimento(AmiguitoStorage.carregar());
    window.AmiguitoEstado = estado;
    AmiguitoStorage.salvar(estado);
    aplicarModoFiguras();
    atualizarChrome();
    btnSom.addEventListener("click", alternarSom);
    if (btnFiguras) btnFiguras.addEventListener("click", alternarFiguras);
    if (btnFalar) btnFalar.addEventListener("click", () => {
      // gesto do usuário — essencial no iOS
      if (!estado.somAtivo) {
        estado.somAtivo = true;
        AmiguitoStorage.salvar(estado);
        atualizarChrome();
      }
      AmiguitoFala.falar(ultimaFala || "Amiguito Pro", { force: true });
    });
    window.addEventListener("hashchange", rotear);
    // desbloquear vozes
    if (window.speechSynthesis) speechSynthesis.getVoices();
    rotear();
    setInterval(() => {
      if (!estado.personagemId) return;
      estado = AmiguitoStorage.aplicarDecaimento(estado);
      window.AmiguitoEstado = estado;
      AmiguitoStorage.salvar(estado);
      if (rotaAtual() === "casa") renderCasa();
    }, 60000);
  }

  function rotaAtual() { return (location.hash || "#/").replace(/^#\/?/, "").split("?")[0] || ""; }
  function partes() { return rotaAtual().split("/").filter(Boolean); }

  function rotear() {
    if (!DADOS) return;
    if (yogaTimer) { clearInterval(yogaTimer); yogaTimer = null; }
    const p = partes();
    const r = rotaAtual();
    if (p[0] === "adulto") { atualizarChrome(); return renderAdulto(); }
    if (!estado.personagemId && r && r !== "inicio" && r !== "adulto") { location.hash = "#/"; return; }
    nav.hidden = !estado.personagemId;
    destacarNav(p[0] || "casa");
    atualizarChrome();
    if (typeof esconderGuia === "function") esconderGuia();
    conteudo.classList.remove("is-transicao");
    void conteudo.offsetWidth;
    conteudo.classList.add("is-transicao");

    if (p[0] === "ler" && p[1]) return renderLer(p[1]);
    if (p[0] === "ler") return renderLerHub();

    if (!estado.personagemId || !r || r === "inicio") return renderBoasVindas();
    if (p[0] === "casa") return renderCasa();
    if (p[0] === "brincar" && p[1]) return renderJogo(p[1]);
    if (p[0] === "brincar") return renderBrincar();
    if (p[0] === "aprender-hub") return renderAprenderHub();
    if (p[0] === "stem" && p[1] === "atividade" && p[2]) return renderStemAtividade(p[2]);
    if (p[0] === "stem" && p[1] === "rota" && p[2]) return renderRota(p[2]);
    if (p[0] === "stem") return renderStemHub();
    if (p[0] === "roteiros" && p[1]) return renderRota(p[1]);
    if (p[0] === "roteiros") return renderStemHub();
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
    const map = { casa:"casa", brincar:"brincar", stem:"stem", "aprender-hub":"stem", roteiros:"stem", mais:"mais", ensinar:"mais", aprender:"mais", yoga:"mais", trofeus:"mais", canto:"mais", ler:"stem" };
    const alvo = map[base] || "casa";
    nav.querySelectorAll(".nav__item").forEach((a) => a.classList.toggle("is-ativo", a.dataset.rota === alvo));
  }

  function personagem() { return DADOS.personagens.find((x) => x.id === estado.personagemId); }
  function nomeExibir() { return estado.nomePet || (personagem() && personagem().nome) || "Amiguinho"; }

  function atualizarChrome() {
    window.AmiguitoEstado = estado;
    aplicarModoFiguras();
    btnSom.setAttribute("aria-pressed", String(!!estado.somAtivo));
    btnSom.setAttribute("aria-label", estado.somAtivo ? "Desativar sons" : "Ativar sons");
    btnSom.innerHTML = `<span aria-hidden="true">${estado.somAtivo ? "🔊" : "🔇"}</span>`;
    AmiguitoSom.syncBgm(!!estado.somAtivo);
    if (estado.personagemId && estado.streak > 0) {
      streakBadge.hidden = false;
      streakBadge.textContent = `🔥 ${estado.streak}d`;
    } else streakBadge.hidden = true;
  }

  function desbloquearTrofeu(id) {
    if (estado.trofeus.includes(id)) return;
    estado.trofeus.push(id);
    const t = DADOS.trofeus.find((x) => x.id === id);
    if (t) { mostrarToast(`Troféu: ${t.icone} ${t.nome}!`); celebrar(); AmiguitoSom.nivel(); }
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
    ["🎉","⭐","💖","✨","🚀","🌟"].forEach((e, i) => {
      const s = document.createElement("span");
      s.textContent = e;
      s.style.left = (8 + Math.random() * 84) + "%";
      s.style.animationDelay = (i * 50) + "ms";
      confete.appendChild(s);
      setTimeout(() => s.remove(), 1800);
    });
  }

  function alternarSom() {
    estado.somAtivo = !estado.somAtivo;
    AmiguitoStorage.salvar(estado);
    atualizarChrome();
    if (estado.somAtivo) {
      AmiguitoSom.sucesso();
      AmiguitoFala.falar(ultimaFala || "Som ligado", { force: true });
    } else {
      AmiguitoFala.cancelar();
      AmiguitoSom.stopBgm();
    }
  }

  function escapar(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function linkVoltar(href, label) {
    return `<p class="voltar"><a class="btn btn--fantasma btn--sm" href="${href}">← ${label || "Voltar"}</a></p>`;
  }
  function guia(txt) {
    return `<div class="guia-chip"><img src="img/astronauta-guia.png" width="56" height="56" alt="Menina astronauta dando joinha"><div><strong>Guia espacial</strong><p>${escapar(txt)}</p></div>
      <button type="button" class="btn btn--icone" data-fala="${escapar(txt)}" aria-label="Ouvir guia" id="btn-guia-ouvir">🗣️</button></div>`;
  }

  /* ===== Welcome ===== */
  function renderBoasVindas() {
    nav.hidden = true;
    desbloquearTrofeu("astronauta");
    estado.viuHero = true;
    AmiguitoStorage.salvar(estado);
    const ja = !!estado.personagemId;
    const stars = Array.from({length:12},(_,i)=>`<span class="estrela-fundo" style="left:${5+i*8}%;top:${8+(i%4)*18}%;animation-delay:${i*.15}s">✦</span>`).join("");
    conteudo.innerHTML = `
      <section aria-labelledby="t-bv">
        <div class="hero">
          <div class="hero__ceu">${stars}</div>
          <img class="hero__img" src="img/astronauta.png" width="220" height="248" alt="Menina astronauta dando joinha">
          <h2 id="t-bv" class="hero__titulo">Amiguito Pro</h2>
          <p class="hero__sub">Missão espacial de cuidar, brincar e aprender!</p>
        </div>
        <span class="selo-pro">✨ Tudo liberado · Pro</span>
        ${guia("Escolhe um amiguinho da tripulação. Depois a gente explora matemática, ciência, inglês e robôs!")}
        <div class="personagens" role="list">
          ${DADOS.personagens.map((p) => `
            <button type="button" class="persona ${estado.personagemId===p.id?"is-escolhida":""}" data-id="${p.id}" role="listitem" style="--c:${p.cor}">
              <div class="persona__arte" style="background:linear-gradient(145deg,${p.cor}55,${p.cor})">${AmiguitoPet.renderSvg(p.id,"feliz",[])}</div>
              <div><div class="persona__nome">${p.nome}</div><div class="persona__desc">${p.descricao}</div></div>
            </button>`).join("")}
        </div>
        <div class="campo-nome">
          <label for="nome-pet">Apelido do amiguinho (opcional)</label>
          <input id="nome-pet" maxlength="12" autocomplete="off" placeholder="Ex: Cometa, Nina, Blue" value="${escapar(estado.nomePet||"")}">
        </div>
        ${ja ? `
          <p style="margin-top:1rem"><a class="btn btn--primario btn--bloco" href="#/casa">Continuar missão com ${escapar(nomeExibir())}</a></p>
          <div class="painel-config"><p>Recomeçar do zero?</p><button type="button" class="btn btn--fantasma" id="btn-reset">Apagar progresso</button></div>
        ` : `<p style="margin-top:1rem"><button type="button" class="btn btn--primario btn--bloco" id="btn-comecar" disabled>Escolha a tripulação 🚀</button></p>`}
      </section>`;

    let escolhido = estado.personagemId;
    const input = conteudo.querySelector("#nome-pet");
    const btnStart = conteudo.querySelector("#btn-comecar");
    conteudo.querySelectorAll(".persona").forEach((btn) => btn.addEventListener("click", () => {
      escolhido = btn.dataset.id;
      conteudo.querySelectorAll(".persona").forEach((b) => b.classList.toggle("is-escolhida", b.dataset.id === escolhido));
      if (btnStart) btnStart.disabled = false;
      AmiguitoSom.tap();
    }));

    function aplicar() {
      const nome = (input.value || "").trim().slice(0, 12);
      if (estado.personagemId && estado.personagemId !== escolhido) {
        if (!confirm("Trocar de amiguinho reinicia o carinho dele. Continuar?")) return;
        const som = estado.somAtivo;
        estado = AmiguitoStorage.resetar();
        estado.somAtivo = som;
        estado.viuHero = true;
      }
      estado.personagemId = escolhido;
      if (nome) { estado.nomePet = nome; desbloquearTrofeu("nomeada"); }
      estado.necessidades = { humor: 85, energia: 85, carinho: 85, diversao: 85 };
      estado.ultimaAtualizacao = Date.now();
      desbloquearTrofeu("primeiro-amigo");
      desbloquearTrofeu("astronauta");
      if (estado.streak >= 3) desbloquearTrofeu("streak-3");
      AmiguitoStorage.salvar(estado);
      falaAtual = AmiguitoIA.falar(personagem(), "saudacao");
      AmiguitoSom.sucesso();
      location.hash = "#/casa";
    }
    if (btnStart) btnStart.addEventListener("click", () => { if (escolhido) aplicar(); });
    if (ja) input.addEventListener("change", () => {
      estado.nomePet = (input.value || "").trim().slice(0, 12);
      if (estado.nomePet) desbloquearTrofeu("nomeada");
      AmiguitoStorage.salvar(estado);
      mostrarToast("Nome salvo!");
    });
    const reset = conteudo.querySelector("#btn-reset");
    if (reset) reset.addEventListener("click", () => {
      if (!confirm("Apagar todo o progresso?")) return;
      estado = AmiguitoStorage.resetar();
      AmiguitoStorage.salvar(estado);
      falaAtual = "";
      mostrarToast("Progresso apagado!");
      renderBoasVindas();
    });
    posRender("Bem-vinda ao Amiguito Pro! Escolha um amiguinho na tela.", ".persona");
  }

  /* ===== Casa / Base ===== */
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
        <span class="selo-pro">✨ Base Espacial · Pro</span>
        <div class="nivel">⭐ Nível ${estado.nivel} · ${estado.xp}/${AmiguitoStorage.xpParaNivel(estado.nivel)} XP</div>
        <h2 id="t-casa" class="titulo-tela">Base d${nomeExibir().endsWith("a") || ["Rumi","Zoe","Mira","Emily"].includes(nomeExibir()) ? "a" : "o"} ${escapar(nomeExibir())}</h2>
        ${guia("Toque nos botões pra cuidar. Depois partimos pras missões STEM!")}
        <div class="balao" role="status"><span class="balao__rotulo">Amiguito fala</span>${escapar(falaAtual)}</div>
        ${AmiguitoPet.renderQuarto(AmiguitoPet.renderSvg(p.id, humor, estado.acessorios), `${classe} ${extra}`)}
        <div class="necessidades">${AmiguitoPet.renderBarras(estado.necessidades)}</div>
        <div class="acoes" role="group" aria-label="Cuidar">
          <button type="button" class="acao" data-acao="brincar"><span class="acao__icone" aria-hidden="true">🎮</span>Brincar</button>
          <button type="button" class="acao" data-acao="diversao"><span class="acao__icone" aria-hidden="true">🎉</span>Diversão</button>
          <button type="button" class="acao" data-acao="dormir"><span class="acao__icone" aria-hidden="true">😴</span>Descansar</button>
          <button type="button" class="acao" data-acao="carinho"><span class="acao__icone" aria-hidden="true">💕</span>Carinho</button>
        </div>
        <p style="margin-top:0.9rem"><a class="btn btn--primario btn--bloco" href="#/aprender-hub" data-fala="Aprender">🚀 Aprender</a></p>
      </section>`;
    conteudo.querySelectorAll(".acao").forEach((b) => {
      b.setAttribute("data-fala", b.textContent.trim());
      b.addEventListener("click", () => cuidar(b.dataset.acao));
    });
    animacaoPet = "";
    posRender("Base espacial. Cuide do amiguinho.", ".acao[data-acao=\"carinho\"]");
  }

  function cuidar(acao) {
    const n = estado.necessidades;
    const map = {
      brincar: { humor: 28, energia: -6, diversao: 20, carinho: 6 },
      diversao: { diversao: 32, humor: 16 },
      dormir: { energia: 38, diversao: -4 },
      carinho: { carinho: 34, humor: 14 }
    };
    const delta = map[acao];
    if (!delta) return;
    Object.keys(delta).forEach((k) => { n[k] = AmiguitoStorage.clamp(n[k] + delta[k]); });
    estado.cuidadosFeitos += 1;
    estado.ultimaAtualizacao = Date.now();
    AmiguitoStorage.ganharXp(estado, 3);
    falaAtual = AmiguitoIA.falar(personagem(), "cuidado", { acao: acao === "diversao" ? "diversao" : acao, listasExtras: { falasCuidado: DADOS.falasCuidado } });
    if (acao === "carinho") falaAtual = "High-five espacial! 💖";
    animacaoPet = acao === "carinho" ? "is-empolgado" : "is-feliz";
    if (acao === "carinho") { AmiguitoSom.carinho(); setTimeout(() => AmiguitoPet.soltarParticulas(["💖","⭐","✨","🚀"]), 40); }
    else AmiguitoSom.tap();
    if (estado.cuidadosFeitos >= 10) desbloquearTrofeu("cuidador");
    if (n.carinho >= 100) desbloquearTrofeu("coracao-cheio");
    if (estado.nivel >= 5) desbloquearTrofeu("nivel-5");
    if (estado.streak >= 3) desbloquearTrofeu("streak-3");
    AmiguitoStorage.salvar(estado);
    if (pendenteRota) {
      const rota = DADOS.roteiros.find((r) => r.id === pendenteRota.rotaId);
      const passo = rota && rota.passos.find((x) => x.id === pendenteRota.passoId);
      if (passo && passo.tipo === "cuidado") {
        AmiguitoRoteiros.marcarPasso(estado, pendenteRota.rotaId, pendenteRota.passoId, rota.passos);
        if (AmiguitoStorage.progressoRota(estado, pendenteRota.rotaId).completo) desbloquearTrofeu("roteiro");
        AmiguitoStorage.salvar(estado);
        pendenteRota = null;
        mostrarToast("Passo do roteiro ✔");
      }
    }
    mostrarToast(acao === "carinho" ? "Muito amor! 💕" : acao === "dormir" ? "Zzz… 😴" : "Que diversão! 🎉");
    renderCasa();
  }

  /* ===== Brincar ===== */
  function renderBrincar() {
    conteudo.innerHTML = `
      <section aria-labelledby="t-br">
        <h2 id="t-br" class="titulo-tela">Brincar</h2>
        ${guia("Minigames rápidos pra aquecer os motores!")}
        <div class="grade-cards">
          ${DADOS.jogos.map((j) => `
            <a class="card-link" href="#/brincar/${j.id}" data-fala="${j.titulo}" aria-label="${j.titulo}">
              <span class="card-link__icone ${j.cor}" aria-hidden="true">${j.icone}</span>
              <span><span class="card-link__titulo">${j.titulo}</span><span class="card-link__meta">${j.desc}</span></span>
            </a>`).join("")}
        </div>
      </section>`;
    posRender("Brincar. Escolha um jogo.", ".card-link");
  }

  function renderJogo(id) {
    const meta = DADOS.jogos.find((j) => j.id === id);
    if (!meta) { location.hash = "#/brincar"; return; }
    const p = personagem();
    conteudo.innerHTML = `
      <section aria-labelledby="t-jg">
        ${linkVoltar("#/brincar","Jogos")}
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
      AmiguitoSom.sucesso();
      celebrar();
      mostrarToast(res.msg || "Mandou bem!");
      completarPassoTipo("jogo", id);
      root.innerHTML = `<div class="card" style="text-align:center">
        <div style="font-size:2.5rem">🎉</div>
        <p class="titulo-tela" style="font-size:1.25rem">${escapar(res.msg || "Você conseguiu!")}</p>
        <div class="balao" style="text-align:left;margin:0.75rem 0"><span class="balao__rotulo">Amiguito fala</span>${escapar(AmiguitoIA.falar(p,"elogio"))}</div>
        <a class="btn btn--primario" href="#/brincar">Mais jogos</a>
        <a class="btn btn--fantasma" href="#/casa" style="margin-left:0.4rem">Base</a>
      </div>`;
    };
    if (id === "alimentar") AmiguitoJogos.montarAlimentar(root, onDone);
    else if (id === "bolhas") AmiguitoJogos.montarBolhas(root, onDone);
    else if (id === "esconde") AmiguitoJogos.montarEsconde(root, onDone, p.emoji);
    else if (id === "memoria") AmiguitoJogos.montarMemoria(root, onDone, false);
    else if (id === "danca") AmiguitoJogos.montarDanca(root, onDone);
    else if (id === "fantasia") {
      AmiguitoJogos.montarFantasia(root, (res) => { AmiguitoStorage.salvar(estado); onDone(res); }, estado, DADOS, (acc) => AmiguitoPet.renderSvg(p.id, "feliz", acc));
    } else location.hash = "#/brincar";
  }

  function completarPassoTipo(tipo, ref) {
    if (!pendenteRota) return;
    const rota = DADOS.roteiros.find((r) => r.id === pendenteRota.rotaId);
    if (!rota) return;
    const passo = rota.passos.find((x) => x.id === pendenteRota.passoId);
    if (passo && passo.tipo === tipo && passo.ref === ref) {
      AmiguitoRoteiros.marcarPasso(estado, pendenteRota.rotaId, pendenteRota.passoId, rota.passos);
      if (AmiguitoStorage.progressoRota(estado, pendenteRota.rotaId).completo) desbloquearTrofeu("roteiro");
      AmiguitoStorage.salvar(estado);
      pendenteRota = null;
    }
  }

  /* ===== STEM Hub ===== */
  function renderStemHub() {
    conteudo.innerHTML = `
      <section aria-labelledby="t-stem">
        <h2 id="t-stem" class="titulo-tela">Missões STEM</h2>
        ${guia("Temas e roteiros. Comece pelo hub Aprender!")}
        <p style="margin-bottom:0.75rem"><a class="btn btn--primario btn--bloco" href="#/aprender-hub" data-fala="Hub Aprender">🎨 Hub Aprender</a></p>
        <div class="grade-cards" style="margin-bottom:0.85rem">
          <a class="card-link destaque-guia" href="#/ler" data-fala="Quero ler" aria-label="Quero ler">
            <span class="card-link__icone bg-rosa" aria-hidden="true">🔤</span>
            <span><span class="card-link__titulo">Quero ler</span><span class="card-link__meta">Letras e figurinhas com áudio</span></span>
          </a>
        </div>
        <h3 style="font-size:1rem;margin:0.5rem 0">Roteiros</h3>
        <div class="grade-cards">
          ${DADOS.roteiros.map((r) => {
            const prog = AmiguitoStorage.progressoRota(estado, r.id);
            const pct = AmiguitoRoteiros.pct(prog, r.passos.length);
            return `<a class="card-link" href="#/stem/rota/${r.id}">
              <span class="card-link__icone ${r.cor}" aria-hidden="true">${r.icone}</span>
              <span style="flex:1"><span class="card-link__titulo">${r.titulo}${prog.completo?" ✓":""}</span>
              <span class="card-link__meta">${r.desc}</span>
              <div class="rota-progresso" aria-label="${pct}%"><i style="width:${pct}%"></i></div></span>
            </a>`;
          }).join("")}
        </div>
        <h3 style="font-size:1rem;margin:1.1rem 0 0.5rem">Atividades rápidas</h3>
        <div class="grade-cards">
          ${DADOS.stemAtividades.map((a) => `
            <a class="card-link" href="#/stem/atividade/${a.id}" data-fala="${a.titulo}" aria-label="${a.titulo}">
              <span class="card-link__icone bg-lavanda" aria-hidden="true">${a.icone}</span>
              <span><span class="card-link__titulo">${a.titulo}</span>
              <span class="card-link__meta">${a.desc} · ${a.trilha}</span></span>
            </a>`).join("")}
        </div>
      </section>`;
    posRender("Missões. Toque em Quero ler ou num roteiro.", "a[href=\"#/ler\"]");
  }

  function renderStemAtividade(id) {
    const meta = DADOS.stemAtividades.find((a) => a.id === id);
    if (!meta) { location.hash = "#/stem"; return; }
    conteudo.innerHTML = `
      <section>
        ${linkVoltar("#/stem","Missões")}
        <h2 class="titulo-tela">${meta.icone} ${meta.titulo}</h2>
        <p class="subtitulo">${meta.desc}</p>
        <div class="progresso-missao" aria-hidden="true"><i style="width:15%"></i></div>
        <div id="stem-root"></div>
      </section>`;
    const root = document.getElementById("stem-root");
    const onStemDone = (res) => {
      if (!estado.stemFeitas.includes(id)) estado.stemFeitas.push(id);
      AmiguitoStorage.ganharXp(estado, 8);
      const trilha = res.trilha || res.tema || "";
      if (trilha === "tech") desbloquearTrofeu("programadora");
      if (trilha === "matematica") desbloquearTrofeu("matematica");
      if (trilha === "ciencia") desbloquearTrofeu("cientista");
      if (trilha === "ingles") desbloquearTrofeu("bilingue");
      if (trilha === "geo" || id.startsWith("geo-")) desbloquearTrofeu("geografa");
      completarPassoTipo("stem", id);
      AmiguitoStorage.salvar(estado);
      AmiguitoSom.sucesso();
      celebrar();
      AmiguitoPet.soltarParticulas(["⭐","🌍","🎉","✨"]);
      anunciar(res.msg);
      mostrarToast(res.msg);
      const bar = conteudo.querySelector(".progresso-missao > i");
      if (bar) bar.style.width = "100%";
      root.innerHTML = `<div class="card" style="text-align:center;margin-top:0.75rem">
        <div style="font-size:2.5rem">🚀</div>
        <p class="titulo-tela" style="font-size:1.2rem">${escapar(res.msg)}</p>
        ${guia("Mandou bem! Quer outra?")}
        <div class="replay-bar"><button type="button" class="btn btn--sol btn--sm" data-fala="${escapar(res.msg)}" id="btn-replay-stem">🗣️</button></div>
        <a class="btn btn--primario" href="#/aprender-hub" data-fala="Aprender">Mais</a>
      </div>`;
      const br = root.querySelector("#btn-replay-stem");
      if (br) br.addEventListener("click", () => AmiguitoFala.falar(res.msg, { force: true }));
      posRender(res.msg, "a.btn--primario");
    };
    if (id.startsWith("geo-") && window.AmiguitoGeo) AmiguitoGeo.montar(id, root, onStemDone);
    else AmiguitoStem.montar(id, root, onStemDone);
    posRender(meta.titulo + ". Ouça e toque.", null); // atividades: sem seta sobre respostas
  }

  function renderRota(id) {
    const rota = DADOS.roteiros.find((r) => r.id === id);
    if (!rota) { location.hash = "#/stem"; return; }
    const prog = AmiguitoStorage.progressoRota(estado, id);
    const pct = AmiguitoRoteiros.pct(prog, rota.passos.length);
    conteudo.innerHTML = `
      <section>
        ${linkVoltar("#/stem","Missões")}
        <h2 class="titulo-tela">${rota.icone} ${rota.titulo}</h2>
        <p class="subtitulo">${rota.desc}</p>
        <div class="rota-progresso"><i style="width:${pct}%"></i></div>
        <div class="passos">
          ${rota.passos.map((passo, idx) => {
            const st = AmiguitoRoteiros.estadoPasso(prog, rota.passos, passo.id);
            const cls = st === "feito" ? "is-feito" : st === "atual" ? "is-atual" : "is-bloqueado";
            return `<div class="passo ${cls}">
              <div class="passo__num">${st==="feito"?"✓":idx+1}</div>
              <div><div style="font-weight:900">${escapar(passo.titulo)}</div>
              <div class="estrelas">${"⭐".repeat(passo.estrelas||1)}</div></div>
              ${st==="atual"?`<button type="button" class="btn btn--primario btn--sm btn-passo" data-id="${passo.id}">Ir</button>`:st==="feito"?`<span>✔</span>`:`<span aria-hidden="true">🔒</span>`}
            </div>`;
          }).join("")}
        </div>
        ${prog.completo?`<div class="card" style="margin-top:1rem;text-align:center"><div style="font-size:2rem">🏆</div><p class="titulo-tela" style="font-size:1.2rem">Roteiro completo!</p></div>`:""}
      </section>`;
    conteudo.querySelectorAll(".btn-passo").forEach((b) => b.addEventListener("click", () => {
      const passo = rota.passos.find((x) => x.id === b.dataset.id);
      if (!passo) return;
      pendenteRota = { rotaId: id, passoId: passo.id };
      AmiguitoSom.tap();
      if (passo.tipo === "licao") location.hash = `#/ensinar/${passo.ref}`;
      else if (passo.tipo === "desafio") location.hash = `#/ensinar/${passo.ref}/desafio`;
      else if (passo.tipo === "jogo") location.hash = `#/brincar/${passo.ref}`;
      else if (passo.tipo === "yoga") location.hash = `#/yoga/${passo.ref}`;
      else if (passo.tipo === "canto") location.hash = "#/canto";
      else if (passo.tipo === "cuidado") location.hash = "#/casa";
      else if (passo.tipo === "stem") location.hash = `#/stem/atividade/${passo.ref}`;
      else if (passo.tipo === "missao") {
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

  /* ===== Ensinar / Yoga / etc — same patterns ===== */
  function renderMais() {
    conteudo.innerHTML = `
      <section>
        <h2 class="titulo-tela">Mais</h2>
        ${guia("Lições, missões do dia, yoga e troféus da tripulação.")}
        <div class="grade-cards">
          <a class="card-link" href="#/ler" data-fala="Quero ler" aria-label="Quero ler"><span class="card-link__icone bg-rosa" aria-hidden="true">🔤</span><span><span class="card-link__titulo">Quero ler</span><span class="card-link__meta">Letras e áudio</span></span></a>
          <a class="card-link" href="#/ensinar" data-fala="Ensinar"><span class="card-link__icone bg-lavanda" aria-hidden="true">📚</span><span><span class="card-link__titulo">Ensinar & Inglês</span><span class="card-link__meta">Lições + desafio</span></span></a>
          <a class="card-link" href="#/aprender"><span class="card-link__icone bg-sol" aria-hidden="true">✨</span><span><span class="card-link__titulo">${escapar(nomeExibir())} ensina</span><span class="card-link__meta">Missões do dia</span></span></a>
          <a class="card-link" href="#/yoga"><span class="card-link__icone bg-menta" aria-hidden="true">🧘</span><span><span class="card-link__titulo">Yoga Suave</span><span class="card-link__meta">Poses calmas</span></span></a>
          <a class="card-link" href="#/trofeus"><span class="card-link__icone bg-rosa" aria-hidden="true">🏆</span><span><span class="card-link__titulo">Troféus</span><span class="card-link__meta">Conquistas</span></span></a>
          <a class="card-link" href="#/" data-fala="Tripulação"><span class="card-link__icone bg-espaco" aria-hidden="true">👩‍🚀</span><span><span class="card-link__titulo">Tripulação</span><span class="card-link__meta">Trocar amiguinho</span></span></a>
        </div>
      </section>`;
    posRender("Mais opções. Quero ler fica no alto.", "a[href=\"#/ler\"]");
  }

  function renderEnsinar() {
    conteudo.innerHTML = `
      <section>
        ${linkVoltar("#/mais","Mais")}
        <h2 class="titulo-tela">Ensinar</h2>
        <div class="dicas-idioma" role="group" aria-label="Idioma">
          <button type="button" class="chip ${estado.idiomaDica==="pt"?"is-ativo":""}" data-idioma="pt">PT</button>
          <button type="button" class="chip ${estado.idiomaDica==="en"?"is-ativo":""}" data-idioma="en">EN</button>
          <button type="button" class="chip ${estado.idiomaDica==="ambos"?"is-ativo":""}" data-idioma="ambos">PT+EN</button>
        </div>
        <div class="grade-cards">
          ${DADOS.licoes.map((l) => {
            const feita = estado.licoesCompletas.includes(l.id);
            return `<a class="card-link" href="#/ensinar/${l.id}">
              <span class="card-link__icone bg-lavanda" aria-hidden="true">${l.icone}</span>
              <span><span class="card-link__titulo">${l.titulo}${feita?" ✓":""}</span><span class="card-link__meta">${l.descricao}</span></span>
            </a>`;
          }).join("")}
          <a class="card-link" href="#/canto"><span class="card-link__icone bg-sol" aria-hidden="true">🎤</span>
            <span><span class="card-link__titulo">Cantinho Hello!</span><span class="card-link__meta">Repita palavrinhas</span></span></a>
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
    let tituloP = pergunta.pergunta, hint = "";
    if (idioma === "en" && pergunta.perguntaEn) tituloP = pergunta.perguntaEn;
    if (idioma === "ambos" && pergunta.perguntaEn) hint = pergunta.perguntaEn;
    conteudo.innerHTML = `
      <section class="jogo">
        ${linkVoltar("#/ensinar","Lições")}
        <h2 class="titulo-tela">${licao.icone} ${licao.titulo}${desafio?" · Desafio":""}</h2>
        <p class="subtitulo">Pergunta ${jogoAtivo.indice+1} de ${total}</p>
        <div class="progresso-missao"><i style="width:${Math.round((jogoAtivo.indice/total)*100)}%"></i></div>
        <div class="card">
          <p class="jogo__pergunta">${escapar(tituloP)}${hint?`<span class="hint-en">${escapar(hint)}</span>`:""}</p>
          <div class="jogo__opcoes">${pergunta.opcoes.map((op,i)=>{
            let label = op.texto;
            if (idioma==="en" && op.textoEn) label = op.textoEn;
            if (idioma==="ambos" && op.textoEn) label = `${op.texto} · ${op.textoEn}`;
            return `<button type="button" class="opcao ${op.cor?"opcao--cor":""}" data-i="${i}">${op.cor?`<span class="cor-swatch" style="background:${op.cor}"></span>`:""}${escapar(label)}</button>`;
          }).join("")}</div>
          ${desafio?"":`<p style="margin-top:0.85rem"><a class="btn btn--fantasma btn--sm" href="#/ensinar/${licaoId}/desafio">Modo desafio</a></p>`}
        </div>
      </section>`;
    posRender(tituloP, null); // sem overlay nas respostas
    anunciar(tituloP);
    const botoes = [...conteudo.querySelectorAll(".opcao")];
    botoes.forEach((btn) => btn.addEventListener("click", () => {
      const op = pergunta.opcoes[Number(btn.dataset.i)];
      const certa = AmiguitoEnsinar.verificar(op);
      botoes.forEach((b) => { b.disabled = true; });
      btn.classList.add(certa ? "is-certa" : "is-errada");
      if (certa) { jogoAtivo.acertos += 1; AmiguitoSom.sucesso(); mostrarToast(AmiguitoIA.falar(personagem(),"certo",{listasExtras:DADOS})); }
      else {
        const certaBtn = botoes.find((b,i) => pergunta.opcoes[i].certa);
        if (certaBtn) certaBtn.classList.add("is-certa");
        AmiguitoSom.erro();
        mostrarToast(AmiguitoIA.falar(personagem(),"errado",{listasExtras:DADOS}));
      }
      setTimeout(() => { jogoAtivo.indice += 1; renderLicao(licaoId, desafio); }, 850);
    }));
  }

  function finalizarLicao(licao, desafio) {
    if (!estado.licoesCompletas.includes(licao.id)) estado.licoesCompletas.push(licao.id);
    AmiguitoStorage.ganharXp(estado, desafio ? 16 : 12);
    desbloquearTrofeu("professora");
    if (licao.tipo === "ingles") desbloquearTrofeu("bilingue");
    if (licao.tipo === "ciencia") desbloquearTrofeu("cientista");
    if (licao.tipo === "matematica") desbloquearTrofeu("matematica");
    if (licao.tipo === "tech") desbloquearTrofeu("programadora");
    if (estado.licoesCompletas.length >= 4) desbloquearTrofeu("sabia");
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
    celebrar(); AmiguitoSom.nivel();
    const total = desafio ? Math.min(6, licao.perguntas.length + 2) : licao.perguntas.length;
    conteudo.innerHTML = `<section class="jogo"><div class="card">
      <div style="font-size:3rem">🎉</div>
      <h2 class="titulo-tela">Lição concluída!</h2>
      <p class="subtitulo">Acertos: ${jogoAtivo.acertos}/${total}</p>
      ${guia(AmiguitoIA.falar(personagem(),"elogio"))}
      <a class="btn btn--primario" href="#/ensinar">Mais lições</a>
      <a class="btn btn--secundario" href="#/casa" style="margin-left:0.4rem">Base</a>
    </div></section>`;
    jogoAtivo = null;
  }

  function renderCanto() {
    let i = 0;
    const frases = DADOS.callResponse;
    function paint() {
      const f = frases[i % frases.length];
      conteudo.innerHTML = `<section class="jogo">
        ${linkVoltar("#/ensinar","Lições")}
        <h2 class="titulo-tela">🎤 Cantinho Hello!</h2>
        <p class="subtitulo">${escapar(f.dica)}</p>
        <div class="card">
          <p style="font-size:2.2rem;font-weight:900;margin:1rem 0">${escapar(f.en)}</p>
          <button type="button" class="btn btn--sol btn--bloco" id="btn-repita">Eu repeti! 👏</button>
          <button type="button" class="btn btn--fantasma btn--bloco" id="btn-prox" style="margin-top:0.5rem">Próxima</button>
        </div></section>`;
      conteudo.querySelector("#btn-repita").addEventListener("click", () => {
        AmiguitoSom.sucesso();
        mostrarToast("Hello, estrela! 🌟");
        AmiguitoStorage.ganharXp(estado, 2);
        completarPassoTipo("canto", "callResponse");
        AmiguitoStorage.salvar(estado);
      });
      conteudo.querySelector("#btn-prox").addEventListener("click", () => { i += 1; paint(); });
    }
    paint();
  }

  function renderYoga() {
    conteudo.innerHTML = `<section>
      ${linkVoltar("#/mais","Mais")}
      <h2 class="titulo-tela">Yoga Suave</h2>
      <p class="subtitulo">Brincadeira — pare se sentir desconforto. Não é orientação médica.</p>
      <div class="grade-cards">${DADOS.yoga.map((y)=>`
        <a class="card-link" href="#/yoga/${y.id}">
          <span class="card-link__icone bg-menta" aria-hidden="true">${y.emoji}</span>
          <span><span class="card-link__titulo">${y.nome}</span><span class="card-link__meta">${y.segundos}s</span></span>
        </a>`).join("")}</div>
    </section>`;
  }

  function renderYogaPose(id) {
    const pose = DADOS.yoga.find((y) => y.id === id);
    if (!pose) { location.hash = "#/yoga"; return; }
    let resto = pose.segundos;
    conteudo.innerHTML = `<section>
      ${linkVoltar("#/yoga","Poses")}
      <h2 class="titulo-tela">${pose.emoji} ${pose.nome}</h2>
      <div class="yoga-pose">
        ${AmiguitoYoga.svgPose(pose.id)}
        <p style="font-weight:800;margin:0.5rem 0 0.75rem">${escapar(pose.instrucao)}</p>
        <div class="timer-anel" id="timer" style="--progresso:0%"><span id="timer-num">${resto}</span></div>
        <button type="button" class="btn btn--menta" id="btn-yoga-start">Começar</button>
        <p class="subtitulo" style="margin-top:0.75rem;font-size:0.8rem">Pare se sentir desconforto. Não é orientação médica.</p>
      </div></section>`;
    const timerEl = conteudo.querySelector("#timer");
    const numEl = conteudo.querySelector("#timer-num");
    conteudo.querySelector("#btn-yoga-start").addEventListener("click", (ev) => {
      ev.target.disabled = true;
      ev.target.textContent = "Respirando…";
      yogaTimer = setInterval(() => {
        resto -= 1;
        timerEl.style.setProperty("--progresso", Math.round(((pose.segundos - resto) / pose.segundos) * 100) + "%");
        numEl.textContent = String(Math.max(0, resto));
        if (resto <= 0) {
          clearInterval(yogaTimer); yogaTimer = null;
          if (!estado.yogaFeitas.includes(pose.id)) estado.yogaFeitas.push(pose.id);
          AmiguitoStorage.ganharXp(estado, 6);
          if (estado.yogaFeitas.length >= 3) desbloquearTrofeu("yogi");
          completarPassoTipo("yoga", pose.id);
          AmiguitoStorage.salvar(estado);
          AmiguitoSom.sucesso(); celebrar();
          mostrarToast("Pose concluída! 🧘");
          ev.target.textContent = "Feito com carinho ✨";
        }
      }, 1000);
    });
  }

  function renderAprender() {
    const dica = AmiguitoAprender.dicaDoDia(DADOS.dicas, estado);
    AmiguitoStorage.salvar(estado);
    const missoes = AmiguitoAprender.missoesDisponiveis(DADOS.missoes, estado.missoesFeitas).slice(0, 3);
    conteudo.innerHTML = `<section>
      ${linkVoltar("#/mais","Mais")}
      <h2 class="titulo-tela">${escapar(nomeExibir())} ensina</h2>
      <div class="dica-dia"><div class="dica-dia__rotulo">💡 Dica do dia</div><p><strong>${escapar(dica)}</strong></p></div>
      ${missoes.map((m) => {
        const feita = estado.missoesFeitas.includes(m.id);
        return `<article class="missao">
          <div class="missao__titulo">${m.emoji} ${escapar(m.titulo)}${feita?" ✓":""}</div>
          <p class="missao__texto">${escapar(m.texto)}</p>
          <button type="button" class="btn ${feita?"btn--fantasma":"btn--menta"} btn--bloco btn-missao" data-id="${m.id}" ${feita?"disabled":""}>${feita?"Feita!":"Pronto, fiz!"}</button>
        </article>`;
      }).join("")}
    </section>`;
    conteudo.querySelectorAll(".btn-missao:not([disabled])").forEach((btn) => btn.addEventListener("click", () => {
      AmiguitoAprender.completarMissao(estado, btn.dataset.id);
      desbloquearTrofeu("missao-feita");
      if (estado.missoesFeitas.length >= 5) desbloquearTrofeu("missao-mestre");
      AmiguitoStorage.salvar(estado);
      AmiguitoSom.sucesso(); celebrar();
      mostrarToast("Missão completa! ⭐");
      renderAprender();
    }));
  }

  function renderTrofeus() {
    conteudo.innerHTML = `<section>
      ${linkVoltar("#/mais","Mais")}
      <h2 class="titulo-tela">Troféus</h2>
      <div class="stats">
        <div class="stat"><div class="stat__num">${estado.nivel}</div><div class="stat__label">Nível</div></div>
        <div class="stat"><div class="stat__num">${estado.streak}</div><div class="stat__label">Dias</div></div>
        <div class="stat"><div class="stat__num">${estado.trofeus.length}</div><div class="stat__label">Troféus</div></div>
      </div>
      <div class="trofeus-grade" role="list">
        ${DADOS.trofeus.map((t) => {
          const ok = estado.trofeus.includes(t.id);
          return `<div class="trofeu ${ok?"is-desbloqueado":""}" role="listitem">
            <span class="trofeu__icone">${ok?t.icone:"🔒"}</span>
            <div class="trofeu__nome">${escapar(t.nome)}</div>
            <div class="trofeu__desc">${escapar(t.desc)}</div>
          </div>`;
        }).join("")}
      </div>
      <div class="painel-config"><a class="btn btn--fantasma" href="#/">Trocar tripulação</a></div>
    </section>`;
  }


  function aplicarModoFiguras() {
    document.body.classList.toggle("modo-figuras", !!estado.modoFiguras);
    if (btnFiguras) {
      btnFiguras.setAttribute("aria-pressed", String(!!estado.modoFiguras));
      btnFiguras.setAttribute("aria-label", estado.modoFiguras ? "Modo só figuras ligado" : "Modo só figuras desligado");
      btnFiguras.innerHTML = `<span aria-hidden="true">${estado.modoFiguras ? "👁️" : "🔤"}</span>`;
    }
  }

  function alternarFiguras() {
    estado.modoFiguras = !estado.modoFiguras;
    estado.primeiraVisita = false;
    AmiguitoStorage.salvar(estado);
    aplicarModoFiguras();
    AmiguitoSom.tap();
    AmiguitoFala.falar(estado.modoFiguras ? "Modo só figuras ligado" : "Mostrando as palavras", { force: true });
    mostrarToast(estado.modoFiguras ? "Só figuras 👁️" : "Com palavras 🔤");
  }

  function anunciar(texto) {
    ultimaFala = texto;
    AmiguitoFala.falar(texto);
  }

  // Seletores que NUNCA recebem o overlay (perguntas / respostas / áreas de jogo)
  const GUIA_PROIBIDO = /\.opcao|\.pic-btn|\.geo-regiao|\.jogo__pergunta|\.jogo__opcoes|\.memoria-carta|\.porta|\.ritmo-pad|\.comida-item|\.drag-alvo|\.drag-item|\.acao|\.necessidade|\.letra-gigante|#stem-root|#ler-root|#jogo-root/i;

  function esconderGuia() {
    if (!guiaSeta) return;
    guiaSeta.hidden = true;
    guiaAlvoSel = null;
    document.querySelectorAll(".destaque-guia").forEach((el) => el.classList.remove("destaque-guia"));
  }

  function posRender(falaTela, seletorGuia) {
    aplicarModoFiguras();
    AmiguitoFala.amarrar(conteudo);
    AmiguitoFala.amarrar(nav);
    if (falaTela) anunciar(falaTela);
    // Em telas de pergunta/resposta: só fala, sem seta flutuante
    if (!seletorGuia || GUIA_PROIBIDO.test(String(seletorGuia))) {
      esconderGuia();
      return;
    }
    guiaAlvoSel = seletorGuia;
    requestAnimationFrame(() => posicionarGuia(guiaAlvoSel));
  }

  function posicionarGuia(sel) {
    if (!guiaSeta) return;
    document.querySelectorAll(".destaque-guia").forEach((el) => el.classList.remove("destaque-guia"));
    if (!sel || !estado.personagemId || GUIA_PROIBIDO.test(String(sel))) {
      guiaSeta.hidden = true;
      return;
    }
    const el = conteudo.querySelector(sel) || document.querySelector(sel);
    if (!el) { guiaSeta.hidden = true; return; }
    // Se o alvo for (ou estiver dentro de) pergunta/opções, não mostrar
    if (el.closest(".jogo__opcoes, .jogo__pergunta, .pic-grid, .opcao, #stem-root, #ler-root, #jogo-root, .card.jogo, section.jogo")) {
      guiaSeta.hidden = true;
      return;
    }
    el.classList.add("destaque-guia");
    const r = el.getBoundingClientRect();
    // Canto inferior, longe do conteúdo central
    const top = Math.min(window.innerHeight - 100, Math.max(8, r.bottom + 8));
    const left = Math.min(window.innerWidth - 64, Math.max(8, r.left + r.width / 2 - 24));
    guiaSeta.style.top = top + "px";
    guiaSeta.style.left = left + "px";
    guiaSeta.hidden = false;
    // Auto-esconde no primeiro toque da tela
    const hideOnce = () => { esconderGuia(); conteudo.removeEventListener("pointerdown", hideOnce, true); };
    conteudo.addEventListener("pointerdown", hideOnce, true);
  }


  function renderAprenderHub() {
    const cena = `<div class="cena-ilustrada" aria-hidden="true"><span class="cena-ilustrada__nuvem">☁️</span><span class="cena-ilustrada__sol">☀️</span>
      <div style="position:absolute;bottom:8px;left:0;right:0;text-align:center;font-size:2rem">🌳🏠🌴</div></div>`;
    conteudo.innerHTML = `
      <section aria-labelledby="t-hub">
        <h2 id="t-hub" class="titulo-tela">Aprender</h2>
        ${guia("Toque num tema. Eu falo e você aponta!")}
        ${cena}
        <div class="hub-temas">
          <a class="tema-card tema-card--geo" href="#/stem/atividade/geo-brasil" data-fala="Geografia Brasil" aria-label="Geografia">
            <span class="tema-card__icone">🇧🇷</span><span>Brasil</span>
          </a>
          <a class="tema-card tema-card--geo" href="#/stem/atividade/geo-continentes" data-fala="Mundo" aria-label="Mundo">
            <span class="tema-card__icone">🌍</span><span>Mundo</span>
          </a>
          <a class="tema-card tema-card--math" href="#/stem/atividade/contar-objetos" data-fala="Matemática" aria-label="Matemática">
            <span class="tema-card__icone">🔢</span><span>Contar</span>
          </a>
          <a class="tema-card tema-card--ciencia" href="#/stem/atividade/clima" data-fala="Ciência" aria-label="Ciência">
            <span class="tema-card__icone">🔬</span><span>Ciência</span>
          </a>
          <a class="tema-card tema-card--ingles" href="#/ensinar/ingles-basico" data-fala="Inglês" aria-label="Inglês">
            <span class="tema-card__icone">🌍</span><span>Hello</span>
          </a>
          <a class="tema-card tema-card--tech" href="#/stem/atividade/programar" data-fala="Robô" aria-label="Tecnologia">
            <span class="tema-card__icone">🤖</span><span>Robô</span>
          </a>
          <a class="tema-card tema-card--ler" href="#/ler" data-fala="Quero ler" aria-label="Quero ler">
            <span class="tema-card__icone">🔤</span><span>Ler</span>
          </a>
          <a class="tema-card" href="#/stem" data-fala="Todos os roteiros" aria-label="Roteiros">
            <span class="tema-card__icone">🗺️</span><span>Roteiros</span>
          </a>
        </div>
        <div class="grade-cards">
          <a class="card-link" href="#/stem/rota/brasilzinho" data-fala="Roteiro Brasilzinho" aria-label="Brasilzinho">
            <span class="card-link__icone bg-menta" aria-hidden="true">🇧🇷</span>
            <span><span class="card-link__titulo">Brasilzinho</span><span class="card-link__meta">Regiões e lugares</span></span>
          </a>
          <a class="card-link" href="#/stem/rota/volta-mundo" data-fala="Volta ao mundo" aria-label="Volta ao mundo">
            <span class="card-link__icone bg-ceu" aria-hidden="true">🌎</span>
            <span><span class="card-link__titulo">Volta ao mundo</span><span class="card-link__meta">Continentes e animais</span></span>
          </a>
        </div>
      </section>`;
    posRender("Aprender. Escolha um tema.", ".tema-card");
  }

  function renderLerHub() {
    conteudo.innerHTML = `
      <section aria-labelledby="t-ler">
        ${linkVoltar("#/stem", "Missões")}
        <h2 id="t-ler" class="titulo-tela">🔤 Quero ler</h2>
        ${guia("Ouça e toque na figurinha. Sem pressa!")}
        <div class="grade-cards">
          <a class="card-link" href="#/ler/letras" data-fala="Letras com figurinha" aria-label="Letras">
            <span class="card-link__icone bg-rosa" aria-hidden="true">🅰️</span>
            <span><span class="card-link__titulo">Letras</span><span class="card-link__meta">Som + figura</span></span>
          </a>
          <a class="card-link" href="#/ler/silabas" data-fala="Sílabas" aria-label="Sílabas">
            <span class="card-link__icone bg-ceu" aria-hidden="true">🅱️</span>
            <span><span class="card-link__titulo">Sílabas</span><span class="card-link__meta">BA CA LU</span></span>
          </a>
          <a class="card-link" href="#/ler/palavras" data-fala="Palavras e figurinhas" aria-label="Palavras">
            <span class="card-link__icone bg-sol" aria-hidden="true">📖</span>
            <span><span class="card-link__titulo">Palavras</span><span class="card-link__meta">Ouvir e achar</span></span>
          </a>
          <a class="card-link" href="#/stem/rota/quero-ler" data-fala="Roteiro Quero ler" aria-label="Roteiro">
            <span class="card-link__icone bg-lavanda" aria-hidden="true">🗺️</span>
            <span><span class="card-link__titulo">Roteiro</span><span class="card-link__meta">Passo a passo</span></span>
          </a>
        </div>
      </section>`;
    posRender("Quero ler. Escolha letras, sílabas ou palavras.", ".card-link");
  }

  function renderLer(tipo) {
    const map = { letras: "letras", silabas: "silabas", palavras: "palavras" };
    const kind = map[tipo] || "letras";
    const titulos = { letras: "Letras", silabas: "Sílabas", palavras: "Palavras" };
    conteudo.innerHTML = `
      <section>
        ${linkVoltar("#/ler", "Quero ler")}
        <h2 class="titulo-tela">${titulos[kind] || "Ler"}</h2>
        <div id="ler-root"></div>
      </section>`;
    const root = document.getElementById("ler-root");
    const falar = (txt, opts) => { ultimaFala = txt; AmiguitoFala.falar(txt, opts); };
    AmiguitoLer.montar(kind, root, DADOS.alfabetizacao, (res) => {
      AmiguitoStorage.ganharXp(estado, 10);
      desbloquearTrofeu("leitora");
      if (pendenteRota) {
        const rota = DADOS.roteiros.find((r) => r.id === pendenteRota.rotaId);
        const passo = rota && rota.passos.find((x) => x.id === pendenteRota.passoId);
        if (passo && passo.tipo === "ler") {
          AmiguitoRoteiros.marcarPasso(estado, pendenteRota.rotaId, pendenteRota.passoId, rota.passos);
          if (AmiguitoStorage.progressoRota(estado, pendenteRota.rotaId).completo) desbloquearTrofeu("roteiro");
          pendenteRota = null;
        }
      }
      AmiguitoStorage.salvar(estado);
      AmiguitoSom.sucesso();
      celebrar();
      anunciar(res.msg);
      root.innerHTML = `<div class="card" style="text-align:center">
        <div style="font-size:2.5rem">🎉</div>
        <p class="titulo-tela" style="font-size:1.2rem">${escapar(res.msg)}</p>
        ${guia("Mandou bem! Quer mais?")}
        <a class="btn btn--primario" href="#/ler" data-fala="Mais leitura">Mais</a>
      </div>`;
      posRender(res.msg, "a.btn--primario");
    }, falar);
    posRender(titulos[kind] + ". Ouça e toque na figurinha.", null);
  }


  function renderAdulto() {
    if (!confirm("Área do adulto. Continuar?")) {
      history.back();
      return;
    }
    nav.hidden = true;
    conteudo.innerHTML = `
      <section>
        <h2 class="titulo-tela">Área do adulto</h2>
        <div class="adulto-box">
          <p><strong>Amiguito Pro</strong> foi feito pra criança que ainda não lê: ícones grandes, modo só figuras e fala em português.</p>
          <ul>
            <li>Ative o som 🔊 (no iPhone/iPad, toque em 🗣️ depois de ligar o som — o navegador exige um toque).</li>
            <li>O botão 👁️ liga/desliga o <em>modo só figuras</em> (padrão: ligado).</li>
            <li>A qualidade da voz depende do aparelho (voz pt-BR do sistema).</li>
            <li>Progresso fica só neste aparelho.</li>
          </ul>
          <p><a class="btn btn--primario btn--bloco" href="#/casa" data-fala="Voltar">Voltar ao app</a></p>
        </div>
      </section>`;
    AmiguitoFala.cancelar();
  }


  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
