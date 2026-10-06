/* Web Audio — SFX + 5 temas procedurais originais (sem copyright). Mudo por padrão. */
(function (global) {
  let ctx = null;
  let bgmTimer = null;
  let bgmOn = false;
  let temaAtual = "calma";

  const TEMAS = [
    { id: "calma", nome: "Calma", icone: "🌙", fala: "Música calma" },
    { id: "festa", nome: "Festa", icone: "🎉", fala: "Música de festa" },
    { id: "espaco", nome: "Espaço", icone: "🚀", fala: "Música do espaço" },
    { id: "floresta", nome: "Floresta", icone: "🌳", fala: "Música da floresta" },
    { id: "foco", nome: "Foco", icone: "📚", fala: "Música de estudar" }
  ];

  // Padrões originais: [freqHz, beats] — volume baixo, kid-safe
  const PADROES = {
    calma: {
      bpm: 72,
      vol: 0.011,
      type: "sine",
      notas: [392, 440, 494, 523, 494, 440, 392, 349]
    },
    festa: {
      bpm: 118,
      vol: 0.014,
      type: "triangle",
      notas: [523, 659, 784, 659, 587, 784, 880, 784]
    },
    espaco: {
      bpm: 88,
      vol: 0.012,
      type: "sine",
      notas: [220, 277, 330, 370, 330, 277, 247, 196]
    },
    floresta: {
      bpm: 96,
      vol: 0.012,
      type: "triangle",
      notas: [349, 392, 440, 523, 440, 392, 330, 294]
    },
    foco: {
      bpm: 84,
      vol: 0.010,
      type: "sine",
      notas: [440, 494, 523, 587, 523, 494, 440, 392]
    }
  };

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tom(freq, dur, type, vol, when) {
    try {
      const c = ac();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      const t = when != null ? when : c.currentTime;
      g.gain.setValueAtTime(Math.max(0.0001, vol || 0.05), t);
      o.connect(g); g.connect(c.destination);
      o.start(t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.stop(t + dur + 0.03);
    } catch (_) {}
  }

  function ruidoCurto(dur, vol) {
    try {
      const c = ac();
      const n = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
      const d = n.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
      const s = c.createBufferSource();
      const g = c.createGain();
      s.buffer = n;
      g.gain.value = vol || 0.02;
      s.connect(g); g.connect(c.destination);
      const t = c.currentTime;
      s.start(t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      s.stop(t + dur + 0.02);
    } catch (_) {}
  }

  function ativo() {
    return !!(global.AmiguitoEstado && global.AmiguitoEstado.somAtivo);
  }

  function tap() { if (ativo()) tom(520, 0.07, "triangle", 0.035); }
  function sucesso() {
    if (!ativo()) return;
    const c = ac();
    tom(523, 0.11, "sine", 0.05, c.currentTime);
    tom(659, 0.11, "sine", 0.05, c.currentTime + 0.09);
    tom(784, 0.16, "sine", 0.055, c.currentTime + 0.18);
  }
  function erro() { if (ativo()) tom(196, 0.16, "triangle", 0.03); }
  function carinho() {
    if (!ativo()) return;
    const c = ac();
    tom(660, 0.09, "sine", 0.04, c.currentTime);
    tom(880, 0.12, "sine", 0.04, c.currentTime + 0.08);
    tom(1046, 0.14, "sine", 0.03, c.currentTime + 0.16);
  }
  function nivel() {
    if (!ativo()) return;
    const c = ac();
    [523, 659, 784, 1046].forEach((f, i) => tom(f, 0.11, "sine", 0.042, c.currentTime + i * 0.09));
  }

  /** Stings por ação de cuidado — causa→efeito sonoro */
  function sting(acao) {
    if (!ativo()) return;
    const c = ac();
    const t = c.currentTime;
    if (acao === "carinho") {
      carinho();
      return;
    }
    if (acao === "brincar" || acao === "diversao") {
      tom(523, 0.08, "triangle", 0.04, t);
      tom(659, 0.08, "triangle", 0.04, t + 0.07);
      tom(784, 0.1, "triangle", 0.045, t + 0.14);
      tom(988, 0.12, "sine", 0.035, t + 0.22);
      return;
    }
    if (acao === "dormir") {
      tom(392, 0.22, "sine", 0.03, t);
      tom(330, 0.28, "sine", 0.028, t + 0.2);
      tom(262, 0.35, "sine", 0.025, t + 0.42);
      return;
    }
    if (acao === "alimentar" || acao === "comer") {
      ruidoCurto(0.06, 0.025);
      tom(440, 0.07, "square", 0.02, t + 0.05);
      tom(554, 0.08, "sine", 0.035, t + 0.12);
      return;
    }
    tap();
  }

  function combo() {
    if (!ativo()) return;
    const c = ac();
    [659, 784, 988, 1175].forEach((f, i) => tom(f, 0.09, "triangle", 0.04, c.currentTime + i * 0.07));
  }

  function desafioFanfarra() {
    if (!ativo()) return;
    const c = ac();
    tom(392, 0.12, "triangle", 0.04, c.currentTime);
    tom(523, 0.14, "triangle", 0.045, c.currentTime + 0.12);
    tom(659, 0.18, "sine", 0.05, c.currentTime + 0.26);
  }

  function contagem() {
    if (!ativo()) return;
    tom(880, 0.06, "square", 0.025);
  }

  function stopBgm() {
    bgmOn = false;
    if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
  }

  function startBgm(temaId) {
    if (!ativo()) return;
    if (temaId) temaAtual = temaId;
    const pad = PADROES[temaAtual] || PADROES.calma;
    stopBgm();
    bgmOn = true;
    const intervalo = Math.round(60000 / pad.bpm);
    let i = 0;
    // primeira nota imediata
    tom(pad.notas[0], intervalo / 1000 * 0.7, pad.type, pad.vol);
    bgmTimer = setInterval(() => {
      if (!ativo()) { stopBgm(); return; }
      i += 1;
      const f = pad.notas[i % pad.notas.length];
      // harmonia suave ocasional
      tom(f, intervalo / 1000 * 0.65, pad.type, pad.vol);
      if (temaAtual === "espaco" && i % 4 === 0) tom(f / 2, intervalo / 1000, "sine", pad.vol * 0.6);
      if (temaAtual === "floresta" && i % 3 === 0) ruidoCurto(0.04, 0.008);
      if (temaAtual === "festa" && i % 2 === 0) tom(f * 1.5, 0.05, "triangle", pad.vol * 0.5);
    }, intervalo);
  }

  function setTema(id) {
    if (!PADROES[id]) return;
    temaAtual = id;
    if (ativo() && bgmOn) startBgm(id);
  }

  function syncBgm(on, temaId) {
    if (temaId) temaAtual = temaId;
    if (on && ativo()) startBgm(temaAtual);
    else stopBgm();
  }

  function getTema() { return temaAtual; }

  global.AmiguitoSom = {
    TEMAS, tap, sucesso, erro, carinho, nivel, sting, combo, desafioFanfarra, contagem,
    syncBgm, stopBgm, startBgm, setTema, getTema
  };
})(window);
