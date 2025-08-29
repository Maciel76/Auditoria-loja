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
import RankingPresença from "../views/RankingPresença.vue";
import RankingRuptura from "../views/RankingRuptura.vue";

const routes = [
  { path: "/", name: "Upload", component: Upload },
  { path: "/usuarios", name: "Usuarios", component: Usuarios },
  { path: "/ranking/etiqueta", name: "Ranking", component: Ranking },
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
