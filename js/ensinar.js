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
      opcoes: embaralhar(p.opcoes),
      total: desafio ? Math.min(6, pool.length + 2) : pool.length,
      indice: desafio ? indice : idx
    };
  }
  function verificar(opcao) { return !!(opcao && opcao.certa); }
  global.AmiguitoEnsinar = { montarPergunta, verificar, embaralhar };
})(window);
