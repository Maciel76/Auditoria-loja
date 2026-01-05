<template>
  <div class="contato">
    <h1>Entre em Contato</h1>
    <p>Se você tiver dúvidas, sugestões ou precisar de suporte, não hesite em nos contatar.</p>

    <div class="contact-info">
      <h2>Informações de Contato</h2>
      <p><strong>Desenvolvedor:</strong> Maciel Ribeiro</p>
      <p>
        <strong>WhatsApp:</strong>
        <a href="https://wa.me/5562982809010" target="_blank">(62) 98280-9010</a>
      </p>
      <p>
        <strong>E-mail:</strong>
        <a href="mailto:stwcontato@hotmail.com">stwcontato@hotmail.com</a>
      </p>
    </div>

    <div class="contact-form">
      <h2>Envie uma Mensagem</h2>
      <form @submit.prevent="enviarMensagem">
        <div class="form-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" v-model="form.nome" required>
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="form.email" required>
        </div>
        <div class="form-group">
          <label for="mensagem">Mensagem</label>
          <textarea id="mensagem" v-model="form.mensagem" rows="5" required></textarea>
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contato',
  data() {
    return {
      form: {
        nome: '',
        email: '',
        mensagem: ''
      }
    }
  },
  methods: {
    enviarMensagem() {
      // Aqui você pode adicionar a lógica para enviar a mensagem
      // Por exemplo, usando o Axios para enviar para o backend
      alert('Mensagem enviada com sucesso! (funcionalidade a ser implementada)');
      this.form.nome = '';
      this.form.email = '';
      this.form.mensagem = '';
    }
  }
}
</script>

<style scoped>
.contato {
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.contact-info {
  margin-bottom: 2rem;
}

.contact-info h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.contact-info p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.contact-form h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #0056b3;
}
</style>
