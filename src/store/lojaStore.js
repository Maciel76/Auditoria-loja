import { defineStore } from "pinia";

export const useLojaStore = defineStore("loja", {
  state: () => ({
    lojaSelecionada: null,
  }),
  actions: {
    selecionarLoja(loja) {
      this.lojaSelecionada = loja;
      // Opcional: salvar no localStorage para persistência
      localStorage.setItem("lojaSelecionada", JSON.stringify(loja));
    },
    carregarLoja() {
      const lojaSalva = localStorage.getItem("lojaSelecionada");
      if (lojaSalva) {
        this.lojaSelecionada = JSON.parse(lojaSalva);
      }
    },
    // No seu store/lojaStore.js
    lojas: [
      {
        codigo: "056",
        nome: "Goiania Buritis",
        imagem: "/images/lojas/default.jpg",
      },
      // ...
    ],
  },
});
