/* Fala PT-BR — frases curtas, rate ~0.9, fila limpa */
(function (global) {
  let vozPt = null;
  let falando = false;

  function escolherVoz() {
    if (!global.speechSynthesis) return null;
    const voices = speechSynthesis.getVoices() || [];
    vozPt = voices.find((v) => /pt-BR/i.test(v.lang)) ||
            voices.find((v) => /^pt/i.test(v.lang)) ||
            voices.find((v) => /brazil|brasil|luciana|fernanda/i.test(v.name)) || null;
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
    falando = false;
  }

  /** Encurta texto pra criança (máx ~12 palavras) */
  function encurtar(texto) {
    let t = String(texto || "").replace(/\s+/g, " ").trim();
    t = t.replace(/[—–]/g, ". ").replace(/\s+/g, " ");
    const parts = t.split(/(?<=[.!?])\s+/);
    t = parts[0] || t;
    const words = t.split(" ");
    if (words.length > 12) t = words.slice(0, 12).join(" ");
    return t;
  }

  function falar(texto, opts) {
    opts = opts || {};
    if (!texto || !global.speechSynthesis) return;
    if (mutado() && !opts.force) return;
    cancelar();
    // completo:true = bio completa (sem cortar)
    let t = String(texto || "").replace(/\s+/g, " ").trim();
    if (!opts.completo) t = encurtar(t);
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "pt-BR";
    u.rate = opts.rate != null ? opts.rate : (opts.completo ? 0.92 : 0.88);
    u.pitch = 1.08;
    u.volume = 1;
    const v = vozPt || escolherVoz();
    if (v) u.voice = v;
    falando = true;
    u.onend = u.onerror = () => { falando = false; };
    try { speechSynthesis.speak(u); } catch (_) { falando = false; }
  }

  function rotuloDe(el) {
    if (!el) return "";
    return el.getAttribute("data-fala") ||
           el.getAttribute("aria-label") ||
           (el.getAttribute("title") || "") ||
           (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
  }

  function amarrar(root) {
    const base = root || document;
    base.querySelectorAll("[data-fala], .acao, .nav__item, .persona, .opcao, .card-link, .btn-passo, .chip, .pic-btn, .geo-regiao, .mapa-hot").forEach((el) => {
      if (el._falaBound) return;
      if (el.hasAttribute("data-fala-bio")) return; // bio completa tratada no app
      el._falaBound = true;
      const say = () => {
        const t = rotuloDe(el);
        if (t) falar(t);
      };
      el.addEventListener("click", () => setTimeout(say, 40), { passive: true });
      el.addEventListener("focus", say, { passive: true });
    });
  }

  global.AmiguitoFala = { falar, cancelar, amarrar, rotuloDe, mutado, escolherVoz, encurtar };
})(window);
