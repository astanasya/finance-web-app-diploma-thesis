"use client";

import { useState, useTransition } from "react";
import { createCategory } from "@/actions/categories";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Home, Gift, Car, Utensils, ShoppingBag, 
  Briefcase, Coins, Heart, GraduationCap, Plane, 
  Gamepad2, Dumbbell, Coffee, Pizza, Zap, 
  Smartphone, Music, Camera, PenTool, Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

// Список доступних іконок для вибору
const ICONS = [
  { name: "Home", icon: Home },
  { name: "Gift", icon: Gift },
  { name: "Car", icon: Car },
  { name: "Utensils", icon: Utensils },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Briefcase", icon: Briefcase },
  { name: "Coins", icon: Coins },
  { name: "Heart", icon: Heart },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Plane", icon: Plane },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Coffee", icon: Coffee },
  { name: "Pizza", icon: Pizza },
  { name: "Zap", icon: Zap },
  { name: "Smartphone", icon: Smartphone },
  { name: "Music", icon: Music },
  { name: "Camera", icon: Camera },
  { name: "PenTool", icon: PenTool },
  { name: "Wallet", icon: Wallet },
];

export function AddCategoryModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Стан форми
  const [type, setType] = useState("INCOME");
  const [selectedIcon, setSelectedIcon] = useState("Wallet");
  const [name, setName] = useState("");

  const SelectedIconComponent = ICONS.find(i => i.name === selectedIcon)?.icon || Wallet;

  async function handleSave() {
    if (!name) return;
    
    startTransition(async () => {
      await createCategory(name, type, selectedIcon);
      setName("");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-2xl h-12 px-6 gap-2">
          <Plus size={20} /> Add category
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-90 border-white/5 text-white p-10 rounded-[32px] sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center">Add category</DialogTitle>
          <p className="text-gray-500 text-center text-sm">Please fill out the form below</p>
        </DialogHeader>

        {/* ТАБИ INCOME / EXPENSE */}
        <Tabs defaultValue="INCOME" onValueChange={setType} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-[#1A1A1C] p-1 h-12 rounded-xl border border-white/5">
            <TabsTrigger value="INCOME" className="rounded-lg data-[state=active]:bg-primary-600/10 data-[state=active]:text-primary-500 font-bold">
              ↑ Income
            </TabsTrigger>
            <TabsTrigger value="EXPENSE" className="rounded-lg data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 font-bold">
              ↓ Expense
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* ПОЛЕ НАЗВИ */}
        <div className="space-y-2 mb-10">
          <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] ml-1">Name</label>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name" 
            className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-lg placeholder:text-gray-700 shadow-none h-12" 
          />
        </div> 

        {/* ВИБІР ІКОНКИ ТА ПРЕВ'Ю */}
        <div className="flex items-top gap-6 mb-8 w-full">
            {/* Прев'ю вибраної іконки */}
            <div className="w-16 h-16 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                <SelectedIconComponent size={32} className="text-white" />
            </div>

            {/* СІТКА ІКОНОК - Додано flex-1 та justify-items-center */}
            <div className="flex-1 grid grid-cols-5 gap-y-4 gap-x-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {ICONS.map((item) => (
                    <button
                        key={item.name}
                        type="button"
                        onClick={() => setSelectedIcon(item.name)}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all border outline-none mx-auto",
                            selectedIcon === item.name 
                                ? "bg-gray-70 border-gray-60 text-white " 
                                : "bg-[#1A1A1C] border-transparent text-gray-500 hover:border-white/10"
                        )}
                    >
                        <item.icon size={18} />
                    </button>
                ))}
            </div>
        </div>

        {/* КНОПКИ */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="bg-transparent border-gray-800 text-gray-300 h-14 rounded-2xl hover:bg-white/5 font-bold"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isPending || !name}
            className="bg-primary-600 hover:bg-primary-700 text-gray-100 border border-primary-600/30 font-black h-14 rounded-2xl  transition-all"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}