"use client";

import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface IconProps extends LucideProps {
  name: string; // Назва іконки, яка приходить з БД
}

export const DynamicIcon = ({ name, ...props }: IconProps) => {
  // Динамічно отримуємо компонент з бібліотеки lucide-react
  // @ts-ignore
  const IconComponent = Icons[name];

  if (!IconComponent) {
    // Якщо іконку не знайдено (або назва порожня), показуємо іконку за замовчуванням
    return <Icons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};