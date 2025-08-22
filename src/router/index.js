import { createRouter, createWebHistory } from "vue-router";
import Upload from "../views/Upload.vue";
import Usuarios from "../views/Usuarios.vue";
import Hanking from "../views/Hanking.vue";

const routes = [
  { path: "/", name: "Upload", component: Upload },
  { path: "/usuarios", name: "Usuarios", component: Usuarios },
  { path: "/hanking", name: "Hanking", component: Hanking },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
