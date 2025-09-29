export function exportarRelatorio(locaisComEstatisticas) {
  const relatorioData = locaisComEstatisticas.map((local) => ({
    Local: local.nome,
    "Total Itens": local.total,
    "Itens Lidos": local.lidos,
    "Itens Não Lidos": local.total - local.lidos,
    "Percentual Lidos": `${local.percentualLidos}%`,
    Status: getStatusLabel(local.percentualLidos),
  }));

  const csvContent = [
    "Local,Total Itens,Itens Lidos,Itens Não Lidos,Percentual Lidos,Status",
    ...relatorioData.map(
      (item) =>
        `"${item.Local}",${item["Total Itens"]},${item["Itens Lidos"]},${item["Itens Não Lidos"]},"${item["Percentual Lidos"]}","${item.Status}"`
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `relatorio_setores_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getStatusLabel(percentual) {
  if (percentual >= 90) return "Excelente";
  if (percentual >= 70) return "Bom";
  if (percentual >= 50) return "Médio";
  if (percentual >= 30) return "Baixo";
  return "Crítico";
}
