/* Web Audio — SFX originais, mudo por padrão */
(function (global) {
  let ctx = null;
  let bgmTimer = null;
  let bgmOn = false;

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
      g.gain.value = vol || 0.05;
      o.connect(g); g.connect(c.destination);
      const t = when || c.currentTime;
      o.start(t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.stop(t + dur + 0.02);
    } catch (_) {}
  }

  function ativo() {
    return !!(global.AmiguitoEstado && global.AmiguitoEstado.somAtivo);
  }

  function tap() { if (ativo()) tom(520, 0.08, "triangle", 0.04); }
  function sucesso() {
    if (!ativo()) return;
    const c = ac();
    tom(523, 0.12, "sine", 0.05, c.currentTime);
    tom(659, 0.12, "sine", 0.05, c.currentTime + 0.1);
    tom(784, 0.18, "sine", 0.055, c.currentTime + 0.2);
  }
  function erro() { if (ativo()) tom(220, 0.15, "triangle", 0.035); }
  function carinho() {
    if (!ativo()) return;
    const c = ac();
    tom(660, 0.1, "sine", 0.04, c.currentTime);
    tom(880, 0.14, "sine", 0.04, c.currentTime + 0.09);
  }
  function nivel() {
    if (!ativo()) return;
    const c = ac();
    [523, 659, 784, 1046].forEach((f, i) => tom(f, 0.12, "sine", 0.045, c.currentTime + i * 0.1));
  }

  function startBgm() {
    if (!ativo() || bgmOn) return;
    bgmOn = true;
    const notas = [392, 440, 494, 523, 494, 440];
    let i = 0;
    bgmTimer = setInterval(() => {
      if (!ativo()) { stopBgm(); return; }
      tom(notas[i % notas.length], 0.35, "sine", 0.012);
      i += 1;
    }, 900);
  }
  function stopBgm() {
    bgmOn = false;
    if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
  }
  function syncBgm(on) {
    if (on) startBgm(); else stopBgm();
  }

  global.AmiguitoSom = { tap, sucesso, erro, carinho, nivel, syncBgm, stopBgm };
})(window);
