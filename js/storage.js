/* Persistência Amiguito Pro — necessidades Pou-like, moedas, evolução */
(function (global) {
  const CHAVE = "amiguito-virtual-v1";
  const IDS_NOVOS = ["rumi", "zoe", "mira", "emily", "leozinho", "void", "nova", "pixi", "sol"];
  const IDS_ANTIGOS = ["luna", "pipoca", "fogo"];

  const estadoPadrao = () => ({
    versaoSave: 6,
    personagemId: null,
    nomePet: "",
    necessidades: { fome: 80, feliz: 85, energia: 85, higiene: 80 },
    ultimaAtualizacao: Date.now(),
    nivel: 1,
    xp: 0,
    moedas: 20,
    highScores: {},
    moveis: [],
    acessorios: [],
    acessoriosDesbloqueados: ["estrela"],
    moveisDesbloqueados: ["tapete-basico"],
    cuidadosFeitos: 0,
    licoesCompletas: [],
    missoesFeitas: [],
    trofeus: [],
    jogosJogados: [],
    yogaFeitas: [],
    stemFeitas: [],
    roteiros: {},
    dicaDoDia: null,
    dicaData: null,
    somAtivo: false,
    temaMusica: "calma",
    modoFiguras: true,
    primeiraVisita: true,
    idiomaDica: "pt",
    nivelEducar: {},
    sequenciasProgresso: {},
    streak: 0,
    ultimoDia: null,
    viuHero: false,
    criadoEm: Date.now()
  });

  function migrarNecessidades(oldN) {
    oldN = oldN || {};
    // Novo modelo Pou-like
    if (oldN.fome != null && oldN.feliz != null && oldN.higiene != null) {
      return {
        fome: clamp(oldN.fome),
        feliz: clamp(oldN.feliz),
        energia: clamp(oldN.energia != null ? oldN.energia : 85),
        higiene: clamp(oldN.higiene)
      };
    }
    // Legado humor/carinho/diversao
    const feliz = clamp(
      oldN.feliz != null ? oldN.feliz :
      Math.round(((oldN.humor || 85) + (oldN.carinho || 85) + (oldN.diversao || 85)) / 3)
    );
    const fome = clamp(oldN.fome != null ? oldN.fome : (oldN.diversao != null ? oldN.diversao : 80));
    return {
      fome: fome,
      feliz: feliz,
      energia: clamp(oldN.energia != null ? oldN.energia : 85),
      higiene: clamp(oldN.higiene != null ? oldN.higiene : (oldN.carinho != null ? Math.min(100, oldN.carinho + 10) : 80))
    };
  }

  function migrar(dados) {
    const base = estadoPadrao();
    const merged = Object.assign(base, dados, {
      necessidades: migrarNecessidades(dados.necessidades),
      roteiros: Object.assign({}, base.roteiros, dados.roteiros || {}),
      licoesCompletas: dados.licoesCompletas || [],
      missoesFeitas: dados.missoesFeitas || [],
      trofeus: dados.trofeus || [],
      jogosJogados: dados.jogosJogados || [],
      yogaFeitas: dados.yogaFeitas || [],
      stemFeitas: dados.stemFeitas || [],
      acessorios: dados.acessorios || [],
      highScores: Object.assign({}, base.highScores, dados.highScores || {}),
      moveis: dados.moveis || [],
      acessoriosDesbloqueados: dados.acessoriosDesbloqueados || base.acessoriosDesbloqueados,
      moveisDesbloqueados: dados.moveisDesbloqueados || base.moveisDesbloqueados,
      nivelEducar: Object.assign({}, base.nivelEducar, dados.nivelEducar || {}),
      sequenciasProgresso: Object.assign({}, base.sequenciasProgresso, dados.sequenciasProgresso || {})
    });
    if (merged.moedas == null) merged.moedas = 20;
    if (merged.personagemId && IDS_ANTIGOS.includes(merged.personagemId)) {
      merged.personagemId = null;
    }
    if (merged.personagemId && !IDS_NOVOS.includes(merged.personagemId)) {
      merged.personagemId = null;
    }
    merged.versaoSave = 6;
    if (!merged.temaMusica) merged.temaMusica = "calma";
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
    n.fome = clamp(n.fome - horas * 5);
    n.feliz = clamp(n.feliz - horas * 3.5);
    n.energia = clamp(n.energia - horas * 2.8);
    n.higiene = clamp(n.higiene - horas * 3.2);
    estado.ultimaAtualizacao = agora;
    return estado;
  }

  function clamp(v) { return Math.max(0, Math.min(100, Math.round(Number(v) || 0))); }

  function xpParaNivel(nivel) { return 16 + (nivel - 1) * 7; }

  /** @returns {{ nivelou: boolean, nivelAntes: number }} */
  function ganharXp(estado, qtd) {
    const nivelAntes = estado.nivel;
    estado.xp += qtd;
    while (estado.xp >= xpParaNivel(estado.nivel)) {
      estado.xp -= xpParaNivel(estado.nivel);
      estado.nivel += 1;
    }
    return { nivelou: estado.nivel > nivelAntes, nivelAntes };
  }

  function ganharMoedas(estado, qtd) {
    estado.moedas = Math.max(0, (estado.moedas || 0) + qtd);
    return estado.moedas;
  }

  function registrarScore(estado, jogoId, score) {
    const prev = (estado.highScores && estado.highScores[jogoId]) || 0;
    if (score > prev) {
      if (!estado.highScores) estado.highScores = {};
      estado.highScores[jogoId] = score;
      return true;
    }
    return false;
  }

  /** Estágios visuais: bebe (1–2), crianca (3–5), explorador (6+) */
  function estagioDe(nivel) {
    if (nivel >= 6) return { id: "explorador", nome: "Explorador", icone: "🚀", min: 6 };
    if (nivel >= 3) return { id: "crianca", nome: "Criança", icone: "🌟", min: 3 };
    return { id: "bebe", nome: "Bebê", icone: "🐣", min: 1 };
  }

  function progressoRota(estado, rotaId) {
    if (!estado.roteiros[rotaId]) estado.roteiros[rotaId] = { feitos: [], completo: false };
    return estado.roteiros[rotaId];
  }

  global.AmiguitoStorage = {
    carregar, salvar, resetar, aplicarDecaimento, ganharXp, ganharMoedas,
    registrarScore, xpParaNivel, estagioDe, clamp, progressoRota, registrarStreak,
    CHAVE, IDS_NOVOS
  };
})(window);
