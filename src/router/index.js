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
import ReadingDetails from "../views/dashboard/contente/ReadingDetails.vue"; //demostração de leitura detalhada
import DadosSetor from "../views/dashboard/contente/DadosSetor.vue"; //demostração de leitura detalhada
import StatusEtiquetas from "../views/dashboard/contente/StatusEtiquetas.vue";
import EmployeeChart from "../views/dashboard/contente/EmployeeChart.vue";
import AnaliseSetor from "../views/dashboard/contente/NextContente/AnaliseSetor.vue";
import ConteudoTeste from "../views/Conteudo/ConteudoTeste.vue"; // teste de conteudo
import ConteudoTeste1 from "../views/Conteudo/ConteudoTeste1.vue"; // teste de conteudo
import ConteudoTeste2 from "../views/Conteudo/ConteudoTeste2.vue"; // teste de conteudo
const routes = [
  { path: "/teste", name: "ConteudoTeste", component: ConteudoTeste }, // rota de teste
  { path: "/teste1", name: "ConteudoTeste1", component: ConteudoTeste1 }, // rota de teste 1
  { path: "/teste2", name: "ConteudoTeste2", component: ConteudoTeste2 }, // rota de teste 2
  { path: "/", name: "Upload", component: Upload },
  { path: "/usuarios", name: "Usuarios", component: Usuarios },
  { path: "/ranking/etiqueta", name: "Ranking", component: Ranking },
  {
    path: "/dashboard/details",
    name: "ReadingDetails",
    component: ReadingDetails,
  },
  { path: "/dashboard/analise", name: "AnaliseSetor", component: AnaliseSetor },
  { path: "/dashboard/setor", name: "DadosSetor", component: DadosSetor },
  {
    path: "/dashboard/status",
    name: "StatusEtiquetas",
    component: StatusEtiquetas,
  },
  {
    path: "/dashboard/employee",
    name: "EmployeeChart",
    component: EmployeeChart,
  },
  {
    path: "/ranking/presenca",
    name: "RankingPresenca",
    component: RankingPresença,
  },
  {
    path: "/ranking/ruptura",
    name: "RankingRuptura",
    component: RankingRuptura,
  },
  { path: "/setores", name: "Setores", component: Setores },
  { path: "/lista", name: "ListaUsuarios", component: ListaUsuarios },
  { path: "/relatorios", name: "Relatorios", component: RelatoriosDashboard }, // Adicione esta linha
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  {
    path: "/dashboard/etiqueta",
    name: "EtiquetaContent",
    component: EtiquetaContent,
  },
  {
    path: "/dashboard/presenca",
    name: "PresencaContent",
    component: PresencaContent,
  },
  {
    path: "/dashboard/ruptura",
    name: "RupturaContent",
    component: RupturaContent,
  },
  {
    path: "/perfil/:id",
    name: "PerfilUsuario",
    component: PerfilUsuario,
    props: true,
  },
  {
    path: "/dashboard/views",
    name: "DashboardViews",
    component: DashboadWiews,
  },
  { path: "/upload/etiqueta", name: "Etiqueta", component: Etiqueta },
  { path: "/upload/presenca", name: "Presenca", component: Presenca },
  { path: "/upload/ruptura", name: "Ruptura", component: Ruptura },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
