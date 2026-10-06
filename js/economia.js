/* Loja cosmética — estrelas/moedas (sem dinheiro real) */
(function (global) {
  const LOJA = {
    acessorios: [
      { id: "estrela", nome: "Estrelinha", emoji: "⭐", preco: 0, tipo: "acessorio" },
      { id: "capacete", nome: "Capacete", emoji: "👨‍🚀", preco: 25, tipo: "acessorio" },
      { id: "oculos", nome: "Óculos", emoji: "🕶️", preco: 20, tipo: "acessorio" },
      { id: "laco", nome: "Laço", emoji: "🎀", preco: 18, tipo: "acessorio" },
      { id: "coroa", nome: "Coroa", emoji: "👑", preco: 40, tipo: "acessorio" },
      { id: "foguete", nome: "Foguete", emoji: "🚀", preco: 35, tipo: "acessorio" },
      { id: "oculos-sol", nome: "Óculos sol", emoji: "😎", preco: 22, tipo: "acessorio" },
      { id: "bone", nome: "Boné", emoji: "🧢", preco: 28, tipo: "acessorio" }
    ],
    moveis: [
      { id: "tapete-basico", nome: "Tapete", emoji: "🟪", preco: 0, tipo: "movel" },
      { id: "planta", nome: "Plantinha", emoji: "🪴", preco: 15, tipo: "movel" },
      { id: "lampada", nome: "Luminária", emoji: "💡", preco: 30, tipo: "movel" },
      { id: "poster", nome: "Pôster", emoji: "🖼️", preco: 22, tipo: "movel" },
      { id: "sofa", nome: "Sofá fofo", emoji: "🛋️", preco: 50, tipo: "movel" },
      { id: "janela-arco", nome: "Janela", emoji: "🪟", preco: 45, tipo: "movel" }
    ]
  };

  function todos() {
    return LOJA.acessorios.concat(LOJA.moveis);
  }

  function item(id) {
    return todos().find((x) => x.id === id);
  }

  function desbloqueado(estado, it) {
    if (!it) return false;
    if (it.tipo === "movel") return (estado.moveisDesbloqueados || []).includes(it.id);
    return (estado.acessoriosDesbloqueados || []).includes(it.id);
  }

  function comprar(estado, id) {
    const it = item(id);
    if (!it) return { ok: false, msg: "Item sumiu…" };
    if (desbloqueado(estado, it)) return { ok: false, msg: "Já tem!" };
    if ((estado.moedas || 0) < it.preco) return { ok: false, msg: "Faltam estrelas ⭐" };
    estado.moedas -= it.preco;
    if (it.tipo === "movel") {
      if (!estado.moveisDesbloqueados) estado.moveisDesbloqueados = [];
      estado.moveisDesbloqueados.push(it.id);
      if (!estado.moveis.includes(it.id)) estado.moveis.push(it.id);
    } else {
      if (!estado.acessoriosDesbloqueados) estado.acessoriosDesbloqueados = [];
      estado.acessoriosDesbloqueados.push(it.id);
    }
    return { ok: true, msg: "Comprado! " + it.emoji, item: it };
  }

  function equiparAcessorio(estado, id) {
    if (!(estado.acessoriosDesbloqueados || []).includes(id)) return false;
    const i = estado.acessorios.indexOf(id);
    if (i >= 0) estado.acessorios.splice(i, 1);
    else {
      if (estado.acessorios.length >= 3) estado.acessorios.shift();
      estado.acessorios.push(id);
    }
    return true;
  }

  function toggleMovel(estado, id) {
    if (!(estado.moveisDesbloqueados || []).includes(id)) return false;
    const i = estado.moveis.indexOf(id);
    if (i >= 0) estado.moveis.splice(i, 1);
    else estado.moveis.push(id);
    return true;
  }

  global.AmiguitoEconomia = { LOJA, todos, item, desbloqueado, comprar, equiparAcessorio, toggleMovel };
})(window);
