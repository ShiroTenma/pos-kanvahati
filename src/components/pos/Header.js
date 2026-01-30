"use client"
import { Search } from 'lucide-react';

const CATEGORIES = ["All", "Makanan", "Minuman", "Snack"];

export function Header({ query, setQuery, activeCategory, setActiveCategory }) {
  return (
    <div className="p-6 bg-base-200 z-10">
      <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari menu..."
            className="input w-full pl-12 bg-base-200/50 focus:bg-base-100 rounded-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm px-6 rounded-full border-0 ${activeCategory === cat ? 'bg-primary text-white' : 'bg-base-200 text-gray-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
