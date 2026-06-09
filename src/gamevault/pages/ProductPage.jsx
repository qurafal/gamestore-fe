import { BadgeCheck, Receipt, ShieldCheck, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { EmptyState, SectionHeader } from "../components";
import {
  formatDate,
  formatPrice,
  formatPriority,
  getDiscountedPrice,
  pickPalette,
} from "../../appBackend/appBackendUtils";

export const ProductPage = ({
  product,
  isAuthenticated,
  isOwned,
  onOpenPublisher,
  onOpenLibrary,
  onOpenLogin,
  onOpenCheckout,
  onAddWishlist,
  onSubmitReview,
  onMarkHelpful,
  reviewSubmitted,
}) => {
  const [priority, setPriority] = useState("medium");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isRecommend, setIsRecommend] = useState(true);
  const [helpfulReviewId, setHelpfulReviewId] = useState("");
  const accent = pickPalette(product?.id || 0);

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="Pilih game lain dari katalog untuk melihat detailnya."
      />
    );
  }

  const canReview = isAuthenticated && isOwned && !reviewSubmitted;
  const discountedPrice = getDiscountedPrice(product);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
          <div
            className={`overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${accent} p-4`}
          >
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                  {product.ageRating}
                </span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                  Release {formatDate(product.releaseDate)}
                </span>
                {product.publisher ? (
                  <button
                    onClick={() => onOpenPublisher(product.publisher.id)}
                    className="rounded-full border border-white/10 bg-black/30 px-3 py-1"
                  >
                    {product.publisher.name}
                  </button>
                ) : null}
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[160px_1fr]">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                  {product.coverUrl ? (
                    <img
                      src={product.coverUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-black/20 text-sm text-slate-400">
                      No cover uploaded
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                      Game Detail
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">
                      {product.title}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-200">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                    {(product.platforms || []).map((platform) => (
                      <span
                        key={platform.id}
                        className="rounded-full border border-white/10 bg-black/30 px-3 py-1"
                      >
                        {platform.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  {product.discount > 0 ? (
                    <p className="text-sm text-slate-300 line-through">
                      {formatPrice(product.price)}
                    </p>
                  ) : null}
                  <p className="mt-1 text-4xl font-semibold text-white">
                    {formatPrice(discountedPrice)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        onOpenLogin();
                        return;
                      }
                      if (isOwned) {
                        onOpenLibrary();
                        return;
                      }
                      onAddWishlist(product.id, priority);
                    }}
                    className={`rounded-full px-5 py-3 text-sm font-semibold ${
                      isOwned
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : isAuthenticated
                          ? "border border-white/15 text-white"
                          : "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                    }`}
                  >
                    {isOwned
                      ? "Owned"
                      : isAuthenticated
                        ? "Add to Wishlist"
                        : "Login to Wishlist"}
                  </button>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        onOpenLogin();
                        return;
                      }
                      if (isOwned) {
                        onOpenLibrary();
                        return;
                      }
                      onOpenCheckout(product.id);
                    }}
                    className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20"
                  >
                    {isOwned ? "Open Library" : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
              <p className="font-semibold text-slate-100">Publisher</p>
              <button
                type="button"
                onClick={() =>
                  product.publisher && onOpenPublisher(product.publisher.id)
                }
                className="mt-2 text-left text-sky-300 transition hover:text-sky-200 disabled:cursor-default disabled:text-slate-400"
                disabled={!product.publisher}
              >
                {product.publisher?.name || "Not available"}
              </button>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
              <p className="font-semibold text-slate-100">Platforms</p>
              <p className="mt-2 leading-6">
                {(product.platforms || [])
                  .map((platform) => platform.name)
                  .join(", ") || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
          <SectionHeader
            label="Action"
            title="Wishlist Priority"
            description="Backend menerima prioritas saat game pertama kali masuk wishlist."
          />
          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Priority
            </label>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {["high", "medium", "low"].map((value) => (
                <button
                  key={value}
                  onClick={() => setPriority(value)}
                  className={`rounded-2xl border px-3 py-3 text-sm transition ${
                    priority === value
                      ? "border-rose-500/40 bg-rose-500/10 text-white"
                      : "border-white/10 bg-black/25 text-slate-300"
                  }`}
                >
                  {formatPriority(value)}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
            <div className="flex items-center gap-2 text-slate-100">
              <ShoppingBag className="h-4 w-4 text-rose-300" />
              <p className="font-semibold">Checkout flow</p>
            </div>
            <p className="mt-2 leading-6">
              Pembayaran menggunakan balance akan memindahkan game ke library
              secara atomik dan menghapus item terkait dari wishlist.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
            <div className="flex items-center gap-2 text-slate-100">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <p className="font-semibold">Review rule</p>
            </div>
            <p className="mt-2 leading-6">
              Game harus dimiliki dulu sebelum review bisa dikirim. Satu game
              hanya bisa direview sekali per user.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Review
              </p>
              <h3 className="text-2xl font-semibold text-white">
                Submit Your Review
              </h3>
            </div>
            <Receipt className="h-5 w-5 text-rose-300" />
          </div>

          {canReview ? (
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                await onSubmitReview(product.id, {
                  rating: Number(rating),
                  review_text: reviewText,
                  is_recommend: isRecommend,
                });
                setRating(5);
                setReviewText("");
                setIsRecommend(true);
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Recommendation
                  </label>
                  <label className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={isRecommend}
                      onChange={(event) => setIsRecommend(event.target.checked)}
                    />
                    Recommend this game
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Review Text
                </label>
                <textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  rows="5"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="Share your experience..."
                />
              </div>

              <button
                type="submit"
                className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <EmptyState
              title="Review belum tersedia"
              description={
                !isAuthenticated
                  ? "Login untuk membeli game dan membuka form review."
                  : isOwned
                    ? "Review sudah pernah dikirim atau backend menolak duplikasi."
                    : "Beli game ini terlebih dahulu untuk memberikan ulasan."
              }
            />
          )}
        </div>

        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Helpful Vote
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Mark review helpful
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Backend menyediakan endpoint anti-spam untuk helpful vote. Jika
              kamu punya review ID, panel ini bisa digunakan langsung.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Review ID
            </label>
            <input
              value={helpfulReviewId}
              onChange={(event) => setHelpfulReviewId(event.target.value)}
              placeholder="e.g. 12"
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => onMarkHelpful(helpfulReviewId)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20"
            >
              Mark Helpful
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onOpenLibrary()}
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:text-white"
            >
              Open Library
            </button>
            <button
              onClick={() => onOpenCheckout(product.id)}
              className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20"
            >
              Checkout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
