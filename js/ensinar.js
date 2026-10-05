/* Jogos de ensinar */
(function (global) {
  function embaralhar(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function montarPergunta(licao, indice) {
    const p = licao.perguntas[indice];
    if (!p) return null;
    return {
      pergunta: p.pergunta,
      opcoes: embaralhar(p.opcoes),
      total: licao.perguntas.length,
      indice
    };
  }

  function verificar(opcao) {
    return !!(opcao && opcao.certa);
  }

  global.AmiguitoEnsinar = { montarPergunta, verificar, embaralhar };
})(window);
