// Store para gerenciar sessão de usuário comum (colaborador)
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserSessionStore = defineStore("userSession", () => {
  // Estado da sessão do usuário comum
  const usuarioComum = ref(null); // { id: matricula, tipo: 'comum' }
  const isUsuarioComum = computed(() => !!usuarioComum.value);

  // Fazer login como usuário comum (pela matrícula)
  const loginUsuarioComum = (matricula) => {
    usuarioComum.value = {
      id: matricula,
      tipo: "comum",
      loginTime: new Date().toISOString(),
    };

    // Salvar no localStorage para persistir sessão
    localStorage.setItem("usuarioComum", JSON.stringify(usuarioComum.value));

    return { success: true, usuario: usuarioComum.value };
  };

  // Logout do usuário comum
  const logoutUsuarioComum = () => {
    usuarioComum.value = null;
    localStorage.removeItem("usuarioComum");
  };

  // Carregar sessão do localStorage (se existir)
  const carregarSessao = () => {
    const sessaoSalva = localStorage.getItem("usuarioComum");
    if (sessaoSalva) {
      try {
        usuarioComum.value = JSON.parse(sessaoSalva);
        return true;
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
        localStorage.removeItem("usuarioComum");
        return false;
      }
    }
    return false;
  };

  // Verificar se pode acessar rota
  const podeAcessarRota = (routeName) => {
    if (!isUsuarioComum.value) {
      return true; // Se não é usuário comum, pode acessar tudo (admin ou visitante)
    }

    // Rotas permitidas para usuário comum
    const rotasPermitidas = [
      "Login",
      "Perfil",
      "PerfilDireto",
      "perfilLoja",
      "RankingColaboradores",
      "RankingLojas",
      "ListaLojas",
      "Home", // Comunidade completa: posts, sugestões, votações, reações e comentários
    ];

    return rotasPermitidas.includes(routeName);
  };

  // Obter ID do usuário comum logado
  const getUsuarioId = computed(() => {
    return usuarioComum.value?.id || null;
  });

  return {
    usuarioComum,
    isUsuarioComum,
    loginUsuarioComum,
    logoutUsuarioComum,
    carregarSessao,
    podeAcessarRota,
    getUsuarioId,
  };
});
