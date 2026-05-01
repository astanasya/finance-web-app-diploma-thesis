"use client";

import { useState } from "react";
import { deleteEnvelope } from "@/actions/budget";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteConfirmModal({ envelopeId, name, onClose }: any) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteEnvelope(envelopeId);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-gray-90 border border-white/5 text-white p-10 rounded-[32px] sm:max-w-[400px] shadow-2xl text-center">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold text-center">Delete envelope?</DialogTitle>
        </DialogHeader>
        
        <p className="text-gray-40 text-sm font-regular leading-relaxed">
          Are you sure you want to delete <span className="text-white font-semibold">{name}</span> ? 
          <br />
          This action cannot be undone.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button 
            type="button"
            variant="outline" 
            onClick={onClose}
            className="bg-transparent border-gray-800 text-gray-300 h-12 rounded-xl hover:bg-white/5 font-bold transition-all"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-red-900/20"
          >
            {loading ? "..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}