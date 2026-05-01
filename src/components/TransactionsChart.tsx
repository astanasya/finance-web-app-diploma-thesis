"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function TransactionsChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#02ba3a" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#02ba3a" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 9 }} 
            dy={15}
            minTickGap={30} // Цей параметр автоматично приховає зайві дати, щоб вони не злипалися
            />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#161617', border: '1px solid #ffffff10', borderRadius: '16px', color: 'white' }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            cursor={{ stroke: '#ffffff10' }}
          />
          <Area 
            type="monotone" 
            dataKey="income" 
            stroke="#02ba3a" 
            strokeWidth={3}
            fill="url(#colorIncome)" 
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="expenses" 
            stroke="#ef4444" 
            strokeWidth={3}
            fill="url(#colorExpenses)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}