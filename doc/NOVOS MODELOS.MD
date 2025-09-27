Vamos reestruturar os modelos para ter uma abordagem mais unificada e escalável, considerando múltiplas lojas.

Objetivos:

Unificar modelos de auditoria (etiqueta, presença, ruptura) em um único modelo, com um campo para tipo.

Garantir que todos os modelos tenham referência à loja.

Simplificar a estrutura de usuários, talvez unificando também.

Manter a flexibilidade para os diferentes tipos de dados.

Vamos criar os seguintes modelos:

Store (Loja): Para armazenar as lojas.

User (Usuário): Para armazenar os usuários, com referência à loja.

Audit (Auditoria): Modelo unificado para armazenar os itens de auditoria (etiqueta, presença, ruptura).

FileProcess (Processamento de Arquivo): Para rastrear o processamento de arquivos.

Além disso, podemos manter o modelo Planilha para metadados das planilhas, mas também com referência à loja.

Vamos reescrever os modelos:

1. Modelo Store (Loja)
   javascript
   // models/Store.js
   import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
code: {
type: String,
required: true,
unique: true,
},
name: {
type: String,
required: true,
},
city: String,
image: {
type: String,
default: '/images/lojas/default.jpg',
},
isActive: {
type: Boolean,
default: true,
},
}, {
timestamps: true,
});

export default mongoose.model('Store', storeSchema); 2. Modelo User (Usuário)
javascript
// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
userId: {
type: String,
required: true,
unique: true,
},
name: {
type: String,
required: true,
},
email: String,
phone: String,
position: String,
photo: String,
store: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Store',
required: true,
},
isActive: {
type: Boolean,
default: true,
},
}, {
timestamps: true,
});

export default mongoose.model('User', userSchema); 3. Modelo Audit (Auditoria)
Este modelo será unificado para todos os tipos de auditoria.

javascript
// models/Audit.js
import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
store: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Store',
required: true,
},
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
},
type: {
type: String,
required: true,
enum: ['etiqueta', 'presenca', 'ruptura'],
},
date: {
type: Date,
required: true,
default: Date.now,
},
// Campos comuns
code: String,
product: String,
location: String,
status: String,
stock: String,
// Campos específicos para ruptura
rootProductClass: String,
productClass: String,
sector: String,
auditStatus: String,
auditedAt: Date,
confirmedPresence: String,
daysWithoutSale: Number,
ruptureCost: Number,
// Campos específicos para presença
presence: Boolean,
confirmedAt: Date,
// Metadata
metadata: {
originalFile: String,
uploadDate: {
type: Date,
default: Date.now,
},
rowNumber: Number,
synchronized: {
type: Boolean,
default: false,
},
},
}, {
timestamps: true,
});

// Índices
auditSchema.index({ store: 1, date: 1 });
auditSchema.index({ user: 1, date: 1 });
auditSchema.index({ type: 1, date: 1 });
auditSchema.index({ location: 1, date: 1 });
auditSchema.index({ status: 1 });

export default mongoose.model('Audit', auditSchema); 4. Modelo FileProcess (Processamento de Arquivo)
javascript
// models/FileProcess.js
import mongoose from 'mongoose';

const fileProcessSchema = new mongoose.Schema({
store: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Store',
required: true,
},
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
},
originalName: {
type: String,
required: true,
},
processedName: String,
type: {
type: String,
enum: ['etiqueta', 'presenca', 'ruptura'],
required: true,
},
status: {
type: String,
enum: ['pending', 'processing', 'completed', 'error'],
default: 'pending',
},
result: {
totalItems: Number,
processedItems: Number,
errors: [String],
},
processingTime: Number, // em milissegundos
}, {
timestamps: true,
});

export default mongoose.model('FileProcess', fileProcessSchema); 5. Modelo Planilha (para metadados)
Se ainda for necessário, podemos manter o modelo Planilha, mas com referência à loja.

javascript
// models/Planilha.js
import mongoose from 'mongoose';

const planilhaSchema = new mongoose.Schema({
store: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Store',
required: true,
},
fileName: {
type: String,
required: true,
},
uploadDate: {
type: Date,
default: Date.now,
},
auditDate: {
type: Date,
required: true,
},
auditType: {
type: String,
enum: ['etiqueta', 'presenca', 'ruptura'],
required: true,
},
totalItems: {
type: Number,
default: 0,
},
readItems: {
type: Number,
default: 0,
},
completionRate: {
type: Number,
default: 0,
},
involvedUsers: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
}],
metadata: {
fileSize: Number,
format: String,
totalRows: Number,
processingComplete: {
type: Boolean,
default: false,
},
},
}, {
timestamps: true,
});

planilhaSchema.index({ store: 1, auditDate: 1, auditType: 1 });
planilhaSchema.index({ uploadDate: -1 });

export default mongoose.model('Planilha', planilhaSchema);
Considerações:
Unificação: Agora temos um único modelo para auditoria, que pode lidar com todos os tipos.

Referências: Usamos referências para Store e User, o que permite populate e consultas mais eficientes.

Flexibilidade: O modelo Audit tem campos para todos os tipos de auditoria. Campos não utilizados em um tipo específico ficarão vazios.

Rastreabilidade: O modelo FileProcess ajuda a rastrear o processamento de arquivos.

Migração:
Para migrar os dados existentes, você precisará:

Criar registros na coleção Store para cada loja.

Associar usuários a lojas (coleção User).

Migrar os dados das auditorias existentes para o novo modelo Audit, convertendo o código da loja para o ObjectId correspondente.

Esta estrutura deve facilitar o gerenciamento de múltiplas lojas e centralizar a lógica de auditoria.

Reestruturação do Sistema de Auditorias - Modelos Unificados
Analisando seus modelos atuais, vejo que há muita duplicação e falta de padronização. Vou propor uma estrutura unificada e simplificada que atenda a todas as necessidades.

Modelos Consolidados

1. Modelo de Loja (Store)
   javascript
   // models/Store.js
   import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
code: {
type: String,
required: true,
unique: true,
index: true
},
name: {
type: String,
required: true
},
city: {
type: String,
required: true
},
image: {
type: String,
default: "/images/lojas/default.jpg"
},
isActive: {
type: Boolean,
default: true
},
metadata: {
address: String,
region: String,
phone: String
}
}, {
timestamps: true
});

export default mongoose.model("Store", storeSchema); 2. Modelo de Usuário (User)
javascript
// models/User.js
import mongoose from "mongoose";

const auditDetailSchema = new mongoose.Schema({
date: {
type: Date,
required: true,
default: Date.now
},
type: {
type: String,
enum: ["etiqueta", "presenca", "ruptura"],
required: true
},
itemsCount: {
type: Number,
default: 0
},
items: [{
code: String,
product: String,
location: String,
status: String,
stock: String,
auditData: mongoose.Schema.Types.Mixed
}]
});

const userSchema = new mongoose.Schema({
userId: {
type: String,
required: true,
unique: true
},
name: {
type: String,
required: true
},
email: String,
phone: String,
position: String,
photo: String,
stores: [{
type: mongoose.Schema.Types.ObjectId,
ref: "Store"
}],
auditHistory: [auditDetailSchema],
totalAuditCount: {
type: Number,
default: 0
},
isActive: {
type: Boolean,
default: true
}
}, {
timestamps: true
});

// Índices para performance
userSchema.index({ userId: 1 });
userSchema.index({ "auditHistory.date": 1 });
userSchema.index({ stores: 1 });

export default mongoose.model("User", userSchema); 3. Modelo Unificado de Auditoria (Audit)
javascript
// models/Audit.js
import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
// Identificação
store: {
type: mongoose.Schema.Types.ObjectId,
ref: "Store",
required: true
},
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},
type: {
type: String,
enum: ["etiqueta", "presenca", "ruptura"],
required: true
},
auditDate: {
type: Date,
required: true,
index: true
},

// Dados do produto
productCode: String,
productName: String,
location: String,
status: String,
stock: String,

// Campos específicos por tipo de auditoria
auditData: {
// Campos para etiqueta
lastPurchase: Date,
// Campos para presença
presence: Boolean,
presenceConfirmedAt: Date,
// Campos para ruptura
productClass: String,
sector: String,
daysWithoutSale: Number,
ruptureCost: Number,
supplier: String
},

// Metadados
sourceFile: {
name: String,
uploadDate: {
type: Date,
default: Date.now
},
rowNumber: Number
},

// Controles
processed: {
type: Boolean,
default: false
},
synchronized: {
type: Boolean,
default: false
}
}, {
timestamps: true
});

// Índices compostos para consultas eficientes
auditSchema.index({ store: 1, auditDate: 1 });
auditSchema.index({ user: 1, auditDate: 1 });
auditSchema.index({ type: 1, auditDate: 1 });
auditSchema.index({ store: 1, type: 1, auditDate: 1 });

export default mongoose.model("Audit", auditSchema); 4. Modelo de Processamento de Arquivo (FileProcess)
javascript
// models/FileProcess.js
import mongoose from "mongoose";

const fileProcessSchema = new mongoose.Schema({
store: {
type: mongoose.Schema.Types.ObjectId,
ref: "Store",
required: true
},
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User"
},
originalName: {
type: String,
required: true
},
processedName: String,
type: {
type: String,
enum: ["etiqueta", "presenca", "ruptura"],
required: true
},
status: {
type: String,
enum: ["pending", "processing", "completed", "error"],
default: "pending"
},
auditDate: {
type: Date,
required: true
},
results: {
totalItems: Number,
processedItems: Number,
errors: [String],
processingTime: Number
},
metadata: {
fileSize: Number,
mimeType: String,
columns: [String]
}
}, {
timestamps: true
});

export default mongoose.model("FileProcess", FileProcess);
Estrutura de APIs Unificadas
Rota Principal de Upload
javascript
// routes/upload.js
import express from "express";
import multer from "multer";
import FileProcess from "../models/FileProcess";
import { processAuditFile } from "../services/auditProcessor";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
try {
const { storeId, auditType, auditDate } = req.body;

    // Registrar processamento
    const fileProcess = new FileProcess({
      store: storeId,
      originalName: req.file.originalname,
      type: auditType,
      auditDate: new Date(auditDate),
      status: "pending"
    });

    await fileProcess.save();

    // Processar em background
    processAuditFile(fileProcess._id, req.file.path);

    res.json({
      success: true,
      message: "Arquivo em processamento",
      processId: fileProcess._id
    });

} catch (error) {
res.status(500).json({ error: error.message });
}
});

// Status do processamento
router.get("/status/:processId", async (req, res) => {
try {
const process = await FileProcess.findById(req.params.processId)
.populate("store", "code name");

    if (!process) {
      return res.status(404).json({ error: "Processo não encontrado" });
    }

    res.json(process);

} catch (error) {
res.status(500).json({ error: error.message });
}
});

export default router;
Rota de Relatórios e Estatísticas
javascript
// routes/reports.js
import express from "express";
import Audit from "../models/Audit";

const router = express.Router();

// Estatísticas por loja e período
router.get("/stats", async (req, res) => {
try {
const { storeId, startDate, endDate, type } = req.query;

    const matchStage = {
      auditDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (storeId) matchStage.store = storeId;
    if (type) matchStage.type = type;

    const stats = await Audit.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            store: "$store",
            type: "$type",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$auditDate" } }
          },
          totalItems: { $sum: 1 },
          completedItems: {
            $sum: { $cond: [{ $eq: ["$status", "Atualizado"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          store: "$_id.store",
          type: "$_id.type",
          date: "$_id.date",
          totalItems: 1,
          completedItems: 1,
          completionRate: {
            $round: [{ $multiply: [{ $divide: ["$completedItems", "$totalItems"] }, 100] }, 2]
          }
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json(stats);

} catch (error) {
res.status(500).json({ error: error.message });
}
});

// Ranking de usuários
router.get("/ranking", async (req, res) => {
try {
const { storeId, startDate, endDate, type } = req.query;

    const matchStage = {
      auditDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (storeId) matchStage.store = storeId;
    if (type) matchStage.type = type;

    const ranking = await Audit.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$user",
          totalItems: { $sum: 1 },
          completedItems: {
            $sum: { $cond: [{ $eq: ["$status", "Atualizado"] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$user.userId",
          name: "$user.name",
          totalItems: 1,
          completedItems: 1,
          efficiency: {
            $round: [{ $multiply: [{ $divide: ["$completedItems", "$totalItems"] }, 100] }, 2]
          }
        }
      },
      { $sort: { completedItems: -1 } }
    ]);

    res.json(ranking);

} catch (error) {
res.status(500).json({ error: error.message });
}
});

export default router;
Serviço de Processamento Unificado
javascript
// services/auditProcessor.js
import Audit from "../models/Audit";
import User from "../models/User";
import FileProcess from "../models/FileProcess";
import { parseExcelFile } from "../utils/excelParser";

export async function processAuditFile(processId, filePath) {
const fileProcess = await FileProcess.findById(processId);
if (!fileProcess) throw new Error("Processo não encontrado");

try {
fileProcess.status = "processing";
await fileProcess.save();

    const startTime = Date.now();

    // Parse do arquivo
    const auditData = await parseExcelFile(filePath, fileProcess.type);

    // Processar cada item
    const processedItems = [];

    for (const item of auditData) {
      // Encontrar ou criar usuário
      let user = await User.findOne({ userId: item.userId });
      if (!user) {
        user = new User({
          userId: item.userId,
          name: item.userName,
          stores: [fileProcess.store]
        });
        await user.save();
      }

      // Criar registro de auditoria
      const audit = new Audit({
        store: fileProcess.store,
        user: user._id,
        type: fileProcess.type,
        auditDate: fileProcess.auditDate,
        productCode: item.code,
        productName: item.product,
        location: item.location,
        status: item.status,
        stock: item.stock,
        auditData: {
          // Campos específicos por tipo
          ...(fileProcess.type === "etiqueta" && { lastPurchase: item.lastPurchase }),
          ...(fileProcess.type === "presenca" && {
            presence: item.presence,
            presenceConfirmedAt: item.presenceConfirmedAt
          }),
          ...(fileProcess.type === "ruptura" && {
            productClass: item.productClass,
            sector: item.sector,
            daysWithoutSale: item.daysWithoutSale,
            ruptureCost: item.ruptureCost,
            supplier: item.supplier
          })
        },
        sourceFile: {
          name: fileProcess.originalName,
          rowNumber: item.rowNumber
        }
      });

      await audit.save();
      processedItems.push(audit._id);

      // Atualizar contador do usuário
      if (item.status === "Atualizado") {
        user.totalAuditCount += 1;

        // Adicionar ao histórico
        user.auditHistory.push({
          date: fileProcess.auditDate,
          type: fileProcess.type,
          itemsCount: 1,
          items: [{
            code: item.code,
            product: item.product,
            location: item.location,
            status: item.status,
            stock: item.stock
          }]
        });

        await user.save();
      }
    }

    // Atualizar status do processamento
    fileProcess.status = "completed";
    fileProcess.results = {
      totalItems: auditData.length,
      processedItems: processedItems.length,
      processingTime: Date.now() - startTime
    };

    await fileProcess.save();

    return { success: true, processedItems: processedItems.length };

} catch (error) {
fileProcess.status = "error";
fileProcess.results = {
errors: [error.message]
};
await fileProcess.save();

    throw error;

}
}
Vantagens desta Estrutura
Unificação: Um único modelo para todos os tipos de auditoria

Escalabilidade: Estrutura preparada para múltiplas lojas

Performance: Índices otimizados para consultas frequentes

Rastreabilidade: Histórico completo de processamento de arquivos

Manutenibilidade: Código mais limpo e fácil de manter

Consistência: Dados padronizados em todo o sistema

Migração Progressiva
Para migrar dos modelos antigos para esta nova estrutura:

Crie scripts de migração para cada coleção antiga

Execute a migração em lotes, começando com dados recentes

Mantenha ambas as estruturas durante a transição

Atualize gradualmente o frontend para usar os novos endpoints

Remova os modelos antigos após confirmação de que todos os dados foram migrados

Esta estrutura resolve os problemas de duplicação e fornece uma base sólida para o crescimento do sistema.
