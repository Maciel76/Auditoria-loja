import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Adicione seus ícones aqui (exemplo)
// import { faUser, faHome, faUpload } from "@fortawesome/free-solid-svg-icons";
// library.add(faUser, faHome, faUpload);

// Crie a instância do Pinia
const pinia = createPinia();

// Crie a aplicação Vue
const app = createApp(App);

// Use os plugins
app.use(pinia);
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

// Monte a aplicação
app.mount("#app");
