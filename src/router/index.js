import { createRouter, createWebHistory } from "vue-router";
import Upload from "../views/Upload.vue";
import Usuarios from "../views/Usuarios.vue";
import Ranking from "../views/Ranking.vue";
import Setores from "../views/Setores.vue";
import ListaUsuarios from "../views/ListaUsuarios.vue";
import PerfilUsuario from "../views/PerfilUsuario.vue";
import Relatorios from "../views/Relatorios.vue"; // Importe o novo componente
import Dashboard from "../views/Dashboard.vue";
import EtiquetaContent from "../views/dashboard/EtiquetaContent.vue";
import PresencaContent from "../views/dashboard/PresencaContent.vue";
import RupturaContent from "../views/dashboard/RupturaContent.vue";
import DashboadWiews from "../views/dashboard/DashboadWiews.vue";

const routes = [
  { path: "/", name: "Upload", component: Upload },
  { path: "/usuarios", name: "Usuarios", component: Usuarios },
  { path: "/ranking", name: "Ranking", component: Ranking },
  { path: "/setores", name: "Setores", component: Setores },
  { path: "/lista", name: "ListaUsuarios", component: ListaUsuarios },
  { path: "/relatorios", name: "Relatorios", component: Relatorios }, // Adicione esta linha
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
