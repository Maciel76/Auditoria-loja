import { createRouter, createWebHistory } from "vue-router";
import Upload from "../views/Upload.vue";
import Usuarios from "../views/Usuarios.vue";
import Hanking from "../views/Hanking.vue";
import Setores from "../views/Setores.vue";
import ListaUsuarios from "../views/ListaUsuarios.vue";
import PerfilUsuario from "../views/PerfilUsuario.vue";

const routes = [
  { path: "/", name: "Upload", component: Upload },
  { path: "/usuarios", name: "Usuarios", component: Usuarios },
  { path: "/hanking", name: "Hanking", component: Hanking },
  { path: "/setores", name: "Setores", component: Setores },
  { path: "/lista", name: "ListaUsuarios", component: ListaUsuarios },
  {
    path: "/perfil/:id",
    name: "PerfilUsuario",
    component: PerfilUsuario,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
