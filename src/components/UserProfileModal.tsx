"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Check, AlertTriangle, Trash2 } from "lucide-react";
import { updateUserSettings, updatePassword, deleteUserAccount } from "@/actions/user"; // Імпорт дії
import { toast } from "sonner";

export function UserProfileModal({ user, onClose }: any) {
  const { data: session, update } = useSession();
  
  // Стейти для імені та пароля
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Стейт для ВИДАЛЕННЯ акаунту
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const initials = user?.name 
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleNameUpdate = async () => {
    setNameLoading(true);
    const res = await updateUserSettings({ name: newName });
    if (res.success) {
      await update({ ...session, user: { ...session?.user, name: newName } });
      setIsEditingName(false);
      toast.success("Ім'я оновлено");
    }
    setNameLoading(false);
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Заповніть усі поля пароля");
      return;
    }
    setPasswordLoading(true);
    const res = await updatePassword(currentPassword, newPassword);
    if (res.success) {
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      toast.success(res.success);
    } else {
      toast.error(res.error);
    }
    setPasswordLoading(false);
  };

  // Функція видалення
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const res = await deleteUserAccount();
    if (res.success) {
      toast.success("Акаунт успішно видалено");
      signOut({ callbackUrl: "/login" });
    } else {
      toast.error(res.error);
      setDeleteLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#161617] border-white/5 text-white p-0 overflow-hidden outline-none sm:max-w-[750px] w-[95vw] rounded-[32px] shadow-2xl">
        <DialogHeader className="sr-only"><DialogTitle/><DialogDescription/></DialogHeader>

        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          {/* ЛІВА ЧАСТИНА */}
          <div className="w-full md:w-[35%] bg-black/20 p-12 flex flex-col items-center justify-center border-r border-white/5">
            <div className="w-32 h-32 rounded-full bg-primary-600/20 border-4 border-white/5 flex items-center justify-center text-5xl font-black text-primary-500 shadow-2xl">
              {initials}
            </div>
            <div className="mt-6 text-center space-y-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email</p>
                <p className="text-[11px] font-medium text-gray-400 break-all">{user?.email}</p>
            </div>
          </div>

          {/* ПРАВА ЧАСТИНА */}
          <div className="w-full md:w-[65%] p-12 flex flex-col justify-between relative">
          

            <div className="space-y-10">
              {/* Блок імені */}
              <div className="flex justify-between items-start border-b border-white/5 pb-6">
                <div className="space-y-1 flex-1 pr-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Name</p>
                  {isEditingName ? (
                    <Input 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-white/5 border-white/10 h-10 mt-2 rounded-xl"
                        autoFocus
                    />
                  ) : (
                    <p className="text-xl font-black text-white">{user?.name || "Not set"}</p>
                  )}
                </div>
                <div className="pt-4">
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <Button onClick={() => setIsEditingName(false)} variant="ghost" size="sm">Скасувати</Button>
                      <Button onClick={handleNameUpdate} size="sm" className="bg-primary-500 text-black px-3">
                        {nameLoading ? <Loader2 className="animate-spin" size={14}/> : <Check size={14}/>}
                      </Button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditingName(true)} className="text-primary-500 font-bold text-sm hover:underline">Change</button>
                  )}
                </div>
              </div>

              {/* Блок Пароля */}
              <div className="space-y-4 border-b border-white/5 pb-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Password</p>
                    <p className="text-xl font-black text-white">••••••••</p>
                  </div>
                  {!isEditingPassword && (
                    <button onClick={() => setIsEditingPassword(true)} className="text-primary-500 font-bold text-sm hover:underline">Change</button>
                  )}
                </div>
                {isEditingPassword && (
                   <div className="space-y-3 bg-white/5 p-4 rounded-2xl animate-in fade-in zoom-in duration-200">
                     <Input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-black/20 border-white/10 rounded-xl" />
                     <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-black/20 border-white/10 rounded-xl" />
                     <div className="flex gap-2">
                       <Button onClick={() => setIsEditingPassword(false)} variant="ghost" className="flex-1 h-9 text-xs">Cancel</Button>
                       <Button onClick={handlePasswordUpdate} disabled={passwordLoading} className="flex-1 bg-primary-500 text-black h-9 text-xs font-black">
                         {passwordLoading ? <Loader2 className="animate-spin" size={16}/> : "Update"}
                       </Button>
                     </div>
                   </div>
                )}
              </div>

              {/* Блок НЕБЕЗПЕКИ: Видалення */}
              <div className="space-y-4">
                {!isConfirmingDelete ? (
                   <button 
                    onClick={() => setIsConfirmingDelete(true)}
                    className="flex items-center gap-2 text-red-500/60 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
                   >
                     <Trash2 size={12} /> Delete account
                   </button>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl space-y-3 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertTriangle size={16} />
                      <p className="text-xs font-bold uppercase tracking-tight">Are you absolutely sure?</p>
                    </div>
                    <p className="text-[11px] text-red-500/80 leading-relaxed">
                      This action is permanent. All your accounts, transactions, and data will be deleted forever.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => setIsConfirmingDelete(false)} variant="ghost" className="flex-1 h-8 text-[10px] text-white">Cancel</Button>
                      <Button 
                        onClick={handleDeleteAccount} 
                        disabled={deleteLoading}
                        className="flex-1 h-8 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase"
                      >
                        {deleteLoading ? <Loader2 className="animate-spin" size={12}/> : "Yes, delete everything"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Кнопка Log Out */}
            <div className="mt-10 flex gap-4">
              <Button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                variant="ghost" 
                className="w-full bg-white/5 hover:bg-white/10 text-white font-black h-12 rounded-2xl transition-all"
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}