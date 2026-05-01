"use client";

import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { deleteTransaction } from "@/actions/transactions";
import { EditTransactionModal } from "./EditTransactionModal";

interface Props {
  transaction: any;
  accounts: any[];
  categories: any[];
}

export function TransactionRowActions({ transaction, accounts, categories }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <EditTransactionModal 
        open={isEditOpen} 
        setOpen={setIsEditOpen} 
        transaction={transaction}
        accounts={accounts}
        categories={categories}
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 hover:bg-white/5 rounded-full transition-colors outline-none">
          <MoreVertical size={18} className="text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#1A1A1C]  text-white rounded-xl">
          <DropdownMenuItem 
            className="gap-2 cursor-pointer focus:bg-white/5"
            onClick={() => setIsEditOpen(true)} // ВІДКРИВАЄМО МОДАЛКУ
          >
            <Pencil size={14} className="text-gray-400" /> 
            <span>Edit</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
            onClick={async () => {
                if(confirm("Ви впевнені, що хочете видалити цю транзакцію?")) {
                    await deleteTransaction(transaction.id);
                }
            }}
          >
            <Trash2 size={14} /> 
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}