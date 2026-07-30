import { Navbar } from "@/components/layout/Navbar";
import { WatchList } from "@/components/watchlist/WatchList";

export default function WatchListPage() {
  return (
    <div className="flex min-h-screen flex-col animate-in fade-in duration-500">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-black">Watch List</h1>
        <p className="mt-1.5 text-sm text-brand-muted">
          Individuals identified for monitoring based on exposure analysis
        </p>

        <div className="mt-10">
          <WatchList />
        </div>
      </main>
    </div>
  );
}
