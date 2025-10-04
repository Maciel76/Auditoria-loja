// composables/useUploadProgress.js - Composable para gerenciar progresso de upload
import { ref, reactive, onUnmounted } from 'vue'

export function useUploadProgress() {
  // Estados do progresso
  const isUploading = ref(false)
  const progress = reactive({
    percentage: 0,
    status: 'aguardando',
    message: 'Preparando upload...',
    sessionId: null,
    stages: {
      reading: { completed: false, percentage: 0, name: 'Lendo Planilha' },
      processing: { completed: false, percentage: 0, name: 'Processando Dados' },
      saving: { completed: false, percentage: 0, name: 'Salvando no Banco' },
      metrics: { completed: false, percentage: 0, name: 'Calculando Métricas' }
    }
  })

  const result = ref(null)
  const error = ref(null)
  let eventSource = null

  // Inicializar progresso
  const startProgress = () => {
    isUploading.value = true
    progress.percentage = 0
    progress.status = 'iniciando'
    progress.message = 'Iniciando upload...'
    progress.sessionId = null
    result.value = null
    error.value = null

    // Resetar estágios
    Object.keys(progress.stages).forEach(stage => {
      progress.stages[stage].completed = false
      progress.stages[stage].percentage = 0
    })
  }

  // Conectar ao stream de progresso
  const connectToProgressStream = (sessionId) => {
    if (eventSource) {
      eventSource.close()
    }

    progress.sessionId = sessionId
    const streamUrl = `http://localhost:3000/api/progress/stream/${sessionId}`

    eventSource = new EventSource(streamUrl)

    eventSource.onopen = () => {
      console.log('✅ Conectado ao stream de progresso')
    }

    eventSource.onmessage = (event) => {
      try {
        const progressData = JSON.parse(event.data)
        updateProgress(progressData)
      } catch (err) {
        console.error('❌ Erro ao processar dados do progresso:', err)
      }
    }

    eventSource.addEventListener('completed', (event) => {
      const progressData = JSON.parse(event.data)
      console.log('🎉 Upload concluído!')

      result.value = progressData.result
      finishProgress()
    })

    eventSource.addEventListener('error', (event) => {
      const progressData = JSON.parse(event.data)
      console.log('❌ Erro no upload')

      error.value = {
        message: progressData.message || 'Erro no upload',
        details: progressData.error
      }
      finishProgress()
    })

    eventSource.onerror = (err) => {
      console.error('❌ Erro na conexão do stream:', err)
    }
  }

  // Atualizar progresso
  const updateProgress = (progressData) => {
    progress.percentage = progressData.percentage || 0
    progress.status = progressData.status || 'processando'
    progress.message = progressData.message || 'Processando...'

    // Atualizar estágios
    if (progressData.stages) {
      Object.entries(progressData.stages).forEach(([stageName, stageData]) => {
        if (progress.stages[stageName]) {
          progress.stages[stageName].completed = stageData.completed || false
          progress.stages[stageName].percentage = stageData.percentage || 0
        }
      })
    }
  }

  // Finalizar progresso
  const finishProgress = () => {
    isUploading.value = false

    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  }

  // Upload com progresso
  const uploadWithProgress = async (file, tipoAuditoria, lojaStore) => {
    startProgress()

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tipoAuditoria', tipoAuditoria)

      console.log(`🏪 Enviando para loja: ${lojaStore.codigoLojaAtual}`)

      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
          'x-loja': lojaStore.codigoLojaAtual
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        // Conectar ao stream de progresso
        if (data.progress?.sessionId) {
          connectToProgressStream(data.progress.sessionId)
        } else {
          // Fallback para caso não tenha progresso
          result.value = data
          finishProgress()
        }
      } else {
        throw new Error(data.erro || 'Erro no upload')
      }

    } catch (err) {
      console.error('❌ Erro no upload:', err)

      let mensagemErro = 'Falha no upload'
      let detalhes = err.message

      if (err.response?.status === 400) {
        const errorData = err.response.data
        if (errorData?.erro === 'LOJA_NAO_SELECIONADA') {
          mensagemErro = 'Loja não selecionada'
          detalhes = 'Por favor, selecione uma loja válida'
        } else if (errorData?.erro === 'LOJA_INVALIDA') {
          mensagemErro = 'Loja inválida'
          detalhes = errorData?.mensagem || 'Código de loja não reconhecido'
        }
      }

      error.value = {
        message: mensagemErro,
        details: detalhes
      }

      finishProgress()
    }
  }

  // Resetar estado
  const reset = () => {
    isUploading.value = false
    progress.percentage = 0
    progress.status = 'aguardando'
    progress.message = 'Preparando upload...'
    progress.sessionId = null
    result.value = null
    error.value = null

    Object.keys(progress.stages).forEach(stage => {
      progress.stages[stage].completed = false
      progress.stages[stage].percentage = 0
    })

    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  }

  // Cleanup ao destruir o componente
  onUnmounted(() => {
    if (eventSource) {
      eventSource.close()
    }
  })

  return {
    // Estados
    isUploading,
    progress,
    result,
    error,

    // Métodos
    uploadWithProgress,
    reset
  }
}