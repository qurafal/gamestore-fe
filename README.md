# GameVault

GameVault adalah frontend toko game digital berbasis React + Vite yang terhubung ke backend GameVault API (`gamestore-be`). Aplikasi ini menyediakan halaman home, browse, store/game detail, wishlist, library, profile, payment, login, register, dan halaman publisher dedicated menggunakan pendekatan Single Page Application (SPA).

## Fitur

- **Navigasi Utama**: Home (carousel banner otomatis & produk diskon), Browse, Library, Wishlist, dan Profile.
- **Katalog Game Dinamis**: Fitur pencarian teks (judul, deskripsi, publisher) serta filter multi-kategori berdasarkan Platform dan Range Harga (Under 200k, 200k - 350k, Above 350k).
- **Halaman Detail Game**: Informasi lengkap game, rating umur, deskripsi, platform, data publisher, serta form interaktif untuk mengirimkan ulasan (*Review*).
- **Sistem Pembayaran Terintegrasi**: Pengalihan alur pembelian (*checkout*) ke halaman pembayaran (*Payment Flow*) dengan pilihan metode kustom (Balance, E-Wallet, Credit Card) sebelum dialihkan kembali ke halaman toko dengan status terbarui (*Owned*).
- **Manajemen Kustomisasi Wishlist**: Tidak hanya menyimpan game ke backend, pengguna juga dapat mengubah tingkat prioritas (*High, Medium, Low*) serta mengatur opsi notifikasi diskon (*Notify on Discount*) secara *real-time*.
- **Manajemen Dompet & Sesi**: Memeriksa detail akun, total koleksi, serta pengisian saldo (*Top Up*) dompet digital.
- **Notifikasi Global**: Umpan balik visual instan menggunakan komponen `Toast` untuk melacak status keberhasilan atau kegagalan aksi pengguna.

## Tech Stack

- **React 18** (Hooks, `useMemo`, `useEffect`, Conditional Routing)
- **Vite** (Build tool cepat & environment variable management)
- **Tailwind CSS** (Utility-first styling & background radial gradient)
- **Lucide React** (Kumpulan ikon antarmuka modern)

## Prasyarat

- Node.js 18+ sangat disarankan
- Backend GameVault API berjalan di lingkungan lokal (`http://localhost:3000`) atau URL *production* di *cloud server* (seperti Render)

## Setup

1. **Install dependency**:
   ```bash
   npm install
   ```

2. **Buat file `.env` di root project dan isi**:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   *Catatan: Ubah nilai di atas jika backend Anda menggunakan URL server production.*

3. **Jalankan frontend dalam mode pengembangan**:
   ```bash
   npm run dev
   ```

4. **Build untuk production**:
   ```bash
   npm run build
   ```

5. **Preview hasil build production**:
   ```bash
   npm run preview
   ```

## Struktur Proyek

Pemisahan tugas (*separation of concerns*) di dalam direktori `src/` disusun secara modular sebagai berikut:

- `src/AppBackend.jsx` — Komponen utama yang bertindak sebagai pengelola state global, fungsi handler API, dan router kondisional SPA.
- `src/api/gamevaultApi.js` — Service layer tunggal sebagai wrapper semua fetch request ke backend API lengkap dengan fungsi normalisasi data.
- `src/main.jsx` — Entrypoint utama React untuk merender aplikasi ke DOM root.
- `src/appBackend/` — Folder anak (*child directory*) yang mengisolasi komponen UI dan utilitas:
  - `src/appBackend/appBackendComponents.jsx` — Kumpulan komponen visual murni bersifit *stateless/dumb components* (`Navbar`, `ProductCard`, `SectionHeader`, `Toast`).
  - `src/appBackend/appBackendUtils.js` — Kumpulan fungsi utilitas murni seperti pemformat harga Rupiah, kalkulasi harga diskon, penentu palet warna kartu, dan penanganan state toast.

## Alur Program

- **Autentikasi & Manajemen Sesi**: Pengguna melakukan login/register menembak API auth backend. Token JWT yang dikembalikan disimpan dengan aman di `window.localStorage`. Setiap aplikasi dimuat ulang, aplikasi membaca token tersebut dan memperbarui sesi pengguna (Profil, Wishlist, dan Library) secara paralel menggunakan `Promise.all`.
- **Pengambilan & Perlindungan Data**: Data game diambil langsung dari API katalog backend. Fungsi normalisasi data menjamin komponen UI frontend tidak *crash* jika terdapat properti objek database yang kosong atau berubah.
- **Interaksi Antarmuka**: Tombol nama atau ID publisher di halaman store akan mengarahkan pengguna ke halaman publisher dedicated.
- **Transaksi & Sinkronisasi**: Operasi checkout, penambahan wishlist, pembaruan prioritas wishlist, top up dompet, dan pengiriman review diproses langsung melalui HTTP Method (`GET`, `POST`, `PUT`) ke backend. Setelah operasi berhasil, state aplikasi akan memicu pemanggilan ulang sesi pengguna untuk memastikan visual data di frontend tetap sinkron dengan isi database MySQL.