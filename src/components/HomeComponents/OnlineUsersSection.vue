<template>
  <section class="online-users-section">
    <!-- Elementos decorativos de fundo -->
    <div class="decoration-circle users-circle-1"></div>
    <div class="decoration-circle users-circle-2"></div>
    <div class="decoration-circle users-circle-3"></div>
    <div class="decoration-circle users-circle-4"></div>

    <div class="section-container">
      <div class="section-header">
        <div class="header-content">
          <h2>
            <i class="fas fa-users"></i>
            Colaboradores Online
          </h2>
          <p>Veja quem está trabalhando em tempo real</p>
        </div>
        <div class="online-indicator">
          <div class="pulse-dot"></div>
          <span>{{ onlineUsers.length }} Online</span>
        </div>
      </div>

      <div class="users-grid">
        <div
          v-for="user in onlineUsers"
          :key="user.id"
          class="user-card"
          :class="{ 'top-performer': user.isTopPerformer }"
        >
          <div class="user-avatar">
            <img :src="user.avatar" :alt="user.name" />
            <div class="online-badge">
              <div class="online-dot"></div>
            </div>
            <div v-if="user.isTopPerformer" class="top-badge">
              <i class="fas fa-crown"></i>
            </div>
          </div>

          <div class="user-info">
            <h4>{{ user.name }}</h4>
            <p class="user-role">{{ user.role }}</p>
            <div class="user-stats">
              <div class="stat">
                <i class="fas fa-clipboard-check"></i>
                <span>{{ user.auditsToday }}</span>
              </div>
              <div class="stat">
                <i class="fas fa-clock"></i>
                <span>{{ user.timeOnline }}</span>
              </div>
            </div>
          </div>

          <div class="user-activity">
            <div class="activity-indicator" :class="user.activityStatus">
              {{ getActivityText(user.activityStatus) }}
            </div>
          </div>
        </div>
      </div>

      <div class="section-footer">
        <button class="btn-view-all">
          <i class="fas fa-eye"></i>
          Ver Todos os Colaboradores
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

// Dados mock dos colaboradores online
const onlineUsers = ref([
  {
    id: 1,
    name: 'Ana Silva',
    role: 'Coordenadora',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1fd?w=150&h=150&fit=crop&crop=face',
    auditsToday: 12,
    timeOnline: '4h 30m',
    activityStatus: 'auditing',
    isTopPerformer: true
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    role: 'Auditor Sênior',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    auditsToday: 8,
    timeOnline: '3h 15m',
    activityStatus: 'active',
    isTopPerformer: false
  },
  {
    id: 3,
    name: 'Mariana Costa',
    role: 'Auditora',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    auditsToday: 15,
    timeOnline: '5h 45m',
    activityStatus: 'auditing',
    isTopPerformer: true
  },
  {
    id: 4,
    name: 'Roberto Lima',
    role: 'Auditor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    auditsToday: 6,
    timeOnline: '2h 20m',
    activityStatus: 'idle',
    isTopPerformer: false
  },
  {
    id: 5,
    name: 'Sofia Santos',
    role: 'Auditora Pleno',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    auditsToday: 10,
    timeOnline: '6h 10m',
    activityStatus: 'active',
    isTopPerformer: false
  },
  {
    id: 6,
    name: 'João Pedro',
    role: 'Auditor Júnior',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    auditsToday: 4,
    timeOnline: '1h 55m',
    activityStatus: 'active',
    isTopPerformer: false
  }
]);

const getActivityText = (status) => {
  const statusMap = {
    'auditing': 'Auditando',
    'active': 'Ativo',
    'idle': 'Pausado'
  };
  return statusMap[status] || 'Online';
};
</script>

<style scoped>
.online-users-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  margin: 2rem 0;
}

/* Elementos decorativos de fundo */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.08);
  animation: floatUsers 7s ease-in-out infinite;
}

.users-circle-1 {
  width: 180px;
  height: 180px;
  top: -90px;
  left: -40px;
  animation-delay: 0s;
}

.users-circle-2 {
  width: 120px;
  height: 120px;
  bottom: -60px;
  right: -30px;
  animation-delay: 2s;
}

.users-circle-3 {
  width: 80px;
  height: 80px;
  top: 40%;
  right: 10%;
  animation-delay: 4s;
}

.users-circle-4 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 15%;
  animation-delay: 6s;
}

@keyframes floatUsers {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-18px) rotate(8deg);
  }
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.header-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-content h2 i {
  color: #667eea;
}

.header-content p {
  font-size: 1.1rem;
  color: #64748b;
}

.online-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  color: #1e293b;
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.user-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
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
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.user-card.top-performer {
  border-color: #fbbf24;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.user-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e2e8f0;
}

.online-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: white;
  border-radius: 50%;
  padding: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.online-dot {
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
}

.top-badge {
  position: absolute;
  top: -5px;
  left: -5px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
}

.user-info {
  text-align: center;
  margin-bottom: 1rem;
}

.user-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.user-role {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #667eea;
  font-weight: 500;
}

.stat i {
  font-size: 0.8rem;
}

.user-activity {
  text-align: center;
}

.activity-indicator {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.activity-indicator.auditing {
  background: #dcfce7;
  color: #166534;
}

.activity-indicator.active {
  background: #dbeafe;
  color: #1e40af;
}

.activity-indicator.idle {
  background: #fef3c7;
  color: #92400e;
}

.section-footer {
  text-align: center;
}

.btn-view-all {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.btn-view-all:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* Responsividade */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-content h2 {
    font-size: 2rem;
  }

  .users-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  /* Esconde algumas bolinhas em mobile */
  .users-circle-3,
  .users-circle-4 {
    display: none;
  }
}

@media (max-width: 480px) {
  .online-users-section {
    padding: 2rem 1rem;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }

  .user-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>