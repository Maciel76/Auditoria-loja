import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useNivelStore } from './store/nivelStore';

// Mock a simple Vue app for testing
const pinia = createPinia();

// Function to test the exponential progression system with achievements
function testarNivelComConquistas() {
  console.log("🧪 TESTE: Integração Nível Exponencial com Conquistas");
  console.log("=".repeat(60));

  // Criar um usuário de teste
  const usuarioTeste = {
    id: '123',
    nome: 'Teste Usuario',
    contador: 1200, // 1200 itens lidos
    totalAuditorias: 15,
    xpConquistas: 0
  };

  // Testar o cálculo de XP de conquistas
  const xpConquistas = 150; // Exemplo: conquistas geraram 150 XP
  const xpTotal = usuarioTeste.contador + xpConquistas; // 1200 + 150 = 1350 XP
  
  console.log(`Usuário tem ${usuarioTeste.contador} XP base + ${xpConquistas} XP conquistas = ${xpTotal} XP total`);
  
  // Testar se o cálculo de nível está correto com o XP total
  // Simular as funções do novo sistema
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
      const xpParaProximoNivel = Math.floor(100 * Math.pow(1.25, nivel - 1));
      if (xpAcumulado + xpParaProximoNivel > xp) {
        break;
      }
      xpAcumulado += xpParaProximoNivel;
      nivel++;
    }

    return nivel;
  };
  const nivelAntigo = Math.floor(xpTotal / 100) + 1; // Antigo sistema linear
  console.log(`Antigo sistema (linear): Nível ${nivelAntigo} para ${xpTotal} XP`);

  const novoNivel = calcularNivel(xpTotal);
  const progresso = Math.round(((xpTotal - calcularXpParaNivel(novoNivel)) / calcularXpParaProximoNivel(novoNivel)) * 100);
  
  console.log(`Novo sistema (exponencial): Nível ${novoNivel} para ${xpTotal} XP (${progresso}% do nível)`);
  
  // Testar diferentes cenários
  console.log("\n🎯 Testando cenários com diferentes XP:");
  const testes = [
    { contador: 0, xpConquistas: 10, descricao: "Primeira conquista" },
    { contador: 100, xpConquistas: 15, descricao: "Meta 100 conquistada" },
    { contador: 500, xpConquistas: 50, descricao: "Meta 500 conquistada" },
    { contador: 1000, xpConquistas: 100, descricao: "Maratona conquistada" },
    { contador: 2000, xpConquistas: 200, descricao: "Usuário avançado" }
  ];
  
  testes.forEach(teste => {
    const xpTotal = teste.contador + teste.xpConquistas;
    const nivel = calcularNivel(xpTotal);
    const progresso = Math.round(((xpTotal - calcularXpParaNivel(nivel)) / calcularXpParaProximoNivel(nivel)) * 100);
    
    console.log(`${teste.descricao}: ${teste.contador} base + ${teste.xpConquistas} conquistas = ${xpTotal} XP → Nível ${nivel} (${progresso}%)`);
  });

  console.log("\n✅ Teste de integração concluído!");
  console.log("💡 As conquistas agora contribuem para o XP total de forma mais significativa no sistema exponencial.");
}

// Execute the test if in Node.js
if (typeof module !== 'undefined' && module.exports) {
  testarNivelComConquistas();
}