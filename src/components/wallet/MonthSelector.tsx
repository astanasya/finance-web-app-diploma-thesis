"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


export function MonthSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Отримуємо поточні значення з URL або ставимо дефолтні
  const currentMonth = searchParams.get("month") || format(new Date(), "MM");
  const currentYear = searchParams.get("year") || format(new Date(), "yyyy");

  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    router.push(`/wallet?${params.toString()}`);
  };

  const months = [
    { value: "01", label: "Jan" }, { value: "02", label: "Feb" },
    { value: "03", label: "Mar" }, { value: "04", label: "Apr" },
    { value: "05", label: "May" }, { value: "06", label: "Jun" },
    { value: "07", label: "Jul" }, { value: "08", label: "Aug" },
    { value: "09", label: "Sep" }, { value: "10", label: "Oct" },
    { value: "11", label: "Nov" }, { value: "12", label: "Dec" },
  ];

  const activeMonthLabel = months.find(m => m.value === currentMonth)?.label;
  const filterTriggerStyles = "bg-[#1A1A1C] border border-white/5 rounded-2xl text-[13px] font-bold text-zinc-200 h-12 px-4 focus:ring-0 focus:border-white/10 transition-all shadow-none";

  return (
    <Select value={currentMonth} onValueChange={handleMonthChange}>
      <SelectTrigger className={cn("w-[150px]", filterTriggerStyles)}>
        <SelectValue>{activeMonthLabel} {currentYear}</SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-90 border-white/10 text-white">
        {months.map((m) => (
          <SelectItem key={m.value} value={m.value} className="focus:bg-white/10">
            {m.label} {currentYear}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}