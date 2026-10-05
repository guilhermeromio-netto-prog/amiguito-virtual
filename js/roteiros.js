(function (global) {
  function estadoPasso(prog, passos, passoId) {
    const feitos = new Set(prog.feitos || []);
    if (feitos.has(passoId)) return "feito";
    const idx = passos.findIndex((p) => p.id === passoId);
    const anteriorOk = idx === 0 || feitos.has(passos[idx - 1].id);
    return anteriorOk ? "atual" : "bloqueado";
  }

  function marcarPasso(estado, rotaId, passoId, passos) {
    const prog = AmiguitoStorage.progressoRota(estado, rotaId);
    if (!prog.feitos.includes(passoId)) prog.feitos.push(passoId);
    if (prog.feitos.length >= passos.length) {
      prog.completo = true;
    }
    AmiguitoStorage.ganharXp(estado, 6);
    return estado;
  }

  function pct(prog, total) {
    return Math.round(((prog.feitos || []).length / Math.max(1, total)) * 100);
  }

  global.AmiguitoRoteiros = { estadoPasso, marcarPasso, pct };
})(window);
