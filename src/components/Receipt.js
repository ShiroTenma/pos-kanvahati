import React from 'react';

// Menggunakan forwardRef agar bisa dibaca oleh react-to-print
export const Receipt = React.forwardRef(({ cart, total, date }, ref) => {
  return (
    <div ref={ref} className="p-4 bg-white text-black font-mono text-xs" style={{ width: '58mm', minHeight: '100mm' }}>
      
      {/* HEADER STRUK */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">POS KANVAHATI</h2>
        <p>Jl. Jend. Sudirman No. 1</p>
        <p>Balikpapan</p>
        <p className="mt-2 text-[10px]">{date}</p>
      </div>

      <div className="border-b-2 border-dashed border-black mb-2"></div>

      {/* ITEM BELANJA */}
      <div className="flex flex-col gap-2 mb-4">
        {cart.map((item, index) => (
          <div key={index}>
            <div className="font-bold">{item.name}</div>
            <div className="flex justify-between">
              <span>{item.qty} x {item.price.toLocaleString()}</span>
              <span>{(item.qty * item.price).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b-2 border-dashed border-black mb-2"></div>

      {/* TOTAL */}
      <div className="flex justify-between font-bold text-sm mb-4">
        <span>TOTAL:</span>
        <span>Rp {total.toLocaleString()}</span>
      </div>

      {/* FOOTER */}
      <div className="text-center text-[10px] mt-4">
        <p>Terima Kasih</p>
        <p>Silakan Datang Kembali!</p>
      </div>
      
    </div>
  );
});

Receipt.displayName = "Receipt";