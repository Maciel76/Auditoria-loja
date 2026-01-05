<!-- Usuarios.vue - Recreato para usar dados diretamente do modelo backend -->
<template>
  <div class="usuarios-container">
    <!-- Seletor de Loja Obrigatório -->
    <div v-if="!lojaStore.isLojaSelected" class="loja-selection">
      <div class="loja-selection-content">
        <div class="loja-icon">
          <i class="fas fa-store"></i>
        </div>
        <h2>Selecione uma Loja</h2>
        <p>
          Para visualizar os colaboradores, você precisa selecionar uma loja
          primeiro.
        </p>

        <div class="lojas-grid">
          <div
            v-for="loja in lojasDisponiveis"
            :key="loja.codigo"
            class="loja-card"
            @click="selecionarLoja(loja)"
            :class="{ loading: carregando }"
          >
            <div class="loja-image">
              <img :src="loja.imagem" :alt="loja.nome" />
            </div>
            <div class="loja-info">
              <h3>{{ loja.nome }}</h3>
              <p><i class="fas fa-map-marker-alt"></i> {{ loja.cidade }}</p>
              <span class="loja-codigo">{{ loja.codigo }}</span>
            </div>
          </div>
        </div>

        <div v-if="erro" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          {{ erro }}
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal (apenas quando loja selecionada) -->
    <div v-else>
      <!-- Header com Loja Selecionada -->
      <div class="page-header">
        <!-- Elementos decorativos de fundo -->
        <div class="decoration-circle header-circle-1"></div>
        <div class="decoration-circle header-circle-2"></div>
        <div class="decoration-circle header-circle-3"></div>
        <div class="decoration-circle header-circle-4"></div>
        <div class="decoration-circle header-circle-5"></div>
        <div class="decoration-circle header-circle-6"></div>

        <div class="header-content">
          <div class="header-left">
            <div class="loja-image-header">
              <img
                :src="lojaStore.imagemLojaAtual"
                :alt="'Imagem da ' + lojaStore.nomeLojaAtual"
                @error="handleImageError"
              />
            </div>
            <div class="header-text">
              <h1>
                <i class="fas fa-users-cog"></i>
                Colaboradores -
                {{ extrairNomeSimples(lojaStore.nomeLojaAtual) }}
              </h1>
              <p>
                Gestão de colaboradores da loja {{ lojaStore.codigoLojaAtual }}
              </p>
            </div>
          </div>
          <div class="header-actions">
            <button
              @click="carregarUsuarios"
              class="btn-icon-refresh"
              title="Atualizar dados"
              :disabled="carregando"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                :class="{ spinning: carregando }"
              >
                <path
                  fill="white"
                  d="M10.2 3.28c3.53 0 6.43 2.61 6.92 6h2.08l-3.5 4l-3.5-4h2.32a4.44 4.44 0 0 0-4.32-3.45c-1.45 0-2.73.71-3.54 1.78L4.95 5.66a6.97 6.97 0 0 1 5.25-2.38m-.4 13.44c-3.52 0-6.43-2.61-6.92-6H.8l3.5-4c1.17 1.33 2.33 2.67 3.5 4H5.48a4.44 4.44 0 0 0 4.32 3.45c1.45 0 2.73-.71 3.54-1.78l1.71 1.95a6.95 6.95 0 0 1-5.25 2.38"
                />
              </svg>
            </button>
            <button
              @click="trocarLoja"
              class="btn-trocar-loja"
              title="Trocar loja"
            >
              <i class="fas fa-exchange-alt"></i>
              Trocar Loja
            </button>
          </div>
        </div>
      </div>

      <!-- Barra de Filtros e Busca -->
      <div class="filters-bar">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="filtro"
            placeholder="Buscar por nome ou matrícula..."
            class="search-field"
          />
          <span v-if="filtro" @click="filtro = ''" class="clear-search">
            <i class="fas fa-times"></i>
          </span>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-store"></i>
            Loja:
          </label>
          <select v-model="filtroLojaSelect" class="filter-select">
            <option value="">
              Loja Atual ({{ lojaStore.codigoLojaAtual }})
            </option>
            <option value="todos">Todas as lojas</option>
            <option
              v-for="loja in lojasDisponiveis"
              :key="loja.codigo"
              :value="loja.codigo"
            >
              {{ loja.nome }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-th"></i>
            Visualização:
          </label>
          <select v-model="tipoVisualizacao" class="filter-select">
            <option value="card">Cards</option>
            <option value="lista">Lista</option>
          </select>
        </div>
      </div>

      <!-- Cards de Estatísticas -->
      <div class="metrics-grid">
        <div class="metric-card warning">
          <div class="metric-icon trophy-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 600 600"
            >
              <g>
                <ellipse
                  style="fill: #d8dfea"
                  cx="300.616"
                  cy="554.031"
                  rx="175.988"
                  ry="4.969"
                />
                <path
                  style="fill: #e8a615"
                  d="M530,92.139v48.298c0,78.441-63.577,142.052-141.975,142.052h-19.877l22.063-22.757
                  c64.769-1.165,117.073-54.235,117.073-119.295v-36.933h-85.185l2.84-22.728h93.704C524.917,80.774,530,85.86,530,92.139z"
                />
                <path
                  style="fill: #e8a615"
                  d="M373.827,419.34v25.086H226.173V419.34c0-2.045,1.107-3.949,2.896-4.943l11.188-6.307
                  c19.365-10.909,31.348-31.393,31.348-53.639v-26.507h56.79v26.507c0,22.245,11.983,42.729,31.348,53.639l11.188,6.307
                  C372.72,415.391,373.827,417.295,373.827,419.34z"
                />
                <path
                  style="fill: #b7791d"
                  d="M373.827,419.34v25.086H359.63V419.34c0-2.045-1.107-3.949-2.896-4.943l-11.188-6.307
                  c-19.365-10.909-31.348-31.393-31.348-53.639v-26.507h14.198v26.507c0,22.245,11.983,42.729,31.348,53.639l11.188,6.307
                  C372.72,415.391,373.827,417.295,373.827,419.34z"
                />
                <path
                  style="fill: #e8a615"
                  d="M345.432,305.784v16.478c0,7.841-6.36,14.205-14.198,14.205h-62.469
                  c-7.837,0-14.198-6.364-14.198-14.205v-16.478H345.432z"
                />
                <rect
                  x="271.605"
                  y="336.468"
                  style="fill: #b7791d"
                  width="56.79"
                  height="8.353"
                />
                <path
                  style="fill: #343b49"
                  d="M396.543,438.745v99.436H203.457v-99.436c0-3.125,2.556-5.682,5.679-5.682h181.728
                  C393.988,433.063,396.543,435.62,396.543,438.745z"
                />
                <path
                  style="fill: #262d38"
                  d="M396.543,438.745v99.436h-11.358v-99.436c0-3.125-2.556-5.682-5.679-5.682h11.358
                  C393.988,433.063,396.543,435.62,396.543,438.745z"
                />
                <path
                  style="fill: #262d38"
                  d="M413.58,535.34v11.364c0,3.125-2.556,5.682-5.679,5.682H192.099c-3.123,0-5.679-2.557-5.679-5.682
                  V535.34c0-3.125,2.556-5.682,5.679-5.682h215.802C411.025,529.658,413.58,532.215,413.58,535.34z"
                />
                <path
                  style="fill: #171c23"
                  d="M413.58,535.34v11.364c0,3.125-2.556,5.682-5.679,5.682h-11.358c3.123,0,5.679-2.557,5.679-5.682
                  V535.34c0-3.125-2.556-5.682-5.679-5.682h11.358C411.025,529.658,413.58,532.215,413.58,535.34z"
                />
                <path
                  style="fill: #e8a615"
                  d="M368.148,461.473v39.774c0,3.125-2.556,5.682-5.679,5.682H237.531
                  c-3.123,0-5.679-2.557-5.679-5.682v-39.774c0-3.125,2.556-5.682,5.679-5.682h124.938
                  C365.593,455.791,368.148,458.348,368.148,461.473z"
                />
                <path
                  style="fill: #b7791d"
                  d="M345.432,305.784v16.478c0,7.841-6.36,14.205-14.198,14.205h-11.358
                  c7.837,0,14.198-6.364,14.198-14.205v-16.478H345.432z"
                />
                <path
                  style="fill: #e8a615"
                  d="M240.37,282.488h-28.395C133.577,282.488,70,218.877,70,140.436V92.139
                  c0-6.279,5.083-11.364,11.358-11.364h93.704v22.728H92.716v36.933c0,65.06,52.304,118.13,117.073,119.295L240.37,282.488z"
                />
                <path
                  style="fill: #e8a615"
                  d="M439.136,58.046V69.41c0,138.074-62.299,250.011-139.136,250.011S160.864,207.485,160.864,69.41
                  V58.046H439.136z"
                />
                <path
                  style="fill: #b7791d"
                  d="M162.142,103.503h-11.358c-0.568-7.472-0.937-15.057-1.136-22.728h11.358
                  C161.205,88.445,161.574,96.031,162.142,103.503z"
                />
                <path
                  style="fill: #b7791d"
                  d="M227.195,282.488h-11.358c-6.332-6.989-12.352-14.887-17.946-23.581
                  c3.919,0.483,7.865,0.739,11.898,0.824C215.241,268.112,221.062,275.726,227.195,282.488z"
                />
                <path
                  style="fill: #b7791d"
                  d="M345.432,305.784v5.682c-14.254,8.836-29.531,13.637-45.432,13.637s-31.178-4.801-45.432-13.637
                  v-5.682c14.254,8.836,29.531,13.637,45.432,13.637S331.178,314.62,345.432,305.784z"
                />
                <path
                  style="fill: #b7791d"
                  d="M439.136,58.046V69.41c0,133.756-58.466,242.994-131.98,249.699
                  c71.442-6.79,97.906-115.999,97.906-249.699V58.046H439.136z"
                />
                <path
                  style="fill: #e8a615"
                  d="M453.333,55.205c0,3.921-1.59,7.472-4.146,10.057c-2.584,2.557-6.133,4.148-10.052,4.148H160.864
                  c-7.837,0-14.198-6.364-14.198-14.205c0-3.921,1.59-7.472,4.146-10.057c2.584-2.557,6.133-4.148,10.052-4.148h278.272
                  C446.973,41,453.333,47.364,453.333,55.205z"
                />
                <path
                  style="fill: #b7791d"
                  d="M439.136,69.41c0,3.807-0.057,7.586-0.142,11.364H161.006c-0.085-3.779-0.142-7.557-0.142-11.364
                  H439.136z"
                />
                <path
                  style="fill: #b7791d"
                  d="M453.333,55.205c0,3.921-1.59,7.472-4.146,10.057c-2.584,2.557-6.133,4.148-10.052,4.148h-31.235
                  c3.919,0,7.468-1.591,10.052-4.148c2.556-2.585,4.146-6.137,4.146-10.057c0-7.841-6.36-14.205-14.198-14.205h31.235
                  C446.973,41,453.333,47.364,453.333,55.205z"
                />
                <path
                  style="fill: #b7791d"
                  d="M368.148,461.473v39.774c0,3.125-2.556,5.682-5.679,5.682H249.741
                  c22.943-0.455,98.531-5.341,98.531-51.139h14.198C365.593,455.791,368.148,458.348,368.148,461.473z"
                />
                <path
                  style="fill: #ffcc66"
                  d="M237.531,487.042v-23.245c0-1.284,1.04-2.324,2.323-2.324h50.918
                  C290.772,461.473,250.309,465.735,237.531,487.042z"
                />
                <path
                  style="fill: #4e5868"
                  d="M209.846,464.314v-23.245c0-1.284,1.04-2.324,2.323-2.324h50.918
                  C263.086,438.745,222.623,443.006,209.846,464.314z"
                />
                <path
                  style="fill: #ffcc66"
                  d="M300,310.898c-30.837,0-116.363-65.088-126.727-218.76h33.733
                  C215.496,280.158,300,310.898,300,310.898z"
                />
                <path
                  style="fill: #ffcc66"
                  d="M240.37,421.699c0,0,39.753-25.569,39.753-62.503v62.503H240.37z"
                />
                <path
                  style="fill: #ffcc66"
                  d="M166.543,46.682v8.523h-14.198c0-4.688,3.805-8.523,8.519-8.523H166.543z"
                />
                <path
                  style="fill: #b7791d"
                  d="M447.512,80.774c-0.199,7.671-0.568,15.256-1.164,22.728h-24.249l2.84-22.728H447.512z"
                />
                <path
                  style="fill: #b7791d"
                  d="M399.07,259.248c-5.565,8.551-11.5,16.336-17.747,23.24h-13.175l10.052-10.341l12.011-12.415
                  C393.193,259.674,396.146,259.504,399.07,259.248z"
                />
              </g>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{
              limitarNomeTop(melhorColaborador?.nome) || "N/A"
            }}</span>
            <span class="metric-label">Top Colaborador</span>
          </div>
        </div>

        <div class="metric-card primary">
          <div class="metric-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m-2 14l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9z"
              />
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-value">N/A</span>
            <span class="metric-label">Total de Auditorias</span>
          </div>
        </div>

        <div class="metric-card info">
          <div class="metric-icon user-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"
              />
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ totalColaboradoresGeral }}</span>
            <span class="metric-label">Total de Colaboradores</span>
          </div>
        </div>

        <div class="metric-card success">
          <div class="metric-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="white"
                stroke-linejoin="round"
                stroke-width="1.8"
              >
                <path
                  d="M20.5 10.5v9c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54C19.699 21 19.466 21 19 21s-.699 0-.883-.076a1 1 0 0 1-.54-.541c-.077-.184-.077-.417-.077-.883v-9c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54C18.301 9 18.534 9 19 9s.699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883Z"
                />
                <path stroke-linecap="round" d="M16.5 3h3v3" />
                <path stroke-linecap="round" d="M19 3.5s-4 5-14.5 8.5" />
                <path
                  d="M13.5 14v5.5c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54C12.699 21 12.466 21 12 21s-.699 0-.883-.076a1 1 0 0 1-.54-.541c-.077-.184-.077-.417-.077-.883V14c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54c.184-.077.417-.077.883-.077s.699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883Zm-7 2.5v3c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54C5.699 21 5.466 21 5 21s-.699 0-.883-.076a1 1 0 0 1-.54-.541c-.077-.184-.077-.417-.077-.883v-3c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54C4.301 15 4.534 15 5 15s.699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883Z"
                />
              </g>
            </svg>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ mediaItensPorUsuario }}</span>
            <span class="metric-label">Média por Colaborador</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="carregando" class="loading-state">
        <div class="loader"></div>
        <p>
          Carregando colaboradores da loja {{ lojaStore.codigoLojaAtual }}...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="erro" class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h3>Ops! Nenhum Colaborador Encontrado</h3>
        <p>Ou a Loja Nao Foi Encontrada</p>
        <button @click="carregarUsuarios" class="btn-retry">
          <i class="fas fa-redo-alt"></i> Tentar Novamente
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="usuariosFiltrados.length === 0" class="empty-state">
        <div class="empty-illustration">
          <i class="fas fa-user-slash"></i>
        </div>
        <h3>Nenhum colaborador encontrado</h3>
        <p v-if="filtro">Tente ajustar os filtros de busca</p>
        <p v-else-if="filtroLojaSelect && filtroLojaSelect !== 'todos'">
          Ainda não foi enviada a planilha de auditoria para esta loja
        </p>
        <p v-else>Faça o upload de uma planilha para esta loja para começar</p>
        <button v-if="filtro" @click="limparFiltros" class="btn-clear-filter">
          <i class="fas fa-times"></i> Limpar Filtros
        </button>
        <router-link v-else to="/selecionar-auditoria" class="btn-upload">
          <i class="fas fa-cloud-upload-alt"></i> Fazer Upload
        </router-link>
      </div>

      <!-- Grid de Usuários (Cards) -->
      <div v-else-if="tipoVisualizacao === 'card'" class="users-grid">
        <div
          v-for="usuario in usuariosFiltrados"
          :key="usuario.id"
          class="user-card"
          @click="verDetalhes(usuario.id)"
        >
          <div class="user-avatar-section">
            <div class="avatar-circle">
              <img
                v-if="usuario.foto"
                :src="usuario.foto"
                alt="Avatar"
                class="avatar-image"
              />
              <span v-else class="avatar-initials">{{ usuario.iniciais }}</span>
            </div>
            <div
              class="loja-badge-mini"
              :style="{
                background: gerarCorLoja(usuario.loja).gradient,
                boxShadow: `0 4px 15px ${gerarCorLoja(usuario.loja).shadow}`,
              }"
            >
              {{ usuario.loja }}
            </div>
          </div>

          <div class="user-details">
            <h3 class="user-name">{{ limitarNome(usuario.nome) }}</h3>
            <p class="user-matricula">
              <i class="fas fa-id-badge"></i> {{ usuario.id }}
            </p>
            <p class="user-loja">
              <i class="fas fa-store"></i>
              <span>{{ usuario.lojaCompleta }}</span>
            </p>
          </div>

          <div class="user-metrics">
            <div class="metric-item">
              <i class="fas fa-clipboard-list"></i>
              <div class="metric-content">
                <span class="metric-number green">{{ usuario.contador }}</span>
                <span class="metric-text">Itens Lidos</span>
              </div>
            </div>
            <div class="metric-item">
              <i class="fas fa-calendar-check"></i>
              <div class="metric-content">
                <span class="metric-number purple">{{
                  usuario.totalAuditorias
                }}</span>
                <span class="metric-text">Auditorias</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <router-link
              :to="'/perfil/' + usuario.id"
              class="btn-details"
              @click.stop
            >
              <i class="fas fa-eye"></i>
              Ver Perfil Colaborador
            </router-link>
          </div>
        </div>
      </div>

      <!-- Lista de Usuários -->
      <div v-else class="users-list">
        <div
          v-for="usuario in usuariosFiltrados"
          :key="usuario.id"
          class="user-list-item"
          @click="verDetalhes(usuario.id)"
        >
          <div class="list-avatar">
            <div class="avatar-circle-small">
              <img
                v-if="usuario.foto"
                :src="usuario.foto"
                alt="Avatar"
                class="avatar-image"
              />
              <span v-else class="avatar-initials-small">{{
                usuario.iniciais
              }}</span>
            </div>
          </div>

          <div class="list-info">
            <div class="list-header">
              <h3 class="list-name">{{ usuario.nome }}</h3>
              <div
                class="loja-badge-list"
                :style="{
                  background: gerarCorLoja(usuario.loja).gradient,
                  boxShadow: `0 2px 8px ${gerarCorLoja(usuario.loja).shadow}`,
                }"
              >
                {{ usuario.loja }}
              </div>
            </div>
            <div class="list-details">
              <span class="list-matricula">
                <i class="fas fa-id-badge"></i> {{ usuario.id }}
              </span>
              <span class="list-loja">
                <i class="fas fa-store"></i> {{ usuario.lojaCompleta }}
              </span>
            </div>
          </div>

          <div class="list-metrics">
            <div class="list-metric">
              <i class="fas fa-clipboard-list"></i>
              <span class="list-metric-value green">{{
                usuario.contador
              }}</span>
              <span class="list-metric-label">Itens</span>
            </div>
            <div class="list-metric">
              <i class="fas fa-calendar-check"></i>
              <span class="list-metric-value purple">{{
                usuario.totalAuditorias
              }}</span>
              <span class="list-metric-label">Auditorias</span>
            </div>
          </div>

          <div class="list-actions">
            <router-link
              :to="'/perfil/' + usuario.id"
              class="btn-list-details"
              @click.stop
            >
              <i class="fas fa-eye"></i>
              Ver Perfil
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "@/composables/useApi";
import { useLojaStore } from "../store/lojaStore";

const router = useRouter();
const lojaStore = useLojaStore();

// Estados
const usuarios = ref([]);
const lojasDisponiveis = ref([
  {
    codigo: "056",
    nome: "Loja 056 - Goiania Burits",
    cidade: "Goiânia",
    imagem: "/images/lojas/056.jpg",
  },
  {
    codigo: "084",
    nome: "Loja 084 - Goiania Independência",
    cidade: "Goiânia",
    imagem: "/images/lojas/084.jpg",
  },
  {
    codigo: "105",
    nome: "Loja 105 - T9",
    cidade: "Goiânia",
    imagem: "/images/lojas/105.jpg",
  },
  {
    codigo: "111",
    nome: "Loja 111 - Rio Verde",
    cidade: "Rio Verde",
    imagem: "/images/lojas/111.jpg",
  },
  {
    codigo: "140",
    nome: "Loja 140 - Perimetral",
    cidade: "Goiânia",
    imagem: "/images/lojas/140.jpg",
  },
  {
    codigo: "214",
    nome: "Loja 214 - Caldas Novas",
    cidade: "Caldas Novas",
    imagem: "/images/lojas/214.jpg",
  },
  {
    codigo: "176",
    nome: "Loja 176 - Palmas Teotônio",
    cidade: "Palmas",
    imagem: "/images/lojas/176.jpg",
  },
  {
    codigo: "194",
    nome: "Loja 194 - Anápolis",
    cidade: "Anápolis",
    imagem: "/images/lojas/194.jpg",
  },
  {
    codigo: "310",
    nome: "Loja 310 - Portugal",
    cidade: "Goiânia",
    imagem: "/images/lojas/310.jpg",
  },
  {
    codigo: "320",
    nome: "Loja 320 - Palmas cesamar",
    cidade: "Palmas",
    imagem: "/images/lojas/320.jpg",
  },
  {
    codigo: "347",
    nome: "Loja 347 - Araguaina",
    cidade: "Araguaina",
    imagem: "/images/lojas/347.jpeg",
  },
  {
    codigo: "348",
    nome: "Loja 348 - Aparecida",
    cidade: "Aparecida",
    imagem: "/images/lojas/348.jpg",
  },
]);
const filtro = ref("");
const carregando = ref(false);
const erro = ref("");
const filtroLojaSelect = ref("");
const tipoVisualizacao = ref("card");
const totalColaboradoresGeral = ref(0);
const melhorColaborador = ref(null);

// Carregar dados da loja ao montar
onMounted(() => {
  if (lojaStore.isLojaSelected) {
    carregarUsuarios();
  }
});

// Observar mudanças no filtro de loja e recarregar
watch(filtroLojaSelect, () => {
  carregarUsuarios();
});

// Selecionar loja
const selecionarLoja = async (loja) => {
  try {
    carregando.value = true;
    erro.value = "";

    // Usar a store para selecionar a loja
    const sucesso = await lojaStore.selecionarLoja(loja);

    if (sucesso) {
      await carregarUsuarios();
    } else {
      erro.value = "Erro ao validar loja. Tente novamente.";
    }
  } catch (error) {
    erro.value = "Erro ao validar loja. Tente novamente.";
    console.error("Erro ao selecionar loja:", error);
  } finally {
    carregando.value = false;
  }
};

// Trocar loja
const trocarLoja = () => {
  lojaStore.limparLoja();
  usuarios.value = [];
};

// Carregar usuários da loja selecionada
const carregarUsuarios = async () => {
  if (!lojaStore.isLojaSelected) return;

  const { api } = useApi();
  try {
    carregando.value = true;
    erro.value = "";

    // Configurar parâmetros e headers baseado no filtro
    const config = {};

    // Se filtroLojaSelect = "todos", carregar todos os usuários
    if (filtroLojaSelect.value === "todos") {
      config.params = { todos: "true" };
      config.headers = { "x-loja": lojaStore.codigoLojaAtual };
    } else if (filtroLojaSelect.value) {
      // Se tiver uma loja específica selecionada, usar ela no header
      config.headers = { "x-loja": filtroLojaSelect.value };
    } else {
      // Se filtroLojaSelect estiver vazio, carrega da loja atual (comportamento padrão)
      config.headers = { "x-loja": lojaStore.codigoLojaAtual };
    }

    const { data } = await api.get("/metricas/usuarios", config);

    usuarios.value = data.usuarios.map((user) => ({
      id: user.id,
      nome: user.nome,
      contador: user.contador || 0,
      iniciais: user.iniciais || obterIniciais(user.nome),
      loja: user.loja || lojaStore.codigoLojaAtual,
      lojaCompleta: user.lojaCompleta || lojaStore.nomeLojaAtual,
      foto: user.foto,
      ultimaAuditoria: user.ultimaAuditoria,
      totalAuditorias: user.totalAuditorias || 0,
    }));

    // Atualizar estatísticas com base nos novos dados
    totalColaboradoresGeral.value = data.totalColaboradoresGeral || 0;
    melhorColaborador.value = data.melhorColaborador || null;

    const lojaMsg =
      filtroLojaSelect.value === "todos"
        ? "todas as lojas"
        : filtroLojaSelect.value
        ? `loja ${filtroLojaSelect.value}`
        : `loja ${lojaStore.codigoLojaAtual}`;
    console.log(
      `✅ ${usuarios.value.length} usuários carregados de ${lojaMsg}`
    );
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    erro.value =
      error.response?.data?.erro || "Erro ao carregar dados do servidor";
  } finally {
    carregando.value = false;
  }
};

// Obter iniciais do nome
const obterIniciais = (nome) => {
  if (!nome) return "??";
  const nomeLimpo = nome.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
  return (
    nomeLimpo
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "??"
  );
};

// Extrair nome simples da loja
function extrairNomeSimples(nomeCompleto) {
  if (!nomeCompleto) return "Carregando...";
  const partes = nomeCompleto.split(" - ");
  return partes.length > 1 ? partes[1] : nomeCompleto;
}

// Tratar erro de imagem
function handleImageError(event) {
  event.target.src = "/images/lojas/default.jpg";
}

// Formatar data para exibição
const formatarData = (dataString) => {
  if (!dataString) return "-";
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR");
};

// Navegar para detalhes do usuário
const verDetalhes = (id) => {
  router.push(`/perfil/${id}?loja=${lojaStore.codigoLojaAtual}`);
};

// Limpar filtros
const limparFiltros = () => {
  filtro.value = "";
};

// Limitar nome do usuário
const limitarNome = (nome) => {
  if (!nome) return "";
  return nome.length > 18 ? nome.substring(0, 18) + "..." : nome;
};

// Limitar nome do top colaborador
const limitarNomeTop = (nome) => {
  if (!nome) return "";
  return nome.length > 15 ? nome.substring(0, 15) + "..." : nome;
};

// Gerar cor baseada no código da loja
const gerarCorLoja = (codigoLoja) => {
  const cores = {
    // Cores específicas para lojas conhecidas
    "056": {
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
      shadow: "rgba(238, 90, 36, 0.4)",
    }, // Vermelho
    "002": {
      gradient: "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)",
      shadow: "rgba(68, 160, 141, 0.4)",
    }, // Verde-azulado
    "003": {
      gradient: "linear-gradient(135deg, #45b7d1 0%, #96c93d 100%)",
      shadow: "rgba(69, 183, 209, 0.4)",
    }, // Azul-verde
    "004": {
      gradient: "linear-gradient(135deg, #f39c12 0%, #d35400 100%)",
      shadow: "rgba(211, 84, 0, 0.4)",
    }, // Laranja
    "005": {
      gradient: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
      shadow: "rgba(142, 68, 173, 0.4)",
    }, // Roxo
    "006": {
      gradient: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
      shadow: "rgba(22, 160, 133, 0.4)",
    }, // Verde
    "0526": {
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      shadow: "rgba(249, 115, 22, 0.4)",
    }, // Laranja (sua preferência)
    "084": {
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      shadow: "rgba(16, 185, 129, 0.4)",
    }, // Verde (sua preferência)
    105: {
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      shadow: "rgba(249, 115, 22, 0.4)",
    }, // Laranja
  };

  // Se a loja tem uma cor específica, usa ela
  if (cores[codigoLoja]) {
    return cores[codigoLoja];
  }

  // Caso contrário, gera uma cor baseada no código da loja
  const numero = parseInt(codigoLoja) || 0;
  const coresAutomaticas = [
    {
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shadow: "rgba(102, 126, 234, 0.4)",
    }, // Azul-roxo
    {
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      shadow: "rgba(245, 87, 108, 0.4)",
    }, // Rosa
    {
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      shadow: "rgba(79, 172, 254, 0.4)",
    }, // Azul claro
    {
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      shadow: "rgba(67, 233, 123, 0.4)",
    }, // Verde claro
    {
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      shadow: "rgba(250, 112, 154, 0.4)",
    }, // Rosa-amarelo
    {
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      shadow: "rgba(168, 237, 234, 0.4)",
    }, // Azul-rosa claro
    {
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      shadow: "rgba(255, 154, 158, 0.4)",
    }, // Rosa suave
    {
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      shadow: "rgba(252, 182, 159, 0.4)",
    }, // Pêssego
  ];

  return coresAutomaticas[numero % coresAutomaticas.length];
};

// Computed: Usuários filtrados
const usuariosFiltrados = computed(() => {
  let resultado = usuarios.value;

  // Filtro por nome ou matrícula (apenas filtro local)
  if (filtro.value) {
    const filtroLower = filtro.value.toLowerCase();
    resultado = resultado.filter(
      (u) =>
        u.nome.toLowerCase().includes(filtroLower) ||
        u.id.toLowerCase().includes(filtroLower)
    );
  }

  return resultado;
});

// Computed: Total de auditorias da loja atual
const totalAuditoriasLoja = computed(() => {
  const usuariosDaLoja = usuarios.value.filter(
    (u) => u.loja === lojaStore.codigoLojaAtual
  );
  return usuariosDaLoja.reduce(
    (total, u) => total + (u.totalAuditorias || 0),
    0
  );
});

// Computed: Total de itens lidos
const totalItensLidos = computed(() =>
  usuarios.value.reduce((total, usuario) => total + usuario.contador, 0)
);

// Computed: Média de itens por usuário (baseada apenas na loja atual)
const mediaItensPorUsuario = computed(() => {
  const usuariosDaLoja = usuarios.value.filter(
    (u) => u.loja === lojaStore.codigoLojaAtual
  );
  const totalItens = usuariosDaLoja.reduce((sum, u) => sum + u.contador, 0);
  return usuariosDaLoja.length
    ? Math.round(totalItens / usuariosDaLoja.length)
    : 0;
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.usuarios-container {
  margin-top: -50px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  font-family: "Inter", sans-serif;
}

/* ===== SELEÇÃO DE LOJA ===== */
.loja-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.loja-selection-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  width: 100%;
}

.loja-icon {
  font-size: 4rem;
  color: #667eea;
  margin-bottom: 2rem;
}

.loja-selection-content h2 {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.loja-selection-content p {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 3rem;
}

.lojas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.loja-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.loja-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.loja-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.loja-image {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e2e8f0;
}

.loja-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loja-info h3 {
  font-size: 1.1rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.loja-info p {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.loja-codigo {
  background: #667eea;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Estilo para o ícone da loja nos cards */
.metric-icon.loja-icon {
  background: transparent !important;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

.metric-icon.loja-icon img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* Estilo para o ícone de usuário nos cards */
.metric-icon.user-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* ===== HEADER ===== */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

/* Elementos decorativos de fundo no header */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.header-circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -50px;
  animation-delay: 0s;
}

.header-circle-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -40px;
  animation-delay: 1s;
}

.header-circle-3 {
  width: 100px;
  height: 100px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.header-circle-4 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 10%;
  animation-delay: 3s;
}

.header-circle-5 {
  width: 60px;
  height: 60px;
  top: 60%;
  left: 5%;
  animation-delay: 4s;
}

.header-circle-6 {
  width: 90px;
  height: 90px;
  top: 10%;
  left: 20%;
  animation-delay: 5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.page-header::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.loja-image-header {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.loja-image-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-text h1 {
  color: white;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-text p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 300;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-icon-refresh,
.btn-icon-return,
.btn-trocar-loja {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  font-weight: 500;
}

.btn-icon-refresh,
.btn-icon-return {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.2rem;
}

.btn-trocar-loja {
  padding: 0.75rem 1.5rem;
  gap: 0.5rem;
}

.btn-icon-refresh:hover,
.btn-icon-return:hover,
.btn-trocar-loja:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-icon-refresh:disabled,
.btn-icon-return:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ===== FILTROS ===== */
.filters-bar {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-wrapper {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1rem;
}

.search-field {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
}

.search-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.3s ease;
}

.clear-search:hover {
  color: #ef4444;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* ===== MÉTRICAS ===== */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 15px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 100px;
}

.metric-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.1;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.metric-card:hover::before {
  transform: scale(1.5);
}

.metric-card.primary {
  border-left: 4px solid #667eea;
}
.metric-card.primary .metric-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.metric-card.primary::before {
  background: #667eea;
}

.metric-card.success {
  border-left: 4px solid #10b981;
}
.metric-card.success .metric-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
.metric-card.success::before {
  background: #10b981;
}

.metric-card.info {
  border-left: 4px solid #3b82f6;
}
.metric-card.info .metric-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}
.metric-card.info::before {
  background: #3b82f6;
}

.metric-card.warning {
  border-left: 4px solid #f59e0b;
}
.metric-card.warning .metric-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}
.metric-card.warning::before {
  background: #f59e0b;
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.metric-icon.trophy-icon {
  background: white !important;
}

.metric-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.metric-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

/* ===== LOADING ===== */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.loader {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

.loading-state p {
  color: #64748b;
  font-size: 1.1rem;
}

/* ===== ERROR STATE ===== */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.error-state h3 {
  color: #1e293b;
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.error-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.btn-retry {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.empty-illustration {
  font-size: 5rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  color: #1e293b;
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.btn-clear-filter,
.btn-upload {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 1rem;
}

.btn-clear-filter:hover,
.btn-upload:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

/* ===== GRID DE USUÁRIOS ===== */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
}

.user-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.user-card:hover::before {
  transform: scaleX(1);
}

.user-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.user-avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: white;
  font-size: 2rem;
  font-weight: 700;
}

.user-details {
  text-align: center;
  margin-bottom: 1.5rem;
}

.loja-badge-mini {
  position: absolute;
  bottom: -1px;
  right: 35%;
  color: white;
  width: 35px;
  height: 25px;
  border-radius: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  font-weight: 900;
  font-size: 0.9rem;
  z-index: 10;
  /* Background e box-shadow são aplicados dinamicamente via :style */
}

.user-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.user-matricula {
  color: #3b82f6;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.user-loja {
  color: #64748b;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.user-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.metric-item i {
  color: #667eea;
  font-size: 1.25rem;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.metric-number.green {
  color: #10b981;
}

.metric-number.purple {
  color: #8b5cf6;
}

.metric-text {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.user-last-activity {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.activity-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.activity-date {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 600;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.btn-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-size: 0.95rem;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* ===== RESPONSIVO ===== */
@media (max-width: 1200px) {
  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}

@media (max-width: 768px) {
  .usuarios-container {
    padding: 1rem;
  }

  .loja-selection-content {
    padding: 2rem;
  }

  .lojas-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .header-left {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .loja-image-header {
    width: 60px;
    height: 60px;
  }

  .header-text h1 {
    font-size: 1.5rem;
  }

  .header-text p {
    font-size: 0.95rem;
  }

  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    min-width: 100%;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select {
    min-width: 100%;
  }

  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .user-metrics {
    grid-template-columns: 1fr;
  }

  /* Esconde algumas bolinhas em mobile para não poluir */
  .header-circle-3,
  .header-circle-4,
  .header-circle-5,
  .header-circle-6 {
    display: none;
  }
}

/* ===== VISUALIZAÇÃO EM LISTA ===== */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-list-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.user-list-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
  border-left-color: #667eea;
}

.list-avatar {
  flex-shrink: 0;
}

.avatar-circle-small {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  overflow: hidden;
}

.avatar-initials-small {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
}

.list-info {
  flex: 1;
  min-width: 0;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.list-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.loja-badge-list {
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.list-details {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.list-matricula,
.list-loja {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.list-matricula {
  color: #3b82f6;
  font-weight: 600;
}

.list-metrics {
  display: flex;
  gap: 2rem;
  padding: 0 1rem;
  border-left: 2px solid #e2e8f0;
  border-right: 2px solid #e2e8f0;
}

.list-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.list-metric i {
  color: #667eea;
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.list-metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.list-metric-value.green {
  color: #10b981;
}

.list-metric-value.purple {
  color: #8b5cf6;
}

.list-metric-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.list-actions {
  flex-shrink: 0;
}

.btn-list-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-list-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .header-left {
    align-items: center;
    text-align: center;
  }

  .btn-icon-refresh {
    width: 45px;
    height: 45px;
  }

  .avatar-circle {
    width: 80px;
    height: 80px;
  }

  .avatar-initials {
    font-size: 1.5rem;
  }

  .user-name {
    font-size: 1.2rem;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }

  /* Lista responsiva em mobile */
  .user-list-item {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .list-metrics {
    width: 100%;
    border-left: none;
    border-right: none;
    border-top: 2px solid #e2e8f0;
    border-bottom: 2px solid #e2e8f0;
    padding: 1rem 0;
    justify-content: space-around;
  }

  .list-actions {
    width: 100%;
  }

  .btn-list-details {
    width: 100%;
  }
}
</style>
