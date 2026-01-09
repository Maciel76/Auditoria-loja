import { createRouter, createWebHistory } from "vue-router";
import Upload from "../views/Upload.vue";
import Usuarios from "../views/Usuarios.vue";
import RankingColaboradores from "../views/RankingColaboradores.vue";
import RankingLojas from "../views/RankingLojas.vue";
import Setores from "../views/Setores.vue";
import ListaUsuarios from "../views/ListaUsuarios.vue";
import PerfilUsuario from "../views/PerfilUsuario.vue";
import Dashboard from "../views/Dashboard.vue";
import Corredores from "../views/Corredores.vue";
import Home from "../views/Home.vue";
import Etiqueta from "../views/uploadview/Etiqueta.vue";
import Presenca from "../views/uploadview/Presenca.vue";
import Ruptura from "../views/uploadview/Ruptura.vue";
import SelecionarLoja from "../views/SelecionarLoja.vue";
import PerfilLoja from "@/views/PerfilLoja.vue";
import TesteMetricas from "@/views/PerfilLoja/TesteMetricas.vue";
import AdminLogin from "@/views/AdminLogin.vue";
import { useLojaStore } from "../store/lojaStore";
import { useAuthStore } from "../store/authStore";
import Login from "@/views/Login.vue";

// InfoSite components
import CentralAjuda from "@/views/InfoSite/CentralAjuda.vue";
import Changelog from "@/views/InfoSite/Changelog.vue";
import Contato from "@/views/InfoSite/Contato.vue";
import Documentacao from "@/views/InfoSite/Documentacao.vue";
import RoadMap from "@/views/InfoSite/RoadMap.vue";
import Sugestao from "@/views/InfoSite/Sugestao.vue";
import Tutorias from "@/views/InfoSite/Tutorias.vue";
import Votacao from "@/views/InfoSite/Votacao.vue";

const routes = [
  // Rota principal - Seleção de Loja (SEM Layout do App.vue)
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresLoja: false },
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
    meta: { requiresLoja: false, requiresAuth: false },
  },
  {
    path: "/",
    name: "SelecionarLoja",
    component: SelecionarLoja,
    meta: { requiresLoja: false }, // Esta rota não requer loja selecionada
  },

  // Rotas que requerem loja selecionada (com layout normal)
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresLoja: true },
  },
  {
    path: "/selecionar-auditoria",
    name: "SelecionarAuditoria",
    component: Upload,
    meta: { requiresLoja: true },
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    component: Usuarios,
    meta: { requiresLoja: true },
  },
  // Nova rota unificada de ranking
  {
    path: "/ranking",
    name: "RankingColaboradores",
    component: RankingColaboradores,
    meta: { requiresLoja: true },
  },
  {
    path: "/ranking-lojas",
    name: "RankingLojas",
    component: RankingLojas,
    meta: { requiresLoja: false }, // Ranking de lojas não precisa de loja específica
  },

  {
    path: "/setores",
    name: "Setores",
    component: Setores,
    meta: { requiresLoja: true },
  },
  {
    path: "/lista",
    name: "ListaUsuarios",
    component: ListaUsuarios,
    meta: { requiresLoja: true },
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresLoja: true, requiresAuth: true }, // Requer autenticação admin
  },
  {
    path: "/corredores",
    name: "Corredores",
    component: Corredores,
    meta: { requiresLoja: true },
  },

  {
    path: "/perfil/:id",
    name: "Perfil",
    component: PerfilUsuario,
    props: true,
    meta: { requiresLoja: false },
  },

  {
    path: "/upload/etiqueta",
    name: "Etiqueta",
    component: Etiqueta,
    meta: { requiresLoja: true },
  },
  {
    path: "/upload/presenca",
    name: "Presenca",
    component: Presenca,
    meta: { requiresLoja: true },
  },
  {
    path: "/upload/ruptura",
    name: "Ruptura",
    component: Ruptura,
    meta: { requiresLoja: true },
  },
  {
    path: "/perfil-loja/:codigo",
    name: "perfilLoja",
    component: PerfilLoja,
    props: true,
    meta: { requiresLoja: false },
  },
  // Rota para IDs diretos de usuário (ex: /2692473 -> /perfil/2692473)
  {
    path: "/:id(\\d+)", // Apenas números
    name: "PerfilDireto",
    component: PerfilUsuario,
    props: true,
    meta: { requiresLoja: false },
  },
  {
    path: "/teste-metricas",
    name: "TesteMetricas",
    component: TesteMetricas,
    meta: { requiresLoja: true }, // Apenas requer loja, sem autenticação
  },

  // InfoSite routes
  {
    path: "/info/central-ajuda",
    name: "CentralAjuda",
    component: CentralAjuda,
    meta: { requiresLoja: false },
  },
  {
    path: "/info/changelog",
    name: "Changelog",
    component: Changelog,
    meta: { requiresLoja: false },
  },
  {
    path: "/info/contato",
    name: "Contato",
    component: Contato,
    meta: { requiresLoja: false },
  },
  {
    path: "/info/documentacao",
    name: "Documentacao",
    component: Documentacao,
    meta: { requiresLoja: false },
  },
  {
    path: "/info/roadmap",
    name: "RoadMap",
    component: RoadMap,
    meta: { requiresLoja: false },
  },
  {
    path: "/info/sugestao",
    name: "Sugestao",
    component: Sugestao,
    meta: { requiresLoja: false },
  },
  {
    path: "/info/tutorias",
    name: "Tutorias",
    component: Tutorias,
    meta: { requiresLoja: false },
  },
  {
    path: "/info/votacao",
    name: "Votacao",
    component: Votacao,
    meta: { requiresLoja: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard para verificar se a loja foi selecionada e autenticação admin
router.beforeEach((to, from, next) => {
  const lojaStore = useLojaStore();
  const authStore = useAuthStore();

  // NÃO verificar sessão salva - sempre requer login

  // Verificar se a rota requer autenticação admin
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirecionar para login admin se não estiver autenticado
    next("/admin/login");
    return;
  }

  // Se a rota requer loja mas não está selecionada, redireciona para seleção
  if (to.meta.requiresLoja && !lojaStore.lojaSelecionada) {
    next("/");
  } else {
    next();
  }
});

export default router;
