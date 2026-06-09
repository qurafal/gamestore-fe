import { CheckCircle2, Coins, Trash2, Upload, UserCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, SectionHeader } from "../components";
import { DEFAULT_AVATAR_URL } from "../../api/gamevaultApi";
import {
  formatDate,
  formatPrice,
  formatPriority,
} from "../../appBackend/appBackendUtils";

export const WishlistPage = ({
  wishlist,
  isAuthenticated,
  onOpenProduct,
  onOpenCheckout,
  onLogin,
  onDeleteWishlist,
  onBulkDeleteWishlists,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const totalSelected = selectedIds.length;

  const toggleSelection = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  };

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Wishlist locked"
        description="Login untuk menyimpan game incaran dan mengatur prioritas wishlist dari backend."
        action={
          <button
            onClick={onLogin}
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Login
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        label="Favorites"
        title="Wishlist"
        description="Item disimpan per game dengan prioritas, lalu bisa dihapus satu atau bulk sesuai kebutuhan."
        action={
          totalSelected > 0 ? (
            <button
              onClick={async () => {
                await onBulkDeleteWishlists(selectedIds);
                setSelectedIds([]);
              }}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-500/40 hover:text-white"
            >
              Delete Selected ({totalSelected})
            </button>
          ) : null
        }
      />

      {wishlist.length === 0 ? (
        <EmptyState
          title="Wishlist masih kosong"
          description="Tambahkan game dari halaman detail produk lalu pilih prioritas yang sesuai."
        />
      ) : (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-5 md:flex-row md:items-center md:justify-between"
            >
              <label className="flex items-start gap-3 md:flex-1">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="mt-1 rounded border-white/10 bg-black/30 text-rose-500 focus:ring-rose-500/50"
                />
                <div className="space-y-2">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.product.publisher?.name || "Unknown publisher"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1">
                      Priority: {formatPriority(item.priority)}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1">
                      Notify discount: {item.notifyDiscount ? "On" : "Off"}
                    </span>
                  </div>
                </div>
              </label>

              <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-end">
                <button
                  onClick={() => onOpenProduct(item.product.id)}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:text-white"
                >
                  Open Store
                </button>
                <button
                  onClick={() => onOpenCheckout(item.product.id)}
                  className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-500/20"
                >
                  Buy Now
                </button>
                <button
                  onClick={async () => {
                    await onDeleteWishlist(item.id);
                  }}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:border-rose-500/40 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const LibraryPage = ({
  library,
  isAuthenticated,
  onOpenProduct,
  onLogin,
}) => {
  const orderedLibrary = useMemo(
    () =>
      [...library].sort(
        (left, right) => new Date(right.acquiredAt) - new Date(left.acquiredAt),
      ),
    [library],
  );

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Library locked"
        description="Login untuk melihat game yang sudah dimiliki dan diurutkan berdasarkan waktu perolehan."
        action={
          <button
            onClick={onLogin}
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Login
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        label="Collection"
        title="Library"
        description="Game yang sudah dimiliki ditampilkan kronologis berdasarkan acquired_at dari backend."
      />

      {orderedLibrary.length === 0 ? (
        <EmptyState
          title="Library masih kosong"
          description="Setelah checkout berhasil, game yang dibeli akan muncul di sini secara otomatis."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orderedLibrary.map((item) => (
            <div
              key={item.id}
              className="rounded-[2rem] border border-white/10 bg-carbon/80 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    Acquired {formatDate(item.acquiredAt)}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => onOpenProduct(item.product.id)}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:text-white"
                >
                  Open Store
                </button>
                <button className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white">
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProfilePage = ({
  user,
  libraryCount,
  wishlistCount,
  onTopUp,
  onUploadAvatar,
  onNavigate,
}) => {
  const [amount, setAmount] = useState(100000);
  const [method, setMethod] = useState("ewallet");
  const [avatarFile, setAvatarFile] = useState(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
        <SectionHeader
          label="Account"
          title="Profile"
          description="Ringkasan akun, wallet, dan penggantian avatar lewat upload multipart."
        />
        <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 text-slate-200">
            <img
              src={user.avatarUrl || DEFAULT_AVATAR_URL}
              alt={user.username}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Username
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {user.username}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500">
              Email
            </p>
            <p className="mt-1 text-sm text-white">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Saldo
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {formatPrice(user.balance)}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Library
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {libraryCount}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Wishlist
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {wishlistCount}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-100">Transaksi</p>
          <p className="mt-2 leading-6">
            Top up balance terhubung langsung ke endpoint wallet backend.
            Setelah sukses, profil akan disinkronkan ulang.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
        <SectionHeader
          label="Wallet"
          title="Top Up & Avatar"
          description="Form ini mengikuti payload backend yang dipakai di dokumentasi."
        />
        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            min="10000"
            onChange={(event) => setAmount(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Payment Method
          </label>
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none"
          >
            <option value="ewallet">E-Wallet</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        <button
          onClick={() => onTopUp(amount, method)}
          className="flex items-center justify-center gap-2 rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20"
        >
          <Coins className="h-4 w-4" />
          Confirm Top Up
        </button>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Upload className="h-4 w-4 text-rose-300" />
            Update Avatar
          </p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
            className="mt-3 block w-full text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
          />
          <button
            onClick={() => avatarFile && onUploadAvatar(avatarFile)}
            disabled={!avatarFile}
            className="mt-3 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Upload Avatar
          </button>
        </div>

        <button
          onClick={() => onNavigate("library")}
          className="rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Open Library
        </button>
      </section>
    </div>
  );
};
