// Teste da nova progressão exponencial de níveis
function testarProgressaoExponencial() {
  console.log("🧪 TESTE: Nova Progressão Exponencial de Níveis");
  console.log("=".repeat(60));

  // Funções que simulam o novo sistema exponencial
  const calcularXpParaProximoNivel = (nivel) => {
    return Math.floor(100 * Math.pow(1.25, nivel - 1));
  };

  const calcularXpParaNivel = (nivel) => {
    if (nivel <= 1) return 0;

    let xpTotal = 0;
    for (let i = 1; i < nivel; i++) {
      const xpParaEsteNivel = Math.floor(100 * Math.pow(1.25, i - 1));
      xpTotal += xpParaEsteNivel;
    }
    return xpTotal;
  };

  const calcularNivel = (xp) => {
    if (xp < 100) return 1;

    let nivel = 1;
    let xpAcumulado = 0;

    while (xpAcumulado < xp) {
      const xpParaProximoNivel = calcularXpParaProximoNivel(nivel);
      if (xpAcumulado + xpParaProximoNivel > xp) {
        break;
      }
      xpAcumulado += xpParaProximoNivel;
      nivel++;
    }

    return nivel;
  };

  const calcularProgressoNivel = (xp) => {
    const nivel = calcularNivel(xp);
    if (nivel === 1) {
      return (xp / 100) * 100;
    }

    const xpNecessarioNivelAtual = calcularXpParaNivel(nivel);
    const xpNecessarioProximoNivel = calcularXpParaNivel(nivel + 1);
    const xpNoNivel = xp - xpNecessarioNivelAtual;
    const xpParaProximoNivel = xpNecessarioProximoNivel - xpNecessarioNivelAtual;

    return (xpNoNivel / xpParaProximoNivel) * 100;
  };

  // Testar progressão dos primeiros 15 níveis
  console.log("📊 TABELA DE PROGRESSÃO DE NÍVEIS:");
  console.log("Nível | XP Mínimo | XP para Próximo | XP Total Acumulado");
  console.log("-".repeat(60));

  for (let nivel = 1; nivel <= 15; nivel++) {
    const xpMinimo = calcularXpParaNivel(nivel);
    const xpParaProximo = calcularXpParaProximoNivel(nivel);
    const xpTotalProximo = xpMinimo + xpParaProximo;

    console.log(`  ${nivel.toString().padStart(2)}  |   ${xpMinimo.toString().padStart(6)}  |      ${xpParaProximo.toString().padStart(6)}   |      ${xpTotalProximo.toString().padStart(6)}`);
  }

  console.log("\n");

  // Testar com valores específicos de XP
  console.log("🎯 TESTES COM VALORES ESPECÍFICOS:");
  console.log("-".repeat(40));

  const valoresXP = [50, 100, 250, 500, 750, 1000, 1500, 2000, 3000, 5000];

  valoresXP.forEach(xp => {
    const nivel = calcularNivel(xp);
    const progresso = Math.round(calcularProgressoNivel(xp));
    const xpParaNivelAtual = calcularXpParaNivel(nivel);
    const xpParaProximo = calcularXpParaProximoNivel(nivel);
    const xpNoNivel = xp - xpParaNivelAtual;

    console.log(`${xp.toString().padStart(4)} XP = Nível ${nivel} (${progresso}% do nível, ${Math.floor(xpNoNivel)}/${xpParaProximo} XP no nível)`);
  });

  console.log("\n✅ Teste concluído com sucesso!");
  console.log("💡 O novo sistema torna mais difícil subir de nível nos níveis altos.");
  console.log("📈 Isso incentiva maior engajamento de usuários experientes.");
}

// Executar o teste
testarProgressaoExponencial();