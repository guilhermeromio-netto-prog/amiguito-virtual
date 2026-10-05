(function (global) {
  const CHAVE = "amiguito-virtual-v1";
  const IDS_NOVOS = ["rumi", "zoe", "mira", "emily", "leozinho"];
  const IDS_ANTIGOS = ["luna", "pipoca", "fogo"];

  const estadoPadrao = () => ({
    versaoSave: 3,
    personagemId: null,
    nomePet: "",
    necessidades: { humor: 85, energia: 85, carinho: 85, diversao: 85 },
    ultimaAtualizacao: Date.now(),
    nivel: 1,
    xp: 0,
    cuidadosFeitos: 0,
    licoesCompletas: [],
    missoesFeitas: [],
    trofeus: [],
    jogosJogados: [],
    yogaFeitas: [],
    stemFeitas: [],
    roteiros: {},
    acessorios: [],
    dicaDoDia: null,
    dicaData: null,
    somAtivo: false,
    idiomaDica: "pt",
    streak: 0,
    ultimoDia: null,
    viuHero: false,
    criadoEm: Date.now()
  });

  function migrar(dados) {
    const base = estadoPadrao();
    const merged = Object.assign(base, dados, {
      necessidades: Object.assign(base.necessidades, dados.necessidades || {}),
      roteiros: Object.assign({}, base.roteiros, dados.roteiros || {}),
      licoesCompletas: dados.licoesCompletas || [],
      missoesFeitas: dados.missoesFeitas || [],
      trofeus: dados.trofeus || [],
      jogosJogados: dados.jogosJogados || [],
      yogaFeitas: dados.yogaFeitas || [],
      stemFeitas: dados.stemFeitas || [],
      acessorios: dados.acessorios || []
    });
    // map old animal needs → new
    if (dados.necessidades && dados.necessidades.fome != null && merged.necessidades.diversao == null) {
      merged.necessidades.diversao = dados.necessidades.fome;
    }
    if (!merged.necessidades.diversao && merged.necessidades.diversao !== 0) merged.necessidades.diversao = 85;
    delete merged.necessidades.fome;
    // old characters → force re-pick but keep progress
    if (merged.personagemId && IDS_ANTIGOS.includes(merged.personagemId)) {
      merged.personagemId = null;
      merged.nomePet = merged.nomePet || "";
    }
    if (merged.personagemId && !IDS_NOVOS.includes(merged.personagemId)) {
      merged.personagemId = null;
    }
    merged.versaoSave = 3;
    return merged;
  }

  function carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (!bruto) return estadoPadrao();
      return registrarStreak(migrar(JSON.parse(bruto)));
    } catch (e) {
      return estadoPadrao();
    }
  }

  function salvar(estado) {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); return true; }
    catch (e) { return false; }
  }

  function resetar() {
    localStorage.removeItem(CHAVE);
    return estadoPadrao();
  }

  function registrarStreak(estado) {
    const hoje = new Date().toISOString().slice(0, 10);
    if (estado.ultimoDia === hoje) return estado;
    if (!estado.ultimoDia) estado.streak = 1;
    else {
      const ontem = new Date(); ontem.setDate(ontem.getDate() - 1);
      estado.streak = estado.ultimoDia === ontem.toISOString().slice(0, 10) ? (estado.streak || 0) + 1 : 1;
    }
    estado.ultimoDia = hoje;
    return estado;
  }

  function aplicarDecaimento(estado) {
    const agora = Date.now();
    const horas = Math.max(0, (agora - (estado.ultimaAtualizacao || agora)) / 3600000);
    if (horas < 0.02) return estado;
    const n = estado.necessidades;
    n.humor = clamp(n.humor - horas * 3.5);
    n.energia = clamp(n.energia - horas * 2.5);
    n.carinho = clamp(n.carinho - horas * 4);
    n.diversao = clamp(n.diversao - horas * 4.5);
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
    clamp, progressoRota, registrarStreak, CHAVE, IDS_NOVOS
  };
})(window);
