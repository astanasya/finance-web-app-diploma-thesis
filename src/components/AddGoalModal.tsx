"use client";

import { useState, useMemo } from "react";
import { createGoal } from "@/actions/goals";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Додано
import { DayPicker } from "react-day-picker"; // Додано
import { Plus, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"; // Додано
import { format, differenceInMonths } from "date-fns"; // Додано
import { cn } from "@/lib/utils";

export function AddGoalModal() {
  const [open, setOpen] = useState(false);
  
  // Змінюємо тип стану на Date для роботи з календарем
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // Автоматичний розрахунок щомісячного платежу (оновлено під Date)
  const monthlyTarget = useMemo(() => {
  const targetAmount = parseFloat(amount);
  if (!targetAmount || !startDate || !endDate) return "0.00";

  // Рахуємо чисту різницю в місяцях (наприклад, Травень -> Листопад = 6)
  const months = differenceInMonths(endDate, startDate);
  
  // Якщо різниця менше місяця (наприклад, обрали дати в межах тижня), 
  // ділимо на 1, щоб не ділити на 0
  const divisor = months > 0 ? months : 1;
  const result = targetAmount / divisor;

  return result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}, [amount, startDate, endDate]);

  async function handleSave() {
    if (!startDate || !endDate) return;
    const res = await createGoal({
      name,
      targetAmount: parseFloat(amount),
      startDate: startDate,
      deadline: endDate
    });
    if (!res.error) setOpen(false);
  }

  // Стилі для інпутів-кнопок
  const inputStyles = "bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 pl-4 pr-1 text-base h-10 shadow-none w-full flex items-center justify-between text-left transition-all";
  
  /// Оновлені стилі для календаря
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
    // ОСЬ ЦЕЙ КЛЮЧ ДОДАЄ ЗЕЛЕНУ ЗАЛИВКУ
    selected: "bg-primary-600 text-black font-bold rounded-xl hover:bg-primary-500", 
    
    today: "text-primary-500 font-bold underline decoration-2 underline-offset-4",
    outside: "text-zinc-800 opacity-50",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-2xl h-12 px-6 gap-2">
          <Plus size={20} /> Add goal
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-90 border-white/5 text-white p-10 rounded-[32px] sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-center">Add a goal</DialogTitle>
          <p className="text-gray-500 text-center text-sm">Please fill out the form below</p>
        </DialogHeader>

        <div className="space-y-8">
          <div className="space-y-2">
            <Label className="text-gray-400 text-[10px] font-medium tracking-widest ml-1">Name</Label>
            <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Goal name" 
                className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 pl-4 pr-1 text-base h-10 shadow-none" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400 text-[10px] font-medium tracking-widest ml-1">Goal amount</Label>
            <Input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="$ 0.00" 
                className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-1 text-base h-10 shadow-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* START DATE */}
            <div className="space-y-2">
                <Label className="text-gray-400 text-[10px] font-medium tracking-widest ml-1">Start date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className={inputStyles}>
                            <span className={startDate ? "text-white" : "text-gray-700"}>
                                {startDate ? format(startDate, "dd MMM, yyyy") : "Select date"}
                            </span>
                            <CalendarIcon size={14} className="text-gray-600" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-[#1a1a1c] border-gray-800 rounded-3xl shadow-2xl" align="start">
                        <DayPicker
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            weekStartsOn={1}
                            components={{
                                Chevron: ({ orientation }) => orientation === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />
                            }}
                            classNames={calendarClassNames}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* END DATE */}
            <div className="space-y-2">
                <Label className="text-gray-400 text-[10px] font-medium tracking-widest ml-1">End date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className={inputStyles}>
                            <span className={endDate ? "text-white" : "text-gray-700"}>
                                {endDate ? format(endDate, "dd MMM, yyyy") : "Select date"}
                            </span>
                            <CalendarIcon size={14} className="text-gray-600" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-[#1a1a1c] border-gray-800 rounded-3xl shadow-2xl" align="start">
                        <DayPicker
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            weekStartsOn={1}
                            disabled={{ before: startDate || new Date() }}
                            components={{
                                Chevron: ({ orientation }) => orientation === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />
                            }}
                            classNames={calendarClassNames}
                        />
                    </PopoverContent>
                </Popover>
            </div>
          </div>

          <div className="space-y-2 bg-primary-600/5 p-4 rounded-2xl border border-primary-600/10">
            <Label className="text-primary-500 text-[10px] font-bold tracking-widest">Monthly target (Calculated)</Label>
            <p className="text-2xl font-bold text-gray-0">${monthlyTarget}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="bg-transparent border-gray-800 text-gray-300 h-12 rounded-xl hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary-600 hover:bg-primary-500 text-gray-100 font-bold h-12 rounded-xl transition-all">Add goal</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}