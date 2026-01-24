import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-[#09090b]">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-20 px-8 text-center sm:items-start sm:text-left">
        
        {/* Logo Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-black dark:text-white">
            MARKTIST
          </h1>
          <div className="h-1 w-12 bg-cyan-500 mt-1"></div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
            Welcome to the Workspace.
          </h2>
          
          <p className="max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Connect with the team in real-time. Please sign in to your account. 
            <span className="block mt-4 p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg text-sm italic">
              Note: New accounts require manual approval by an administrator before access to the chat is granted.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-10 w-full sm:flex-row">
          <Link
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold transition-transform hover:scale-105 active:scale-95 md:w-[200px] shadow-lg"
            href="/auth/login"
          >
            Get Started
          </Link>
          
        </div>

        {/* Footer info */}
        <footer className="mt-20 text-xs text-zinc-400 uppercase tracking-widest">
          &copy; 2024 MARKTIST Internal Systems , No outsider is allowed.
        </footer>
      </main>
    </div>
  );
}