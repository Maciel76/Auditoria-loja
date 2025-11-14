## anotação de comportamento do modelo  backend/models/LojaDailyMetrics.js

essas sao umas anotação de comportamento indesejado do modelo backend/models/LojaDailyMetrics.js. note que vou comenta na frente dos itens que estao com portamento indesejados que eu gostaria que mudasse 

{
  "_id": {
    "$oid": "68f7f3a25cbdf86683e35a08"
  },
  "loja": {
    "$oid": "68f7f39091481b57003901cb"
  },
  "__v": 0,
  "alertas": [],
  "createdAt": {
    "$date": "2025-10-21T20:57:06.819Z"
  },
  "data": {
    "$date": "2025-10-21T20:57:06.818Z"
  },
  "dataFim": {
    "$date": "2025-08-07T02:59:59.999Z"
  },
  "dataInicio": {
    "$date": "2025-10-21T03:00:00.000Z"
  },
  "etiquetas": { // 1. Comportamento das Etiquetas:
//- O objeto "etiquetas" está funcionando corretamente em geral
///- Ajuste necessário no cálculo do percentual de conclusão:
 // * Valores atuais: itensValidos = 8780, itensAtualizados = 8338, itensDesatualizado = 241
  //* Cálculo correto: (itensAtualizados + itensDesatualizado) / itensValidos * 100 = 97.78%
  //* Atualmente está: percentualConclusao = 95%
  //* Correção: percentualConclusao deveria ser 97.78%
  //* percentualRestante deveria ser 2.22% (não 5%)

    "totalItens": 13776,
    "itensValidos": 8780,
    "itensAtualizados": 8338,
    "itensNaolidos": 125,
    "itensDesatualizado": 241,
    "itensNaopertence": 307,
    "itensLidosemestoque": 317,
    "itensNlidocomestoque": 125,
    "itensSemestoque": 4448,
    "percentualConclusao": 95,
    "percentualRestante": 5,
    "usuariosAtivos": 21,
    "contadorClasses": { // beleza, esses contadores de classes estão corretos parece que esta contando a quantidade total de itens dessa classe mas quantos items forao lido de cada classe preciso que crie uma nova chave onde vai lista a quantidade de itens lidos por classe. por exemplo: "A CLASSIFICAR_lidos": 75, "ALTO GIRO_lidos": 430, assim por diante para cada classe
      "A CLASSIFICAR": 80,
      "ALTO GIRO": 445,
      "BAZAR": 2625,
      "DIVERSOS": 7,
      "DPH": 3351,
      "FLV": 56,
      "LATICINIOS 1": 428,
      "LIQUIDA": 1247,
      "PERECIVEL 1": 618,
      "PERECIVEL 2": 843,
      "PERECIVEL 2 B": 42,
      "PERECIVEL 3": 149,
      "SECA DOCE": 2721,
      "SECA SALGADA": 878,
      "SECA SALGADA 2": 286
    },
    "contadorLocais": { //Os contadores locais já registram corretamente a quantidade total de itens lidos por corredor. Agora, quero adicionar uma nova chave que registre a quantidade de itens atualizados por corredor — ou seja, o total de itens cuja etiqueta foi alterada (atualizada ou desatualizada), itens lidos sem estoque e itens lidos que não pertencem ao corredor. isso é para medir a pocentagem de itens lidos do corredor para pode mostra no front end a porcentagem de conclusão por corredor. no caso quando envia a planilha vc vai analiza r os itens lidos e ver quantos foram atualizados (atualizados + desatualizados + sem estoque + nao pertence) e salvar essa nova chave dentro de contadorLocais com o mesmo nome do corredor mais sufixo "_atualizados" por exemplo: "C01 - C01_atualizados": 10, "CS01 - CS01_atualizados": 5, assim por diante para cada corredor. 
      "C01 - C01": 32,
      "CS01 - CS01": 39,
      "F01 - F01": 345,
      "F02 - F02": 232,
      "FLV - FLV": 44,
      "G01A - G01A": 285,
      "G01B - G01B": 381,
      "G02A - G02A": 126,
      "G02B - G02B": 233,
      "G03A - G03A": 203,
      "G03B - G03B": 69,
      "G04A - G04A": 366,
      "G04B - G04B": 59,
      "G05A - G05A": 216,
      "G05B - G05B": 331,
      "G06A - G06A": 262,
      "G06B - G06B": 93,
      "G07A - G07A": 383,
      "G07B - G07B": 254,
      "G08A - G08A": 267,
      "G08B - G08B": 124,
      "G09A - G09A": 33,
      "G09B - G09B": 194,
      "G10A - G10A": 82,
      "G10B - G10B": 308,
      "G11A - G11A": 151,
      "G11B - G11B": 356,
      "G12A - G12A": 351,
      "G12B - G12B": 565,
      "G13A - G13A": 392,
      "G13B - G13B": 822,
      "G14A - G14A": 189,
      "G14B - G14B": 335,
      "G15A - G15A": 122,
      "G15B - G15B": 199,
      "G16A - G16A": 59,
      "G16B - G16B": 140,
      "G17A - G17A": 253,
      "G17B - G17B": 164,
      "G18A - G18A": 591,
      "G18B - G18B": 267,
      "G19A - G19A": 250,
      "G19B - G19B": 287,
      "G20A - G20A": 65,
      "G20B - G20B": 264,
      "G21A - G21A": 77,
      "G21B - G21B": 204,
      "G22A - G22A": 203,
      "G22B - G22B": 140,
      "GELO - GELO": 2,
      "I01 - I01": 120,
      "PA01 - PA01": 193,
      "PAO - PAO": 350,
      "PF01 - PF01": 470,
      "PF02 - PF02": 362,
      "PF03 - PF03": 252,
      "PL01 - PL01": 134,
      "PL02 - PL02": 111,
      "SORVETE - SORVETE": 50
    },
    "_id": {
      "$oid": "68f7f3a291481b5700395c08"
    }
  },
  "locaisEstatisticas": [],// pode excluir essa chave se nao tiver usando ela para nada
  "lojaNome": "Loja 105 - T9",
  "presencas": {
    "totalItens": 13727, // beleza esse ta correto
    "itensLidos": 13727, // exclui porque tem 2 chaves que sao iguais essa e a de total itens lidos dentro de etiquetas
    "itensAtualizados": 0, // esses era pra ser os itens lidos da planilha so que na planilha de presença o nome da coluna é diferente entao o sistema nao ta reconhecendo esses itens como lidos. preciso que corrija isso para que essa chave mostre a quantidade correta de itens lidos na planilha de presença, o nome que esta na planilha e "Com Presença e com Estoque"
    "itenscomPresencaSemEstoque" : 0, // essa chave deve cer criada para conta os itens com presenca mas sem estoque da planilha na planilha o nome real da coluna é "Com Presença e Sem Estoque" preciso que crie essa chave e salve a quantidade correta de itens com presenca mas sem estoque nessa chave
    "percentualConclusao": 0, //o pecentual de conclusao e  cauculado com base na quantidade de itens itensAtualizados dividido pela quantidade de presencasNaoConfirmadas vezes 100. por exemplo se na planilha tiver 1000 itens e desses 800 forem lidos (itensAtualizados) e 200 nao lidos (presencasNaoConfirmadas) o percentual de conclusao seria 80%. entao preciso que corrija esse calculo para que mostre o percentual correto com base nesses dois valores.
    "percentualRestante": 0, // o percentual restante e o complemento do percentual de conclusao. ou seja 100 menos o percentual de conclusao. por exemplo se o percentual de conclusao for 80% o percentual restante sera 20%. preciso que corrija esse calculo para que mostre o valor correto com base no percentual de conclusao.
    "presencasConfirmadas": 0, // pode ecluir essa chave se nao tiver usando ela para nada
    "presencasNaoConfirmadas": 0, // essa chave deve cer criada para conta os itens nao lidos da planilha na planilha o nome real da coluna é "Sem Presença e Com Estoque" preciso que crie essa chave e salve a quantidade correta de itens nao lidos nessa chave
    "presencasSemEstoque": 0, // essa chave deve cer criada para conta os itens sem estoque da planilha na planilha o nome real da coluna é "Sem Presença e Sem Estoque" preciso que crie essa chave e salve a quantidade correta de itens sem estoque nessa chave
    "presencasNaoPertence": 0, // essa chave deve cer criada para conta os itens que nao pertencem da planilha na planilha o nome real da coluna é "Lido não pertence" preciso que crie essa chave e salve a quantidade correta de itens que nao pertencem nessa chave
    "percentualPresenca": 0, // pode excluir essa chave se nao tiver usando ela para nada
    "custoTotalPresenca": 0, // nova chave para registrar o custo total da ruptura vc vai fazer o filtro por itens da coluna Situação que estejam com a situação "Sem Presença e Com Estoque" e somar o valor da coluna "Custo Ruptura" desses itens para salvar nessa chave e soma os valores aqui e salvar nessa chave
    "usuariosAtivos": 24, // beleza esse ta correto
    "contadorClasses": { // beleza esses contadores de classes estão corretos parece que esta contando a quantidade total de itens dessa classe mas quantos items forao lido de cada classe preciso que crie uma nova chave onde vai lista a quantidade de itens lidos por classe. por exemplo: "A CLASSIFICAR_lidos": 69, "ALTO GIRO_lidos": 447, assim por diante para cada classe, no caso vc usario dos filtro pegaria os itens da classe que foram lidos na planilha de presença e filtrassse pela situação "Com Presença e com Estoque" para contar quantos itens foram lidos por classe. por exemplo na classe "ALTO GIRO" se na planilha tiver 500 itens dessa classe e desses 447 estiverem com a situação "Com Presença e com Estoque" entao o valor de "ALTO GIRO_lidos" seria 447.
      "A CLASSIFICAR": 69,
      "ALTO GIRO": 447,
      "BAZAR": 2622,
      "DIVERSOS": 9,
      "DPH": 3357,
      "FLV": 55,
      "LATICINIOS 1": 415,
      "LIQUIDA": 1248,
      "PERECIVEL 1": 618,
      "PERECIVEL 2": 829,
      "PERECIVEL 2 B": 40,
      "PERECIVEL 3": 147,
      "SECA DOCE": 2710,
      "SECA SALGADA": 879,
      "SECA SALGADA 2": 282
    },
    "contadorLocais": { // Os contadores locais já registram corretamente a quantidade total de itens lidos por corredor. Agora, quero adicionar uma nova chave que registre a quantidade de itens com presença e com estoque por corredor — ou seja, o total de itens cuja situação na planilha é "Com Presença e com Estoque". isso é para medir a pocentagem de itens com presença por corredor para pode mostra no front end a porcentagem de presença por corredor. no caso quando envia a planilha vc vai analiza r os itens lidos e ver quantos foram com presença e com estoque e salvar essa nova chave dentro de contadorLocais com o mesmo nome do corredor mais sufixo "_comPresenca" por exemplo: "C01 - C01_comPresenca": 25, "CS01 - CS01_comPresenca": 30, assim por diante para cada corredor.
      "C01 - C01": 29,
      "CS01 - CS01": 34,
      "F01 - F01": 346,
      "F02 - F02": 222,
      "FLV - FLV": 50,
      "G01A - G01A": 286,
      "G01B - G01B": 386,
      "G02A - G02A": 126,
      "G02B - G02B": 234,
      "G03A - G03A": 201,
      "G03B - G03B": 66,
      "G04A - G04A": 386,
      "G04B - G04B": 58,
      "G05A - G05A": 188,
      "G05B - G05B": 336,
      "G06A - G06A": 265,
      "G06B - G06B": 93,
      "G07A - G07A": 387,
      "G07B - G07B": 248,
      "G08A - G08A": 275,
      "G08B - G08B": 122,
      "G09A - G09A": 33,
      "G09B - G09B": 196,
      "G10A - G10A": 82,
      "G10B - G10B": 310,
      "G11A - G11A": 153,
      "G11B - G11B": 352,
      "G12A - G12A": 348,
      "G12B - G12B": 574,
      "G13A - G13A": 392,
      "G13B - G13B": 818,
      "G14A - G14A": 187,
      "G14B - G14B": 335,
      "G15A - G15A": 122,
      "G15B - G15B": 200,
      "G16A - G16A": 58,
      "G16B - G16B": 140,
      "G17A - G17A": 250,
      "G17B - G17B": 164,
      "G18A - G18A": 590,
      "G18B - G18B": 265,
      "G19A - G19A": 245,
      "G19B - G19B": 288,
      "G20A - G20A": 65,
      "G20B - G20B": 258,
      "G21A - G21A": 81,
      "G21B - G21B": 203,
      "G22A - G22A": 208,
      "G22B - G22B": 137,
      "GELO - GELO": 2,
      "I01 - I01": 121,
      "PA01 - PA01": 193,
      "PAO - PAO": 350,
      "PF01 - PF01": 460,
      "PF02 - PF02": 344,
      "PF03 - PF03": 243,
      "PL01 - PL01": 134,
      "PL02 - PL02": 110,
      "SORVETE - SORVETE": 50
    },
    "_id": {
      "$oid": "68f7f3a291481b5700395c06"
    }
  },
  "ranking": { //pode excluir essa chave se nao tiver usando ela para nada
    "eficienciaOperacional": 74,
    "notaQualidade": 7,
    "pontuacaoTotal": 74,
    "posicaoGeral": 0
  },
  "rupturas": { // 3. Comportamento das Rupturas:
    "totalItens": 491,// essa chave esta correta
    "itensLidos": 491, // exclui porque tem 2 chaves que sao iguais essa e a de total itens lidos dentro de etiquetas
    "itensAtualizados": 0, // esse campo e para caucula o valor dos itens lidos da coluna situação com nome "Com Presença e com Estoque" na planilha de ruptura porem o nome da coluna na planilha esta diferente entao o sistema nao esta reconhecendo esses itens como lidos. preciso que corrija isso para que essa chave mostre a quantidade correta de itens lidos na planilha de ruptura
    "itensRupturaSemEstoque": 0, // essa chave deve cer criada para conta os itens em ruptura sem estoque da planilha na planilha o nome real da coluna é "Sem Presença e Sem Estoque" preciso que crie essa chave e salve a quantidade correta de itens em ruptura sem estoque nessa chave
    "itensSempresençaSemEstoque": 0, // essa chave deve cer criada para conta os itens em ruptura com presenca mas sem estoque da planilha na planilha o nome real da coluna é "Sem Presença e Sem Estoque" preciso que crie essa chave e salve a quantidade correta de itens em ruptura com presenca mas sem estoque nessa chave
    "percentualConclusao": 0, // o pecentual de conclusao e  cauculado com base na quantidade de itens itensAtualizados dividido pela quantidade de itensRupturaSemEstoque vezes 100. por exemplo se na planilha tiver 1000 itens e desses 800 forem lidos (itensAtualizados) e 200 nao lidos (rupturasNaoConfirmadas) o percentual de conclusao seria 80%. entao preciso que corrija esse calculo para que mostre o percentual correto com base nesses dois valores.
    "percentualRestante": 0, // o percentual restante e o complemento do percentual de conclusao. ou seja 100 menos o percentual de conclusao. por exemplo se o percentual de conclusao for 80% o percentual restante sera 20%. preciso que corrija esse calculo para que mostre o valor correto com base no percentual de conclusao.
    "custoTotalRuptura": 0, // nova chave para registrar o custo total da ruptura vc vai fazer o filtro por itens da coluna Situação que estejam com a situação "Sem Presença e Com Estoque" e somar o valor da coluna "Custo Ruptura" desses itens para salvar nessa chave e soma os valores aqui e salvar nessa chave
    "rupturasCriticas": 0, // exclui porque nao to usando essa chave para nada
    "usuariosAtivos": 3, // beleza esse ta correto
    "contadorClasses": { // beleza esses contadores de classes estão corretos parece que esta contando a quantidade total de itens dessa classe mas quantos items forao lido de cada classe preciso que crie uma nova chave onde vai lista a quantidade de itens lidos por classe. por exemplo: "A CLASSIFICAR_lidos": 6, "ALTO GIRO_lidos": 12, assim por diante para cada classe, no caso vc usario dos filtro pegaria os itens da classe que foram lidos na planilha de ruptura e filtrassse pela situação "Com Presença e com Estoque" para contar quantos itens foram lidos por classe. por exemplo na classe "ALTO GIRO" se na planilha tiver 20 itens dessa classe e desses 12 estiverem com a situação "Com Presença e com Estoque" entao o valor de "ALTO GIRO_lidos" seria 12. sem fala que ainda nem ta contando nada aqui
      "A CLASSIFICAR": 0,
      "ALTO GIRO": 0,
      "BAZAR": 0,
      "DIVERSOS": 0,
      "DPH": 0,
      "FLV": 0,
      "LATICINIOS 1": 0,
      "LIQUIDA": 0,
      "PERECIVEL 1": 0,
      "PERECIVEL 2": 0,
      "PERECIVEL 2 B": 0,
      "PERECIVEL 3": 0,
      "SECA DOCE": 0,
      "SECA SALGADA": 0,
      "SECA SALGADA 2": 0
    },
    "contadorLocais": { // Os contadores locais já registram corretamente a quantidade total de itens lidos por corredor. Agora, quero adicionar uma nova chave que registre a quantidade de itens com presença e com estoque por corredor — ou seja, o total de itens cuja situação na planilha é "Com Presença e com Estoque". isso é para medir a pocentagem de itens com presença por corredor para pode mostra no front end a porcentagem de presença por corredor. no caso quando envia a planilha vc vai analiza r os itens lidos e ver quantos foram com presença e com estoque e salvar essa nova chave dentro de contadorLocais com o mesmo nome do corredor mais sufixo "_comPresenca" por exemplo: "C01 - C01_comPresenca": 5, "CS01 - CS01_comPresenca": 3, assim por diante para cada corredor.  sem fala que nem ta contando nada aqui
      "C01 - C01": 0,
      "CS01 - CS01": 0,
      "F01 - F01": 0,
      "F02 - F02": 0,
      "FLV - FLV": 0,
      "G01A - G01A": 0,
      "G01B - G01B": 0,
      "G02A - G02A": 0,
      "G02B - G02B": 0,
      "G03A - G03A": 0,
      "G03B - G03B": 0,
      "G04A - G04A": 0,
      "G04B - G04B": 0,
      "G05A - G05A": 0,
      "G05B - G05B": 0,
      "G06A - G06A": 0,
      "G06B - G06B": 0,
      "G07A - G07A": 0,
      "G07B - G07B": 0,
      "G08A - G08A": 0,
      "G08B - G08B": 0,
      "G09A - G09A": 0,
      "G09B - G09B": 0,
      "G10A - G10A": 0,
      "G10B - G10B": 0,
      "G11A - G11A": 0,
      "G11B - G11B": 0,
      "G12A - G12A": 0,
      "G12B - G12B": 0,
      "G13A - G13A": 0,
      "G13B - G13B": 0,
      "G14A - G14A": 0,
      "G14B - G14B": 0,
      "G15A - G15A": 0,
      "G15B - G15B": 0,
      "G16A - G16A": 0,
      "G16B - G16B": 0,
      "G17A - G17A": 0,
      "G17B - G17B": 0,
      "G18A - G18A": 0,
      "G18B - G18B": 0,
      "G19A - G19A": 0,
      "G19B - G19B": 0,
      "G20A - G20A": 0,
      "G20B - G20B": 0,
      "G21A - G21A": 0,
      "G21B - G21B": 0,
      "G22A - G22A": 0,
      "G22B - G22B": 0,
      "GELO - GELO": 0,
      "I01 - I01": 0,
      "PA01 - PA01": 0,
      "PAO - PAO": 0,
      "PF01 - PF01": 0,
      "PF02 - PF02": 0,
      "PF03 - PF03": 0,
      "PL01 - PL01": 0,
      "PL02 - PL02": 0,
      "SORVETE - SORVETE": 0
    },
    "_id": {
      "$oid": "68f7f3a291481b5700395c07"
    }
  },
  "totais": { // exclui essa chave se nao tiver usando ela para nada
    "itensAtualizados": 8338,
    "itensLidos": 22998,
    "percentualConclusaoGeral": 36,
    "planilhasProcessadas": 0,
    "totalItens": 27994,
    "usuariosAtivos": 48,
    "usuariosTotais": 0
  },
  "ultimaAtualizacao": {
    "$date": "2025-10-22T21:03:22.376Z"
  },
  "updatedAt": {
    "$date": "2025-10-22T21:03:22.376Z"
  },
  "versaoCalculo": "1.0"
}