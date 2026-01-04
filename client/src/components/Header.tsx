import { Bug, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Bug className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-white">HackTrace</h1>
              <p className="text-xs text-zinc-500">Execution Trace Analysis</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search traces..."
                className="w-64 rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-zinc-400">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}