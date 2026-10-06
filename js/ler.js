/* Quero ler — bandejas de letras + sílabas + palavras (áudio-primeiro) */
(function (global) {
  function falar(txt, falarFn) {
    if (falarFn) falarFn(txt);
    else if (window.AmiguitoEducar) AmiguitoEducar.falar(txt, { completo: true });
    else if (window.AmiguitoFala) AmiguitoFala.falar(txt, { completo: true });
  }

  function montarLetras(root, dados, onDone, falarFn) {
    const letras = (dados && dados.letras) || [
      { letra: "A", som: "a", emoji: "🚀", palavra: "astronauta" },
      { letra: "B", som: "bê", emoji: "🍌", palavra: "banana" },
      { letra: "M", som: "ême", emoji: "🌙", palavra: "lua" },
      { letra: "S", som: "ésse", emoji: "⭐", palavra: "estrela" }
    ];
    const item = letras[Math.floor(Math.random() * letras.length)];
    const distratores = AmiguitoEnsinar.embaralhar(
      letras.filter((l) => l.letra !== item.letra).map((l) => l.letra)
    ).slice(0, 2);
    const opts = AmiguitoEnsinar.embaralhar([item.letra].concat(distratores));

    root.innerHTML = `
      ${AmiguitoEducar.fasesHtml("modelo")}
      ${AmiguitoEducar.coachHtml("")}
      <div class="edu-letra-tray card">
        <div class="letra-gigante" aria-hidden="true">${item.letra}</div>
        <span class="letra-emoji">${item.emoji}</span>
        <p class="subtitulo">${item.palavra}</p>
        <button type="button" class="btn btn--sol btn--bloco" id="btn-ouvir-letra" data-fala="Ouvir">🗣️ Ouvir o som</button>
        <div id="ler-fase-2" hidden>
          <p class="jogo__pergunta">Qual letra combina com ${item.emoji}?</p>
          <div class="jogo__opcoes" id="ler-ops"></div>
        </div>
        ${AmiguitoEducar.porqueBox("Cada letra tem um som. Sons juntos formam palavras!")}
      </div>`;
    AmiguitoEducar.setCoach(root, "Olha a letra " + item.letra + "! Ela soa " + item.som + ".", true);
    root.querySelector("#btn-ouvir-letra").onclick = () => {
      falar(item.letra + ". " + item.som + ". " + item.palavra, falarFn);
      AmiguitoEducar.setFase(root, "guia");
      AmiguitoEducar.setCoach(root, "Agora escolha a letra certa.", true);
      const box = root.querySelector("#ler-fase-2");
      box.hidden = false;
      AmiguitoEducar.setFase(root, "pratica");
      const ops = root.querySelector("#ler-ops");
      ops.innerHTML = opts.map((L) => `<button type="button" class="opcao" data-v="${L}" style="font-size:2rem;font-weight:900">${L}</button>`).join("");
      ops.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
        const ok = b.dataset.v === item.letra;
        if (ok) {
          b.classList.add("is-certa", "is-acerto-fx");
          AmiguitoEducar.acertoFesta(root, "Cada letra tem um som. Juntas, elas formam palavras!", "Letra certa!");
          setTimeout(() => onDone({ sucesso: true, msg: "Letra " + item.letra + "!" }), 1200);
        } else {
          const certa = [...ops.querySelectorAll(".opcao")].find((x) => x.dataset.v === item.letra);
          AmiguitoEducar.erroGentil(null, b, certa, root);
          setTimeout(() => montarLetras(root, dados, onDone, falarFn), 1500);
        }
      }));
    };
  }

  function montarSilabas(root, dados, onDone, falarFn) {
    const silabas = (dados && dados.silabas) || [
      { alvo: "BA", emoji: "🍌", opcoes: ["BA", "BO", "BI"] },
      { alvo: "LU", emoji: "🌙", opcoes: ["LA", "LU", "LI"] },
      { alvo: "SA", emoji: "⭐", opcoes: ["SA", "SE", "SO"] }
    ];
    const item = silabas[Math.floor(Math.random() * silabas.length)];
    root.innerHTML = `
      ${AmiguitoEducar.fasesHtml("pratica")}
      ${AmiguitoEducar.coachHtml("Ouça e toque na sílaba.")}
      <div class="card" style="text-align:center">
        <div style="font-size:3rem">${item.emoji}</div>
        <button type="button" class="btn btn--sol" id="btn-ouvir">🗣️ Ouvir</button>
        <div class="jogo__opcoes" style="margin-top:0.75rem">${AmiguitoEnsinar.embaralhar(item.opcoes).map((o) =>
          `<button type="button" class="opcao" data-v="${o}" style="font-size:1.4rem;font-weight:900">${o}</button>`).join("")}</div>
        ${AmiguitoEducar.porqueBox("Sílabas são pedacinhos de som que montam a palavra.")}
      </div>`;
    AmiguitoEducar.setCoach(root, "Qual sílaba combina?", true);
    root.querySelector("#btn-ouvir").onclick = () => falar(item.alvo, falarFn);
    falar(item.alvo, falarFn);
    root.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.v === item.alvo;
      if (ok) {
        b.classList.add("is-certa");
        AmiguitoEducar.acertoFesta(root, "Sílabas são pedacinhos de som que montam a palavra.", "Sílaba certa!");
        setTimeout(() => onDone({ sucesso: true, msg: "Sílaba " + item.alvo + "!" }), 1100);
      } else {
        const certa = [...root.querySelectorAll(".opcao")].find((x) => x.dataset.v === item.alvo);
        AmiguitoEducar.erroGentil(null, b, certa, root);
        setTimeout(() => montarSilabas(root, dados, onDone, falarFn), 1400);
      }
    }));
  }

  function montarPalavras(root, dados, onDone, falarFn) {
    const palavras = (dados && dados.palavras) || [
      { palavra: "SOL", emoji: "☀️", opcoes: ["☀️", "🌙", "⭐"] },
      { palavra: "LUA", emoji: "🌙", opcoes: ["🌙", "🍎", "🚀"] },
      { palavra: "CÉU", emoji: "☁️", opcoes: ["☁️", "🐟", "🧀"] }
    ];
    const item = palavras[Math.floor(Math.random() * palavras.length)];
    const opcoesPic = item.opcoes || ([item.emoji].concat(item.distratores || ["🌙","⚽","🏠"]).slice(0,4));
    root.innerHTML = `
      ${AmiguitoEducar.fasesHtml("pratica")}
      ${AmiguitoEducar.coachHtml("Ouça a palavra e toque na figurinha.")}
      <div class="card" style="text-align:center">
        <p class="letra-gigante" style="font-size:2.5rem">${item.palavra}</p>
        <button type="button" class="btn btn--sol" id="btn-ouvir">🗣️ Ouvir</button>
        <div class="jogo__opcoes pic-grid" style="margin-top:0.75rem">${AmiguitoEnsinar.embaralhar(opcoesPic).map((o) =>
          `<button type="button" class="opcao pic-btn" data-v="${o}" style="font-size:2.2rem">${o}</button>`).join("")}</div>
        ${AmiguitoEducar.porqueBox("Palavras nomeiam as coisas que a gente vê e sente.")}
      </div>`;
    AmiguitoEducar.setCoach(root, "Toque a figurinha da palavra.", true);
    root.querySelector("#btn-ouvir").onclick = () => falar(item.palavra, falarFn);
    falar(item.palavra, falarFn);
    root.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.v === item.emoji;
      if (ok) {
        b.classList.add("is-certa");
        AmiguitoEducar.acertoFesta(root, "Palavras nomeiam as coisas que a gente vê e sente.", "Palavra certa!");
        setTimeout(() => onDone({ sucesso: true, msg: "Palavra " + item.palavra + "!" }), 1100);
      } else {
        const certa = [...root.querySelectorAll(".opcao")].find((x) => x.dataset.v === item.emoji);
        AmiguitoEducar.erroGentil(null, b, certa, root);
        setTimeout(() => montarPalavras(root, dados, onDone, falarFn), 1400);
      }
    }));
  }

  function montarBandeja(root, dados, onDone, falarFn) {
    const letras = ["A", "E", "I", "O", "U", "M", "P", "S"];
    const alvo = letras[Math.floor(Math.random() * letras.length)];
    const pecas = AmiguitoEnsinar.embaralhar(letras).slice(0, 6).map((L, i) => ({
      id: "l" + i, match: L === alvo ? "ok" : "x" + i, icone: L, label: L
    }));
    // ensure one correct
    if (!pecas.some((p) => p.match === "ok")) {
      pecas[0] = { id: "alvo", match: "ok", icone: alvo, label: alvo };
    }
    AmiguitoEducar.montarArrastarSlots(root, {
      pecas: pecas.filter((p) => p.match === "ok").concat(pecas.filter((p) => p.match !== "ok").slice(0, 2)),
      slots: [{ id: "bandeja", accept: "ok", label: "Bandeja " + alvo, icone: "🧺" }],
      fala: "Coloque a letra " + alvo + " na bandeja.",
      porque: "Separar letras na bandeja treina o olho e a mão juntos.",
      msgOk: "Bandeja certa!",
      trilha: "ler",
      meta: 1
    }, onDone);
  }

  function montar(tipo, root, dados, onDone, falarFn) {
    if (tipo === "letras") return montarLetras(root, dados, onDone, falarFn);
    if (tipo === "silabas") return montarSilabas(root, dados, onDone, falarFn);
    if (tipo === "palavras") return montarPalavras(root, dados, onDone, falarFn);
    if (tipo === "bandeja") return montarBandeja(root, dados, onDone, falarFn);
    return montarLetras(root, dados, onDone, falarFn);
  }

  global.AmiguitoLer = { montar, montarLetras, montarSilabas, montarPalavras, montarBandeja };
})(window);
