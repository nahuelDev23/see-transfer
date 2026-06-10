import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Acceso",
};

interface AuthPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
        <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
          Seetransfer
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Panel de administración</h1>
        <p className="mt-2 text-sm text-slate-400">
          Acceso restringido para gestionar transferencias con tracking.
        </p>
        <div className="mt-8">
          <LoginForm errorCode={error} />
        </div>
      </div>
    </main>
  );
}
