<template>
  <div class="quick-suggestion">
    <h3>💡 Tem uma ideia para melhorar o sistema?</h3>
    <div class="suggestion-form">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="✍️ Compartilhe sua ideia com a comunidade..."
        rows="3"
      ></textarea>
      <div class="form-footer">
        <div class="points-info">
          <span class="points-badge">+10 pontos por sugestão aceita</span>
        </div>
        <button class="btn-send" :disabled="!modelValue" @click="handleSubmit">
          <i class="fas fa-paper-plane"></i>
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "suggestion-submitted"]);

const handleSubmit = () => {
  if (props.modelValue.trim()) {
    emit("suggestion-submitted", props.modelValue);
  }
};
</script>

<style scoped>
.quick-suggestion {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.quick-suggestion h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
}

.suggestion-form textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.suggestion-form textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.points-badge {
  background: #fef3c7;
  color: #d97706;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-send {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.btn-send:hover:not(:disabled) {
  background: #2563eb;
}

.btn-send:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
