## 01 Anotação de comportamentos do backend

Quero que o comportamento do backend relativo ao modelo Auditoria.js fique claro e objetivo:

Objetivo

- Manter apenas um registro por loja no modelo Auditoria: sempre atualizar o registro existente com os dados da última auditoria, em vez de criar um novo registro por dia.

Comportamento atual

- Ao subir uma planilha com N lojas, os dados de cada loja são salvos separadamente (ok).
- Se reenviar a mesma planilha no mesmo dia, o registro é atualizado (ok).
- Se enviar em outro dia, um novo registro é criado (indesejado — causa crescimento excessivo de dados).

Requisito desejado

- Para cada loja presente na planilha, fazer um "update or create" (upsert): localizar o registro da loja (por identificador único — ex.: storeId ou nome da loja + tipo de auditoria) e atualizar com os novos dados; se não existir, criar.
- Assim, uploads em dias diferentes sobrescrevem/atualizam o registro existente e não criam histórico adicional.

Restrições e recomendações de implementação

- Não quebrar o funcionamento dos outros modelos/rotas.
- Preferência por mudança mínima: ajustar a rota principal para chamar um serviço que execute o upsert, ou implementar a lógica de upsert no serviço já existente.
- Usar operação atômica (ex.: findOneAndUpdate com upsert: true no MongoDB) e indexar o campo usado como chave única.
- Garantir que, ao atualizar, campos necessários sejam substituídos ou mesclados conforme regra definida (especificar campos que devem ser preservados, se houver).

Critérios de aceitação

- Após o upload de uma planilha, existe no máximo um documento por loja em Auditoria, contendo os dados da última auditoria.
- Uploads em dias diferentes atualizam o mesmo documento.
- Rotas e funcionalidades relacionadas continuam funcionando como antes.
- Implementar testes ou checagens simples para validar o comportamento.
