# 🏪 POS KANVAHATI

**POS KANVAHATI** adalah sistem aplikasi kasir (Point of Sale) berbasis web modern yang dibangun menggunakan **Next.js**. Aplikasi ini dirancang untuk mempermudah operasional UMKM khususnya KANVAHATI dengan antarmuka yang bersih, cepat, dan fitur manajemen yang lengkap.

## ✨ Fitur Unggulan

* **🛒 Kasir Pintar:**
    * Pencarian menu instan (real-time search) dengan *fuzzy logic*.
    * Filter kategori (Makanan, Minuman, Snack).
    * Keranjang belanja dinamis dengan kalkulasi otomatis.
* **💳 Sistem Pembayaran:**
    * Mendukung opsi pembayaran **Tunai (Cash)** dan **QRIS**.
    * Konfirmasi pembayaran dengan modal pop-up interaktif.
* **📦 Manajemen Produk (CRUD):**
    * Tambah, Edit, dan Hapus menu dengan mudah.
    * Fitur **Soft Delete** (Menu yang dihapus tidak hilang dari riwayat transaksi).
* **📊 Laporan & Riwayat:**
    * Mencatat setiap transaksi secara detail (Waktu, Item, Total).
    * **Export ke Excel (.xlsx)** untuk kemudahan rekapitulasi keuangan.
    * Cetak ulang struk belanja kapan saja.
* **🖨️ Cetak Struk:**
    * Terintegrasi dengan printer thermal 58mm/80mm.
* **🎨 UI/UX Modern:**
    * Tema estetik *Pastel Blue & Cream*.
    * Notifikasi interaktif (*Toast*) dan animasi halus.

## 🛠️ Teknologi

Project ini dibangun menggunakan stack teknologi modern:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** JavaScript (React)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
* **Database:** [SQLite](https://www.sqlite.org/) (via Prisma ORM)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Tools:**
    * `react-to-print` (Cetak Struk)
    * `xlsx` (Export Excel)
    * `fuse.js` (Pencarian Cepat)
    * `lucide-react` (Ikon)

## 🚀 Cara Instalasi (Localhost)

Ikuti langkah ini untuk menjalankan aplikasi di komputer Anda.

### 1. Persyaratan
Pastikan komputer Anda sudah terinstall:
* [Node.js](https://nodejs.org/) (Versi 18 atau terbaru)
* [Git](https://git-scm.com/)

### 2. Clone Repository
Buka terminal dan jalankan perintah berikut:

```bash
git clone [https://github.com/username-anda/pos-kanvahati.git](https://github.com/username-anda/pos-kanvahati.git)
cd pos-kanvahati

```

### 3. Install Dependencies

Download semua library yang dibutuhkan:

```bash
npm install

```

### 4. Setup Database

Buat file `.env` di folder root project (sejajar dengan `package.json`), lalu isi dengan:

```env
DATABASE_URL="file:./dev.db"

```

Kemudian, jalankan migrasi database untuk membuat tabel:

```bash
npx prisma migrate dev --name init

```

### 5. Jalankan Aplikasi

```bash
npm run dev

```

Buka browser dan akses: **`http://localhost:3000`**

## 📂 Struktur Folder

```
src/
├── app/
│   ├── api/            # Backend API (Transaction, Products, History)
│   ├── history/        # Halaman Riwayat Transaksi
│   ├── products/       # Halaman Kelola Produk
│   └── page.js         # Halaman Utama (Kasir)
├── components/         # Komponen UI (Sidebar, Receipt, dll)
├── lib/                # Konfigurasi Prisma Client
└── store/              # State Management (Keranjang Belanja)
prisma/
├── schema.prisma       # Skema Database
└── dev.db              # File Database SQLite

```

## 📝 Catatan Deploy

Aplikasi ini menggunakan **SQLite** yang merupakan database berbasis file lokal.

* Jika ingin men-deploy ke **Vercel** atau **Netlify**, Anda **HARUS** mengganti database ke **PostgreSQL** (misalnya menggunakan Supabase atau Neon Tech).
* SQLite tidak akan menyimpan data secara permanen di lingkungan *serverless* seperti Vercel.

## 🤝 Kontribusi

Kontribusi sangat terbuka! Silakan *fork* repository ini dan buat *Pull Request* jika Anda ingin menambahkan fitur baru.

---

Dibuat dengan ❤️ oleh [**ShiroTenma** & **secretceremony**]

