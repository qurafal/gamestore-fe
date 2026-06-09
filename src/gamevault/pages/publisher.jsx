import { PlusCircle, Upload } from "lucide-react";
import { useState } from "react";
import { EmptyState, ProductCard, SectionHeader } from "../components";

export const PublisherPage = ({
  publisher,
  products,
  onOpenProduct,
  onBack,
  onCreateProduct,
  onUploadProductCover,
  canManagePublisher,
}) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(150000);
  const [coverProductId, setCoverProductId] = useState("");
  const [coverFile, setCoverFile] = useState(null);

  const hasPublisherAccess = Boolean(canManagePublisher && publisher);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <SectionHeader
              label="Publisher"
              title={
                hasPublisherAccess ? publisher.name : "Publisher Dashboard"
              }
              description={
                hasPublisherAccess
                  ? "Dashboard ini hanya untuk publisher yang terafiliasi dengan akun yang sedang login."
                  : "Akses publisher hanya tersedia untuk akun dengan role PUBLISHER dan publisher yang terikat ke akun itu."
              }
            />
          </div>
          <button
            onClick={onBack}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Back to Store
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {hasPublisherAccess ? (
            <>
              <form
                className="space-y-4 rounded-[1.75rem] border border-white/10 bg-black/20 p-5"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await onCreateProduct({ title, price: Number(price) });
                  setTitle("");
                  setPrice(150000);
                }}
              >
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                    <PlusCircle className="h-4 w-4 text-rose-300" />
                    Create New Game
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Judul dan harga dikirim langsung ke endpoint create product
                    backend.
                  </p>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none"
                    placeholder="Cyberpunk Surabaya"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Price
                  </label>
                  <input
                    type="number"
                    min="1000"
                    value={price}
                    onChange={(event) => setPrice(Number(event.target.value))}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20"
                >
                  Publish Game
                </button>
              </form>

              <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                    <Upload className="h-4 w-4 text-rose-300" />
                    Upload Game Cover
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Upload multipart langsung ke endpoint cover untuk produk
                    yang sudah ada.
                  </p>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Product
                  </label>
                  <select
                    value={coverProductId}
                    onChange={(event) => setCoverProductId(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none"
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      setCoverFile(event.target.files?.[0] || null)
                    }
                    className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
                  />
                </div>

                <button
                  type="button"
                  disabled={!coverFile || !coverProductId}
                  onClick={() =>
                    onUploadProductCover(Number(coverProductId), coverFile)
                  }
                  className="rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Upload Cover
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              title="Akses publisher dibatasi"
              description="Hanya akun dengan role PUBLISHER dan publisher yang terhubung ke akun ini yang boleh mengelola game."
            />
          )}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          label="Games"
          title="Publisher Catalog"
          description="Daftar game yang sedang ditampilkan untuk publisher yang dipilih dari katalog."
        />
        {products.length === 0 ? (
          <EmptyState
            title="Belum ada game"
            description={
              hasPublisherAccess
                ? "Setelah create product, daftar ini akan terisi otomatis dari backend."
                : "Dashboard publisher tidak tersedia untuk akun ini."
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={onOpenProduct}
                onPrimaryAction={() => onOpenProduct(product.id)}
                secondaryLabel="Open"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
