"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; // Отримуємо сесію
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ArrowLeftRight, Calendar, 
  Wallet, Target, Briefcase, PieChart, 
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfileModal } from "./UserProfileModal";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ArrowLeftRight, label: "Transaction", href: "/transactions" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: Briefcase, label: "Budget", href: "/budget" },
  { icon: PieChart, label: "Analytics", href: "/analytics" },
  { icon: LayoutGrid, label: "Categories", href: "/categories" },
];

export function Sidebar() {
  const pathname = usePathname();
  
  // 1. Отримуємо дані сесії
  const { data: session } = useSession();
  
  // 2. Додаємо стейт для модалки профілю
  const [showProfile, setShowProfile] = useState(false);

  const user = session?.user;

  // 3. Логіка створення ініціалів (AH)
  const initials = user?.name 
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <aside className="w-[90px] flex flex-col bg-gray-90 fixed h-full z-20 border-r border-white/5">
      {/* Логотип прямо тут */}
      <div className="py-8 flex justify-center">
           <div className="h-12 w-12 rounded-full bg-[#1e2222] flex items-center justify-center border border-white/5 shadow-inner">
              {<svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="34" cy="34" r="34" fill="#222324"/>
                <path d="M33.0713 15.5C38.9082 15.5 43.2964 16.3099 46.1582 17.999L46.4238 18.1582C49.1254 19.8257 50.5225 22.1438 50.5225 25.0869C50.5224 26.9483 49.7047 28.6343 48.1494 30.1348C46.9417 31.2999 45.4982 32.2119 43.8271 32.8779C45.1907 33.1954 46.4384 33.6743 47.5664 34.3184H47.5654C49.0973 35.1776 50.3011 36.2374 51.1582 37.5049C52.0439 38.7751 52.4999 40.1274 52.5 41.5527C52.5 45.1112 50.9085 47.8562 47.7773 49.7373C44.6756 51.6006 40.0876 52.5 34.0811 52.5H18.8652C17.8362 52.5 16.9804 52.3342 16.3945 51.9141C15.7716 51.4673 15.5 50.7721 15.5 49.9453V18.0254C15.5001 17.2001 15.7714 16.5056 16.4062 16.0771C16.9918 15.6632 17.843 15.5 18.8652 15.5H33.0713ZM27.5586 44.7568H34.0811C36.1021 44.7568 37.6095 44.4069 38.6562 43.7627C39.6731 43.1181 40.1592 42.2435 40.1592 41.0898C40.1591 40.5242 40.0153 40.0479 39.7402 39.6416C39.4626 39.2316 39.0322 38.8655 38.417 38.5566L38.4131 38.5547C37.1981 37.9324 35.3808 37.5967 32.9102 37.5967H27.5586V44.7568ZM27.5586 29.8252H31.9824C34.0345 29.8252 35.5565 29.4735 36.6025 28.8281C37.6802 28.1606 38.1416 27.3776 38.1416 26.4756C38.1415 25.3783 37.6891 24.5889 36.7549 24.043C35.779 23.4728 34.2504 23.1563 32.1035 23.1562H27.5586V29.8252Z" fill="#02BA3A" stroke="#02BA3A"/>
                <mask id="mask0_2774_37751" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="15" y="15" width="38" height="38">
                <path d="M33.0713 15.5C38.9082 15.5 43.2964 16.3099 46.1582 17.999L46.4238 18.1582C49.1254 19.8257 50.5225 22.1438 50.5225 25.0869C50.5224 26.9483 49.7047 28.6343 48.1494 30.1348C46.9417 31.2999 45.4982 32.2119 43.8271 32.8779C45.1907 33.1954 46.4384 33.6743 47.5664 34.3184H47.5654C49.0973 35.1776 50.3011 36.2374 51.1582 37.5049C52.0439 38.7751 52.4999 40.1274 52.5 41.5527C52.5 45.1112 50.9085 47.8562 47.7773 49.7373C44.6756 51.6006 40.0876 52.5 34.0811 52.5H18.8652C17.8362 52.5 16.9804 52.3342 16.3945 51.9141C15.7716 51.4673 15.5 50.7721 15.5 49.9453V18.0254C15.5001 17.2001 15.7714 16.5056 16.4062 16.0771C16.9918 15.6632 17.843 15.5 18.8652 15.5H33.0713ZM27.5586 44.7568H34.0811C36.1021 44.7568 37.6095 44.4069 38.6562 43.7627C39.6731 43.1181 40.1592 42.2435 40.1592 41.0898C40.1591 40.5242 40.0153 40.0479 39.7402 39.6416C39.4626 39.2316 39.0322 38.8655 38.417 38.5566L38.4131 38.5547C37.1981 37.9324 35.3808 37.5967 32.9102 37.5967H27.5586V44.7568ZM27.5586 29.8252H31.9824C34.0345 29.8252 35.5565 29.4735 36.6025 28.8281C37.6802 28.1606 38.1416 27.3776 38.1416 26.4756C38.1415 25.3783 37.6891 24.5889 36.7549 24.043C35.779 23.4728 34.2504 23.1563 32.1035 23.1562H27.5586V29.8252Z" fill="#02BA3A" stroke="#02BA3A"/>
                </mask>
                <g mask="url(#mask0_2774_37751)">
                <path d="M41.6387 20.1387C41.6386 21.0798 41.462 21.8766 41.0049 22.417C40.55 22.9878 39.8338 23.2139 39 23.2139H27.5586V29.6797H37.1914C37.973 29.6798 38.6519 29.8779 39.1084 30.373L39.1963 30.4766L39.2295 30.5186L39.2539 30.5664V30.5674L39.2549 30.5684C39.2553 30.5691 39.2553 30.5702 39.2559 30.5713C39.2572 30.5741 39.2594 30.5783 39.2617 30.583C39.2664 30.5927 39.2732 30.6067 39.2812 30.624C39.2974 30.6586 39.3192 30.7082 39.3457 30.7695C39.3987 30.892 39.4696 31.0644 39.54 31.2676C39.6777 31.6649 39.8301 32.2196 39.8301 32.7559V34.3477C39.8301 34.8303 39.784 35.3125 39.6865 35.7373C39.5917 36.1505 39.4364 36.5617 39.1836 36.8545L39.1826 36.8535C38.7272 37.4129 38.0175 37.6357 37.1914 37.6357H27.5586V44.7568H39.04C39.8661 44.7568 40.5767 44.9789 41.0322 45.5381C41.4977 46.0773 41.6797 46.8696 41.6797 47.8037V49.4248C41.6796 50.3661 41.5021 51.1627 41.0449 51.7031C40.6469 52.2025 40.0495 52.4383 39.3477 52.4893L39.04 52.5H18.8652C17.8362 52.5 16.9804 52.3342 16.3945 51.9141C15.7716 51.4673 15.5 50.772 15.5 49.9453V18.0254C15.5001 17.2001 15.7714 16.5056 16.4062 16.0771C16.9918 15.6632 17.843 15.5 18.8652 15.5H39L39.3066 15.5107C40.0087 15.5616 40.6078 15.7964 41.0059 16.2959L41.0039 16.2969C41.1545 16.4785 41.253 16.7269 41.3193 16.9326C41.3932 17.1619 41.4524 17.4163 41.498 17.6465C41.544 17.8783 41.5789 18.0953 41.6016 18.2539C41.6129 18.3335 41.6212 18.3993 41.627 18.4453C41.6298 18.4683 41.6323 18.4864 41.6338 18.499C41.6345 18.5052 41.6344 18.5102 41.6348 18.5137C41.6349 18.5152 41.6356 18.5166 41.6357 18.5176V18.5195L41.6387 18.5479V20.1387Z" fill="#1A1A1C" stroke="#02BA3A"/>
                </g>
                </svg>}
           </div>
      </div>


      {/* Навігація */}
      <nav className="flex-1 flex flex-col items-center gap-2 px-2 overflow-y-auto no-scrollbar shrink-0">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center justify-center w-full aspect-square gap-1 rounded-2xl transition-all group",
                isActive ? "bg-white/10 text-gray-0" : "text-gray-40 hover:bg-white/5"
              )}>
                <item.icon size={22} className={cn(isActive ? "text-gray-0" : "text-gray-30")} />
                <span className="text-[9px] font-bold tracking-wider">{item.label}</span>
              </Link>
            )
          })}
      </nav>

      {/* Профіль користувача внизу */}
      <div className="p-4 flex flex-col items-center gap-4 shrink-0 mb-4 mt-auto">
        <button 
          onClick={() => setShowProfile(true)}
          className="relative group transition-transform active:scale-95 outline-none"
        >
          {user?.image ? (
            <img 
                src={user.image} 
                className="w-12 h-12 rounded-full border border-white/10 object-cover" 
                alt="Avatar" 
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-600/10 border border-primary-600/20 flex items-center justify-center text-primary-500 font-black text-sm">
              {initials}
            </div>
          )}
          <div className="absolute -inset-1 rounded-full border border-primary-500 opacity-0 group-hover:opacity-40 transition-opacity" />
        </button>
      </div>

      {/* Модалка профілю */}
      {showProfile && (
        <UserProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
    </aside>
  );
}