# GameVault

GameVault adalah frontend toko game digital berbasis React + Vite yang terhubung ke backend GameVault API. Aplikasi ini menyediakan halaman home, browse, store/game detail, wishlist, library, profile, payment, login, register, dan halaman publisher dedicated.

## Fitur

- Navigasi utama: Home, Browse, Library, Wishlist, Profile
- Katalog game dengan pencarian dan filter
- Halaman detail game dengan akses wishlist, pembelian, dan review
- Redirect pembelian ke flow payment lalu kembali ke store
- Halaman publisher dedicated yang menampilkan game milik satu publisher
- Integrasi API backend untuk auth, wishlist, library, top up, checkout, dan review

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React

## Prasyarat

- Node.js 18+ disarankan
- Backend GameVault API berjalan di `http://localhost:3000` atau URL lain yang kamu tentukan

## Setup

1. Install dependency:

   ```bash
   npm install
   ```

2. Buat file `.env` di root project dan isi:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Jalankan frontend:

   ```bash
   npm run dev
   ```

4. Build untuk production:

   ```bash
   npm run build
   ```

5. Preview hasil build:

   ```bash
   npm run preview
   ```

## Catatan Git

File yang sebaiknya tidak di-commit:

- `node_modules/`
- `dist/`
- `.env`
- log instalasi / runtime
- file editor/OS sementara seperti `.vscode/`, `.idea/`, `.DS_Store`, dan `Thumbs.db`

## Struktur Singkat

- `src/AppBackend.jsx` — UI utama yang terhubung ke backend
- `src/api/gamevaultApi.js` — wrapper API dan helper normalisasi data
- `src/main.jsx` — entrypoint React

## Alur Singkat

- Login/register memakai backend
- Data game diambil dari API backend
- Tombol publisher di halaman store membuka halaman publisher dedicated
- Checkout dan wishlist tetap diproses lewat backend

## Lisensi

Belum ditentukan.
