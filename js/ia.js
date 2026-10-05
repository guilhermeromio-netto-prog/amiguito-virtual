/* Camada de fala do Amiguito.
   Hoje: só roteiro de dados.json.
   Futuro: trocar falar() por chamada ao Grok (sem expor chave no front). */
(function (global) {
  function aleatorio(lista) {
    if (!lista || !lista.length) return "";
    return lista[Math.floor(Math.random() * lista.length)];
  }

  /**
   * @param {object} personagem — do dados.json
   * @param {string} tipo — saudacao | pedido | elogio | cuidado | certo | errado | livre
   * @param {object} ctx — { necessidade, acao, listasExtras }
   */
  function falar(personagem, tipo, ctx) {
    ctx = ctx || {};
    const extras = ctx.listasExtras || {};

    switch (tipo) {
      case "saudacao":
        return aleatorio(personagem.saudacoes);
      case "pedido":
        return aleatorio((personagem.pedidos && personagem.pedidos[ctx.necessidade]) || ["Me ajuda, por favor?"]);
      case "elogio":
        return aleatorio(personagem.elogios);
      case "cuidado":
        return aleatorio((extras.falasCuidado && extras.falasCuidado[ctx.acao]) || ["Obrigada!"]);
      case "certo":
        return aleatorio(extras.respostasCerto || ["Acertou!"]);
      case "errado":
        return aleatorio(extras.respostasErrado || ["Tenta de novo!"]);
      case "livre":
        return ctx.texto || "";
      default:
        return aleatorio(personagem.saudacoes);
    }
  }

  // Ponto de extensão futuro:
  // async function falarComGrok(prompt) { ... }

  global.AmiguitoIA = { falar, aleatorio };
})(window);
