"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportButton({ data }: { data: any[] }) {
  const handleExport = () => {
    if (data.length === 0) return;

    const headers = ["Title,Amount,Type,Date,Account,Category"];
    const rows = data.map(t => 
      `"${t.title}",${t.amount},${t.type},${new Date(t.date).toLocaleDateString()},"${t.account.name}","${t.category?.name || 'None'}"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      className="bg-transparent border-gray-800 text-gray-400 gap-2 rounded-xl px-6 h-12"
    >
      <Download size={18} /> Export CSV
    </Button>
  );
}