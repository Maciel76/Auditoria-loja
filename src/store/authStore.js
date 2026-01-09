import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // Estado (não persiste em localStorage)
  const usuarioAdmin = ref(null);
  const token = ref(null);
  const isAuthenticated = computed(() => !!token.value && !!usuarioAdmin.value);

  // Credenciais administrativas (em produção, isso deve vir do backend)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "Skill317269@#", // Em produção, usar hash seguro
  };

  // Função de login
  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      // Simulação de verificação (em produção, fazer requisição ao backend)
      if (
        username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        const adminData = {
          username: username,
          role: "admin",
          loginTime: new Date().toISOString(),
        };

        // Gerar token simples (em produção, vem do backend)
        const generatedToken = btoa(
          JSON.stringify({
            username,
            timestamp: Date.now(),
            role: "admin",
          })
        );

        usuarioAdmin.value = adminData;
        token.value = generatedToken;

        // NÃO salvar no localStorage - sessão temporária apenas
        resolve({ success: true, user: adminData });
      } else {
        reject({ success: false, message: "Credenciais inválidas" });
      }
    });
  };

  // Função de logout
  const logout = () => {
    usuarioAdmin.value = null;
    token.value = null;
    // Limpar qualquer dado que possa estar salvo (por segurança)
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  // Verificar se o usuário é admin
  const isAdmin = computed(() => {
    return usuarioAdmin.value?.role === "admin";
  });

  return {
    usuarioAdmin,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };
});
