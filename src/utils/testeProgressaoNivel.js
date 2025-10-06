// Teste da nova progressão exponencial de níveis
// Este arquivo serve para validar o sistema antes da implementação completa

export function testarProgressaoExponencial() {
  console.log("🧪 TESTE: Nova Progressão Exponencial de Níveis");
  console.log("=".repeat(60));

  // Simular as funções da store para teste
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
    const xpParaNivelAtual = calcularXpParaNivel(nivel);
    const xpParaProximo = calcularXpParaProximoNivel(nivel);
    const xpNoNivel = xp - xpParaNivelAtual;
    const progresso = Math.round((xpNoNivel / xpParaProximo) * 100);

    console.log(`${xp.toString().padStart(4)} XP = Nível ${nivel} (${progresso}% do nível)`);
  });

  console.log("\n");

  // Comparação: Sistema Antigo vs Novo
  console.log("⚖️  COMPARAÇÃO: SISTEMA ANTIGO vs EXPONENCIAL");
  console.log("-".repeat(50));
  console.log("   XP   | Antigo | Novo | Diferença");
  console.log("-".repeat(50));

  valoresXP.forEach(xp => {
    const nivelAntigo = Math.floor(xp / 100) + 1;
    const nivelNovo = calcularNivel(xp);
    const diferenca = nivelAntigo - nivelNovo;
    const sinal = diferenca > 0 ? "+" : "";

    console.log(`${xp.toString().padStart(6)} |   ${nivelAntigo.toString().padStart(2)}   |  ${nivelNovo.toString().padStart(2)}  |    ${sinal}${diferenca}`);
  });

  console.log("\n✅ Teste concluído!");
  console.log("💡 O novo sistema torna mais difícil subir de nível nos níveis altos.");
  console.log("📈 Isso incentiva maior engajamento de usuários experientes.");
}

// Executar teste se este arquivo for importado no console
if (typeof window !== 'undefined') {
  window.testarProgressaoNivel = testarProgressaoExponencial;
}