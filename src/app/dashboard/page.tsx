import type { Metadata } from "next";
import CreateTransferForm from "@/components/CreateTransferForm";
import LogoutButton from "@/components/LogoutButton";
import TransfersTable from "@/components/TransfersTable";
import { listTransfers } from "@/lib/transfers";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  const transfers = session ? await listTransfers(session.userId) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
            Panel
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">
            Bienvenido, {session?.username}
          </h1>
          <p className="mt-2 text-slate-400">
            Subí archivos con tracking y revisá cada dispositivo que descarga.
          </p>
        </div>
        <LogoutButton />
      </div>

      <CreateTransferForm />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Archivos con tracking</h2>
          <p className="mt-1 text-sm text-slate-400">
            Solo los enlaces creados desde aquí registran datos de descarga.
          </p>
        </div>
        <TransfersTable transfers={transfers} />
      </section>
    </div>
  );
}
