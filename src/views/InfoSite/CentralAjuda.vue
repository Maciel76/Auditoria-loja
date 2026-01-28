<template>
  <div class="central-ajuda">
    <div class="header">
      <h1>Central de Ajuda</h1>
      <p>
        Encontre respostas para as perguntas mais frequentes sobre o sistema de
        Auditoria de Lojas.
      </p>
    </div>

    <div class="faq-section">
      <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
        <div class="faq-question" @click="toggleFaq(index)">
          <h2>{{ item.question }}</h2>
          <span class="faq-icon" :class="{ 'is-open': activeIndex === index }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
        <div v-if="activeIndex === index" class="faq-answer">
          <p>{{ item.answer }}</p>
          <ol v-if="item.steps">
            <li v-for="(step, i) in item.steps" :key="i">{{ step }}</li>
          </ol>
          <p v-if="item.details">{{ item.details }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CentralAjuda",
  data() {
    return {
      activeIndex: null, // Controla qual item do FAQ está aberto
      faqItems: [
        {
          question: "O que é o sistema de Auditoria de Lojas?",
          answer:
            "É uma plataforma completa para gerenciar auditorias em lojas, permitindo o upload de dados CSV de etiquetas, presença e ruptura de produtos. O sistema oferece análise de métricas, rankings de colaboradores e lojas, sistema de conquistas e gamificação, feed de comunidade para interação entre auditores, e recursos avançados de filtros e exportação de relatórios.",
        },
        {
          question: "Como faço para acessar o sistema?",
          answer: "O sistema possui dois tipos de acesso:",
          steps: [
            "USUÁRIO (Auditor): Acesse a página de login e insira apenas sua matrícula. Você será direcionado automaticamente para o seu perfil pessoal.",
            "ADMINISTRADOR: Acesse o sistema normalmente sem necessidade de credenciais. O acesso é direto às funcionalidades administrativas.",
          ],
          details:
            "Caso tenha problemas para acessar com sua matrícula ou não consiga entrar como administrador, entre em contato com o suporte técnico.",
        },
        {
          question: "Como faço upload de dados de auditoria?",
          answer:
            "O sistema aceita três tipos de upload através de arquivos CSV:",
          steps: [
            "Acesse o menu 'Upload' e selecione o tipo desejado (Etiquetas, Presença ou Ruptura)",
            "Clique em 'Selecionar Arquivo' e escolha o arquivo CSV exportado do sistema da loja",
            "Verifique se os dados estão corretos na pré-visualização",
            "Clique em 'Processar Upload' para enviar os dados",
            "Aguarde a confirmação do processamento automático",
          ],
          details:
            "O sistema relaciona automaticamente os dados e atualiza todas as métricas em tempo real.",
        },
        {
          question: "Quais formatos de arquivo posso exportar?",
          answer:
            "O sistema permite exportação de relatórios em dois formatos principais: CSV (para análise em Excel ou outras planilhas) e PDF (para documentação e apresentações). Na tela de auditorias ou métricas, aplique os filtros desejados e clique no botão 'Exportar', depois escolha o formato preferido.",
        },
        {
          question: "Como funciona o sistema de conquistas?",
          answer:
            "O sistema possui gamificação com conquistas e níveis de experiência (XP). Você ganha pontos ao realizar uploads, completar auditorias, participar do feed da comunidade e atingir metas. Cada conquista desbloqueada aumenta seu nível e posição no ranking. Acesse 'Conquistas' no menu para ver seu progresso e conquistas disponíveis.",
        },
        {
          question: "Como usar os filtros avançados?",
          answer:
            "Na seção de auditorias, você encontra filtros para refinar sua busca:",
          steps: [
            "Selecione o período desejado usando o filtro de data",
            "Escolha lojas específicas ou todas as lojas",
            "Filtre por status (concluída, pendente, em andamento)",
            "Selecione produtos ou categorias específicas",
            "Combine múltiplos filtros para análises detalhadas",
          ],
          details:
            "Os filtros são aplicados automaticamente e você pode salvá-los como favoritos.",
        },
        {
          question: "O que é o Feed de Comunidade?",
          answer:
            "O Feed de Comunidade é um espaço de interação entre administradores e auditores. Você pode compartilhar experiências de auditorias, publicar dicas, comentar em posts de outros colaboradores, reagir com diferentes emojis (curtir, amar, fogo, triste) e participar de votações sobre sugestões de melhorias. É uma ferramenta para tornar o trabalho mais colaborativo.",
        },
        {
          question: "Como visualizar métricas e relatórios?",
          answer:
            "As métricas estão organizadas em diferentes seções: Dashboard (visão geral com gráficos e indicadores principais), Métricas de Usuários (desempenho individual e por equipe), Ranking de Colaboradores e Lojas, Mapa de Calor dos Setores (identifica áreas com mais problemas) e Perfil da Loja (histórico completo de cada unidade). Todas as métricas são atualizadas em tempo real.",
        },
        {
          question:
            "Como adicionar ou gerenciar lojas? (Apenas Administradores)",
          answer:
            "Somente usuários com perfil de Administrador podem adicionar ou editar lojas. Acesse o menu 'Gerenciamento' > 'Lojas', clique em 'Adicionar Loja' e preencha: nome da loja, endereço completo, telefone de contato, responsável e informações adicionais. Para editar, clique no ícone de lápis ao lado da loja desejada.",
        },
        {
          question: "Como alterar meus dados de perfil?",
          answer:
            "Clique no ícone do seu perfil no canto superior direito e selecione 'Meu Perfil'. Você pode editar: foto de perfil, nome completo, e-mail, telefone e senha. Para alterar a senha, você precisa informar a senha atual. Após fazer as alterações, clique em 'Salvar' para confirmar.",
        },
        {
          question: "Como funciona o ranking de colaboradores?",
          answer:
            "O ranking classifica os colaboradores com base em: número de auditorias realizadas, precisão dos dados enviados, conquistas desbloqueadas, nível de XP, participação na comunidade e tempo de resposta. O ranking é atualizado diariamente e pode ser filtrado por período (semanal, mensal, anual) ou por loja específica.",
        },
        {
          question: "O que fazer se encontrar um erro durante o upload?",
          answer:
            "Se ocorrer erro no upload, verifique: se o arquivo está no formato CSV correto, se os cabeçalhos das colunas correspondem ao modelo esperado, se não há caracteres especiais que possam causar problemas, se o arquivo não está corrompido. Se o erro persistir, copie a mensagem de erro e entre em contato com o suporte através da página 'Contato'.",
        },
        {
          question: "Posso acessar o sistema pelo celular?",
          answer:
            "Sim! O sistema é totalmente responsivo e otimizado para dispositivos móveis (smartphones e tablets). Você pode realizar todas as operações pelo celular: fazer uploads, visualizar métricas, participar do feed da comunidade, exportar relatórios e acompanhar seu progresso. Recomendamos usar navegadores atualizados como Chrome, Safari ou Firefox.",
        },
        {
          question: "Como entrar em contato com o suporte?",
          answer:
            "Você pode entrar em contato através da página 'Contato' no menu, onde encontrará: e-mail do desenvolvedor (stwcontato@hotmail.com), WhatsApp (62) 98280-9010, LinkedIn e GitHub. Para problemas técnicos, descreva detalhadamente o erro e envie prints se possível. O tempo de resposta é geralmente de 24 a 48 horas.",
        },
        {
          question: "Como participar das votações de melhorias?",
          answer:
            "Na seção 'Comunidade' ou 'Sugestões', você encontra enquetes sobre novas funcionalidades e melhorias propostas pela equipe e outros usuários. Clique na opção desejada para votar. Seu voto ajuda a priorizar as funcionalidades que serão implementadas nas próximas atualizações do sistema. Você pode ver o resultado das votações em tempo real.",
        },
      ],
    };
  },
  methods: {
    toggleFaq(index) {
      // Se o item clicado já estiver aberto, fecha-o. Caso contrário, abre o novo item.
      this.activeIndex = this.activeIndex === index ? null : index;
    },
  },
};
</script>

<style scoped>
.central-ajuda {
  padding: 2rem;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
  line-height: 1.6;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: calc(2rem + 2vw);
  color: #2c3e50;
  font-weight: 600;
}

.header p {
  font-size: calc(1rem + 0.5vw);
  color: #6c757d;
  max-width: 700px;
  margin: 0.5rem auto 0;
}

.faq-section {
  max-width: 900px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 1rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #eef2f7;
}

.faq-item:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

h2 {
  font-size: calc(1rem + 0.5vw);
  font-weight: 500;
  color: #34495e;
  margin: 0;
  line-height: 1.4;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  background: linear-gradient(to bottom, #ffffff 0%, #fafcff 100%);
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background: linear-gradient(to bottom, #f8fbff 0%, #f0f7ff 100%);
}

.faq-icon {
  color: #7f8c8d;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
}

.faq-icon.is-open {
  transform: rotate(180deg);
  color: #3498db;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #555;
  line-height: 1.7;
  background-color: #fefefe;
  border-top: 1px solid #f0f0f0;
}

.faq-answer ol {
  padding-left: 1.5rem;
  margin-top: 1rem;
  counter-reset: item;
}

.faq-answer ol li {
  display: block;
  margin-bottom: 0.7rem;
  counter-increment: item;
}

.faq-answer ol li::before {
  content: counter(item);
  margin-right: 0.5rem;
  background-color: #3498db;
  color: white;
  font-size: 0.8rem;
  padding: 0.1rem 0.4rem;
  border-radius: 50%;
  display: inline-block;
  min-width: 1.2rem;
  text-align: center;
}

.faq-answer p {
  margin-bottom: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .central-ajuda {
    padding: 1.2rem;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .header p {
    font-size: 1rem;
  }

  .faq-section {
    max-width: 100%;
    padding: 0 0.5rem;
  }

  .faq-question {
    padding: 1.2rem;
  }

  h2 {
    font-size: 1.1rem;
  }

  .faq-answer {
    padding: 0 1.2rem 1.2rem;
  }

  .faq-answer ol {
    padding-left: 1.2rem;
  }
}

@media (max-width: 480px) {
  .central-ajuda {
    padding: 1rem;
  }

  .header h1 {
    font-size: 1.6rem;
  }

  .header p {
    font-size: 0.9rem;
  }

  .faq-question {
    padding: 1rem;
  }

  h2 {
    font-size: 1rem;
  }

  .faq-answer {
    padding: 0 1rem 1rem;
  }

  .faq-answer ol {
    padding-left: 1rem;
  }

  .faq-answer ol li::before {
    font-size: 0.7rem;
    padding: 0.05rem 0.3rem;
    min-width: 1rem;
  }
}
</style>
