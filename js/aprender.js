(function (global) {
  function dicaDoDia(dicas, estado) {
    const hoje = new Date().toISOString().slice(0, 10);
    if (estado.dicaData === hoje && estado.dicaDoDia != null) return dicas[estado.dicaDoDia % dicas.length];
    const idx = Math.floor(Math.random() * dicas.length);
    estado.dicaDoDia = idx;
    estado.dicaData = hoje;
    return dicas[idx];
  }
  function missoesDisponiveis(missoes, feitas) {
    const set = new Set(feitas || []);
    const pendentes = missoes.filter((m) => !set.has(m.id));
    return pendentes.length ? pendentes : missoes.slice();
  }
  function completarMissao(estado, missaoId) {
    if (!estado.missoesFeitas.includes(missaoId)) estado.missoesFeitas.push(missaoId);
    AmiguitoStorage.ganharXp(estado, 8);
    return estado;
  }
  global.AmiguitoAprender = { dicaDoDia, missoesDisponiveis, completarMissao };
})(window);
