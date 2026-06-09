import {
  BadgeCheck,
  Gamepad2,
  Heart,
  Home,
  Library,
  LogIn,
  LogOut,
  Search,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";
import {
  formatPrice,
  getDiscountedPrice,
  pickPalette,
} from "../appBackend/appBackendUtils";

export const SectionHeader = ({ label, title, description, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ember/70">
        {label}
      </p>
      <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm text-slate-400">{description}</p>
      ) : null}
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);

export const StatCard = ({ label, value, hint, icon: Icon, tone = "rose" }) => {
  const toneMap = {
    rose: "from-rose-500/20 to-orange-500/10 border-rose-500/20",
    teal: "from-teal-500/20 to-cyan-500/10 border-teal-500/20",
    amber: "from-amber-500/20 to-yellow-500/10 border-amber-500/20",
  };

  return (
    <div
      className={`rounded-3xl border bg-gradient-to-br p-4 ${toneMap[tone] || toneMap.rose}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
          {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-slate-50">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const Toast = ({ toast }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${
      toast.kind === "error"
        ? "border-rose-500/40 bg-rose-500/15 text-rose-100"
        : "border-emerald-500/40 bg-emerald-500/15 text-emerald-50"
    }`}
  >
    {toast.message}
  </div>
);

export const AppNavbar = ({
  activePage,
  onNavigate,
  isAuthenticated,
  user,
  onLogout,
}) => {
  const isPublisher = user?.role === "PUBLISHER";
  const items = isAuthenticated
    ? [
        { key: "home", label: "Home", icon: Home },
        { key: "browse", label: "Browse", icon: Search },
        ...(isPublisher
          ? [{ key: "publisher", label: "Publisher", icon: Sparkles }]
          : [{key: "publisher", label: "Mulai Jual Game", icon: Sparkles}]),
        { key: "library", label: "Library", icon: Library },
        { key: "wishlist", label: "Wishlist", icon: Heart },
        { key: "profile", label: "Profile", icon: User },
      ]
    : [
        { key: "home", label: "Home", icon: Home },
        { key: "browse", label: "Browse", icon: Search },
        { key: "wishlist", label: "Wishlist", icon: Heart },
        { key: "login", label: "Login", icon: LogIn },
        { key: "register", label: "Register", icon: UserPlus },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-carbon/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/20 to-orange-500/10 text-rose-200 shadow-glow">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-50">GameVault</p>
            <p className="text-xs text-slate-500">
              Backend-connected digital store
            </p>
          </div>
        </button>

        <nav className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-300">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-2 transition ${
                  activePage === item.key
                    ? "border border-white/10 bg-white/10 text-white shadow-lg shadow-black/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div className="hidden text-right sm:block">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Balance
              </p>
              <p className="text-sm font-semibold text-slate-100">
                {formatPrice(user.balance)}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-rose-500/20 to-orange-500/10 text-slate-100">
              <img
                src={user.avatarUrl || DEFAULT_AVATAR_URL}
                alt={user.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-100">
                {user.username}
              </p>
              <p className="text-xs text-slate-500">{user.role || "USER"}</p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-rose-500/40 hover:text-white"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("login")}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-500/40 hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export const ProductCard = ({
  product,
  onOpen,
  onPrimaryAction,
  primaryLabel,
  secondaryLabel,
  isOwned = false,
}) => {
  const discountedPrice = getDiscountedPrice(product);
  const accent = pickPalette(product.id);

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-carbon/75 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-rose-500/30">
      <div className={`relative h-48 bg-gradient-to-br ${accent} p-4`}>
        <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                {product.ageRating}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                {product.title}
              </h3>
            </div>
            {product.discount > 0 ? (
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white">
                -{product.discount}%
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-200">
            {(product.platforms || []).slice(0, 3).map((platform) => (
              <span
                key={platform.id}
                className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1"
              >
                {platform.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <p className="line-clamp-2 text-sm text-slate-400">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div>
            {product.discount > 0 ? (
              <p className="text-xs text-slate-500 line-through">
                {formatPrice(product.price)}
              </p>
            ) : null}
            <p className="text-lg font-semibold text-slate-100">
              {formatPrice(discountedPrice)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpen(product.id)}
              className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              Detail
            </button>
            <button
              onClick={() => onPrimaryAction(product.id)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                isOwned
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
              }`}
            >
              {isOwned ? primaryLabel || "Owned" : secondaryLabel || "Open"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export const EmptyState = ({ title, description, action }) => (
  <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-sm text-slate-400">
    <p className="text-base font-semibold text-slate-100">{title}</p>
    <p className="mt-2 max-w-xl">{description}</p>
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);

export const ShellFrame = ({ children, loading = false, error = "" }) => (
  <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-10 md:px-8">
    {error ? (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
        {error}
      </div>
    ) : null}
    {loading ? (
      <div className="rounded-3xl border border-white/10 bg-black/20 px-6 py-4 text-sm text-slate-300">
        Loading GameVault...
      </div>
    ) : null}
    {children}
  </main>
);
