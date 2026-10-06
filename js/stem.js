/* Atividades STEM interativas */
(function (global) {
  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function montarContar(root, onDone) {
    const n = rand(4, 12);
    const emoji = ["⭐", "🚀", "🌙", "🪐"][rand(0, 3)];
    const opts = shuffle([n, n + 1, Math.max(1, n - 2), n + 3]).slice(0, 3);
    if (!opts.includes(n)) opts[0] = n;
    root.innerHTML = `
      <div class="jogo-hud"><span>Quantas ${emoji} você vê?</span><span>Math</span></div>
      <div class="objetos-conta" aria-label="${n} objetos">${emoji.repeat(n).split("").reduce((s,_,i,a)=>s+(i%2===0||emoji.length===1?emoji:""),"") || Array(n).fill(emoji).join("")}</div>
      <div class="jogo__opcoes">${shuffle(opts).map(o=>`<button type="button" class="opcao" data-v="${o}">${o}</button>`).join("")}</div>`;
    // fix emoji display
    root.querySelector(".objetos-conta").textContent = Array(n).fill(emoji).join(" ");
    falarStem("Quantos tem? Toque no número certo.");
    root.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const ok = Number(b.dataset.v) === n;
      b.classList.add(ok ? "is-certa" : "is-errada");
      if (ok) onDone({ sucesso: true, msg: `São ${n}! Mandou bem!`, trilha: "matematica" });
      else { AmiguitoSom && AmiguitoSom.erro(); setTimeout(() => montarContar(root, onDone), 600); }
    }));
  }

  function montarMaisMenos(root, onDone) {
    let a = rand(3, 9), b = rand(3, 9);
    if (a === b) b += 1;
    const esquerdaMais = a > b;
    root.innerHTML = `
      <div class="jogo-hud"><span>Quem tem MAIS?</span><span>Math</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
        <button type="button" class="opcao" data-lado="a" style="min-height:100px;font-size:1.5rem">${Array(a).fill("🔵").join("")}<br><small>${a}</small></button>
        <button type="button" class="opcao" data-lado="b" style="min-height:100px;font-size:1.5rem">${Array(b).fill("🟢").join("")}<br><small>${b}</small></button>
      </div>`;
    falarStem("Quem tem mais?");
    root.querySelectorAll(".opcao").forEach((btn) => btn.addEventListener("click", () => {
      const ok = (btn.dataset.lado === "a") === esquerdaMais;
      btn.classList.add(ok ? "is-certa" : "is-errada");
      if (ok) onDone({ sucesso: true, msg: "Comparação perfeita!", trilha: "matematica" });
      else { AmiguitoSom && AmiguitoSom.erro(); setTimeout(() => montarMaisMenos(root, onDone), 600); }
    }));
  }

  function montarPadrao(root, onDone) {
    const pares = [["⭐","🌙"],["🚀","🛸"],["❤️","💛"],["🔵","🔺"]];
    const [x, y] = pares[rand(0, pares.length - 1)];
    const seq = [x, y, x, y, x];
    const proximo = y;
    const opts = shuffle([proximo, x, "🌈"]);
    falarStem("O que vem depois no padrão?");
    root.innerHTML = `
      <div class="jogo-hud"><span>O que vem depois?</span><span>Padrão</span></div>
      <p class="jogo__pergunta" style="font-size:1.8rem;letter-spacing:4px">${seq.join(" ")} → ?</p>
      <div class="jogo__opcoes">${opts.map(o=>`<button type="button" class="opcao" data-v="${o}">${o}</button>`).join("")}</div>`;
    root.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.v === proximo;
      b.classList.add(ok ? "is-certa" : "is-errada");
      if (ok) onDone({ sucesso: true, msg: "Padrão desvendado!", trilha: "matematica" });
      else { AmiguitoSom && AmiguitoSom.erro(); }
    }));
  }

  function montarExperimento(root, onDone) {
    root.innerHTML = `
      <div class="jogo-hud"><span>Experimento de mentirinha</span><span>Ciência</span></div>
      <p class="jogo__pergunta">Quer ver o gelo derreter (de brincadeira). Qual o 1º passo?</p>
      <div class="jogo__opcoes">
        <button type="button" class="opcao" data-ok="1">Pegar um cubo de gelo (com um adulto)</button>
        <button type="button" class="opcao" data-ok="0">Colocar fogo na geladeira</button>
        <button type="button" class="opcao" data-ok="0">Esconder o Sol</button>
      </div>
      <p class="subtitulo" style="margin-top:0.75rem;font-size:0.8rem">Só com adulto! É brincadeira segura — não é experimento real sozinho.</p>`;
    root.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.ok === "1";
      b.classList.add(ok ? "is-certa" : "is-errada");
      if (ok) onDone({ sucesso: true, msg: "Cientista responsável!", trilha: "ciencia" });
      else AmiguitoSom && AmiguitoSom.erro();
    }));
  }

  function montarClima(root, onDone) {
    const itens = [
      { clima: "☀️ Sol", acao: "Protetor e água", err: ["Casaco bem grosso", "Esqui"] },
      { clima: "🌧️ Chuva", acao: "Guarda-chuva", err: ["Óculos de sol só", "Foguete"] },
      { clima: "❄️ Frio", acao: "Casaco quentinho", err: ["Piscina gelada", "Chinelo só"] }
    ];
    const it = itens[rand(0, 2)];
    const opts = shuffle([it.acao, ...it.err]);
    root.innerHTML = `
      <div class="jogo-hud"><span>Clima: ${it.clima}</span><span>Ciência</span></div>
      <p class="jogo__pergunta">O que combina com esse clima?</p>
      <div class="jogo__opcoes">${opts.map(o=>`<button type="button" class="opcao" data-v="${o}">${o}</button>`).join("")}</div>`;
    root.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.v === it.acao;
      b.classList.add(ok ? "is-certa" : "is-errada");
      if (ok) onDone({ sucesso: true, msg: "Meteorologista mirim!", trilha: "ciencia" });
      else AmiguitoSom && AmiguitoSom.erro();
    }));
  }

  function montarDialogo(root, onDone) {
    const turns = [
      { fala: "Hello!", certa: "Hello!", opts: ["Hello!", "Goodbye!", "Banana!"] },
      { fala: "How are you?", certa: "I'm happy!", opts: ["I'm happy!", "Go away!", "Rocket soup!"] },
      { fala: "Thank you!", certa: "You're welcome!", opts: ["You're welcome!", "No moon!", "Red please!"] }
    ];
    let i = 0;
    function paint() {
      if (i >= turns.length) {
        onDone({ sucesso: true, msg: "Diálogo completo! Amazing!", trilha: "ingles" });
        return;
      }
      const t = turns[i];
      root.innerHTML = `
        <div class="jogo-hud"><span>Diálogo ${i + 1}/${turns.length}</span><span>English</span></div>
        <div class="balao" style="text-align:left;margin-bottom:1rem"><span class="balao__rotulo">Amiguito fala</span>${t.fala}</div>
        <p class="subtitulo">O que você responde?</p>
        <div class="jogo__opcoes">${shuffle(t.opts).map(o=>`<button type="button" class="opcao" data-v="${o}">${o}</button>`).join("")}</div>`;
      root.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
        const ok = b.dataset.v === t.certa;
        b.classList.add(ok ? "is-certa" : "is-errada");
        if (ok) { AmiguitoSom && AmiguitoSom.tap(); i += 1; setTimeout(paint, 500); }
        else AmiguitoSom && AmiguitoSom.erro();
      }));
    }
    paint();
  }

  function montarProgramar(root, onDone) {
    const alvo = ["⬆️", "⬆️", "➡️", "⭐"];
    let seq = [];
    const banco = ["⬆️", "⬇️", "⬅️", "➡️", "⭐"];
    function paint() {
      if (!seq.length) falarStem("Programe o robô: duas setas para cima, uma para a direita, e estrela.");
      root.innerHTML = `
        <div class="jogo-hud"><span>Leve o robô até a estrela</span><span>Tech</span></div>
        <p class="subtitulo">Meta: ${alvo.join(" ")}</p>
        <div class="blocos-seq" id="seq" aria-label="Sua sequência">${seq.map((s,i)=>`<button type="button" class="bloco bloco--seta" data-i="${i}">${s}</button>`).join("") || '<span class="bloco--slot">+</span>'}</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.45rem;justify-content:center;margin:0.75rem 0">
          ${banco.map(b=>`<button type="button" class="bloco" data-add="${b}">${b}</button>`).join("")}
        </div>
        <button type="button" class="btn btn--fantasma btn--sm" id="btn-apagar">Apagar último</button>
        <button type="button" class="btn btn--primario btn--sm" id="btn-run" style="margin-left:0.4rem">Rodar ▶</button>`;
      root.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => {
        if (seq.length >= 6) return;
        seq.push(b.dataset.add);
        AmiguitoSom && AmiguitoSom.tap();
        paint();
      }));
      root.querySelector("#btn-apagar").addEventListener("click", () => { seq.pop(); paint(); });
      root.querySelector("#btn-run").addEventListener("click", () => {
        const ok = seq.join() === alvo.join();
        if (ok) onDone({ sucesso: true, msg: "Robô chegou na estrela!", trilha: "tech" });
        else { AmiguitoSom && AmiguitoSom.erro(); root.querySelector(".subtitulo").textContent = "Quase! Compare com a meta e ajuste."; }
      });
    }
    paint();
  }

  function montarConsertar(root, onDone) {
    const certo = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];
    const errado = ["1️⃣", "3️⃣", "2️⃣", "4️⃣"]; // 2 e 3 trocados
    root.innerHTML = `
      <div class="jogo-hud"><span>Qual passo está fora de ordem?</span><span>Tech</span></div>
      <p class="subtitulo">Sequência bugada: ${errado.join(" ")}</p>
      <p class="jogo__pergunta">Onde está o erro?</p>
      <div class="jogo__opcoes">
        <button type="button" class="opcao" data-ok="0">O 1 está errado</button>
        <button type="button" class="opcao" data-ok="1">O 2 e o 3 estão trocados</button>
        <button type="button" class="opcao" data-ok="0">Está tudo certo</button>
      </div>`;
    root.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.ok === "1";
      b.classList.add(ok ? "is-certa" : "is-errada");
      if (ok) onDone({ sucesso: true, msg: `Corrigido: ${certo.join(" ")}`, trilha: "tech" });
      else AmiguitoSom && AmiguitoSom.erro();
    }));
  }

  function falarStem(txt) {
    if (window.AmiguitoFala) AmiguitoFala.falar(txt);
  }


  /** Puzzle de formas — arrastar */
  function montarFormas(root, onDone, nivel) {
    nivel = nivel || 1;
    const all = [
      { id: "c1", match: "circulo", icone: "🔵", label: "Círculo" },
      { id: "q1", match: "quadrado", icone: "🟥", label: "Quadrado" },
      { id: "t1", match: "triangulo", icone: "🔺", label: "Triângulo" },
      { id: "e1", match: "estrela", icone: "⭐", label: "Estrela" }
    ];
    const pecas = nivel >= 3 ? all : all.slice(0, nivel === 1 ? 2 : 3);
    const slots = pecas.map((p) => ({ id: "s-" + p.match, accept: p.match, label: p.label, icone: "⬜" }));
    AmiguitoEducar.montarArrastarSlots(root, {
      pecas, slots,
      fala: "Encaixe cada forma no lugar.",
      porque: "Formas ajudam a gente a reconhecer desenhos e construir coisas.",
      msgOk: "Formas encaixadas!",
      trilha: "matematica"
    }, onDone);
  }

  /** Reta numérica — colocar o número */
  function montarReta(root, onDone, nivel) {
    nivel = nivel || 1;
    const alvo = 3 + Math.floor(Math.random() * (nivel === 1 ? 4 : nivel === 2 ? 7 : 12));
    const casa = alvo;
    const opts = AmiguitoEnsinar.embaralhar([
      casa,
      Math.max(1, casa - 1),
      casa + 1,
      casa + 2
    ]).slice(0, nivel === 1 ? 2 : 3);
    if (!opts.includes(casa)) opts[0] = casa;
    root.innerHTML = `
      ${AmiguitoEducar.fasesHtml("pratica")}
      ${AmiguitoEducar.coachHtml("A reta dos números: onde fica o " + casa + "?")}
      <div class="edu-reta" aria-label="Reta numérica">
        ${Array.from({ length: Math.max(5, casa + 1) }, (_, i) => {
          const n = i + 1;
          const hole = n === casa;
          return `<div class="edu-reta__casa ${hole ? "is-buraco" : ""}" data-n="${n}">${hole ? "?" : n}</div>`;
        }).join("")}
      </div>
      <div class="jogo__opcoes">${opts.map((o) => `<button type="button" class="opcao" data-v="${o}">${o}</button>`).join("")}</div>
      ${AmiguitoEducar.porqueBox("Os números ficam em ordem: 1, 2, 3… cada um no seu lugar.")}`;
    AmiguitoEducar.setCoach(root, "Toque no número que falta na reta.", true);
    root.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const ok = Number(b.dataset.v) === casa;
      if (ok) {
        b.classList.add("is-certa", "is-acerto-fx");
        const buraco = root.querySelector(".edu-reta__casa.is-buraco");
        if (buraco) { buraco.textContent = String(casa); buraco.classList.remove("is-buraco"); buraco.classList.add("is-acertou"); }
        AmiguitoEducar.acertoFesta(root, "Os números ficam em ordem: cada um no seu lugar na reta.", "Número no lugar!");
        setTimeout(() => onDone({ sucesso: true, msg: "Reta completa!", trilha: "matematica" }), 1200);
      } else {
        const certa = [...root.querySelectorAll(".opcao")].find((x) => Number(x.dataset.v) === casa);
        AmiguitoEducar.erroGentil(null, b, certa, root);
        setTimeout(() => montarReta(root, onDone, nivel), 1400);
      }
    }));
  }

  /** Blocos de código — ordem snap */
  function montarBlocos(root, onDone, nivel) {
    nivel = nivel || 1;
    const sequencia = nivel >= 3
      ? [{ id: "a", match: "1", icone: "1️⃣", label: "Andar" }, { id: "b", match: "2", icone: "2️⃣", label: "Pegar ⭐" }, { id: "c", match: "3", icone: "3️⃣", label: "Comemorar" }, { id: "d", match: "4", icone: "4️⃣", label: "Voltar" }]
      : [{ id: "a", match: "1", icone: "1️⃣", label: "Andar" }, { id: "b", match: "2", icone: "2️⃣", label: "Pegar ⭐" }, { id: "c", match: "3", icone: "3️⃣", label: "Festa" }];
    const slots = sequencia.map((s, i) => ({ id: "slot" + (i + 1), accept: String(i + 1), label: "Passo " + (i + 1), icone: "⬜" }));
    AmiguitoEducar.montarArrastarSlots(root, {
      pecas: sequencia,
      slots,
      fala: "Monte a sequência do robô: 1, 2, 3…",
      porque: "Programar é dar passos em ordem — o robô só faz o que a gente encaixa.",
      msgOk: "Robô programado!",
      trilha: "tech"
    }, onDone);
  }

  /** Habitat — sort animais */
  function montarHabitat(root, onDone, nivel) {
    const pecas = [
      { id: "peixe", match: "mar", icone: "🐟", label: "Peixe" },
      { id: "passaro", match: "ceu", icone: "🐦", label: "Pássaro" },
      { id: "macaco", match: "floresta", icone: "🐒", label: "Macaco" },
      { id: "camelo", match: "deserto", icone: "🐪", label: "Camelo" }
    ].slice(0, nivel === 1 ? 2 : nivel === 2 ? 3 : 4);
    const slots = [
      { id: "mar", accept: "mar", label: "Mar", icone: "🌊" },
      { id: "ceu", accept: "ceu", label: "Céu", icone: "☁️" },
      { id: "floresta", accept: "floresta", label: "Floresta", icone: "🌳" },
      { id: "deserto", accept: "deserto", label: "Deserto", icone: "🏜️" }
    ].filter((s) => pecas.some((p) => p.match === s.accept));
    AmiguitoEducar.montarArrastarSlots(root, {
      pecas, slots,
      fala: "Leve cada animal pro lar dele.",
      porque: "Cada animal vive onde encontra comida, água e abrigo.",
      msgOk: "Habitats combinados!",
      trilha: "ciencia"
    }, onDone);
  }

  function montar(id, root, onDone, opts) {
    opts = opts || {};
    const nivel = opts.nivel || 1;
    if (id === "formas-puzzle") return montarFormas(root, onDone, nivel);
    if (id === "reta-numerica") return montarReta(root, onDone, nivel);
    if (id === "blocos-codigo") return montarBlocos(root, onDone, nivel);
    if (id === "habitat-sort") return montarHabitat(root, onDone, nivel);
    const map = {
      "contar-objetos": montarContar,
      "mais-menos": montarMaisMenos,
      "padrao": montarPadrao,
      "experimento": montarExperimento,
      "clima": montarClima,
      "dialogo-en": montarDialogo,
      "programar": montarProgramar,
      "consertar": montarConsertar
    };
    const porqueStem = {
      "contar-objetos": "Contar é dizer quantos tem, um por um.",
      "mais-menos": "Mais junta; menos tira — assim comparamos quantidades.",
      "padrao": "Padrões se repetem: a gente descobre o que vem depois.",
      "experimento": "Na ciência a gente observa com atenção e segurança.",
      "clima": "O clima muda: sol, chuva, vento — cada um é diferente.",
      "dialogo-en": "Conversar em inglês é praticar sons novos com alegria.",
      "programar": "O robô só faz o que a sequência manda.",
      "consertar": "Quando um passo está errado, a gente troca e tenta de novo."
    };
    const fn = map[id] || montarContar;
    if (window.AmiguitoEducar) {
      const shell = document.createElement("div");
      shell.innerHTML = AmiguitoEducar.fasesHtml("pratica") + AmiguitoEducar.coachHtml("Vamos juntos!") + '<div id="stem-inner"></div>' + AmiguitoEducar.porqueBox(porqueStem[id] || "");
      root.innerHTML = "";
      root.appendChild(shell);
      AmiguitoEducar.setCoach(shell, "Olha, guia e faz — eu te acompanho!", true);
      const inner = shell.querySelector("#stem-inner");
      fn(inner, (res) => {
        res = res || {};
        res.porque = res.porque || porqueStem[id];
        if (res.porque) AmiguitoEducar.mostrarPorque(shell, res.porque);
        onDone(res);
      });
    } else {
      fn(root, onDone);
    }
  }

  global.AmiguitoStem = { montar };
})(window);
