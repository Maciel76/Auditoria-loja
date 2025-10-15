<template>
  <div class="online-users-card">
    <div class="card-header">
      <h3>
        <i class="fas fa-users"></i>
        Colaboradores Online
      </h3>
      <div class="online-count">
        <div class="pulse-dot"></div>
        <span>{{ onlineUsers.length }}</span>
      </div>
    </div>

    <div class="users-list">
      <div
        v-for="user in onlineUsers.slice(0, 6)"
        :key="user.id"
        class="user-item"
        :class="{ 'top-performer': user.isTopPerformer }"
      >
        <div class="user-avatar">
          <img :src="user.avatar" :alt="user.name" />
          <div class="online-badge"></div>
          <div v-if="user.isTopPerformer" class="crown-badge">
            <i class="fas fa-crown"></i>
          </div>
        </div>

        <div class="user-info">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-status" :class="user.activityStatus">
            {{ getActivityText(user.activityStatus) }}
          </div>
        </div>

        <div class="user-stats">
          <span class="audit-count">{{ user.auditsToday }}</span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <button class="btn-view-more">
        <i class="fas fa-eye"></i>
        Ver todos
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dados mock dos colaboradores online (versão compacta)
const onlineUsers = ref([
  {
    id: 1,
    name: 'Ana Silva',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1fd?w=80&h=80&fit=crop&crop=face',
    auditsToday: 12,
    activityStatus: 'auditing',
    isTopPerformer: true
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    auditsToday: 8,
    activityStatus: 'active',
    isTopPerformer: false
  },
  {
    id: 3,
    name: 'Mariana Costa',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    auditsToday: 15,
    activityStatus: 'auditing',
    isTopPerformer: true
  },
  {
    id: 4,
    name: 'Roberto Lima',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    auditsToday: 6,
    activityStatus: 'idle',
    isTopPerformer: false
  },
  {
    id: 5,
    name: 'Sofia Santos',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
    auditsToday: 10,
    activityStatus: 'active',
    isTopPerformer: false
  },
  {
    id: 6,
    name: 'João Pedro',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    auditsToday: 4,
    activityStatus: 'active',
    isTopPerformer: false
  },
  {
    id: 7,
    name: 'Lucia Fernandes',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
    auditsToday: 9,
    activityStatus: 'auditing',
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
.online-users-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.online-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
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
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.users-list {
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.user-item:hover {
  background: #f8fafc;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item.top-performer {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.online-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.crown-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: white;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-status {
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.2rem;
}

.user-status.auditing {
  color: #166534;
}

.user-status.active {
  color: #1e40af;
}

.user-status.idle {
  color: #92400e;
}

.user-stats {
  text-align: center;
  flex-shrink: 0;
}

.audit-count {
  display: inline-block;
  background: #667eea;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  min-width: 24px;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  text-align: center;
}

.btn-view-more {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-view-more:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

/* Scrollbar personalizada */
.users-list::-webkit-scrollbar {
  width: 4px;
}

.users-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.users-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.users-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsividade */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }

  .card-header h3 {
    font-size: 1rem;
  }

  .user-item {
    padding: 0.75rem 1rem;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
  }

  .user-name {
    font-size: 0.9rem;
  }
}
</style>