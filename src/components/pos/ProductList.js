"use client"

export function ProductList({ loading, products, addToCart }) {
  if (loading) {
    return <p className="text-center mt-10">Memuat menu...</p>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-20">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => p.quantity > 0 && addToCart(p)}
            className={`card bg-base-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-base-300 active:scale-95 group ${
              p.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <figure className="relative w-24 h-24 flex items-center justify-center text-5xl mb-3 bg-base-200 rounded-2xl group-hover:scale-105 transition-transform">
              <img 
                src={p.image} 
                alt={p.name} 
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => { e.target.onerror = null; e.target.outerHTML = '📦' }}
              />
              {p.quantity === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                  <span className="text-white font-bold text-4xl">X</span>
                </div>
              )}
            </figure>
            <div className="card-body p-0 items-center text-center">
              <h2 className="card-title text-base font-bold line-clamp-2 min-h-[3rem]">{p.name}</h2>
              <div className="badge badge-lg bg-base-200 text-primary border-0 font-bold mt-1">
                Rp {p.price.toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-neutral">Stok: {p.quantity}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
