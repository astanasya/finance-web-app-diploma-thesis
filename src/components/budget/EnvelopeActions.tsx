"use client";

import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, ArrowRightLeft, Pencil, Trash2 } from "lucide-react";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { TransferBudgetModal } from "@/components/modals/TransferBudgetModal";
import { EditEnvelopeModal } from "@/components/modals/EditEnvelopeModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

export function EnvelopeActions({ envelope, categories, transactions, allEnvelopes }: any) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const close = () => setActiveModal(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-full transition">
          <MoreVertical size={20} className="text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-90 border-white/10 text-white w-48 rounded-2xl p-2">
          <DropdownMenuItem onClick={() => setActiveModal("view")} className="gap-3 cursor-pointer py-3 rounded-xl">
            <Eye size={18} /> View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal("transfer")} className="gap-3 cursor-pointer py-3 rounded-xl">
            <ArrowRightLeft size={18} /> Transfer funds
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal("edit")} className="gap-3 cursor-pointer py-3 rounded-xl">
            <Pencil size={18} /> Edit envelope
          </DropdownMenuItem>
          <hr className="border-white/5 my-1" />
          <DropdownMenuItem onClick={() => setActiveModal("delete")} className="gap-3 cursor-pointer py-3 rounded-xl text-red-500 focus:text-red-500">
            <Trash2 size={18} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {activeModal === "view" && (
        <ViewDetailsModal envelope={envelope} transactions={transactions} categories={categories} onClose={close} />
      )}
      {activeModal === "transfer" && (
        <TransferBudgetModal fromEnvelope={envelope} allEnvelopes={allEnvelopes} onClose={close} />
      )}
      {activeModal === "edit" && (
        <EditEnvelopeModal envelope={envelope} categories={categories} onClose={close} />
      )}
      {activeModal === "delete" && (
        <DeleteConfirmModal envelopeId={envelope.id} name={envelope.name} onClose={close} />
      )}
    </>
  );
}