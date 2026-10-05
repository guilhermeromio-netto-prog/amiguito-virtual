/* Fala PT-BR via speechSynthesis — respeita mute */
(function (global) {
  let fila = null;
  let vozPt = null;

  function escolherVoz() {
    if (!global.speechSynthesis) return null;
    const voices = speechSynthesis.getVoices() || [];
    vozPt = voices.find((v) => /pt-BR/i.test(v.lang)) ||
            voices.find((v) => /^pt/i.test(v.lang)) ||
            voices.find((v) => /brazil|brasil|luciana|fernanda|google português/i.test(v.name)) ||
            null;
    return vozPt;
  }

  if (global.speechSynthesis) {
    speechSynthesis.addEventListener("voiceschanged", escolherVoz);
    escolherVoz();
  }

  function mutado() {
    return !(global.AmiguitoEstado && global.AmiguitoEstado.somAtivo);
  }

  function cancelar() {
    try { if (global.speechSynthesis) speechSynthesis.cancel(); } catch (_) {}
    fila = null;
  }

  /**
   * @param {string} texto
   * @param {{force?: boolean, rate?: number}} opts
   */
  function falar(texto, opts) {
    opts = opts || {};
    if (!texto || !global.speechSynthesis) return;
    if (mutado() && !opts.force) return;
    cancelar();
    const u = new SpeechSynthesisUtterance(String(texto).replace(/\s+/g, " ").trim());
    u.lang = "pt-BR";
    u.rate = opts.rate || 0.92;
    u.pitch = 1.05;
    u.volume = 1;
    const v = vozPt || escolherVoz();
    if (v) u.voice = v;
    fila = u;
    try { speechSynthesis.speak(u); } catch (_) {}
  }

  function rotuloDe(el) {
    if (!el) return "";
    return el.getAttribute("data-fala") ||
           el.getAttribute("aria-label") ||
           (el.getAttribute("title") || "") ||
           (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
  }

  /** Liga escuta de clique/foco em [data-fala] e botões principais */
  function amarrar(root) {
    const base = root || document;
    base.querySelectorAll("[data-fala], .acao, .nav__item, .persona, .opcao, .card-link, .btn-passo, .chip, .btn--primario, .btn--secundario, .btn--menta, .btn--sol, .btn--rosa").forEach((el) => {
      if (el._falaBound) return;
      el._falaBound = true;
      const say = () => {
        const t = rotuloDe(el);
        if (t) falar(t);
      };
      el.addEventListener("click", () => { setTimeout(say, 30); }, { passive: true });
      el.addEventListener("focus", say, { passive: true });
    });
  }

  global.AmiguitoFala = { falar, cancelar, amarrar, rotuloDe, mutado, escolherVoz };
})(window);
