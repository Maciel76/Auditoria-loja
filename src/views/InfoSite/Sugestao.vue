<template>
  <div class="sugestao">
    <h1>Envie sua Sugestão</h1>
    <p>Sua opinião é muito importante para nós. Use o formulário abaixo para enviar suas sugestões, críticas ou elogios.</p>

    <form @submit.prevent="enviarSugestao" class="sugestao-form">
      <div class="form-group">
        <label for="nome">Seu Nome</label>
        <input type="text" id="nome" v-model="form.nome" placeholder="Digite seu nome" required>
      </div>

      <div class="form-group">
        <label for="email">Seu E-mail</label>
        <input type="email" id="email" v-model="form.email" placeholder="Digite seu e-mail" required>
      </div>

      <div class="form-group">
        <label for="tipo">Tipo de Mensagem</label>
        <select id="tipo" v-model="form.tipo" required>
          <option value="sugestao">Sugestão</option>
          <option value="critica">Crítica</option>
          <option value="elogio">Elogio</option>
        </select>
      </div>

      <div class="form-group">
        <label for="mensagem">Sua Mensagem</label>
        <textarea id="mensagem" v-model="form.mensagem" rows="6" placeholder="Escreva sua mensagem aqui..." required></textarea>
      </div>

      <button type="submit">Enviar Sugestão</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Sugestao',
  data() {
    return {
      form: {
        nome: '',
        email: '',
        tipo: 'sugestao',
        mensagem: ''
      }
    }
  },
  methods: {
    enviarSugestao() {
      // Aqui você pode adicionar a lógica para enviar a sugestão para o backend
      // Por exemplo, usando o Axios
      alert('Sua sugestão foi enviada com sucesso! Agradecemos a sua contribuição.');
      this.form.nome = '';
      this.form.email = '';
      this.form.tipo = 'sugestao';
      this.form.mensagem = '';
    }
  }
}
</script>

<style scoped>
.sugestao {
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  max-width: 700px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.sugestao-form {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #28a745;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

button:hover {
  background-color: #218838;
}
</style>
