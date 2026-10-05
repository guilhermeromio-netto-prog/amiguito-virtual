/* Persistência local — Amiguito Virtual */
(function (global) {
  const CHAVE = "amiguito-virtual-v1";

  const estadoPadrao = () => ({
    personagemId: null,
    nomeCrianca: "",
    necessidades: { fome: 80, humor: 80, energia: 80, carinho: 80 },
    ultimaAtualizacao: Date.now(),
    nivel: 1,
    xp: 0,
    cuidadosFeitos: 0,
    licoesCompletas: [],
    missoesFeitas: [],
    trofeus: [],
    dicaDoDia: null,
    dicaData: null,
    somAtivo: false,
    criadoEm: Date.now()
  });

  function carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (!bruto) return estadoPadrao();
      const dados = JSON.parse(bruto);
      return Object.assign(estadoPadrao(), dados, {
        necessidades: Object.assign(estadoPadrao().necessidades, dados.necessidades || {})
      });
    } catch (e) {
      console.warn("Falha ao ler progresso", e);
      return estadoPadrao();
    }
  }

  function salvar(estado) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
      return true;
    } catch (e) {
      console.warn("Falha ao salvar progresso", e);
      return false;
    }
  }

  function resetar() {
    localStorage.removeItem(CHAVE);
    return estadoPadrao();
  }

  /** Decai suave das necessidades com base no tempo decorrido */
  function aplicarDecaimento(estado) {
    const agora = Date.now();
    const horas = Math.max(0, (agora - (estado.ultimaAtualizacao || agora)) / 3600000);
    if (horas < 0.02) return estado; // ~1 min

    // Por hora: fome -6, humor -4, energia -3, carinho -5 (gentil)
    const n = estado.necessidades;
    n.fome = clamp(n.fome - horas * 6);
    n.humor = clamp(n.humor - horas * 4);
    n.energia = clamp(n.energia - horas * 3);
    n.carinho = clamp(n.carinho - horas * 5);
    estado.ultimaAtualizacao = agora;
    return estado;
  }

  function clamp(v) {
    return Math.max(0, Math.min(100, Math.round(v)));
  }

  function ganharXp(estado, qtd) {
    estado.xp += qtd;
    while (estado.xp >= xpParaNivel(estado.nivel)) {
      estado.xp -= xpParaNivel(estado.nivel);
      estado.nivel += 1;
    }
    return estado;
  }

  function xpParaNivel(nivel) {
    return 20 + (nivel - 1) * 10;
  }

  global.AmiguitoStorage = {
    carregar,
    salvar,
    resetar,
    aplicarDecaimento,
    ganharXp,
    xpParaNivel,
    clamp,
    CHAVE
  };
})(window);
