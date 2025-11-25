<template>
  <div class="dashboard-layout">
    <!-- Area #2 - Top -->
    <div class="area-top">
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-title">
            <div class="title-icon">⚡</div>
            <div class="title-section">
              <h1>Gerenciamento de Postagens</h1>
              <p>
                Administre, edite e monitore todas as postagens da comunidade
              </p>
            </div>
          </div>
          <div class="header-actions">
            <button @click="loadPosts" class="btn-refresh">🔄 Atualizar</button>
            <select v-model="statusFilter" class="status-filter">
              <option value="">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="analisando">Analisando</option>
              <option value="implementado">Implementado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content-wrapper">
      <!-- Area #1 - Left -->
      <div class="area-left">
        <!-- Navigation Cards -->
        <div class="navigation-section">
          <div class="section-header">
            <h2>📂 Gerenciamento</h2>
            <p>Selecione o que deseja gerenciar</p>
          </div>
          <div class="nav-cards-grid">
            <div
              class="nav-card"
              :class="{ active: currentView === 'postagens' }"
              @click="setCurrentView('postagens')"
            >
              <div class="nav-card-icon">📰</div>
              <div class="nav-card-content">
                <h3>Postagens</h3>
                <p>Publicações Gerais</p>
                <span class="nav-card-count"
                  >{{ getPostCountByType("postagem") }} items</span
                >
              </div>
            </div>

            <div
              class="nav-card"
              :class="{ active: currentView === 'sugestoes' }"
              @click="setCurrentView('sugestoes')"
            >
              <div class="nav-card-icon">💡</div>
              <div class="nav-card-content">
                <h3>Sugestões</h3>
                <p>Sugestões e melhorias</p>
                <span class="nav-card-count"
                  >{{ getSugestoesCount() }} items</span
                >
              </div>
            </div>

            <div
              class="nav-card"
              :class="{ active: currentView === 'votacoes' }"
              @click="setCurrentView('votacoes')"
            >
              <div class="nav-card-icon">🚀</div>
              <div class="nav-card-content">
                <h3>Votações</h3>
                <p>Votações de melhorias</p>
                <span class="nav-card-count"
                  >{{ votacoesPendentes.length }} items</span
                >
              </div>
            </div>

            <div
              class="nav-card"
              :class="{ active: currentView === 'avisos' }"
              @click="setCurrentView('avisos')"
            >
              <div class="nav-card-icon">📢</div>
              <div class="nav-card-content">
                <h3>Implementação</h3>
                <p>Avisos importantes</p>
                <span class="nav-card-count"
                  >{{ avisosPendentes.length }} items</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Area #3 - Right -->
      <div class="area-right">
        <!-- Dynamic Content Management -->
        <div class="content-management">
          <div class="management-header">
            <h2>{{ getCurrentViewTitle() }}</h2>
            <p>{{ getCurrentViewDescription() }}</p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Carregando dados...</p>
          </div>

          <!-- Postagens Card -->
          <div v-else-if="currentView === 'postagens'" class="content-list">
            <transition-group name="list-fade" tag="div">
              <div
                v-for="post in getPostsByType('postagem')"
                :key="post._id"
                class="content-card postagem-card"
              >
                <div class="post-header">
                  <div class="post-meta">
                    <span class="post-type">📰 POSTAGEM</span>
                    <span class="post-date">{{
                      formatDate(post.createdAt)
                    }}</span>
                    <span class="post-status" :class="post.status">{{
                      getStatusText(post.status)
                    }}</span>
                  </div>
                  <div class="post-actions">
                    <button
                      @click="updatePostStatus(post._id, 'implementado')"
                      class="btn-approve"
                    >
                      ✅ Aprovar
                    </button>
                    <button
                      @click="updatePostStatus(post._id, 'rejeitado')"
                      class="btn-reject"
                    >
                      ❌ Rejeitar
                    </button>
                  </div>
                </div>
                <div class="post-content">
                  <h3>{{ getPostTitle(post.sugestao) }}</h3>
                  <p>{{ getPostDescription(post.sugestao) }}</p>
                  <div v-if="post.nome" class="post-author">
                    <small>📝 Por: {{ post.nome }}</small>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- Sugestões Card -->
          <div v-else-if="currentView === 'sugestoes'" class="content-list">
            <transition-group name="list-fade" tag="div">
              <div
                v-for="post in getSugestoesList()"
                :key="post._id"
                class="content-card sugestao-card"
              >
                <div class="post-header">
                  <div class="post-meta">
                    <span class="post-type">💡 SUGESTÃO</span>
                    <span class="post-date">{{
                      formatDate(post.createdAt)
                    }}</span>
                    <span class="post-status" :class="post.status">{{
                      getStatusText(post.status)
                    }}</span>
                  </div>
                  <div class="post-actions">
                    <button
                      @click="publicarSugestao(post._id)"
                      class="btn-approve"
                    >
                      📢 Publicar como Aviso
                    </button>
                    <button
                      @click="openDeleteModal('sugestao', post._id)"
                      class="btn-delete"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
                <div class="post-content">
                  <h3>{{ getPostTitle(post.sugestao) }}</h3>
                  <p>{{ getPostDescription(post.sugestao) }}</p>
                  <div v-if="post.nome" class="post-author">
                    <small>💡 Por: {{ post.nome }}</small>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- Votações Card -->
          <div v-else-if="currentView === 'votacoes'" class="content-list">
            <transition-group name="list-fade" tag="div">
              <div
                v-for="votacao in votacoesPendentes"
                :key="votacao._id"
                class="content-card votacao-card"
              >
                <div class="post-header">
                  <div class="post-meta">
                    <span class="post-type">🚀 VOTAÇÃO</span>
                    <span v-if="votacao.autor" class="post-author"
                      >📝 {{ votacao.autor }}</span
                    >
                    <span class="post-date">{{
                      formatDate(votacao.createdAt)
                    }}</span>
                    <span class="post-status" :class="votacao.status">{{
                      getStatusText(votacao.status)
                    }}</span>
                  </div>
                  <div class="post-actions">
                    <select
                      @change="
                        alterarStatusVotacao(votacao._id, $event.target.value)
                      "
                      :value="votacao.status"
                      class="status-selector"
                    >
                      <option value="pendente">🟡 Pendente</option>
                      <option value="aprovado">🟢 Aprovado</option>
                      <option value="ativo">🔴 Ativo</option>
                      <option value="finalizado">✅ Finalizado</option>
                      <option value="rejeitado">❌ Rejeitado</option>
                    </select>
                    <button
                      @click="openDeleteModal('votacao', votacao._id)"
                      class="btn-delete"
                      title="Deletar votação"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
                <div class="post-content">
                  <h3>{{ votacao.titulo }}</h3>
                  <p>{{ votacao.descricao }}</p>
                  <div v-if="votacao.beneficios" class="votacao-beneficios">
                    <strong>Benefícios:</strong> {{ votacao.beneficios }}
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- Avisos/Implementação Card -->
          <div v-else-if="currentView === 'avisos'" class="content-list">
            <transition-group name="list-fade" tag="div">
              <div
                v-for="aviso in avisosPendentes"
                :key="aviso._id"
                class="content-card aviso-card"
                :class="`prioridade-${aviso.prioridade}`"
              >
                <div class="post-header">
                  <div class="post-meta">
                    <span class="post-type">📢 AVISO</span>
                    <span class="post-date">{{
                      formatDate(aviso.createdAt)
                    }}</span>
                    <span class="post-status" :class="aviso.status">{{
                      getStatusText(aviso.status)
                    }}</span>
                    <span class="aviso-prioridade" :class="aviso.prioridade">{{
                      getPrioridadeText(aviso.prioridade)
                    }}</span>
                  </div>
                  <div class="post-actions">
                    <button
                      @click="aprovarAviso(aviso._id)"
                      class="btn-approve"
                    >
                      ✅ Publicar
                    </button>
                    <button
                      @click="rejeitarAviso(aviso._id)"
                      class="btn-reject"
                    >
                      ❌ Rejeitar
                    </button>
                    <button
                      @click="openDeleteModal('aviso', aviso._id)"
                      class="btn-delete"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
                <div class="post-content">
                  <h3>{{ aviso.titulo }}</h3>
                  <p>{{ aviso.conteudo }}</p>
                  <div v-if="aviso.autor" class="post-author">
                    <small>📝 Por: {{ aviso.autor }}</small>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- Default Posts List (legacy) -->
          <div v-else class="posts-list">
            <div
              v-for="post in filteredPosts"
              :key="post._id"
              class="post-card"
              :class="[`status-${post.status}`]"
            >
              <!-- Post Header -->
              <div class="post-header">
                <div class="post-meta">
                  <span class="post-type"
                    >{{ getTypeIcon(post.tipo) }}
                    {{ post.tipo.toUpperCase() }}</span
                  >
                  <span class="post-date">{{
                    formatDate(post.createdAt)
                  }}</span>
                  <span class="post-status" :class="post.status">{{
                    getStatusText(post.status)
                  }}</span>
                </div>
                <div class="post-actions">
                  <button @click="editPost(post)" class="btn-edit">
                    ✏️ Editar
                  </button>
                  <button @click="deletePost(post._id)" class="btn-delete">
                    🗑️ Excluir
                  </button>
                </div>
              </div>

              <!-- Post Content -->
              <div class="post-content">
                <h3 class="post-title">{{ getPostTitle(post.sugestao) }}</h3>
                <p class="post-description">
                  {{ getPostDescription(post.sugestao) }}
                </p>
              </div>

              <!-- Reactions System -->
              <div class="reactions-section">
                <h4>Reações da Comunidade:</h4>
                <div class="reactions-grid">
                  <div
                    v-for="(reaction, type) in getReactions(post)"
                    :key="type"
                    class="reaction-item"
                    @click="toggleReaction(post._id, type)"
                    :class="{ active: hasUserReacted(post, type) }"
                  >
                    <span class="reaction-emoji">{{
                      getReactionEmoji(type)
                    }}</span>
                    <span class="reaction-count">{{ reaction.count }}</span>
                  </div>
                </div>
              </div>

              <!-- Admin Response -->
              <div v-if="post.comentarioAdmin" class="admin-response">
                <h4>📋 Resposta do Admin:</h4>
                <p>{{ post.comentarioAdmin }}</p>
              </div>

              <!-- Admin Actions -->
              <div class="admin-actions">
                <textarea
                  v-model="post.newResponse"
                  placeholder="Responder como administrador..."
                  class="admin-textarea"
                ></textarea>
                <div class="admin-controls">
                  <select v-model="post.newStatus" class="status-select">
                    <option value="pendente">Pendente</option>
                    <option value="analisando">Analisando</option>
                    <option value="implementado">Implementado</option>
                    <option value="rejeitado">Rejeitado</option>
                  </select>
                  <button @click="updatePost(post)" class="btn-update">
                    💾 Atualizar
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredPosts.length === 0" class="empty-state">
              <div class="empty-icon">📭</div>
              <h3>Nenhuma postagem encontrada</h3>
              <p>Não há postagens com os filtros selecionados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Area #4 - Bottom -->
    <div class="area-bottom">
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ posts.length }}</span>
            <span class="stat-label">Total de Postagens</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <span class="stat-value">{{
              getPostsByStatus("pendente").length
            }}</span>
            <span class="stat-label">Pendentes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔍</div>
          <div class="stat-info">
            <span class="stat-value">{{
              getPostsByStatus("analisando").length
            }}</span>
            <span class="stat-label">Em Análise</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{
              getPostsByStatus("implementado").length
            }}</span>
            <span class="stat-label">Implementadas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">❌</div>
          <div class="stat-info">
            <span class="stat-value">{{
              getPostsByStatus("rejeitado").length
            }}</span>
            <span class="stat-label">Rejeitadas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <transition name="fade">
      <div v-if="successMessage" class="success-notification">
        {{ successMessage }}
      </div>
    </transition>

    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="showDeleteConfirmModal" class="delete-modal-overlay">
      <div class="delete-modal-content">
        <h3>Confirmar Exclusão</h3>
        <p>
          Tem certeza que deseja excluir este item? Esta ação não pode ser
          desfeita.
        </p>
        <div class="delete-modal-actions">
          <button @click="cancelDeletion" class="btn-cancel-delete">
            Cancelar
          </button>
          <button @click="confirmDeletion" class="btn-confirm-delete">
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  name: "PostsManagement",
  setup() {
    const posts = ref([]);
    const loading = ref(false);
    const statusFilter = ref("");
    const successMessage = ref("");
    const userIdentifier = ref(`user_${Date.now()}`);
    const typeFilter = ref("");

    // Estados para o modal de exclusão
    const showDeleteConfirmModal = ref(false);
    const itemToDelete = ref({ id: null, type: null });

    // Tipos de postagem
    const postTypes = ref([
      {
        key: "Postagem",
        title: "Postagem",
        icon: "📰",
        description: "Publicação Geral ",
      },
      {
        key: "Sugestões ",
        title: "Sugestões ",
        icon: "💡",
        description: "Supetões e melhorias",
      },
      {
        key: "Votação",
        title: "Votação",
        icon: "🚀",
        description: "Avisos impotantes",
      },
      {
        key: "implementação",
        title: "Implementação",
        icon: "✔ ",
        description: "Processos de auditoria",
      },
      {
        key: "relatorios",
        title: "Relatórios",
        icon: "📋",
        description: "Geração de relatórios",
      },
    ]);

    // Items de votação
    const votingItems = ref([
      {
        id: 1,
        title: "Integração com Power BI",
        description: "Exportação de dados direto para dashboards do Power BI",
        status: "in-progress",
        votes: 127,
        userVoted: false,
      },
      {
        id: 2,
        title: "App Mobile Nativo",
        description: "Aplicativo dedicado para auditorias em campo",
        status: "under-review",
        votes: 89,
        userVoted: false,
      },
      {
        id: 3,
        title: "Relatórios Automáticos",
        description: "Geração automática de relatórios semanais",
        status: "implemented",
        votes: 56,
        userVoted: true,
      },
      {
        id: 4,
        title: "Sistema de Gamificação",
        description: "Badges e recompensas por participação ativa",
        status: "new-idea",
        votes: 34,
        userVoted: false,
      },
    ]);

    // Estados para avisos e votações
    const avisosPendentes = ref([]);
    const votacoesPendentes = ref([]);

    // Estado para view atual
    const currentView = ref("postagens");

    const filteredPosts = computed(() => {
      let filtered = posts.value;

      if (statusFilter.value) {
        filtered = filtered.filter(
          (post) => post.status === statusFilter.value
        );
      }

      if (typeFilter.value) {
        filtered = filtered.filter((post) => post.tipo === typeFilter.value);
      }

      return filtered;
    });

    // Carregar postagens
    const loadPosts = async () => {
      loading.value = true;
      try {
        const response = await axios.get("http://localhost:3000/api/sugestoes");
        posts.value = response.data.sugestoes.map((post) => ({
          ...post,
          newResponse: post.comentarioAdmin || "",
          newStatus: post.status,
        }));
        console.log(`✅ ${posts.value.length} postagens carregadas`);
      } catch (error) {
        console.error("Erro ao carregar postagens:", error);
        showMessage("Erro ao carregar postagens", "error");
      } finally {
        loading.value = false;
      }
    };

    // Carregar avisos pendentes
    const loadAvisos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/avisos?status=pendente",
          {
            headers: { "x-loja": "001" },
          }
        );
        avisosPendentes.value = response.data.avisos || [];
        console.log(
          `✅ ${avisosPendentes.value.length} avisos pendentes carregados`
        );
      } catch (error) {
        console.error("Erro ao carregar avisos:", error);
      }
    };

    // Carregar votações pendentes
    const loadVotacoes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/votacoes", {
          headers: { "x-loja": "001" },
        });
        votacoesPendentes.value = response.data.votacoes || [];
        console.log(`✅ ${votacoesPendentes.value.length} votações carregadas`);
      } catch (error) {
        console.error("Erro ao carregar votações:", error);
      }
    };

    // Aprovar aviso
    const aprovarAviso = async (avisoId) => {
      try {
        await axios.put(`http://localhost:3000/api/avisos/${avisoId}/status`, {
          status: "aprovado",
          dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        });
        showMessage("Aviso aprovado com sucesso!", "success");
        loadAvisos(); // Recarregar lista
      } catch (error) {
        console.error("Erro ao aprovar aviso:", error);
        showMessage("Erro ao aprovar aviso", "error");
      }
    };

    // Deletar aviso
    const deletarAviso = async (avisoId) => {
      cancelDeletion(); // Fecha o modal

      try {
        await axios.delete(`http://localhost:3000/api/avisos/${avisoId}`);

        // Remover da lista local
        avisosPendentes.value = avisosPendentes.value.filter(
          (a) => a._id !== avisoId
        );

        showMessage("Aviso excluído com sucesso!", "success");
      } catch (error) {
        console.error("Erro ao excluir aviso:", error);
        showMessage("Erro ao excluir o aviso. Tente novamente.", "error");
      }
    };

    // Rejeitar aviso
    const rejeitarAviso = async (avisoId) => {
      try {
        await axios.put(`http://localhost:3000/api/avisos/${avisoId}/status`, {
          status: "rejeitado",
        });
        showMessage("Aviso rejeitado", "success");
        loadAvisos(); // Recarregar lista
      } catch (error) {
        console.error("Erro ao rejeitar aviso:", error);
        showMessage("Erro ao rejeitar aviso", "error");
      }
    };

    // Aprovar votação
    const aprovarVotacao = async (votacaoId) => {
      try {
        const dataInicio = new Date();
        const dataFim = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

        await axios.put(
          `http://localhost:3000/api/votacoes/${votacaoId}/status`,
          {
            status: "ativo",
            dataInicio: dataInicio.toISOString(),
            dataFim: dataFim.toISOString(),
          }
        );
        showMessage("Votação aprovada e iniciada!", "success");
        loadVotacoes(); // Recarregar lista
      } catch (error) {
        console.error("Erro ao aprovar votação:", error);
        showMessage("Erro ao aprovar votação", "error");
      }
    };

    // Alterar status da votação
    const alterarStatusVotacao = async (votacaoId, novoStatus) => {
      try {
        await axios.put(
          `http://localhost:3000/api/votacoes/${votacaoId}/status`,
          {
            status: novoStatus,
          }
        );

        // Atualizar localmente
        const votacao = votacoesPendentes.value.find(
          (v) => v._id === votacaoId
        );
        if (votacao) {
          votacao.status = novoStatus;
        }

        console.log(
          `✅ Status da votação ${votacaoId} alterado para ${novoStatus}`
        );
      } catch (error) {
        console.error("Erro ao alterar status da votação:", error);
        alert("Erro ao alterar status da votação");
      }
    };

    // Deletar votação
    const deletarVotacao = async (votacaoId) => {
      cancelDeletion(); // Fecha o modal
      try {
        await axios.delete(`http://localhost:3000/api/votacoes/${votacaoId}`);

        // Remover da lista local
        votacoesPendentes.value = votacoesPendentes.value.filter(
          (v) => v._id !== votacaoId
        );

        console.log(`✅ Votação ${votacaoId} deletada com sucesso`);
        showMessage("Votação deletada com sucesso!", "success");
      } catch (error) {
        console.error("Erro ao deletar votação:", error);
        showMessage("Erro ao deletar votação", "error");
      }
    };

    // Publicar sugestão como aviso
    const publicarSugestao = async (sugestaoId) => {
      if (
        !confirm(
          "Tem certeza que deseja publicar esta sugestão como aviso importante?"
        )
      ) {
        return;
      }

      try {
        // Encontrar a sugestão
        const sugestao = posts.value.find((p) => p._id === sugestaoId);
        if (!sugestao) {
          alert("Sugestão não encontrada");
          return;
        }

        // Criar aviso baseado na sugestão
        const avisoResponse = await axios.post(
          "http://localhost:3000/api/avisos",
          {
            titulo: `Sugestão Implementada: ${getPostTitle(sugestao.sugestao)}`,
            conteudo: `Baseado na sugestão de ${sugestao.nome || "usuário"}: ${
              sugestao.sugestao
            }`,
            prioridade: "media",
            autor: sugestao.nome || "Sistema",
            status: "pendente",
          }
        );

        if (avisoResponse.data) {
          // Aprovar o aviso automaticamente
          await axios.put(
            `http://localhost:3000/api/avisos/${avisoResponse.data.id}/status`,
            {
              status: "aprovado",
            }
          );

          // Deletar a sugestão após publicar
          await axios.delete(
            `http://localhost:3000/api/sugestoes/${sugestaoId}`
          );

          // Remover da lista local
          posts.value = posts.value.filter((p) => p._id !== sugestaoId);

          // Recarregar avisos
          loadAvisos();

          alert("Sugestão publicada como aviso com sucesso!");
          console.log(
            `✅ Sugestão ${sugestaoId} publicada como aviso aprovado`
          );
        }
      } catch (error) {
        console.error("Erro ao publicar sugestão:", error);
        alert("Erro ao publicar sugestão como aviso");
      }
    };

    // Deletar sugestão
    const deletarSugestao = async (sugestaoId) => {
      cancelDeletion(); // Fecha o modal
      try {
        await axios.delete(`http://localhost:3000/api/sugestoes/${sugestaoId}`);

        // Remover da lista local
        posts.value = posts.value.filter((p) => p._id !== sugestaoId);

        showMessage("Sugestão deletada com sucesso!", "success");
      } catch (error) {
        console.error("Erro ao deletar sugestão:", error);
        alert("Erro ao deletar sugestão");
      }
    };

    // Rejeitar votação
    const rejeitarVotacao = async (votacaoId) => {
      try {
        await axios.put(
          `http://localhost:3000/api/votacoes/${votacaoId}/status`,
          {
            status: "rejeitado",
          }
        );
        showMessage("Votação rejeitada", "success");
        loadVotacoes(); // Recarregar lista
      } catch (error) {
        console.error("Erro ao rejeitar votação:", error);
        showMessage("Erro ao rejeitar votação", "error");
      }
    };

    // Utilitários
    const getTypeIcon = (type) => {
      const icons = {
        geral: "💡",
        dashboard: "📊",
        ranking: "🏆",
        auditoria: "🔍",
        relatorios: "📋",
      };
      return icons[type] || "📝";
    };

    const getStatusText = (status) => {
      const statusTexts = {
        pendente: "Pendente",
        analisando: "Em Análise",
        implementado: "Implementado",
        rejeitado: "Rejeitado",
      };
      return statusTexts[status] || status;
    };

    const getPrioridadeText = (prioridade) => {
      const prioridadeTexts = {
        baixa: "Baixa",
        media: "Média",
        alta: "Alta",
        critica: "Crítica",
      };
      return prioridadeTexts[prioridade] || prioridade;
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const getPostTitle = (sugestao) => {
      const lines = sugestao.split("\n\n");
      return lines[0] || sugestao.substring(0, 50) + "...";
    };

    const getPostDescription = (sugestao) => {
      const lines = sugestao.split("\n\n");
      if (lines.length > 1) {
        return lines.slice(1).join("\n\n");
      }
      return sugestao.length > 100
        ? sugestao.substring(0, 100) + "..."
        : sugestao;
    };

    // Sistema de reações
    const getReactions = (post) => {
      const defaultReactions = {
        like: { count: 0, users: [] },
        dislike: { count: 0, users: [] },
        fire: { count: 0, users: [] },
        heart: { count: 0, users: [] },
      };
      return post.reactions || defaultReactions;
    };

    const getReactionEmoji = (type) => {
      const emojis = {
        like: "👍",
        dislike: "👎",
        fire: "🔥",
        heart: "💚",
      };
      return emojis[type];
    };

    const hasUserReacted = (post, reactionType) => {
      const reactions = getReactions(post);
      return (
        reactions[reactionType]?.users?.includes(userIdentifier.value) || false
      );
    };

    const toggleReaction = async (postId, reactionType) => {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/sugestoes/${postId}/react`,
          {
            reaction: reactionType,
            userIdentifier: userIdentifier.value,
          }
        );

        if (response.data.reactions) {
          const post = posts.value.find((p) => p._id === postId);
          if (post) {
            post.reactions = response.data.reactions;
          }
          showMessage(response.data.message, "success");
        }
      } catch (error) {
        console.warn(
          "API não disponível, usando simulação local:",
          error.message
        );

        const post = posts.value.find((p) => p._id === postId);
        if (post) {
          if (!post.reactions) {
            post.reactions = {
              like: { count: 0, users: [] },
              dislike: { count: 0, users: [] },
              fire: { count: 0, users: [] },
              heart: { count: 0, users: [] },
            };
          }

          const hasReacted = post.reactions[reactionType].users.includes(
            userIdentifier.value
          );

          if (hasReacted) {
            post.reactions[reactionType].count = Math.max(
              0,
              post.reactions[reactionType].count - 1
            );
            post.reactions[reactionType].users = post.reactions[
              reactionType
            ].users.filter((user) => user !== userIdentifier.value);
            showMessage(
              `Reação ${getReactionEmoji(reactionType)} removida!`,
              "success"
            );
          } else {
            post.reactions[reactionType].count += 1;
            post.reactions[reactionType].users.push(userIdentifier.value);
            showMessage(
              `Reação ${getReactionEmoji(reactionType)} adicionada!`,
              "success"
            );
          }
        }
      }
    };

    // Gerenciamento de posts
    const updatePost = async (post) => {
      try {
        const updateData = {
          status: post.newStatus,
        };

        if (post.newResponse && post.newResponse.trim()) {
          updateData.comentarioAdmin = post.newResponse.trim();
        }

        const response = await axios.put(
          `http://localhost:3000/api/sugestoes/${post._id}/status`,
          updateData
        );

        if (response.data.message) {
          post.status = post.newStatus;
          if (updateData.comentarioAdmin) {
            post.comentarioAdmin = updateData.comentarioAdmin;
          }
          showMessage("Post atualizado com sucesso!", "success");
        }
      } catch (error) {
        console.error("Erro ao atualizar post:", error);
        showMessage("Erro ao atualizar post", "error");
      }
    };

    const deletePost = async (postId) => {
      if (!confirm("Tem certeza que deseja excluir esta postagem?")) return;

      try {
        const response = await axios.delete(
          `http://localhost:3000/api/sugestoes/${postId}`
        );

        if (response.data.message) {
          posts.value = posts.value.filter((p) => p._id !== postId);
          showMessage("Post excluído com sucesso!", "success");
        }
      } catch (error) {
        console.error("Erro ao excluir post:", error);
        showMessage("Erro ao excluir post", "error");
      }
    };

    const editPost = (post) => {
      const textarea = document.querySelector(
        `textarea[data-post-id="${post._id}"]`
      );
      if (textarea) textarea.focus();
    };

    const showMessage = (text, type = "success") => {
      successMessage.value = text;
      setTimeout(() => {
        successMessage.value = "";
      }, 3000);
    };

    // Funções para navegação por tipos
    const setTypeFilter = (type) => {
      typeFilter.value = typeFilter.value === type ? "" : type;
    };

    const getPostCountByType = (type) => {
      return posts.value.filter((post) => post.tipo === type).length;
    };

    // Funções para votação
    const getVotingStatusText = (status) => {
      const statusTexts = {
        "new-idea": "Nova Ideia",
        "under-review": "Em Análise",
        "in-progress": "Em Desenvolvimento",
        implemented: "Implementado",
      };
      return statusTexts[status] || status;
    };

    const voteOnItem = (itemId) => {
      const item = votingItems.value.find((item) => item.id === itemId);
      if (item && !item.userVoted) {
        item.votes++;
        item.userVoted = true;
        showMessage(`Voto registrado em "${item.title}"!`, "success");
      }
    };

    // Função para estatísticas
    const getPostsByStatus = (status) => {
      return posts.value.filter((post) => post.status === status);
    };

    // Funções para navegação entre views
    const setCurrentView = (view) => {
      currentView.value = view;
    };

    const getCurrentViewTitle = () => {
      const titles = {
        postagens: "📰 Gerenciamento de Postagens",
        sugestoes: "💡 Gerenciamento de Sugestões",
        votacoes: "🚀 Gerenciamento de Votações",
        avisos: "📢 Gerenciamento de Avisos",
      };
      return titles[currentView.value] || "📋 Gerenciamento";
    };

    const getCurrentViewDescription = () => {
      const descriptions = {
        postagens: "Gerencie todas as postagens criadas pela comunidade",
        sugestoes: "Analise e aprove sugestões de melhorias",
        votacoes: "Aprove e inicie votações de melhorias",
        avisos: "Publique avisos importantes para implementação",
      };
      return descriptions[currentView.value] || "Selecione uma categoria";
    };

    // Funções para filtrar conteúdo por tipo
    const getPostsByType = (type) => {
      if (type === "postagem") {
        return posts.value.filter(
          (post) =>
            post.sugestao &&
            post.sugestao.includes("POSTAGEM:") &&
            post.sugestao.includes("AUTOR:")
        );
      }
      return posts.value.filter((post) => post.tipo === type);
    };

    const getSugestoesList = () => {
      return posts.value.filter(
        (post) =>
          post.tipo === "geral" &&
          (!post.sugestao.includes("POSTAGEM:") ||
            !post.sugestao.includes("AUTOR:"))
      );
    };

    const getSugestoesCount = () => {
      return getSugestoesList().length;
    };

    // Função para atualizar status rapidamente
    const updatePostStatus = async (postId, newStatus) => {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/sugestoes/${postId}/status`,
          {
            status: newStatus,
          }
        );

        if (response.data.message) {
          // Atualizar localmente
          const post = posts.value.find((p) => p._id === postId);
          if (post) {
            post.status = newStatus;
          }
          showMessage(
            `Status atualizado para ${getStatusText(newStatus)}`,
            "success"
          );
        }
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        showMessage("Erro ao atualizar status", "error");
      }
    };

    // Funções do Modal de Exclusão
    const openDeleteModal = (type, id) => {
      itemToDelete.value = { id, type };
      showDeleteConfirmModal.value = true;
    };

    const cancelDeletion = () => {
      showDeleteConfirmModal.value = false;
      itemToDelete.value = { id: null, type: null };
    };

    const confirmDeletion = () => {
      const { id, type } = itemToDelete.value;
      if (type === "aviso") {
        deletarAviso(id);
      } else if (type === "votacao") {
        deletarVotacao(id);
      } else if (type === "sugestao") {
        deletarSugestao(id);
      } else if (type === "post") {
        deletePost(id);
      }
    };

    // Carregar dados quando componente for montado
    onMounted(() => {
      loadPosts();
      loadAvisos();
      loadVotacoes();
    });

    return {
      posts,
      loading,
      statusFilter,
      successMessage,
      filteredPosts,
      avisosPendentes,
      votacoesPendentes,
      currentView,
      loadPosts,
      loadAvisos,
      loadVotacoes,
      aprovarAviso,
      rejeitarAviso,
      deletarAviso,
      aprovarVotacao,
      rejeitarVotacao,
      alterarStatusVotacao,
      deletarVotacao,
      publicarSugestao,
      deletarSugestao,
      getTypeIcon,
      getStatusText,
      getPrioridadeText,
      formatDate,
      getPostTitle,
      getPostDescription,
      getReactions,
      getReactionEmoji,
      hasUserReacted,
      toggleReaction,
      updatePost,
      updatePostStatus,
      deletePost,
      editPost,
      typeFilter,
      postTypes,
      votingItems,
      setTypeFilter,
      setCurrentView,
      getCurrentViewTitle,
      getCurrentViewDescription,
      getPostCountByType,
      getPostsByType,
      getSugestoesList,
      getSugestoesCount,
      getVotingStatusText,
      voteOnItem,
      getPostsByStatus,
      showDeleteConfirmModal,
      openDeleteModal,
      cancelDeletion,
      confirmDeletion,
    };
  },
};
</script>

<style scoped>
/* Layout Principal */
.dashboard-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  gap: 0;
}

.area-top {
  grid-area: 1 / 1 / 2 / 2;
}

.main-content-wrapper {
  grid-area: 2 / 1 / 3 / 2;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 0;
  min-height: calc(100vh - 140px);
}

.area-left {
  background: white;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
  height: 100%;
}

.area-right {
  background: #f8f9fa;
  overflow-y: auto;
  height: 100%;
}

.area-bottom {
  grid-area: 3 / 1 / 4 / 2;
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 0;
}

/* Header Styles */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  font-size: 2.2rem;
}

.title-section h1 {
  margin: 0 0 4px 0;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.title-section p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-refresh {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.status-filter {
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  font-weight: 500;
}

.status-filter option {
  background: #4361ee;
  color: white;
}

/* Left Area Styles */
.area-left {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.navigation-section,
.voting-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0 0 6px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.section-header p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Navigation Cards */
.nav-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.8)
  );
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.nav-card.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
  transform: translateY(-1px);
}

.nav-card-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.nav-card-content {
  flex: 1;
}

.nav-card-content h3 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
}

.nav-card-content p {
  margin: 0 0 6px 0;
  opacity: 0.8;
  font-size: 0.85rem;
  line-height: 1.3;
}

.nav-card-count {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: inline-block;
}

.nav-card.active .nav-card-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Voting Cards */
.voting-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voting-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.voting-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.voting-card.status-new-idea::before {
  background: linear-gradient(90deg, #3b82f6, #1e40af);
}

.voting-card.status-under-review::before {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.voting-card.status-in-progress::before {
  background: linear-gradient(90deg, #06b6d4, #0891b2);
}

.voting-card.status-implemented::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.voting-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

/* Avisos Section */
.avisos-section {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.avisos-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.aviso-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.aviso-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.aviso-card.prioridade-baixa {
  border-left: 4px solid #22c55e;
}

.aviso-card.prioridade-media {
  border-left: 4px solid #eab308;
}

.aviso-card.prioridade-alta {
  border-left: 4px solid #f97316;
}

.aviso-card.prioridade-critica {
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}

.aviso-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.aviso-card-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  flex: 1;
}

.aviso-prioridade {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.aviso-prioridade.baixa {
  background: #dcfce7;
  color: #16a34a;
}

.aviso-prioridade.media {
  background: #fef3c7;
  color: #ca8a04;
}

.aviso-prioridade.alta {
  background: #fed7aa;
  color: #ea580c;
}

.aviso-prioridade.critica {
  background: #fee2e2;
  color: #dc2626;
}

.aviso-description {
  margin: 0 0 1rem 0;
  color: #4b5563;
  line-height: 1.5;
  font-size: 0.875rem;
}

.aviso-actions {
  display: flex;
  gap: 0.5rem;
}

.approve-btn,
.reject-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.approve-btn {
  background: #22c55e;
  color: white;
}

.approve-btn:hover {
  background: #16a34a;
  transform: translateY(-1px);
}

.reject-btn {
  background: #ef4444;
  color: white;
}

.reject-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Content Management Styles */
.content-management {
  padding: 2rem;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.content-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.postagem-card {
  border-left: 4px solid #3b82f6;
}

.sugestao-card {
  border-left: 4px solid #f59e0b;
}

.votacao-card {
  border-left: 4px solid #8b5cf6;
}

.aviso-card {
  border-left: 4px solid #ef4444;
}

.aviso-card.prioridade-baixa {
  border-left-color: #22c55e;
}

.aviso-card.prioridade-media {
  border-left-color: #eab308;
}

.aviso-card.prioridade-alta {
  border-left-color: #f97316;
}

.aviso-card.prioridade-critica {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.post-type {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.post-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.post-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.post-status.pendente {
  background: #fef3c7;
  color: #92400e;
}

.post-status.analisando {
  background: #dbeafe;
  color: #1e40af;
}

.post-status.implementado {
  background: #d1fae5;
  color: #065f46;
}

.post-status.rejeitado {
  background: #fee2e2;
  color: #991b1b;
}

.post-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.btn-approve,
.btn-implement,
.btn-reject,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-approve {
  background: #22c55e;
  color: white;
}

.btn-approve:hover {
  background: #16a34a;
  transform: translateY(-1px);
}

.btn-implement {
  background: #3b82f6;
  color: white;
}

.btn-implement:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-reject {
  background: #ef4444;
  color: white;
}

.btn-reject:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-delete {
  background: #6b7280;
  color: white;
}

.btn-delete:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* Seletor de Status */
.status-selector {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;
}

.status-selector:hover {
  border-color: #6366f1;
  background: #f8fafc;
}

.status-selector:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Autor da postagem */
.post-author {
  font-size: 0.8rem;
  color: #6b7280;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.post-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.post-content p {
  margin: 0 0 1rem 0;
  color: #4b5563;
  line-height: 1.6;
}

.post-author,
.votacao-beneficios {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.post-author small {
  color: #6b7280;
  font-style: italic;
}

.votacao-beneficios {
  color: #4b5563;
  font-size: 0.9rem;
}

.votacao-beneficios strong {
  color: #1a202c;
}

.voting-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 8px;
}

.voting-card-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
  line-height: 1.3;
}

.voting-status {
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

.voting-status.new-idea {
  background: #e0f2fe;
  color: #0277bd;
}

.voting-status.under-review {
  background: #fff8e1;
  color: #f57c00;
}

.voting-status.in-progress {
  background: #e0f7fa;
  color: #00838f;
}

.voting-status.implemented {
  background: #e8f5e8;
  color: #2e7d32;
}

.voting-description {
  margin: 0 0 14px 0;
  color: #6c757d;
  line-height: 1.4;
  font-size: 0.85rem;
}

.voting-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vote-btn {
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.vote-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.vote-btn.voted {
  background: linear-gradient(135deg, #10b981, #059669);
  cursor: default;
}

.vote-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.vote-count {
  font-weight: 600;
  color: #495057;
  font-size: 0.8rem;
}

/* Right Area Styles */
.area-right {
  padding: 24px;
}

.posts-management {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.management-header {
  padding: 24px 24px 0 24px;
  margin-bottom: 0;
}

.management-header h2 {
  margin: 0 0 6px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.management-header p {
  margin: 0 0 20px 0;
  color: #6c757d;
  font-size: 0.95rem;
}

.posts-list {
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  overflow-y: auto;
}

/* Post Card Styles */
.post-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #e9ecef;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.post-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.post-card.status-pendente {
  border-left-color: #ffc107;
}

.post-card.status-analisando {
  border-left-color: #17a2b8;
}

.post-card.status-implementado {
  border-left-color: #28a745;
}

.post-card.status-rejeitado {
  border-left-color: #dc3545;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.post-type {
  font-weight: 600;
  color: #4361ee;
  background: rgba(67, 97, 238, 0.1);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.8rem;
}

.post-date {
  color: #6c757d;
  font-size: 0.85rem;
}

.post-status {
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.post-status.pendente {
  background: #fff3cd;
  color: #856404;
}

.post-status.analisando {
  background: #d1ecf1;
  color: #0c5460;
}

.post-status.implementado {
  background: #d4edda;
  color: #155724;
}

.post-status.rejeitado {
  background: #f8d7da;
  color: #721c24;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-edit:hover {
  background: #bbdefb;
}

.btn-delete {
  background: #ffebee;
  color: #d32f2f;
}

.btn-delete:hover {
  background: #ffcdd2;
}

.post-content {
  margin-bottom: 16px;
}

.post-title {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.post-description {
  margin: 0;
  color: #6c757d;
  line-height: 1.5;
  font-size: 0.95rem;
}

.reactions-section {
  margin: 16px 0;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 10px;
}

.reactions-section h4 {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  color: #495057;
  font-weight: 600;
}

.reactions-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.reaction-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.85rem;
}

.reaction-item:hover {
  border-color: #4361ee;
  transform: translateY(-1px);
}

.reaction-item.active {
  background: #4361ee;
  color: white;
  border-color: #4361ee;
}

.reaction-emoji {
  font-size: 1rem;
}

.reaction-count {
  font-size: 0.8rem;
  font-weight: 600;
}

.admin-response {
  margin: 16px 0;
  padding: 14px;
  background: linear-gradient(
    135deg,
    rgba(40, 167, 69, 0.1),
    rgba(32, 201, 151, 0.05)
  );
  border-left: 4px solid #28a745;
  border-radius: 8px;
}

.admin-response h4 {
  margin: 0 0 6px 0;
  color: #28a745;
  font-size: 0.95rem;
  font-weight: 600;
}

.admin-response p {
  margin: 0;
  color: #495057;
  font-style: italic;
  font-size: 0.9rem;
  line-height: 1.4;
}

.admin-actions {
  margin-top: 16px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 10px;
}

.admin-textarea {
  width: 100%;
  min-height: 70px;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.admin-textarea:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.admin-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  flex: 1;
}

.btn-update {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-update:hover {
  background: #218838;
  transform: translateY(-1px);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f8f9fa;
  border-top: 4px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 1.3rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

/* Bottom Area Styles */
.area-bottom {
  padding: 20px 32px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  max-width: 100%;
  margin: 0 auto;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.stat-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-top: 4px;
  font-weight: 500;
}

/* Success Notification */
.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 14px 20px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.4);
  z-index: 1000;
  font-size: 0.9rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animação de lista */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.5s ease;
}
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-fade-leave-active {
  position: absolute;
}

/* Modal de Exclusão */
.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.delete-modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.delete-modal-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #1a202c;
  font-size: 1.5rem;
}

.delete-modal-content p {
  margin-bottom: 2rem;
  color: #4a5568;
  line-height: 1.6;
}

.delete-modal-actions {
  display: flex;
  gap: 1rem;
}

.btn-cancel-delete,
.btn-confirm-delete {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid transparent;
}

.btn-cancel-delete {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-confirm-delete {
  background-color: #ef4444;
  color: white;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-content-wrapper {
    grid-template-columns: 300px 1fr;
  }

  .stats-overview {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .area-left {
    border-right: none;
    border-bottom: 1px solid #e9ecef;
    height: auto;
    max-height: 50vh;
    overflow-y: auto;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-refresh,
  .status-filter {
    width: 100%;
  }

  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .post-meta {
    gap: 8px;
  }

  .admin-controls {
    flex-direction: column;
  }

  .status-select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 16px 20px;
  }

  .area-left,
  .area-right {
    padding: 16px;
  }

  .stats-overview {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 14px;
  }

  .title-section h1 {
    font-size: 1.4rem;
  }

  .title-icon {
    font-size: 1.8rem;
  }
}
</style>
