import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Library,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ProductCard,
  SectionHeader,
  StatCard,
  EmptyState,
} from "../components";
import {
  formatPrice,
  getDiscountedPrice,
  pickPalette,
} from "../../appBackend/appBackendUtils";

export const HomePage = ({
  products,
  featuredProduct,
  onOpenProduct,
  isAuthenticated,
  ownedCount,
  wishlistCount,
  balance,
}) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const hero = featuredProduct || products[0] || null;

  useEffect(() => {
    if (!products.length) return;
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % products.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [products.length]);

  const heroProduct = products[heroIndex] || hero;
  const topDeals = [...products]
    .sort((a, b) => b.discount - a.discount || a.price - b.price)
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div
          className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${pickPalette(heroProduct?.id || 0)} p-4 lg:p-6`}
        >
          {heroProduct ? (
            <div className="flex min-h-[520px] flex-col justify-between rounded-[1.75rem] border border-white/10 bg-black/25 p-5 backdrop-blur-sm lg:p-7">
              
              {/* --- IMAGE HERO SECTION --- */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black/40 shadow-inner mb-4">
                {heroProduct.coverUrl ? (
                  <img 
                    src={heroProduct.coverUrl} 
                    alt={heroProduct.title} 
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600">
                    <span className="text-sm">No Preview Available</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() =>
                    setHeroIndex((current) =>
                      current === 0 ? products.length - 1 : current - 1,
                    )
                  }
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                    Featured Game
                  </p>
                  <h1 className="mt-1 text-xl font-semibold text-white md:text-2xl">
                    {heroProduct.title}
                  </h1>
                </div>
                <button
                  onClick={() =>
                    setHeroIndex((current) => (current + 1) % products.length)
                  }
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-base line-clamp-2">
                  {heroProduct.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                  {(heroProduct.platforms || []).map((platform) => (
                    <span
                      key={platform.id}
                      className="rounded-full border border-white/10 bg-black/30 px-3 py-1"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  {heroProduct.discount > 0 ? (
                    <p className="text-sm text-slate-300 line-through">
                      {formatPrice(heroProduct.price)}
                    </p>
                  ) : null}
                  <p className="mt-1 text-4xl font-semibold text-white">
                    {formatPrice(getDiscountedPrice(heroProduct))}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-300">
                    {heroProduct.publisher?.name || "Unknown Studio"}
                  </p>
                </div>
                <button
                  onClick={() => onOpenProduct(heroProduct.id)}
                  className="rounded-full border border-white/15 bg-black/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/35"
                >
                  Open Store Page
                </button>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Katalog belum dimuat"
              description="Backend belum mengirim data produk."
            />
          )}
        </div>

        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-5 lg:p-6">
          <SectionHeader
            label="At A Glance"
            title="Snapshot"
            description="Ringkasan akun dan katalog."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <StatCard label="Owned Games" value={ownedCount} hint="Library pribadi" icon={Library} tone="teal" />
            <StatCard label="Wishlist" value={wishlistCount} hint="Game incaran" icon={Heart} tone="rose" />
            <StatCard label="Wallet" value={formatPrice(balance)} hint={isAuthenticated ? "Tersambung" : "Login dulu"} icon={Wallet} tone="amber" />
            <StatCard label="Catalog" value={products.length} hint="Produk publik" icon={Sparkles} tone="teal" />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader
          label="Top Deals"
          title="Diskon Tertinggi"
          description="Produk dengan penawaran terbaik saat ini."
        />
        {topDeals.length === 0 ? (
          <EmptyState title="Belum ada deal" description="Cek nanti lagi!" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topDeals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={onOpenProduct}
                onBuy={() => onOpenProduct(product.id)}
                isOwned={false}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};