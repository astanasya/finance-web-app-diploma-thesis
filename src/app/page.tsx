import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#0d1111] overflow-hidden font-sans text-white">
      
      {/* --- ЕФЕКТИ ФОНУ (як у LoginPage) --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* --- CONTENT --- */}
      <div className="relative z-10 max-w-5xl px-6 text-center space-y-12">
        
        {/* LOGO AREA */}
        <div className="flex items-center justify-center gap-3">
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

        {/* HERO TEXT */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white">
            Take control of your <br />
            <span className="bg-gradient-to-r from-[#77FE9F] to-primary-600 bg-clip-text text-transparent">
              financial future
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
            Manage expenses, set smart saving goals, and get AI-powered insights to grow your wealth — all in one beautiful place.
          </p>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in zoom-in duration-1000 delay-200">
          <Link href="/register">
            <Button className="h-14 px-10 text-lg bg-primary-600 hover:bg-primary-500 text-black font-black rounded-2xl shadow-[0_10px_20px_rgba(2,186,58,0.2)] transition-all hover:scale-105 active:scale-95">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="h-14 px-10 text-lg text-white border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
              Sign In
            </Button>
          </Link>
        </div>

        {/* FEATURE CHIPS */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <FeatureCard 
            icon={<Zap className="text-primary-500" size={20} />} 
            text="AI Smart Coach" 
          />
          <FeatureCard 
            icon={<TrendingUp className="text-primary-500" size={20} />} 
            text="Goal Tracking" 
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-primary-500" size={20} />} 
            text="Secure & Private" 
          />
        </div>

      </div>

      {/* FOOTER BORDER-LIKE DECORATION */}
      <div className="absolute bottom-10 text-zinc-600 text-[10px] uppercase font-black tracking-[0.3em]">
        © 2026 EASE BUDGET • SMART FINANCE SYSTEM
      </div>
    </main>
  );
}

function FeatureCard({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm shadow-xl">
      {icon}
      <span className="text-sm font-bold text-zinc-300 tracking-wide">{text}</span>
    </div>
  );
}