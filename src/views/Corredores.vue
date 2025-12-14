<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 text-white">Visão Detalhada dos Corredores</h1>

    <div v-if="loading" class="text-white text-center">
      Carregando...
    </div>

    <div v-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <div v-if="corredorData" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Etiquetas -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-3 text-white">Etiquetas</h2>
        <table class="w-full text-sm text-left text-gray-400">
          <thead class="text-xs text-gray-100 uppercase bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3">Corredor</th>
              <th scope="col" class="px-6 py-3">Total</th>
              <th scope="col" class="px-6 py-3">Válidos</th>
              <th scope="col" class="px-6 py-3">Lidos</th>
              <th scope="col" class="px-6 py-3">%</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dados, corredor) in corredorData.etiquetas" :key="corredor" class="bg-gray-800 border-b border-gray-700">
              <th scope="row" class="px-6 py-4 font-medium text-white whitespace-nowrap">{{ corredor }}</th>
              <td class="px-6 py-4">{{ dados.total }}</td>
              <td class="px-6 py-4">{{ dados.itensValidos }}</td>
              <td class="px-6 py-4">{{ dados.lidos }}</td>
              <td class="px-6 py-4">{{ dados.percentual.toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Rupturas -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-3 text-white">Rupturas</h2>
        <table class="w-full text-sm text-left text-gray-400">
          <thead class="text-xs text-gray-100 uppercase bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3">Corredor</th>
              <th scope="col" class="px-6 py-3">Total</th>
              <th scope="col" class="px-6 py-3">Válidos</th>
              <th scope="col" class="px-6 py-3">Lidos</th>
              <th scope="col" class="px-6 py-3">%</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dados, corredor) in corredorData.rupturas" :key="corredor" class="bg-gray-800 border-b border-gray-700">
              <th scope="row" class="px-6 py-4 font-medium text-white whitespace-nowrap">{{ corredor }}</th>
              <td class="px-6 py-4">{{ dados.total }}</td>
              <td class="px-6 py-4">{{ dados.itensValidos }}</td>
              <td class="px-6 py-4">{{ dados.lidos }}</td>
              <td class="px-6 py-4">{{ dados.percentual.toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Presenças -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-3 text-white">Presenças</h2>
        <table class="w-full text-sm text-left text-gray-400">
          <thead class="text-xs text-gray-100 uppercase bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3">Corredor</th>
              <th scope="col" class="px-6 py-3">Total</th>
              <th scope="col" class="px-6 py-3">Válidos</th>
              <th scope="col" class="px-6 py-3">Lidos</th>
              <th scope="col" class="px-6 py-3">%</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dados, corredor) in corredorData.presencas" :key="corredor" class="bg-gray-800 border-b border-gray-700">
              <th scope="row" class="px-6 py-4 font-medium text-white whitespace-nowrap">{{ corredor }}</th>
              <td class="px-6 py-4">{{ dados.total }}</td>
              <td class="px-6 py-4">{{ dados.itensValidos }}</td>
              <td class="px-6 py-4">{{ dados.lidos }}</td>
              <td class="px-6 py-4">{{ dados.percentual.toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Corredores',
  data() {
    return {
      corredorData: null,
      loading: true,
      error: null,
    };
  },
  async mounted() {
    try {
      this.loading = true;
      const response = await axios.get('/api/loja-daily-metrics/corredores/hoje');
      this.corredorData = response.data;
    } catch (err) {
      this.error = 'Erro ao carregar os dados dos corredores.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
/* Adicione estilos personalizados aqui, se necessário */
</style>
