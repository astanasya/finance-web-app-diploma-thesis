import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#0D1111] text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-8">
        <h1 className="text-6xl font-bold text-brand-green">Ease Budget</h1>
        <p className="text-xl text-gray-400">Твій дипломний проєкт стартував успішно!</p>
        
        <div className="flex gap-4 mt-8">
          <Link href="/login">
            <Button className="bg-brand-green text-black font-bold px-8 py-6 text-lg hover:bg-emerald-500">
              Перейти до входу
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}