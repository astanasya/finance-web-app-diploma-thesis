"use client";

import { useState, useMemo } from "react";
import { updateGoal } from "@/actions/goals";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, differenceInMonths } from "date-fns";
import { cn } from "@/lib/utils";

export function EditGoalModal({ goal, onClose }: { goal: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  
  // Ініціалізуємо стани даними існуючої цілі
  const [name, setName] = useState(goal.name);
  const [amount, setAmount] = useState(goal.targetAmount.toString());
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(goal.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(goal.deadline));

  const monthlyTarget = useMemo(() => {
    const targetAmount = parseFloat(amount);
    if (!targetAmount || !startDate || !endDate) return "0.00";
    const months = differenceInMonths(endDate, startDate);
    const divisor = months > 0 ? months : 1;
    return (targetAmount / divisor).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [amount, startDate, endDate]);

  const handleSave = async () => {
    if (!name || !amount || !startDate || !endDate) return;
    setLoading(true);
    const res = await updateGoal(goal.id, {
      name,
      targetAmount: parseFloat(amount),
      startDate,
      deadline: endDate
    });
    setLoading(false);
    if (res.success) onClose();
  };

  const labelStyles = "text-gray-400 text-[10px] font-medium tracking-widest ml-1";
  const inputStyles = "bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-0 h-10 text-base placeholder:text-gray-700 shadow-none w-full flex items-center justify-between text-left transition-all";

  const calendarClassNames = {
    months: "relative",
    month: "space-y-4",
    month_caption: "flex justify-center items-center h-8 mb-4 relative",
    caption_label: "text-sm font-bold text-white",
    nav: "flex items-center",
    button_previous: "absolute left-0 top-0 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 z-20 flex items-center justify-center text-white",
    button_next: "absolute right-0 top-0 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 z-20 flex items-center justify-center text-white",
    month_grid: "w-full border-collapse",
    weekdays: "flex w-full justify-between mb-2",
    weekday: "text-zinc-500 w-10 font-bold text-[11px] uppercase text-center",
    weeks: "flex flex-col gap-1",
    week: "flex w-full justify-between",
    day: "h-10 w-10 flex items-center justify-center relative p-0",
    day_button: cn(
        "h-10 w-10 flex items-center justify-center text-sm font-medium transition-all rounded-xl hover:bg-zinc-800 text-zinc-300",
    ),
    selected: "bg-primary-600 text-black font-bold rounded-xl", 
    today: "text-primary-500 font-bold underline decoration-2 underline-offset-4",
    outside: "text-zinc-800 opacity-50",
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#161617] border border-white/5 text-white p-10 rounded-[32px] sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center tracking-tight">Edit goal</DialogTitle>
          <p className="text-zinc-500 text-center text-sm mt-1">Update your target details</p>
        </DialogHeader>

        <div className="space-y-10">
          <div className="space-y-2">
            <Label className={labelStyles}>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className={inputStyles} />
          </div>

          <div className="space-y-2">
            <Label className={labelStyles}>Goal amount</Label>
            <div className="relative flex items-center">
              <span className="absolute left-0 text-zinc-600 text-sm">$</span>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className={cn(inputStyles, "pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none")} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
                <Label className={labelStyles}>Start date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className={inputStyles}>
                            <span className="text-white">{startDate ? format(startDate, "dd MMM, yyyy") : "Select date"}</span>
                            <CalendarIcon size={14} className="text-gray-600" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-[#1a1a1c] border-gray-800 rounded-3xl" align="start">
                        <DayPicker mode="single" selected={startDate} onSelect={setStartDate} weekStartsOn={1}
                            components={{ Chevron: ({ orientation }) => orientation === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} /> }}
                            classNames={calendarClassNames}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <Label className={labelStyles}>End date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className={inputStyles}>
                            <span className="text-white">{endDate ? format(endDate, "dd MMM, yyyy") : "Select date"}</span>
                            <CalendarIcon size={14} className="text-gray-600" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-[#1a1a1c] border-gray-800 rounded-3xl" align="start">
                        <DayPicker mode="single" selected={endDate} onSelect={setEndDate} weekStartsOn={1}
                            disabled={{ before: startDate || new Date() }}
                            components={{ Chevron: ({ orientation }) => orientation === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} /> }}
                            classNames={calendarClassNames}
                        />
                    </PopoverContent>
                </Popover>
            </div>
          </div>

          <div className="space-y-2 bg-primary-600/5 p-5 rounded-[20px] border border-primary-600/10">
            <Label className="text-primary-500 text-[10px] font-bold tracking-widest uppercase">New Monthly target</Label>
            <p className="text-2xl font-bold text-white mt-1">${monthlyTarget}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="bg-transparent border-gray-800 text-gray-300 h-14 rounded-2xl hover:bg-white/5 font-bold">Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className="bg-primary-600 hover:bg-primary-500 text-gray-100 font-bold h-12 rounded-xl  transition-all">
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}