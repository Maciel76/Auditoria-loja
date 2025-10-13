import { createRouter, createWebHistory } from "vue-router";
import Upload from "../views/Upload.vue";
import Usuarios from "../views/Usuarios.vue";
import RankingColaboradores from "../views/RankingColaboradores.vue";
import RankingLojas from "../views/RankingLojas.vue";
import Setores from "../views/Setores.vue";
import ListaUsuarios from "../views/ListaUsuarios.vue";
import PerfilUsuario from "../views/PerfilUsuario.vue";
import Dashboard from "../views/Dashboard.vue";
// Arquivos removidos - não existem mais
// import EtiquetaContent from "../views/dashboard/EtiquetaContent.vue";
// import PresencaContent from "../views/dashboard/PresencaContent.vue";
// import RupturaContent from "../views/dashboard/RupturaContent.vue";
import DashboadWiews from "../views/dashboard/DashboadWiews.vue";
import RelatoriosDashboard from "../views/RelatoriosDashboard.vue";
import Etiqueta from "../views/uploadview/Etiqueta.vue";
import Presenca from "../views/uploadview/Presenca.vue";
import Ruptura from "../views/uploadview/Ruptura.vue";

// Legacy components - mantidos para compatibilidade temporária
// import RankingEtiqueta from "../views/RankingEtiqueta.vue";
// import RankingPresença from "../views/RankingPresenca.vue";
// import RankingRuptura from "../views/RankingRuptura.vue";
// Arquivos da pasta contente - removidos
// import ReadingDetails from "../views/dashboard/contente/ReadingDetails.vue";
// import DadosSetor from "../views/dashboard/contente/utios/DadosSetor.vue";
// import StatusEtiquetas from "../views/dashboard/contente/utios/StatusEtiquetas.vue";
// import EmployeeChart from "../views/dashboard/contente/EmployeeChart.vue";
// import AnaliseSetor from "../views/dashboard/contente/NextContente/AnaliseSetor.vue";
import ConteudoTeste from "../views/Conteudo/ConteudoTeste.vue";
import ConteudoTeste1 from "../views/Conteudo/ConteudoTeste1.vue";
import ConteudoTeste2 from "../views/Conteudo/ConteudoTeste2.vue";
import SelecionarLoja from "../views/SelecionarLoja.vue";
import PerfilLoja from "@/views/PerfilLoja.vue";
import { useLojaStore } from "../store/lojaStore";
import Login from "@/views/Login.vue";

const routes = [
  // Rota principal - Seleção de Loja (SEM Layout do App.vue)
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresLoja: false },
  },
  {
    path: "/",
    name: "SelecionarLoja",
    component: SelecionarLoja,
    meta: { requiresLoja: false }, // Esta rota não requer loja selecionada
  },

  // Rotas que requerem loja selecionada (com layout normal)
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
  // Rotas removidas - componentes não existem mais
  // {
  //   path: "/dashboard/details",
  //   name: "ReadingDetails",
  //   component: ReadingDetails,
  //   meta: { requiresLoja: true },
  // },
  // {
  //   path: "/dashboard/analise",
  //   name: "AnaliseSetor",
  //   component: AnaliseSetor,
  //   meta: { requiresLoja: true },
  // },
  // {
  //   path: "/dashboard/setor",
  //   name: "DadosSetor",
  //   component: DadosSetor,
  //   meta: { requiresLoja: true },
  // },
  // {
  //   path: "/dashboard/status",
  //   name: "StatusEtiquetas",
  //   component: StatusEtiquetas,
  //   meta: { requiresLoja: true },
  // },
  // {
  //   path: "/dashboard/employee",
  //   name: "EmployeeChart",
  //   component: EmployeeChart,
  //   meta: { requiresLoja: true },
  // },
  // Rotas legacy - mantidas para compatibilidade durante transição
  // {
  //   path: "/ranking/etiqueta",
  //   name: "RankingEtiqueta",
  //   component: RankingEtiqueta,
  //   meta: { requiresLoja: true },
  // },
  // {
  //   path: "/ranking/presenca",
  //   name: "RankingPresenca",
  //   component: RankingPresença,
  //   meta: { requiresLoja: true },
  // },
  // {
  //   path: "/ranking/ruptura",
  //   name: "RankingRuptura",
  //   component: RankingRuptura,
  //   meta: { requiresLoja: true },
  // },
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
    path: "/relatorios",
    name: "Relatorios",
    component: RelatoriosDashboard,
    meta: { requiresLoja: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresLoja: true },
  },
  // Rotas removidas - componentes de conteúdo não existem mais
  // {
  //   path: "/dashboard/etiqueta",
  //   name: "EtiquetaContent",
  //   component: EtiquetaContent,
  //   meta: { requiresLoja: true },
  // },
  // {
  //   path: "/dashboard/presenca",
  //   name: "PresencaContent",
  //   component: PresencaContent,
  //   meta: { requiresLoja: true },
  // },
  // {
  //   path: "/dashboard/ruptura",
  //   name: "RupturaContent",
  //   component: RupturaContent,
  //   meta: { requiresLoja: true },
  // },
  {
    path: "/perfil/:id",
    name: "Perfil",
    component: PerfilUsuario,
    props: true,
    meta: { requiresLoja: false },
  },
  {
    path: "/dashboard/views",
    name: "DashboardViews",
    component: DashboadWiews,
    meta: { requiresLoja: true },
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

  // Rotas de teste (opcional - pode requerer loja também se necessário)
  {
    path: "/teste",
    name: "ConteudoTeste",
    component: ConteudoTeste,
    meta: { requiresLoja: false },
  },
  {
    path: "/teste1",
    name: "ConteudoTeste1",
    component: ConteudoTeste1,
    meta: { requiresLoja: false },
  },
  {
    path: "/teste2",
    name: "ConteudoTeste2",
    component: ConteudoTeste2,
    meta: { requiresLoja: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard para verificar se a loja foi selecionada
router.beforeEach((to, from, next) => {
  const lojaStore = useLojaStore();

  // Se a rota requer loja mas não está selecionada, redireciona para seleção
  if (to.meta.requiresLoja && !lojaStore.lojaSelecionada) {
    next("/");
  } else {
    next();
  }
});

export default router;
