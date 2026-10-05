(function (global) {
  function aleatorio(lista) {
    if (!lista || !lista.length) return "";
    return lista[Math.floor(Math.random() * lista.length)];
  }
  function falar(personagem, tipo, ctx) {
    ctx = ctx || {};
    const extras = ctx.listasExtras || {};
    switch (tipo) {
      case "saudacao": return aleatorio(personagem.saudacoes);
      case "pedido": return aleatorio((personagem.pedidos && personagem.pedidos[ctx.necessidade]) || ["Me ajuda, por favor?"]);
      case "elogio": return aleatorio(personagem.elogios);
      case "cuidado": return aleatorio((extras.falasCuidado && extras.falasCuidado[ctx.acao]) || ["Obrigada!"]);
      case "certo": return aleatorio(extras.respostasCerto || ["Acertou!"]);
      case "errado": return aleatorio(extras.respostasErrado || ["Tenta de novo!"]);
      case "livre": return ctx.texto || "";
      default: return aleatorio(personagem.saudacoes);
    }
  }
  global.AmiguitoIA = { falar, aleatorio };
})(window);
