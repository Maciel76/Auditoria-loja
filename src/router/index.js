import { createRouter, createWebHistory } from "vue-router";
import Upload from "../views/Upload.vue";
import Usuarios from "../views/Usuarios.vue";
import Ranking from "../views/RankingEtiqueta.vue";
import Setores from "../views/Setores.vue";
import ListaUsuarios from "../views/ListaUsuarios.vue";
import PerfilUsuario from "../views/PerfilUsuario.vue";
import Dashboard from "../views/Dashboard.vue";
import EtiquetaContent from "../views/dashboard/EtiquetaContent.vue";
import PresencaContent from "../views/dashboard/PresencaContent.vue";
import RupturaContent from "../views/dashboard/RupturaContent.vue";
import DashboadWiews from "../views/dashboard/DashboadWiews.vue";
import RelatoriosDashboard from "../views/RelatoriosDashboard.vue";
import Etiqueta from "../views/uploadview/Etiqueta.vue";
import Presenca from "../views/uploadview/Presenca.vue";
import Ruptura from "../views/uploadview/Ruptura.vue";
import RankingPresença from "../views/RankingPresenca.vue";
import RankingRuptura from "../views/RankingRuptura.vue";
import ReadingDetails from "../views/dashboard/contente/ReadingDetails.vue";
import DadosSetor from "../views/dashboard/contente/DadosSetor.vue";
import StatusEtiquetas from "../views/dashboard/contente/StatusEtiquetas.vue";
import EmployeeChart from "../views/dashboard/contente/EmployeeChart.vue";
import AnaliseSetor from "../views/dashboard/contente/NextContente/AnaliseSetor.vue";
import ConteudoTeste from "../views/Conteudo/ConteudoTeste.vue";
import ConteudoTeste1 from "../views/Conteudo/ConteudoTeste1.vue";
import ConteudoTeste2 from "../views/Conteudo/ConteudoTeste2.vue";
import SelecionarLoja from "../views/SelecionarLoja.vue";
import PerfilLoja from "@/views/PerfilLoja.vue";
import { useLojaStore } from "../store/lojaStore";

const routes = [
  // Rota principal - Seleção de Loja (SEM Layout do App.vue)
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
  {
    path: "/ranking/etiqueta",
    name: "Ranking",
    component: Ranking,
    meta: { requiresLoja: true },
  },
  {
    path: "/dashboard/details",
    name: "ReadingDetails",
    component: ReadingDetails,
    meta: { requiresLoja: true },
  },
  {
    path: "/dashboard/analise",
    name: "AnaliseSetor",
    component: AnaliseSetor,
    meta: { requiresLoja: true },
  },
  {
    path: "/dashboard/setor",
    name: "DadosSetor",
    component: DadosSetor,
    meta: { requiresLoja: true },
  },
  {
    path: "/dashboard/status",
    name: "StatusEtiquetas",
    component: StatusEtiquetas,
    meta: { requiresLoja: true },
  },
  {
    path: "/dashboard/employee",
    name: "EmployeeChart",
    component: EmployeeChart,
    meta: { requiresLoja: true },
  },
  {
    path: "/ranking/presenca",
    name: "RankingPresenca",
    component: RankingPresença,
    meta: { requiresLoja: true },
  },
  {
    path: "/ranking/ruptura",
    name: "RankingRuptura",
    component: RankingRuptura,
    meta: { requiresLoja: true },
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
  {
    path: "/dashboard/etiqueta",
    name: "EtiquetaContent",
    component: EtiquetaContent,
    meta: { requiresLoja: true },
  },
  {
    path: "/dashboard/presenca",
    name: "PresencaContent",
    component: PresencaContent,
    meta: { requiresLoja: true },
  },
  {
    path: "/dashboard/ruptura",
    name: "RupturaContent",
    component: RupturaContent,
    meta: { requiresLoja: true },
  },
  {
    path: "/perfil/:id",
    name: "PerfilUsuario",
    component: PerfilUsuario,
    props: true,
    meta: { requiresLoja: true },
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
    path: "/perfil-loja",
    name: "perfilLoja",
    component: PerfilLoja,
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
