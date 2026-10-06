/* Lições Ensinar — fluxo pedagógico completo */
(function (global) {
  function embaralhar(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function montarPergunta(licao, indice, desafio) {
    const pool = licao.perguntas;
    if (!pool || !pool.length) return null;
    const idx = desafio ? Math.floor(Math.random() * pool.length) : indice;
    const p = pool[idx % pool.length];
    if (!p) return null;
    return {
      pergunta: p.pergunta,
      perguntaEn: p.perguntaEn || "",
      porque: p.porque || licao.porquePadrao || "Porque observar com carinho nos ensina!",
      opcoes: embaralhar(p.opcoes),
      total: desafio ? Math.min(6, pool.length + 2) : pool.length,
      indice: desafio ? indice : idx
    };
  }

  function verificar(opcao) { return !!(opcao && opcao.certa); }

  /** Sessão completa com fases + nível */
  function iniciarSessao(root, licao, opts, callbacks) {
    opts = opts || {};
    callbacks = callbacks || {};
    const nivel = opts.nivel || 1;
    const desafio = !!opts.desafio;
    const estado = { indice: 0, acertos: 0, combo: 0, nivel: nivel };
    const total = desafio ? Math.min(6, licao.perguntas.length + 2) : licao.perguntas.length;

    function proxima() {
      if (estado.indice >= total) {
        if (callbacks.onComplete) callbacks.onComplete(estado);
        return;
      }
      const pergunta = montarPergunta(licao, estado.indice, desafio);
      if (!pergunta) {
        if (callbacks.onComplete) callbacks.onComplete(estado);
        return;
      }
      // idioma
      if (opts.idioma === "en" && pergunta.perguntaEn) pergunta.pergunta = pergunta.perguntaEn;
      else if (opts.idioma === "ambos" && pergunta.perguntaEn) {
        pergunta.pergunta = pergunta.pergunta + " · " + pergunta.perguntaEn;
      }

      root.innerHTML = `<div class="edu-sessao" id="edu-sessao"></div>`;
      const box = root.querySelector("#edu-sessao");
      const hdr = document.createElement("div");
      hdr.className = "edu-sessao-hdr";
      hdr.innerHTML = `
        <div class="progresso-foguete" aria-label="Progresso">
          <span class="progresso-foguete__ico">🚀</span>
          <div class="progresso-foguete__trilho"><div class="progresso-foguete__fill" style="width:${Math.round((estado.indice / total) * 100)}%"></div></div>
          <span style="font-weight:900;font-size:0.85rem">${estado.indice + 1}/${total}</span>
        </div>
        ${estado.combo >= 2 ? `<div class="combo-badge">🔥 Combo x${estado.combo}</div>` : ""}`;
      box.appendChild(hdr);
      const corpo = document.createElement("div");
      box.appendChild(corpo);

      AmiguitoEducar.montarQuizFases(corpo, pergunta, { nivel: estado.nivel }, (res) => {
        if (res.sucesso) {
          estado.acertos += 1;
          estado.combo += 1;
        } else {
          estado.combo = 0;
        }
        estado.indice += 1;
        setTimeout(proxima, 200);
      });
    }
    proxima();
    return estado;
  }

  global.AmiguitoEnsinar = { montarPergunta, verificar, embaralhar, iniciarSessao };
})(window);
