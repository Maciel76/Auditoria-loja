// store/usuarioStore.js - Gerenciamento de usuários e fotos
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/config/api";

export const useUsuarioStore = defineStore("usuario", () => {
  // Estado
  const usuarios = ref([]);
  const usuarioAtual = ref(null);
  const carregando = ref(false);
  const erro = ref(null);

  // Computed
  const usuariosComFoto = computed(() => {
    return usuarios.value.filter((u) => u.foto);
  });

  const usuariosSemFoto = computed(() => {
    return usuarios.value.filter((u) => !u.foto);
  });

  // Obter URL completa da imagem
  const getImageUrl = (foto) => {
    if (!foto) return null;
    if (foto.startsWith("http")) return foto;
    // Remove /api do início se existir para montar a URL correta
    const fotoPath = foto.startsWith("/api") ? foto.slice(4) : foto;
    return `${api.defaults.baseURL}${fotoPath}`;
  };

  // Obter iniciais do nome
  const getIniciais = (nome) => {
    if (!nome) return "??";
    return nome
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Obter dados de avatar do usuário (foto ou iniciais)
  const getAvatarData = (usuario) => {
    return {
      foto: usuario.foto ? getImageUrl(usuario.foto) : null,
      iniciais: getIniciais(usuario.nome),
      temFoto: !!usuario.foto,
    };
  };

  // Carregar usuários (da loja atual)
  const carregarUsuarios = async (lojaCodigo) => {
    carregando.value = true;
    erro.value = null;

    try {
      const response = await api.get("/api/usuarios", {
        headers: {
          "x-loja": lojaCodigo,
        },
      });

      usuarios.value = response.data.map((user) => ({
        ...user,
        iniciais: getIniciais(user.nome),
      }));

      return usuarios.value;
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      erro.value = error.response?.data?.erro || "Erro ao carregar usuários";
      throw error;
    } finally {
      carregando.value = false;
    }
  };

  // Carregar usuário específico
  const carregarUsuario = async (usuarioId) => {
    carregando.value = true;
    erro.value = null;

    try {
      const response = await api.get(
        `/api/usuarios/${usuarioId}`
      );

      const usuario = {
        ...response.data,
        iniciais: getIniciais(response.data.nome),
      };

      usuarioAtual.value = usuario;

      // Atualizar no array de usuários se existir
      const index = usuarios.value.findIndex((u) => u.id === usuarioId);
      if (index !== -1) {
        usuarios.value[index] = usuario;
      }

      return usuario;
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      erro.value = error.response?.data?.erro || "Erro ao carregar usuário";
      throw error;
    } finally {
      carregando.value = false;
    }
  };

  // Atualizar foto do usuário
  const atualizarFoto = async (usuarioId, file) => {
    carregando.value = true;
    erro.value = null;

    try {
      const formData = new FormData();
      formData.append("foto", file);

      const response = await api.post(
        `/api/usuarios/${usuarioId}/foto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.sucesso) {
        const novaFoto = response.data.foto;

        // Atualizar no array de usuários
        const index = usuarios.value.findIndex((u) => u.id === usuarioId);
        if (index !== -1) {
          usuarios.value[index].foto = novaFoto;
        }

        // Atualizar usuário atual se for o mesmo
        if (usuarioAtual.value?.id === usuarioId) {
          usuarioAtual.value.foto = novaFoto;
        }

        return novaFoto;
      }
    } catch (error) {
      console.error("Erro ao atualizar foto:", error);
      erro.value = error.response?.data?.erro || "Erro ao atualizar foto";
      throw error;
    } finally {
      carregando.value = false;
    }
  };

  // Buscar usuário por ID (do cache ou carregar)
  const buscarUsuario = async (usuarioId) => {
    // Primeiro tenta encontrar no cache
    const usuarioCache = usuarios.value.find((u) => u.id === usuarioId);
    if (usuarioCache) {
      return usuarioCache;
    }

    // Se não encontrar, carrega do servidor
    return await carregarUsuario(usuarioId);
  };

  // Limpar store
  const limpar = () => {
    usuarios.value = [];
    usuarioAtual.value = null;
    erro.value = null;
    carregando.value = false;
  };

  return {
    // Estado
    usuarios,
    usuarioAtual,
    carregando,
    erro,

    // Computed
    usuariosComFoto,
    usuariosSemFoto,

    // Métodos
    carregarUsuarios,
    carregarUsuario,
    atualizarFoto,
    buscarUsuario,
    getImageUrl,
    getIniciais,
    getAvatarData,
    limpar,
  };
});
