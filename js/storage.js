/* Persistência Pro + migração v1 → v2 */
(function (global) {
  const CHAVE = "amiguito-virtual-v1"; // mesma chave: migra campos novos

  const estadoPadrao = () => ({
    versaoSave: 2,
    personagemId: null,
    nomePet: "",
    necessidades: { fome: 85, humor: 85, energia: 85, carinho: 85 },
    ultimaAtualizacao: Date.now(),
    nivel: 1,
    xp: 0,
    cuidadosFeitos: 0,
    licoesCompletas: [],
    missoesFeitas: [],
    trofeus: [],
    jogosJogados: [],
    yogaFeitas: [],
    roteiros: {}, // { [rotaId]: { feitos: string[], completo: bool } }
    acessorios: [],
    dicaDoDia: null,
    dicaData: null,
    somAtivo: false,
    idiomaDica: "pt", // pt | en | ambos
    streak: 0,
    ultimoDia: null,
    criadoEm: Date.now()
  });

  function carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (!bruto) return estadoPadrao();
      const dados = JSON.parse(bruto);
      const base = estadoPadrao();
      const merged = Object.assign(base, dados, {
        necessidades: Object.assign(base.necessidades, dados.necessidades || {}),
        roteiros: Object.assign({}, base.roteiros, dados.roteiros || {}),
        licoesCompletas: dados.licoesCompletas || [],
        missoesFeitas: dados.missoesFeitas || [],
        trofeus: dados.trofeus || [],
        jogosJogados: dados.jogosJogados || [],
        yogaFeitas: dados.yogaFeitas || [],
        acessorios: dados.acessorios || []
      });
      merged.versaoSave = 2;
      return registrarStreak(merged);
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
      console.warn("Falha ao salvar", e);
      return false;
    }
  }

  function resetar() {
    localStorage.removeItem(CHAVE);
    return estadoPadrao();
  }

  function registrarStreak(estado) {
    const hoje = new Date().toISOString().slice(0, 10);
    if (estado.ultimoDia === hoje) return estado;
    if (!estado.ultimoDia) {
      estado.streak = 1;
    } else {
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      const y = ontem.toISOString().slice(0, 10);
      estado.streak = estado.ultimoDia === y ? (estado.streak || 0) + 1 : 1;
    }
    estado.ultimoDia = hoje;
    return estado;
  }

  function aplicarDecaimento(estado) {
    const agora = Date.now();
    const horas = Math.max(0, (agora - (estado.ultimaAtualizacao || agora)) / 3600000);
    if (horas < 0.02) return estado;
    const n = estado.necessidades;
    n.fome = clamp(n.fome - horas * 5);
    n.humor = clamp(n.humor - horas * 3.5);
    n.energia = clamp(n.energia - horas * 2.5);
    n.carinho = clamp(n.carinho - horas * 4);
    estado.ultimaAtualizacao = agora;
    return estado;
  }

  function clamp(v) { return Math.max(0, Math.min(100, Math.round(v))); }

  function ganharXp(estado, qtd) {
    estado.xp += qtd;
    while (estado.xp >= xpParaNivel(estado.nivel)) {
      estado.xp -= xpParaNivel(estado.nivel);
      estado.nivel += 1;
    }
    return estado;
  }

  function xpParaNivel(nivel) { return 18 + (nivel - 1) * 8; }

  function progressoRota(estado, rotaId) {
    if (!estado.roteiros[rotaId]) estado.roteiros[rotaId] = { feitos: [], completo: false };
    return estado.roteiros[rotaId];
  }

  global.AmiguitoStorage = {
    carregar, salvar, resetar, aplicarDecaimento, ganharXp, xpParaNivel,
    clamp, progressoRota, registrarStreak, CHAVE
  };
})(window);
