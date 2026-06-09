import { useState } from "react";

export const PublisherPage = ({
  publisher,
  products,
  onOpenProduct,
  onCreateProduct,
  onUploadProductCover,
  canManagePublisher,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // State Form
  const [studioName, setStudioName] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [newProductId, setNewProductId] = useState(null);
  
  // State Media
  const [coverFile, setCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const resetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setStudioName("");
      setTitle("");
      setPrice("");
      setNewProductId(null);
      setCoverFile(null);
      setPreviewUrl(null);
    }, 300);
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!canManagePublisher && !studioName) return;
    if (!title || !price) return;
    
    setLoading(true);
    try {
      const createdGame = await onCreateProduct({ 
        title, 
        price, 
        studioName: !canManagePublisher ? studioName : undefined 
      });
      
      if (createdGame && createdGame.id) {
        setNewProductId(createdGame.id);
        setStep(2);
      }
    } catch (error) {
      // Error ditangani oleh toast
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleStep2Submit = async () => {
    if (!coverFile || !newProductId) return;
    setLoading(true);
    try {
      await onUploadProductCover(newProductId, coverFile);
      resetModal();
    } catch (error) {
      // Error ditangani toast
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FUNGSI RENDER MODAL (Mencegah Lose Focus Bug)
  // ==========================================
  const renderModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => !loading && resetModal()} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f1115] shadow-2xl shadow-black ring-1 ring-white/10 animate-in zoom-in-95 duration-200">
        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {!canManagePublisher ? "Registrasi Studio" : "Identitas Karya"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Langkah 1 dari 2: {!canManagePublisher ? "Beri nama studio Anda dan judul game pertama." : "Tentukan judul dan harga game Anda."}
                </p>
              </div>

              <div className="space-y-4">
                {/* INPUT NAMA STUDIO KHUSUS ONBOARDING */}
                {!canManagePublisher && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="mb-1.5 block text-sm font-medium text-blue-400">Nama Studio (Publisher)</label>
                    <input
                      type="text"
                      required
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      disabled={loading}
                      className="w-full cursor-text rounded-xl border border-blue-500/30 bg-blue-500/5 px-4 py-3.5 text-white outline-none transition-all focus:border-blue-500 focus:bg-blue-500/10 disabled:opacity-50"
                      placeholder="Contoh: Nusantara Interactive"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Judul Game</label>
                  <input
                    type="text"
                    required
                    autoFocus={canManagePublisher}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    className="w-full cursor-text rounded-xl border border-white/10 bg-black/50 px-4 py-3.5 text-white outline-none transition-all focus:border-blue-500 focus:bg-white/5 disabled:opacity-50"
                    placeholder="Judul game Anda"
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Harga (Rupiah)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={loading}
                    className="w-full cursor-text rounded-xl border border-white/10 bg-black/50 px-4 py-3.5 text-white outline-none transition-all focus:border-blue-500 focus:bg-white/5 disabled:opacity-50"
                    placeholder="150000"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetModal}
                  disabled={loading}
                  className="w-1/3 cursor-pointer rounded-xl bg-white/5 py-3.5 font-medium text-slate-300 transition-all hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !title || !price || (!canManagePublisher && !studioName)}
                  className="w-2/3 cursor-pointer rounded-xl bg-blue-600 py-3.5 font-medium text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Memproses..." : "Lanjut ke Cover"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Visualisasi Game</h2>
                <p className="mt-1 text-sm text-slate-400">Langkah 2 dari 2: Unggah gambar kover (16:9).</p>
              </div>

              <label className="group relative flex h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-black/30 transition-all hover:border-blue-500 hover:bg-white/5">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto mb-3 h-10 w-10 text-slate-500 transition-colors group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm font-medium text-slate-300">Klik untuk mencari gambar</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => resetModal()}
                  disabled={loading}
                  className="w-1/3 cursor-pointer rounded-xl bg-white/5 py-3.5 font-medium text-slate-300 transition-all hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Nanti Saja
                </button>
                <button
                  type="button"
                  onClick={handleStep2Submit}
                  disabled={loading || !coverFile}
                  className="w-2/3 cursor-pointer rounded-xl bg-blue-600 py-3.5 font-medium text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Mengunggah..." : "Rilis Sekarang"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ==========================================
  // TAMPILAN ONBOARDING (Jika belum jadi Publisher)
  // ==========================================
  if (!canManagePublisher) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20 text-center animate-in fade-in duration-700 md:py-32">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10 text-blue-500 ring-1 ring-blue-500/20">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Rilis Mahakarya Anda
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          Bergabunglah dengan kreator lain di GameVault. Buat studio Anda sendiri, unggah game pertama Anda, dan mulai hasilkan pendapatan hari ini juga.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-10 group relative flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-black shadow-lg transition-all hover:scale-105 hover:bg-slate-200 active:scale-95"
        >
          Mulai Perjalanan Kreator
          <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {isModalOpen && renderModal()}
      </div>
    );
  }

  // ==========================================
  // TAMPILAN DASHBOARD (Jika sudah jadi Publisher)
  // ==========================================
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 animate-in fade-in duration-500 md:px-8">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {publisher?.name || "Studio Anda"}
          </h1>
          <p className="mt-2 text-slate-400">
            Kelola katalog game dan rilis karya terbaru Anda ke dunia.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 ease-out hover:bg-blue-500 active:scale-[0.97]"
        >
          <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Rilis Game Baru
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onOpenProduct(product.id)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-black/40"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
              {product.coverUrl ? (
                <img src={product.coverUrl} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-600">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="truncate text-lg font-semibold text-slate-100 transition-colors group-hover:text-blue-400">
                {product.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-emerald-400">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500">
            <p>Belum ada game yang dirilis.</p>
          </div>
        )}
      </div>

      {isModalOpen && renderModal()}
    </div>
  );
};