"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, startOfMonth, endOfMonth, startOfToday, subDays, startOfYear, endOfYear, subMonths } from "date-fns";
import { CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const presets = [
  { label: "All time", getValue: () => undefined },
  { label: "Today", getValue: () => ({ from: startOfToday(), to: startOfToday() }) },
  { label: "Last week", getValue: () => ({ from: subDays(startOfToday(), 7), to: startOfToday() }) },
  { 
    label: "Last month", 
    getValue: () => {
      const prevMonth = subMonths(new Date(), 1);
      return { from: startOfMonth(prevMonth), to: endOfMonth(prevMonth) };
    } 
  },
  { label: "This month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: "This year", getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
  { label: "Custom", getValue: () => undefined },
];

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [tempRange, setTempRange] = useState<DateRange | undefined>({
    from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
  });
  const [activePreset, setActivePreset] = useState("Custom");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    if (tempRange?.from) params.set("from", format(tempRange.from, "yyyy-MM-dd"));
    else params.delete("from");
    if (tempRange?.to) params.set("to", format(tempRange.to, "yyyy-MM-dd"));
    else params.delete("to");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-gray-90 border-white/5 rounded-2xl h-12 gap-3 text-gray-200 px-5 hover:bg-gray-80">
          <CalendarIcon size={18} className="text-gray-500" />
          <span className="text-sm font-bold">
            {tempRange?.from ? (
              tempRange.to ? `${format(tempRange.from, "dd MMM")} – ${format(tempRange.to, "dd MMM, yyyy")}` : format(tempRange.from, "dd MMM, yyyy")
            ) : "All time"}
          </span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-auto p-0 bg-[#161617] border-white/5 shadow-2xl rounded-[32px] overflow-hidden" align="start">
        <div className="flex">
          {/* ЛІВА ПАНЕЛЬ */}
          <div className="w-[180px] border-r border-white/5 flex flex-col p-6 gap-1 shrink-0">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setActivePreset(preset.label);
                  setTempRange(preset.getValue());
                }}
                className={cn(
                  "text-left px-4 py-2.5 rounded-xl text-[14px] transition-all",
                  activePreset === preset.label 
                    ? "bg-[#29292a] text-white font-medium" 
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* ПРАВА ПАНЕЛЬ */}
          <div className="p-8 flex flex-col min-w-[360px]">
            {/* INPUTS */}
            <div className="flex items-center gap-8 mb-8">
              <div className="flex-1 space-y-2">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Start date</p>
                <div className="relative border-b border-zinc-800 pb-2 flex items-center justify-between">
                  <span className={cn("text-sm", tempRange?.from ? "text-white" : "text-zinc-600")}>
                    {tempRange?.from ? format(tempRange.from, "dd MMM, yyyy") : "Select date"}
                  </span>
                  {tempRange?.from && <X size={16} className="text-zinc-600 cursor-pointer" onClick={() => setTempRange(undefined)} />}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">End date</p>
                <div className="relative border-b border-zinc-800 pb-2 flex items-center justify-between">
                  <span className={cn("text-sm", tempRange?.to ? "text-white" : "text-zinc-600")}>
                    {tempRange?.to ? format(tempRange.to, "dd MMM, yyyy") : "Select date"}
                  </span>
                  {tempRange?.to && <X size={16} className="text-zinc-600 cursor-pointer" onClick={() => setTempRange(prev => prev ? { from: prev.from, to: undefined } : undefined)} />}
                </div>
              </div>
            </div>

            {/* КАЛЕНДАР */}
            <div className="flex-1 select-none">
              <DayPicker
                mode="range"
                selected={tempRange}
                onSelect={setTempRange}
                weekStartsOn={1}
                showOutsideDays
                components={{
                  Chevron: ({ orientation }) => orientation === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />
                }}
                classNames={{
                  months: "relative",
                  month: "space-y-4",
                  month_caption: "flex justify-center items-center h-8 mb-4 relative",
                  caption_label: "text-sm font-bold text-white",
                  nav: "flex items-center",
                  button_previous: "absolute left-0 top-0 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 z-20 flex items-center justify-center",
                  button_next: "absolute right-0 top-0 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 z-20 flex items-center justify-center",
                  month_grid: "w-full border-collapse",
                  weekdays: "flex w-full justify-between mb-2", // Рядок Mo Tu We...
                  weekday: "text-zinc-500 w-10 font-bold text-[11px] uppercase text-center",
                  weeks: "flex flex-col gap-1", // Контейнер для тижнів (вертикальний)
                  week: "flex w-full justify-between", // КОЖЕН ТИЖДЕНЬ - ГОРИЗОНТАЛЬНИЙ (ЦЕ ВИПРАВЛЕННЯ)
                  day: "h-10 w-10 flex items-center justify-center relative p-0 focus-within:z-20",
                  day_button: cn(
                    "h-10 w-10 flex items-center justify-center text-sm font-medium transition-all rounded-xl hover:bg-zinc-800 text-zinc-300"
                  ),
                  selected: "bg-primary-600 text-black font-bold",
                  range_start: "bg-primary-600 text-black rounded-xl",
                  range_end: "bg-primary-600 text-black rounded-xl",
                  range_middle: "bg-primary-600/20 text-primary-500 rounded-none",
                  today: "text-primary-500 font-bold underline decoration-2 underline-offset-4",
                  outside: "text-zinc-800 opacity-50",
                  disabled: "text-zinc-800 opacity-50",
                  hidden: "invisible",
                }}
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-6">
              <Button variant="ghost" onClick={() => setIsOpen(false)} className="flex-1 border border-zinc-800 text-zinc-400 h-14 rounded-2xl font-bold">Cancel</Button>
              <Button onClick={handleApply} className="flex-1 bg-primary-600 hover:bg-primary-500 text-black font-black h-14 rounded-2xl shadow-[0_10px_20px_rgba(2,186,58,0.2)]">Add</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}