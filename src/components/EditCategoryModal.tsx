"use client";

import { useState, useTransition } from "react";
import { updateCategory } from "@/actions/categories";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pencil, Home, Gift, Car, Utensils, ShoppingBag, 
  Briefcase, Coins, Heart, GraduationCap, Plane, 
  Gamepad2, Dumbbell, Coffee, Pizza, Zap, 
  Smartphone, Music, Camera, PenTool, Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = [
  { name: "Home", icon: Home }, { name: "Gift", icon: Gift }, { name: "Car", icon: Car },
  { name: "Utensils", icon: Utensils }, { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Briefcase", icon: Briefcase }, { name: "Coins", icon: Coins },
  { name: "Heart", icon: Heart }, { name: "GraduationCap", icon: GraduationCap },
  { name: "Plane", icon: Plane }, { name: "Gamepad2", icon: Gamepad2 },
  { name: "Dumbbell", icon: Dumbbell }, { name: "Coffee", icon: Coffee },
  { name: "Pizza", icon: Pizza }, { name: "Zap", icon: Zap },
  { name: "Smartphone", icon: Smartphone }, { name: "Music", icon: Music },
  { name: "Camera", icon: Camera }, { name: "PenTool", icon: PenTool }, { name: "Wallet", icon: Wallet },
];

export function EditCategoryModal({ category }: { category: any }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const [type, setType] = useState(category.type);
  const [selectedIcon, setSelectedIcon] = useState(category.icon || "Wallet");
  const [name, setName] = useState(category.name);

  const SelectedIconComponent = ICONS.find(i => i.name === selectedIcon)?.icon || Wallet;

  async function handleSave() {
    if (!name) return;
    startTransition(async () => {
      await updateCategory(category.id, name, type, selectedIcon);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
            <Pencil size={20} />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-[#161617] border-white/5 text-white p-10 rounded-[32px] sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center">Edit category</DialogTitle>
          <p className="text-zinc-500 text-center text-sm">Update your category details</p>
        </DialogHeader>

        <Tabs defaultValue={type} onValueChange={setType} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-[#1A1A1C] p-1 h-12 rounded-xl border border-white/5">
            <TabsTrigger value="INCOME" className="rounded-lg data-[state=active]:bg-primary-600/10 data-[state=active]:text-primary-500 font-bold">↑ Income</TabsTrigger>
            <TabsTrigger value="EXPENSE" className="rounded-lg data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 font-bold">↓ Expense</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2 mb-10">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Name</label>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-0 border-b border-zinc-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-lg shadow-none h-12" 
          />
        </div> 

        <div className="flex items-center gap-6 mb-10 w-full">
            <div className="w-20 h-20 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                <SelectedIconComponent size={40} className="text-white" />
            </div>
            <div className="flex-1 grid grid-cols-5 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {ICONS.map((item) => (
                    <button
                        key={item.name}
                        type="button"
                        onClick={() => setSelectedIcon(item.name)}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all border",
                            selectedIcon === item.name 
                                ? "bg-zinc-700 border-primary-500 text-white shadow-[0_0_15px_rgba(2,186,58,0.2)]" 
                                : "bg-[#1A1A1C] border-transparent text-zinc-500 hover:border-white/10"
                        )}
                    >
                        <item.icon size={18} />
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="bg-transparent border-zinc-800 text-zinc-400 h-14 rounded-2xl font-bold">Cancel</Button>
          <Button onClick={handleSave} disabled={isPending || !name} className="bg-[#02BA3A] hover:bg-[#029d31] text-black font-black h-14 rounded-2xl text-lg shadow-lg transition-all">
            {isPending ? "..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}