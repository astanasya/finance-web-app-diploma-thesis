"use client";

import { loginUser } from "@/actions/login"; 
import { useState, useTransition } from "react"; 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react" // Додаємо EyeOff

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // Додаємо стан для видимості пароля
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    
    startTransition(async () => {
      const result = await loginUser(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="relative flex min-h-screen w-full bg-[#0d1111] overflow-hidden font-sans">
      
      {/* --- ЕФЕКТИ ФОНУ --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* --- ЛІВА ЧАСТИНА --- */}
      <div className="relative z-10 hidden w-1/2 flex-col justify-between p-20 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full  flex items-center justify-center ">
              {<svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="34" cy="34" r="34" />
                <path d="M33.0713 15.5C38.9082 15.5 43.2964 16.3099 46.1582 17.999L46.4238 18.1582C49.1254 19.8257 50.5225 22.1438 50.5225 25.0869C50.5224 26.9483 49.7047 28.6343 48.1494 30.1348C46.9417 31.2999 45.4982 32.2119 43.8271 32.8779C45.1907 33.1954 46.4384 33.6743 47.5664 34.3184H47.5654C49.0973 35.1776 50.3011 36.2374 51.1582 37.5049C52.0439 38.7751 52.4999 40.1274 52.5 41.5527C52.5 45.1112 50.9085 47.8562 47.7773 49.7373C44.6756 51.6006 40.0876 52.5 34.0811 52.5H18.8652C17.8362 52.5 16.9804 52.3342 16.3945 51.9141C15.7716 51.4673 15.5 50.7721 15.5 49.9453V18.0254C15.5001 17.2001 15.7714 16.5056 16.4062 16.0771C16.9918 15.6632 17.843 15.5 18.8652 15.5H33.0713ZM27.5586 44.7568H34.0811C36.1021 44.7568 37.6095 44.4069 38.6562 43.7627C39.6731 43.1181 40.1592 42.2435 40.1592 41.0898C40.1591 40.5242 40.0153 40.0479 39.7402 39.6416C39.4626 39.2316 39.0322 38.8655 38.417 38.5566L38.4131 38.5547C37.1981 37.9324 35.3808 37.5967 32.9102 37.5967H27.5586V44.7568ZM27.5586 29.8252H31.9824C34.0345 29.8252 35.5565 29.4735 36.6025 28.8281C37.6802 28.1606 38.1416 27.3776 38.1416 26.4756C38.1415 25.3783 37.6891 24.5889 36.7549 24.043C35.779 23.4728 34.2504 23.1563 32.1035 23.1562H27.5586V29.8252Z" fill="#02BA3A" stroke="#02BA3A"/>
                <mask id="mask0_2774_37751" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="15" y="15" width="38" height="38">
                <path d="M33.0713 15.5C38.9082 15.5 43.2964 16.3099 46.1582 17.999L46.4238 18.1582C49.1254 19.8257 50.5225 22.1438 50.5225 25.0869C50.5224 26.9483 49.7047 28.6343 48.1494 30.1348C46.9417 31.2999 45.4982 32.2119 43.8271 32.8779C45.1907 33.1954 46.4384 33.6743 47.5664 34.3184H47.5654C49.0973 35.1776 50.3011 36.2374 51.1582 37.5049C52.0439 38.7751 52.4999 40.1274 52.5 41.5527C52.5 45.1112 50.9085 47.8562 47.7773 49.7373C44.6756 51.6006 40.0876 52.5 34.0811 52.5H18.8652C17.8362 52.5 16.9804 52.3342 16.3945 51.9141C15.7716 51.4673 15.5 50.7721 15.5 49.9453V18.0254C15.5001 17.2001 15.7714 16.5056 16.4062 16.0771C16.9918 15.6632 17.843 15.5 18.8652 15.5H33.0713ZM27.5586 44.7568H34.0811C36.1021 44.7568 37.6095 44.4069 38.6562 43.7627C39.6731 43.1181 40.1592 42.2435 40.1592 41.0898C40.1591 40.5242 40.0153 40.0479 39.7402 39.6416C39.4626 39.2316 39.0322 38.8655 38.417 38.5566L38.4131 38.5547C37.1981 37.9324 35.3808 37.5967 32.9102 37.5967H27.5586V44.7568ZM27.5586 29.8252H31.9824C34.0345 29.8252 35.5565 29.4735 36.6025 28.8281C37.6802 28.1606 38.1416 27.3776 38.1416 26.4756C38.1415 25.3783 37.6891 24.5889 36.7549 24.043C35.779 23.4728 34.2504 23.1563 32.1035 23.1562H27.5586V29.8252Z" fill="#02BA3A" stroke="#02BA3A"/>
                </mask>
                <g mask="url(#mask0_2774_37751)">
                <path d="M41.6387 20.1387C41.6386 21.0798 41.462 21.8766 41.0049 22.417C40.55 22.9878 39.8338 23.2139 39 23.2139H27.5586V29.6797H37.1914C37.973 29.6798 38.6519 29.8779 39.1084 30.373L39.1963 30.4766L39.2295 30.5186L39.2539 30.5664V30.5674L39.2549 30.5684C39.2553 30.5691 39.2553 30.5702 39.2559 30.5713C39.2572 30.5741 39.2594 30.5783 39.2617 30.583C39.2664 30.5927 39.2732 30.6067 39.2812 30.624C39.2974 30.6586 39.3192 30.7082 39.3457 30.7695C39.3987 30.892 39.4696 31.0644 39.54 31.2676C39.6777 31.6649 39.8301 32.2196 39.8301 32.7559V34.3477C39.8301 34.8303 39.784 35.3125 39.6865 35.7373C39.5917 36.1505 39.4364 36.5617 39.1836 36.8545L39.1826 36.8535C38.7272 37.4129 38.0175 37.6357 37.1914 37.6357H27.5586V44.7568H39.04C39.8661 44.7568 40.5767 44.9789 41.0322 45.5381C41.4977 46.0773 41.6797 46.8696 41.6797 47.8037V49.4248C41.6796 50.3661 41.5021 51.1627 41.0449 51.7031C40.6469 52.2025 40.0495 52.4383 39.3477 52.4893L39.04 52.5H18.8652C17.8362 52.5 16.9804 52.3342 16.3945 51.9141C15.7716 51.4673 15.5 50.772 15.5 49.9453V18.0254C15.5001 17.2001 15.7714 16.5056 16.4062 16.0771C16.9918 15.6632 17.843 15.5 18.8652 15.5H39L39.3066 15.5107C40.0087 15.5616 40.6078 15.7964 41.0059 16.2959L41.0039 16.2969C41.1545 16.4785 41.253 16.7269 41.3193 16.9326C41.3932 17.1619 41.4524 17.4163 41.498 17.6465C41.544 17.8783 41.5789 18.0953 41.6016 18.2539C41.6129 18.3335 41.6212 18.3993 41.627 18.4453C41.6298 18.4683 41.6323 18.4864 41.6338 18.499C41.6345 18.5052 41.6344 18.5102 41.6348 18.5137C41.6349 18.5152 41.6356 18.5166 41.6357 18.5176V18.5195L41.6387 18.5479V20.1387Z" fill="#1A1A1C" stroke="#02BA3A"/>
                </g>
                </svg>}
           </div>
            <span className="text-primary-500 font-bold text-xl tracking-tight">Ease <span className="text-primary-600">Budget</span></span>
          </div>
        </div>
        
        <div className="max-w-xl">
          <h1 className="text-[64px] font-bold leading-[1.1] tracking-tight text-white">
            Manage your <br />
            <span className="bg-gradient-to-r from-primary-500 to-primary-900 bg-clip-text text-transparent">
              budget with ease
            </span>
          </h1>
          <p className="mt-6 text-gray-400 text-lg font-medium">
            Sign in to continue your journey to financial freedom!
          </p>
          
          
        </div>
        
        <div className="text-xs text-gray-600 uppercase tracking-[0.2em]">© 2025 Ease Budget UI Kit</div>
      </div>

      {/* --- ПРАВА ЧАСТИНА --- */}
      <div className="relative z-10 flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-[460px] bg-[#161617] p-10 rounded-[24px] border border-white/5 shadow-2xl">
          <div className="space-y-2 text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Sign in</h2>
            <p className="text-gray-400">
              New user? <Link href="/register" className="text-primary-500 hover:underline">Create an account</Link>
            </p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 ml-1">Email</Label>
              <Input 
                name="email" 
                id="email" 
                type="email" 
                disabled={isPending}
                placeholder="Enter your email address" 
                className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-base placeholder:text-gray-600 transition-all shadow-none h-10" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 ml-1">Password</Label>
              <div className="relative">
                <Input 
                  name="password" 
                  id="password" 
                  // Змінюємо тип з "password" на "text" залежно від стану
                  type={showPassword ? "text" : "password"} 
                  disabled={isPending}
                  placeholder="Enter your password" 
                  className="bg-transparent border-0 border-b border-gray-800 rounded-none focus-visible:ring-0 focus-visible:border-primary-500 px-1 text-base placeholder:text-gray-600 transition-all shadow-none h-10 w-full pr-10" 
                />
                {/* Кнопка перемикання */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 h-5 w-5 text-gray-500 cursor-pointer hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-primary-600 hover:bg-[#02ba3a]/90 text-black font-bold h-12 rounded-lg text-lg transition-all active:scale-[0.98]"
            >
              {isPending ? "Logging in..." : "Sign in"}
            </Button>
          </form>

        </div>
      </div>
    </div>
  )
}