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
            onClick={() => addToCart(p)}
            className="card bg-base-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-base-300 active:scale-95 group"
          >
            <div className="card-body p-5 items-center text-center">
              <div className="text-5xl mb-3">{p.image}</div>
              <h2 className="card-title text-base font-bold line-clamp-2 min-h-[3rem]">{p.name}</h2>
              <div className="badge badge-lg bg-base-200 text-primary border-0 font-bold mt-1">
                Rp {p.price.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
