import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, ProductCard, SectionHeader } from "../components";
import { getDiscountedPrice } from "../../appBackend/appBackendUtils";

export const BrowsePage = ({ products, onOpenProduct, onSearchCatalog }) => {
  const [searchInput, setSearchInput] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const platforms = useMemo(
    () => [
      "All",
      ...new Set(
        products.flatMap((product) =>
          product.platforms.map((platform) => platform.name),
        ),
      ),
    ],
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesPlatform =
        platformFilter === "All" ||
        product.platforms.some((platform) => platform.name === platformFilter);
      const discountedPrice = getDiscountedPrice(product);
      const matchesPrice =
        priceFilter === "All" ||
        (priceFilter === "Under 200k" && discountedPrice < 200000) ||
        (priceFilter === "200k - 350k" &&
          discountedPrice >= 200000 &&
          discountedPrice <= 350000) ||
        (priceFilter === "Above 350k" && discountedPrice > 350000);

      return matchesPlatform && matchesPrice;
    });
  }, [platformFilter, priceFilter, products]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchCatalog(searchInput.trim());
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-5">
        <SectionHeader
          label="Filters"
          title="Refine Catalog"
          description="Bisa search dari backend, lalu diperkecil lagi secara lokal."
        />
        <div className="space-y-4 text-sm text-slate-300">
          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Platform
            </label>
            <select
              value={platformFilter}
              onChange={(event) => setPlatformFilter(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 outline-none transition focus:border-rose-500/40"
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Price Range
            </label>
            <select
              value={priceFilter}
              onChange={(event) => setPriceFilter(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 outline-none transition focus:border-rose-500/40"
            >
              <option value="All">All</option>
              <option value="Under 200k">Under 200k</option>
              <option value="200k - 350k">200k - 350k</option>
              <option value="Above 350k">Above 350k</option>
            </select>
          </div>
          <button
            onClick={() => {
              setSearchInput("");
              setPlatformFilter("All");
              setPriceFilter("All");
              onSearchCatalog("");
            }}
            className="w-full rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Reset Search
          </button>
        </div>
      </aside>

      <section className="space-y-5">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/10 bg-carbon/80 p-4"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search title, description, or publisher..."
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Search
            </button>
          </div>
        </form>

        {filteredProducts.length === 0 ? (
          <EmptyState
            title="Tidak ada hasil"
            description="Coba ubah kata kunci search atau filter platform/harga untuk menemukan produk yang cocok."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
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
