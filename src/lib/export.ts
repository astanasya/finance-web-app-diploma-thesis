export function exportToCSV(data: any[], fileName: string) {
  const headers = ["Title,Amount,Type,Category,Account,Date"];
  const rows = data.map(t => 
    `${t.title},${t.amount},${t.type},${t.category?.name || "None"},${t.account.name},${new Date(t.date).toLocaleDateString()}`
  );

  const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
}