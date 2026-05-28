import { useEffect, useMemo, useState } from 'react'
import {
  BadgeCheck,
  Banknote,
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Gamepad2,
  Heart,
  Home,
  Library,
  LogIn,
  LogOut,
  Monitor,
  Play,
  Receipt,
  Search,
  Shield,
  ShoppingBag,
  Star,
  Tag,
  User,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'

const mockData = {
  user: {
    id: 'user-001',
    username: 'RavenStride',
    email: 'ravenstride@gamevault.id',
    balance: 1250000,
    level: 'Platinum',
    memberSince: '2022',
    status: 'Online',
  },
  publishers: [
    {
      id: 'pub-aurora',
      name: 'Aurora Forge',
      bio: 'Indie-first studio focused on atmospheric sci-fi and high-fidelity storytelling.',
      founded: 2016,
      followers: 148000,
      banner:
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'pub-iron',
      name: 'Ironclad Works',
      bio: 'Tactical strategy publisher with a competitive esports pipeline.',
      founded: 2012,
      followers: 231000,
      banner:
        'https://images.unsplash.com/photo-1487837647815-bbc1f30cd0d2?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'pub-storm',
      name: 'Stormgate Labs',
      bio: 'Premium action RPG titles with long-term seasonal support.',
      founded: 2019,
      followers: 94000,
      banner:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop',
    },
  ],
  games: [
    {
      id: 'gv-001',
      title: 'Nebula Drift',
      description:
        'Command an elite salvage crew in a neon-lit galaxy of rogue AI and drifting megastructures.',
      price: 399000,
      discountPercent: 35,
      releaseDate: '2024-02-10',
      platforms: ['Windows', 'Mac'],
      rating: 4.7,
      ageRating: 'Teen',
      publisherId: 'pub-aurora',
      genres: ['Action', 'Sci-Fi'],
      banner:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
      cover:
        'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=800&auto=format&fit=crop',
      trending: true,
      topSeller: true,
      featured: true,
      hero: true,
      heroTag: 'Galaxy Sale 35%',
    },
    {
      id: 'gv-002',
      title: 'Ironclad Protocol',
      description:
        'Lead a mercenary battalion through tactical conflicts and dynamic weather warfare.',
      price: 299000,
      discountPercent: 0,
      releaseDate: '2023-11-05',
      platforms: ['Windows', 'Linux'],
      rating: 4.4,
      ageRating: 'Mature',
      publisherId: 'pub-iron',
      genres: ['Strategy', 'Simulation'],
      banner:
        'https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=1600&auto=format&fit=crop',
      cover:
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=800&auto=format&fit=crop',
      trending: true,
      topSeller: true,
      featured: false,
      hero: false,
      heroTag: 'Commander Edition',
    },
    {
      id: 'gv-003',
      title: 'Mythic Vale',
      description:
        'Explore a living fantasy realm with branching story arcs and co-op raids.',
      price: 449000,
      discountPercent: 20,
      releaseDate: '2024-06-21',
      platforms: ['Windows'],
      rating: 4.8,
      ageRating: 'Teen',
      publisherId: 'pub-storm',
      genres: ['RPG', 'Adventure'],
      banner:
        'https://images.unsplash.com/photo-1523598455549-659d97c4490f?q=80&w=1600&auto=format&fit=crop',
      cover:
        'https://images.unsplash.com/photo-1519643225200-94e79e383724?q=80&w=800&auto=format&fit=crop',
      trending: true,
      topSeller: false,
      featured: true,
      hero: true,
      heroTag: 'Season Pass Live',
    },
    {
      id: 'gv-004',
      title: 'Street Circuit X',
      description:
        'Underground racing league with dynamic city weather and tuned vehicle physics.',
      price: 259000,
      discountPercent: 15,
      releaseDate: '2023-09-12',
      platforms: ['Windows', 'Mac'],
      rating: 4.3,
      ageRating: 'Teen',
      publisherId: 'pub-aurora',
      genres: ['Racing', 'Sports'],
      banner:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      cover:
        'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop',
      trending: false,
      topSeller: true,
      featured: false,
      hero: false,
      heroTag: 'Turbo Week',
    },
    {
      id: 'gv-005',
      title: 'Ghost Signal',
      description:
        'Survive a deep space distress signal with co-op stealth and tactical horror.',
      price: 319000,
      discountPercent: 0,
      releaseDate: '2024-01-30',
      platforms: ['Windows', 'Linux'],
      rating: 4.1,
      ageRating: 'Mature',
      publisherId: 'pub-aurora',
      genres: ['Horror', 'Survival'],
      banner:
        'https://images.unsplash.com/photo-1451186859696-371d9477be93?q=80&w=1600&auto=format&fit=crop',
      cover:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
      trending: false,
      topSeller: false,
      featured: true,
      hero: false,
      heroTag: 'New Expansion',
    },
    {
      id: 'gv-006',
      title: 'Skyforge Reborn',
      description:
        'Forge floating cities and command sky-fleets in a persistent MMO world.',
      price: 499000,
      discountPercent: 10,
      releaseDate: '2024-03-18',
      platforms: ['Windows', 'Mac'],
      rating: 4.5,
      ageRating: 'Teen',
      publisherId: 'pub-storm',
      genres: ['MMO', 'Strategy'],
      banner:
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop',
      cover:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
      trending: true,
      topSeller: false,
      featured: true,
      hero: false,
      heroTag: 'Founders Pack',
    },
    {
      id: 'gv-007',
      title: 'Pixel Bastion',
      description:
        'Retro-inspired tower defense with deep upgrades and rogue-lite runs.',
      price: 149000,
      discountPercent: 0,
      releaseDate: '2022-12-15',
      platforms: ['Windows', 'Mac', 'Linux'],
      rating: 4.0,
      ageRating: 'Everyone',
      publisherId: 'pub-iron',
      genres: ['Indie', 'Strategy'],
      banner:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop',
      cover:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
      trending: false,
      topSeller: false,
      featured: false,
      hero: false,
      heroTag: 'Indie Pick',
    },
    {
      id: 'gv-008',
      title: 'Aether Clash',
      description:
        'Competitive arena brawler featuring 5v5 skirmishes and seasonal ladders.',
      price: 279000,
      discountPercent: 25,
      releaseDate: '2023-06-02',
      platforms: ['Windows'],
      rating: 4.2,
      ageRating: 'Teen',
      publisherId: 'pub-iron',
      genres: ['Action', 'MOBA'],
      banner:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      cover:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
      trending: true,
      topSeller: true,
      featured: false,
      hero: false,
      heroTag: 'Season 8',
    },
  ],
  wishlist: [
    { gameId: 'gv-004', priority: 'High', notifyOnSale: true },
    { gameId: 'gv-006', priority: 'Medium', notifyOnSale: false },
    { gameId: 'gv-007', priority: 'Low', notifyOnSale: true },
  ],
  transactions: [
    {
      id: 'INV-20250114-8812',
      gameId: 'gv-003',
      date: '2025-01-14',
      method: 'Balance',
      pricePaid: 359200,
    },
    {
      id: 'INV-20241220-4410',
      gameId: 'gv-002',
      date: '2024-12-20',
      method: 'Credit Card',
      pricePaid: 299000,
    },
  ],
  reviews: [
    {
      id: 'rev-001',
      gameId: 'gv-002',
      userId: 'user-015',
      username: 'Skyfall',
      rating: 4,
      text: 'Strategic depth feels great, especially with the weather system.',
      recommended: true,
      helpful: 12,
    },
    {
      id: 'rev-002',
      gameId: 'gv-003',
      userId: 'user-022',
      username: 'Vanta',
      rating: 5,
      text: 'The co-op raids are incredible and the art direction is stunning.',
      recommended: true,
      helpful: 18,
    },
  ],
}

const priorityStyles = {
  High: 'border-red-500/50 bg-red-500/15 text-red-200',
  Medium: 'border-amber-500/50 bg-amber-500/15 text-amber-200',
  Low: 'border-sky-500/50 bg-sky-500/15 text-sky-200',
}

const getNavItems = (isAuthenticated) =>
  isAuthenticated
    ? [
        { key: 'home', label: 'Home', icon: Home },
        { key: 'browse', label: 'Browse', icon: Search },
        { key: 'library', label: 'Library', icon: Library },
        { key: 'wishlist', label: 'Wishlist', icon: Heart },
        { key: 'profile', label: 'Profile', icon: User },
      ]
    : [
        { key: 'home', label: 'Home', icon: Home },
        { key: 'browse', label: 'Browse', icon: Search },
        { key: 'library', label: 'Library', icon: Library },
        { key: 'wishlist', label: 'Wishlist', icon: Heart },
        { key: 'login', label: 'Login', icon: LogIn },
        { key: 'register', label: 'Register', icon: UserPlus },
      ]

const formatPrice = (value) => `Rp ${value.toLocaleString('id-ID')}`

const getDiscountedPrice = (game) =>
  game.discountPercent > 0
    ? Math.round(game.price * (1 - game.discountPercent / 100))
    : game.price

const getPlatformIcon = (platform) => {
  if (platform === 'Mac') {
    return <Monitor className="h-4 w-4 text-slate-300" />
  }
  if (platform === 'Linux') {
    return <Shield className="h-4 w-4 text-slate-300" />
  }
  return <Monitor className="h-4 w-4 text-slate-300" />
}

const Toast = ({ message }) => (
  <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-ember/50 bg-graphite px-5 py-3 text-sm shadow-glow">
    {message}
  </div>
)

const SectionHeader = ({ label, title, action }) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
    </div>
    {action && <div>{action}</div>}
  </div>
)

const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-1 text-amber-400">
    {Array.from({ length: 5 }).map((_, index) => {
      const filled = rating >= index + 1
      return (
        <Star
          key={index}
          className={`h-4 w-4 ${filled ? 'fill-amber-400' : 'fill-transparent'}`}
        />
      )
    })}
  </div>
)

const Navbar = ({ activePage, onNavigate, user, isAuthenticated, onLogout }) => (
  <header className="sticky top-0 z-40 border-b border-white/5 bg-black/70 backdrop-blur">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/20">
          <Gamepad2 className="h-5 w-5 text-ember" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-100">GameVault</p>
          <p className="text-xs text-slate-500">Premium Digital Store</p>
        </div>
      </div>
      <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
        {getNavItems(isAuthenticated).map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-2 rounded-full px-3 py-2 transition ${
                activePage === item.key
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>
      {isAuthenticated ? (
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <div className="text-right">
            <p className="text-xs text-slate-400">Saldo</p>
            <p className="text-sm font-semibold text-slate-100">
              {formatPrice(user.balance)}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-ember/30" />
          <div>
            <p className="text-sm font-semibold text-slate-100">{user.username}</p>
            <p className="text-xs text-slate-500">{user.level} Member</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-ember/50 hover:text-white"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('login')}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-ember/50 hover:text-white"
          >
            Login
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white shadow-glow"
          >
            Register
          </button>
        </div>
      )}
    </div>
  </header>
)

const Footer = () => (
  <footer className="border-t border-white/5 bg-black/40 py-10">
    <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3 md:px-8">
      <div>
        <h3 className="text-lg font-semibold text-slate-100">GameVault</h3>
        <p className="mt-2 text-sm text-slate-500">
          Premium store and social hub for next-gen PC gaming experiences.
        </p>
      </div>
      <div className="text-sm text-slate-400">
        <p className="font-semibold text-slate-200">Support</p>
        <p className="mt-2">Help Center</p>
        <p>Community Forums</p>
        <p>Terms and Privacy</p>
      </div>
      <div className="text-sm text-slate-400">
        <p className="font-semibold text-slate-200">Connect</p>
        <p className="mt-2">Discord</p>
        <p>Creator Program</p>
        <p>Press Kit</p>
      </div>
    </div>
  </footer>
)

const GameCard = ({
  game,
  onSelect,
  onBuy,
  isInLibrary,
  isAuthenticated,
}) => {
  const discountedPrice = getDiscountedPrice(game)
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-graphite/60">
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${game.cover})` }}
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{game.title}</h3>
          <p className="text-xs text-slate-500">
            {game.genres.join(' / ')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <RatingStars rating={Math.round(game.rating)} />
          <span>{game.rating.toFixed(1)}</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div>
            {game.discountPercent > 0 ? (
              <div className="text-xs text-slate-400 line-through">
                {formatPrice(game.price)}
              </div>
            ) : null}
            <div className="text-sm font-semibold text-slate-100">
              {formatPrice(discountedPrice)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(game.id)}
              className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-ember/60 hover:text-white"
            >
              Detail
            </button>
            <button
              onClick={() => onBuy(game.id)}
              disabled={isInLibrary}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                isInLibrary
                  ? 'cursor-not-allowed bg-white/10 text-slate-500'
                  : 'bg-ember text-white shadow-glow'
              }`}
            >
              {isInLibrary ? 'In Library' : isAuthenticated ? 'Buy' : 'Login to Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const HomePage = ({
  games,
  onSelectGame,
  onBuyNow,
  libraryIds,
  onNavigate,
  isAuthenticated,
}) => {
  const heroGames = games.filter((game) => game.hero)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroGames.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroGames.length])

  const hero = heroGames[heroIndex]

  const trending = games.filter((game) => game.trending)
  const topSellers = games.filter((game) => game.topSeller)
  const featured = games.filter((game) => game.featured)
  const quickActions = isAuthenticated
    ? [
        { label: 'Browse Games', page: 'browse', description: 'Discover the full catalog.' },
        { label: 'Library', page: 'library', description: 'Open your owned games.' },
        { label: 'Wishlist', page: 'wishlist', description: 'Review saved titles.' },
        { label: 'Profile', page: 'profile', description: 'Check history and saldo.' },
      ]
    : [
        { label: 'Browse Games', page: 'browse', description: 'Discover the full catalog.' },
        { label: 'Library', page: 'library', description: 'See how owned games will appear.' },
        { label: 'Wishlist', page: 'wishlist', description: 'Plan your next purchase.' },
        { label: 'Login', page: 'login', description: 'Sign in to buy and save games.' },
      ]

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-carbon/70">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <Tag className="h-3 w-3 text-ember" />
              {hero.heroTag}
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
              {hero.title}
            </h1>
            <p className="mt-3 text-sm text-slate-400 md:text-base">
              {hero.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectGame(hero.id)}
                className="rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white shadow-glow"
              >
                View Detail
              </button>
              <button
                onClick={() => onBuyNow(hero.id)}
                className="rounded-full border border-white/20 px-5 py-3 text-sm text-white transition hover:border-ember/60"
              >
                Buy Now
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              className="h-72 rounded-3xl bg-cover bg-center shadow-2xl md:h-80"
              style={{ backgroundImage: `url(${hero.banner})` }}
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                className="rounded-full bg-black/60 p-2 text-white"
                onClick={() =>
                  setHeroIndex((prev) =>
                    prev === 0 ? heroGames.length - 1 : prev - 1,
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="rounded-full bg-black/60 p-2 text-white"
                onClick={() =>
                  setHeroIndex((prev) => (prev + 1) % heroGames.length)
                }
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.page}
            onClick={() => onNavigate(action.page)}
            className="rounded-2xl border border-white/10 bg-carbon/70 p-4 text-left transition hover:border-ember/40 hover:bg-white/[0.06]"
          >
            <p className="text-sm font-semibold text-white">{action.label}</p>
            <p className="mt-2 text-xs text-slate-400">{action.description}</p>
          </button>
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeader label="Trending" title="Trending Now" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trending.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelect={onSelectGame}
              onBuy={onBuyNow}
              isInLibrary={libraryIds.has(game.id)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader label="Sales" title="Top Sellers" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topSellers.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelect={onSelectGame}
              onBuy={onBuyNow}
              isInLibrary={libraryIds.has(game.id)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader label="Featured" title="Featured Recommendations" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelect={onSelectGame}
              onBuy={onBuyNow}
              isInLibrary={libraryIds.has(game.id)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

const BrowsePage = ({ games, onSelectGame, onBuyNow, libraryIds, isAuthenticated }) => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [ratingFilter, setRatingFilter] = useState('All')
  const [priceFilter, setPriceFilter] = useState('All')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  const genres = useMemo(
    () =>
      ['All', ...new Set(games.flatMap((game) => game.genres))].sort(),
    [games],
  )
  const platforms = useMemo(
    () =>
      ['All', ...new Set(games.flatMap((game) => game.platforms))].sort(),
    [games],
  )

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchSearch =
        debouncedSearch.trim() === '' ||
        game.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchGenre = genreFilter === 'All' || game.genres.includes(genreFilter)
      const matchPlatform =
        platformFilter === 'All' || game.platforms.includes(platformFilter)
      const matchRating =
        ratingFilter === 'All' || Math.floor(game.rating) >= Number(ratingFilter)
      const price = getDiscountedPrice(game)
      const matchPrice =
        priceFilter === 'All' ||
        (priceFilter === 'Under 200k' && price < 200000) ||
        (priceFilter === '200k - 350k' &&
          price >= 200000 &&
          price <= 350000) ||
        (priceFilter === 'Above 350k' && price > 350000)
      return matchSearch && matchGenre && matchPlatform && matchRating && matchPrice
    })
  }, [games, debouncedSearch, genreFilter, platformFilter, ratingFilter, priceFilter])

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 rounded-2xl border border-white/10 bg-carbon/70 p-5">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <div>
            <label className="text-xs text-slate-400">Genre</label>
            <select
              value={genreFilter}
              onChange={(event) => setGenreFilter(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Platform</label>
            <select
              value={platformFilter}
              onChange={(event) => setPlatformFilter(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Rating</label>
            <select
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            >
              <option value="All">All</option>
              <option value="4">4+</option>
              <option value="3">3+</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Price Range</label>
            <select
              value={priceFilter}
              onChange={(event) => setPriceFilter(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            >
              <option value="All">All</option>
              <option value="Under 200k">Under 200k</option>
              <option value="200k - 350k">200k - 350k</option>
              <option value="Above 350k">Above 350k</option>
            </select>
          </div>
        </div>
      </aside>
      <section className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-carbon/70 p-4">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search games, genres, or publishers..."
              className="w-full bg-transparent text-sm text-slate-100 focus:outline-none"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelect={onSelectGame}
              onBuy={onBuyNow}
              isInLibrary={libraryIds.has(game.id)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

const WishlistModal = ({ game, onClose, onConfirm }) => {
  const [priority, setPriority] = useState('Medium')
  const [notifyOnSale, setNotifyOnSale] = useState(true)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-carbon p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Add {game.title} to Wishlist
          </h3>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-slate-400"
          >
            X
          </button>
        </div>
        <div className="mt-4 space-y-4 text-sm text-slate-300">
          <div>
            <label className="text-xs text-slate-400">Priority</label>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-3">
            <input
              type="checkbox"
              checked={notifyOnSale}
              onChange={(event) => setNotifyOnSale(event.target.checked)}
            />
            Notify me on sale
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(priority, notifyOnSale)}
            className="flex-1 rounded-full bg-ember px-4 py-3 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

const GameStorePage = ({
  game,
  publisher,
  isInLibrary,
  isInWishlist,
  isAuthenticated,
  onAddWishlist,
  onBuyNow,
  onPlayGame,
  onRequireLogin,
  onHelpful,
  reviews,
  currentUserId,
  onSubmitReview,
}) => {
  const [showModal, setShowModal] = useState(false)
  const gameReviews = reviews.filter((review) => review.gameId === game.id)
  const averageRating =
    gameReviews.length > 0
      ? (
          gameReviews.reduce((sum, review) => sum + review.rating, 0) /
          gameReviews.length
        ).toFixed(1)
      : '0.0'
  const hasUserReview = gameReviews.some((review) => review.userId === currentUserId)
  const canReview = isInLibrary && !hasUserReview
  const isWishlistLocked = isInLibrary || isInWishlist
  const primaryActionLabel = isInLibrary
    ? 'Play'
    : isAuthenticated
      ? 'Buy Now'
      : 'Login to Buy'

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {game.ageRating} Rating
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Release {game.releaseDate}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {publisher.name}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-white">{game.title}</h1>
          <p className="mt-3 text-sm text-slate-400">{game.description}</p>
          <div className="mt-4 flex items-center gap-3">
            <RatingStars rating={Math.round(game.rating)} />
            <span className="text-sm text-slate-400">
              {averageRating} avg
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div>
              {game.discountPercent > 0 ? (
                <div className="text-sm text-slate-400 line-through">
                  {formatPrice(game.price)}
                </div>
              ) : null}
              <div className="text-2xl font-semibold text-white">
                {formatPrice(getDiscountedPrice(game))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              {game.platforms.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
                >
                  {getPlatformIcon(platform)}
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onRequireLogin()
                  return
                }
                setShowModal(true)
              }}
              disabled={isWishlistLocked}
              className={`rounded-full px-5 py-3 text-sm font-semibold ${
                isWishlistLocked
                  ? 'cursor-not-allowed bg-white/10 text-slate-500'
                  : 'border border-white/20 text-white hover:border-ember/60'
              }`}
            >
              {isInLibrary
                ? 'Owned'
                : isInWishlist
                  ? 'In Wishlist'
                  : isAuthenticated
                    ? 'Add to Wishlist'
                    : 'Login to Wishlist'}
            </button>
            <button
              onClick={() => {
                if (isInLibrary) {
                  onPlayGame()
                  return
                }
                if (!isAuthenticated) {
                  onRequireLogin()
                  return
                }
                onBuyNow(game.id)
              }}
              className={`rounded-full px-5 py-3 text-sm font-semibold ${
                isInLibrary
                  ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                  : 'bg-ember text-white shadow-glow'
              }`}
            >
              {primaryActionLabel}
            </button>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
          <h3 className="text-lg font-semibold text-white">Game Highlights</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <BadgeCheck className="h-4 w-4 text-ember" /> Premium visuals and
              high-end rendering.
            </li>
            <li className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-ember" /> Full controller and
              streaming support.
            </li>
            <li className="flex items-center gap-3">
              <Users className="h-4 w-4 text-ember" /> Active community events
              every week.
            </li>
          </ul>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-400">
            <p className="font-semibold text-slate-200">Publisher Focus</p>
            <p className="mt-2">{publisher.bio}</p>
          </div>
        </div>
      </section>

      <ReviewSection
        game={game}
        reviews={gameReviews}
        averageRating={averageRating}
        canReview={canReview}
        hasUserReview={hasUserReview}
        isAuthenticated={isAuthenticated}
        onHelpful={onHelpful}
        onSubmitReview={onSubmitReview}
      />

      {showModal && (
        <WishlistModal
          game={game}
          onClose={() => setShowModal(false)}
          onConfirm={(priority, notifyOnSale) => {
            onAddWishlist(game.id, priority, notifyOnSale)
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}

const ReviewSection = ({
  game,
  reviews,
  averageRating,
  canReview,
  hasUserReview,
  isAuthenticated,
  onHelpful,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [recommended, setRecommended] = useState(true)

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-carbon/70 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">Community Reviews</p>
          <h3 className="text-2xl font-semibold text-white">{game.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <RatingStars rating={Math.round(Number(averageRating))} />
          <span className="text-sm text-slate-400">{averageRating} avg</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-white/10 bg-black/30 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {review.username}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <RatingStars rating={review.rating} />
                  <span>{review.rating}/5</span>
                </div>
              </div>
              <button
                onClick={() => onHelpful(review.id)}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300"
              >
                <ThumbIcon />
                Helpful {review.helpful}
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-400">{review.text}</p>
            <p className="mt-2 text-xs text-emerald-300">
              {review.recommended ? 'Recommended' : 'Not Recommended'}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-slate-400">
        {canReview ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              onSubmitReview({
                rating: Number(rating),
                text,
                recommended,
              })
              setRating(5)
              setText('')
              setRecommended(true)
            }}
          >
            <div>
              <label className="text-xs text-slate-400">Rating</label>
              <select
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} Stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Review</label>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows="4"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
                placeholder="Share your experience..."
              />
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-3">
              <input
                type="checkbox"
                checked={recommended}
                onChange={(event) => setRecommended(event.target.checked)}
              />
              Recommend this game
            </label>
            <button
              type="submit"
              className="rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p>
            {!isAuthenticated
              ? 'Login to buy this game and unlock the review form.'
              : hasUserReview
                ? 'You already submitted a review for this game.'
                : 'Purchase the game to unlock the review form.'}
          </p>
        )}
      </div>
    </section>
  )
}

const PublisherPage = ({
  publishers,
  games,
  selectedPublisherId,
  onSelect,
  onSelectGame,
  onBuyNow,
  libraryIds,
}) => {
  const publisher = publishers.find((item) => item.id === selectedPublisherId)
  const catalog = games.filter((game) => game.publisherId === publisher.id)

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-ember/20" />
          <div>
            <p className="text-xs text-slate-400">Publisher Profile</p>
            <h2 className="text-2xl font-semibold text-white">{publisher.name}</h2>
            <p className="text-sm text-slate-400">
              Founded {publisher.founded} / {publisher.followers.toLocaleString()} followers
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">{publisher.bio}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {publishers.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm ${
              item.id === publisher.id
                ? 'border-ember/60 bg-ember/10 text-white'
                : 'border-white/10 bg-black/30 text-slate-400'
            }`}
          >
            <p className="font-semibold">{item.name}</p>
            <p className="text-xs text-slate-500">{item.followers} followers</p>
          </button>
        ))}
      </div>

      <section className="space-y-4">
        <SectionHeader label="Catalog" title="Publisher Games" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {catalog.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelect={onSelectGame}
              onBuy={onBuyNow}
              isInLibrary={libraryIds.has(game.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

const DashboardPage = ({ user, games, libraryIds, wishlist }) => {
  const libraryCount = libraryIds.size
  const wishlistCount = wishlist.length
  const topRated = [...games]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-4 rounded-2xl border border-white/10 bg-carbon/70 p-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-ember/20" />
          <div>
            <p className="text-sm font-semibold text-white">{user.username}</p>
            <p className="text-xs text-slate-400">{user.status}</p>
          </div>
        </div>
        <div className="space-y-2 text-xs text-slate-400">
          <p>Member Since {user.memberSince}</p>
          <p>Status {user.level}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-slate-400">
          <p className="font-semibold text-white">Activity Summary</p>
          <p className="mt-2">Library: {libraryCount} games</p>
          <p>Wishlist: {wishlistCount} games</p>
        </div>
      </aside>
      <section className="space-y-4">
        <SectionHeader label="Overview" title="Your Dashboard" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-slate-500">Library</p>
            <p className="mt-2 text-2xl font-semibold text-white">{libraryCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-slate-500">Wishlist</p>
            <p className="mt-2 text-2xl font-semibold text-white">{wishlistCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-slate-500">Balance</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {formatPrice(user.balance)}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-sm font-semibold text-white">Top Rated Picks</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {topRated.map((game) => (
              <div
                key={game.id}
                className="rounded-xl border border-white/10 bg-carbon/60 p-3 text-sm text-slate-300"
              >
                <p className="font-semibold text-white">{game.title}</p>
                <p className="text-xs text-slate-500">{game.genres.join(', ')}</p>
                <div className="mt-2 flex items-center gap-2">
                  <RatingStars rating={Math.round(game.rating)} />
                  <span className="text-xs">{game.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const WalletPage = ({ balance, onTopUp }) => {
  const [amount, setAmount] = useState(250000)
  const [method, setMethod] = useState('E-Wallet')

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <SectionHeader label="Wallet" title="Saldo & E-Wallet" />
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs text-slate-500">Current Balance</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {formatPrice(balance)}
          </p>
        </div>
        <div className="mt-6 space-y-4 text-sm text-slate-300">
          <div>
            <label className="text-xs text-slate-400">Top Up Amount</label>
            <input
              type="number"
              value={amount}
              min="10000"
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Method</label>
            <select
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            >
              <option>E-Wallet</option>
              <option>Credit Card</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <button
            onClick={() => onTopUp(amount, method)}
            className="w-full rounded-full bg-ember px-4 py-3 font-semibold text-white"
          >
            Confirm Top Up
          </button>
        </div>
      </section>
      <section className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3">
            <Wallet className="h-5 w-5 text-ember" />
            <div>
              <p className="font-semibold text-white">GameVault Balance</p>
              <p className="text-xs text-slate-500">Instant confirmation</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3">
            <CreditCard className="h-5 w-5 text-ember" />
            <div>
              <p className="font-semibold text-white">Credit Card</p>
              <p className="text-xs text-slate-500">Visa, Mastercard, JCB</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3">
            <Banknote className="h-5 w-5 text-ember" />
            <div>
              <p className="font-semibold text-white">Bank Transfer</p>
              <p className="text-xs text-slate-500">Manual verification</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const ProfilePage = ({ user, games, libraryIds, wishlist, transactions, onNavigate }) => {
  const libraryGames = games.filter((game) => libraryIds.has(game.id))
  const recentTransactions = transactions.slice(0, 4)

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Profile</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{user.username}</h2>
          <p className="mt-2 text-sm text-slate-400">{user.email}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {user.level} Member
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Joined {user.memberSince}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {user.status}
            </span>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Saldo</p>
          <p className="mt-2 text-4xl font-semibold text-white">{formatPrice(user.balance)}</p>
          <div className="mt-6 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
            <button
              onClick={() => onNavigate('library')}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left transition hover:border-ember/40"
            >
              <p className="text-xs text-slate-500">Library</p>
              <p className="mt-1 font-semibold text-white">{libraryIds.size} games</p>
            </button>
            <button
              onClick={() => onNavigate('wishlist')}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left transition hover:border-ember/40"
            >
              <p className="text-xs text-slate-500">Wishlist</p>
              <p className="mt-1 font-semibold text-white">{wishlist.length} saved</p>
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <SectionHeader label="History" title="Recent Transactions" />
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-black/40 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => {
                const game = games.find((item) => item.id === transaction.gameId)
                return (
                  <tr key={transaction.id} className="border-t border-white/5">
                    <td className="px-4 py-3 text-xs text-slate-500">{transaction.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{game?.title}</td>
                    <td className="px-4 py-3">{transaction.date}</td>
                    <td className="px-4 py-3">{formatPrice(transaction.pricePaid)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <SectionHeader label="Library" title="Owned Games" />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {libraryGames.map((game) => (
            <div
              key={game.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/30"
            >
              <div
                className="h-36 bg-cover bg-center"
                style={{ backgroundImage: `url(${game.cover})` }}
              />
              <div className="p-4">
                <p className="font-semibold text-white">{game.title}</p>
                <p className="mt-1 text-xs text-slate-500">{game.genres.join(' / ')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const LibraryPage = ({ games, libraryIds, isAuthenticated, onNavigate }) => {
  const libraryGames = games.filter((game) => libraryIds.has(game.id))

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6 text-slate-400">
        <h3 className="text-lg font-semibold text-white">Library</h3>
        <p className="mt-2">Login to sync your purchased games into a personal library.</p>
        <button
          onClick={() => onNavigate('login')}
          className="mt-4 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white"
        >
          Login
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SectionHeader label="Collection" title="Your Library" />
      {libraryGames.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-slate-400">
          Your library is empty. Buy a game from the store to start playing.
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {libraryGames.map((game) => (
          <div
            key={game.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-carbon/70"
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${game.cover})` }}
            />
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <p className="text-lg font-semibold text-white">{game.title}</p>
                <p className="text-xs text-slate-500">{game.genres.join(', ')}</p>
              </div>
              <div className="mt-auto flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ember px-3 py-2 text-xs font-semibold text-white">
                  <Play className="h-4 w-4" /> Play
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300">
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const WishlistPage = ({
  wishlist,
  games,
  isAuthenticated,
  onNavigate,
  onRemove,
  onUpdate,
  onBuyNow,
}) => {
  const wishlistGames = wishlist.map((item) => ({
    ...item,
    game: games.find((game) => game.id === item.gameId),
  }))

  return (
    <div className="space-y-4">
      <SectionHeader label="Favorites" title="Wishlist" />
      {!isAuthenticated ? (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-slate-400">
          Login to save games to your wishlist and track sale alerts.
          <div className="mt-4">
            <button
              onClick={() => onNavigate('login')}
              className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white"
            >
              Login
            </button>
          </div>
        </div>
      ) : null}
      <div className="space-y-3">
        {wishlistGames.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-slate-400">
            No wishlist items yet. Add a game from the store to keep track of it.
          </div>
        ) : (
          wishlistGames.map((item) => (
            <div
              key={item.gameId}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-carbon/70 p-4"
            >
              <div>
                <p className="text-lg font-semibold text-white">{item.game.title}</p>
                <p className="text-xs text-slate-500">
                  {item.game.genres.join(' / ')}
                </p>
                {item.game.discountPercent > 0 ? (
                  <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
                    On Sale {item.game.discountPercent}%
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span
                  className={`rounded-full border px-3 py-1 ${priorityStyles[item.priority]}`}
                >
                  Priority {item.priority}
                </span>
                <button
                  onClick={() =>
                    onUpdate(item.gameId, {
                      notifyOnSale: !item.notifyOnSale,
                    })
                  }
                  className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs"
                >
                  {item.notifyOnSale ? (
                    <Bell className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <BellOff className="h-4 w-4 text-slate-500" />
                  )}
                  {item.notifyOnSale ? 'Sale Alert On' : 'Sale Alert Off'}
                </button>
                <select
                  value={item.priority}
                  onChange={(event) =>
                    onUpdate(item.gameId, { priority: event.target.value })
                  }
                  className="rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button
                  onClick={() => onBuyNow(item.gameId)}
                  className="rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white"
                >
                  Buy
                </button>
                <button
                  onClick={() => onRemove(item.gameId)}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const PaymentPage = ({
  game,
  balance,
  isAuthenticated,
  onNavigate,
  onConfirmPayment,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState('Balance')
  const [message, setMessage] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6 text-slate-400">
        Login to complete payment and add games to your library.
        <button
          onClick={() => onNavigate('login')}
          className="mt-4 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white"
        >
          Login
        </button>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="rounded-2xl border border-white/10 bg-carbon/70 p-6 text-slate-400">
        Select a game to start checkout.
      </div>
    )
  }

  const price = getDiscountedPrice(game)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <SectionHeader label="Checkout" title="Payment" />
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div
            className="h-20 w-24 rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${game.cover})` }}
          />
          <div>
            <p className="text-lg font-semibold text-white">{game.title}</p>
            <p className="text-xs text-slate-500">{game.genres.join(' / ')}</p>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm text-slate-300">
          <div>
            <label className="text-xs text-slate-400">Payment Method</label>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {['Balance', 'Credit Card', 'E-Wallet'].map((item) => (
                <button
                  key={item}
                  onClick={() => setMethod(item)}
                  className={`rounded-xl border px-3 py-3 text-xs ${
                    method === item
                      ? 'border-ember/60 bg-ember/10 text-white'
                      : 'border-white/10 bg-black/30 text-slate-400'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              const result = onConfirmPayment(game.id, method)
              setMessage(result.message)
              if (result.ok) {
                onPaymentSuccess(game.id)
              }
            }}
            className="w-full rounded-full bg-ember px-4 py-3 font-semibold text-white"
          >
            Confirm Payment
          </button>
          {message ? (
            <p className="text-xs text-slate-400">{message}</p>
          ) : null}
        </div>
      </section>
      <section className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <h3 className="text-lg font-semibold text-white">Order Summary</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Payment Method</span>
            <span>{method}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
            <span>Total</span>
            <span>{formatPrice(price)}</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-slate-400">
            <p>Current Balance: {formatPrice(balance)}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [form, setForm] = useState({ email: '', password: '', remember: false })

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-carbon/70 p-6">
      <h2 className="text-2xl font-semibold text-white">Login</h2>
      <p className="mt-2 text-sm text-slate-400">
        Welcome back. Continue your session.
      </p>
      <form
        className="mt-6 space-y-4 text-sm text-slate-300"
        onSubmit={(event) => {
          event.preventDefault()
          onLogin(form)
        }}
      >
        <div>
          <label className="text-xs text-slate-400">Email</label>
          <input
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-3 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, remember: event.target.checked }))
            }
          />
          Remember me
        </label>
        <button className="w-full rounded-full bg-ember px-4 py-3 text-sm font-semibold text-white">
          Login
        </button>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="w-full rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300"
        >
          Go to Register
        </button>
        <p className="text-center text-xs text-slate-500">
          No account? Register from the navigation.
        </p>
      </form>
    </div>
  )
}

const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}
    if (form.username.trim().length < 3) {
      nextErrors.username = 'Username must be at least 3 characters.'
    }
    if (!form.email.includes('@')) {
      nextErrors.email = 'Email must be valid.'
    }
    if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }
    return nextErrors
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-carbon/70 p-6">
      <h2 className="text-2xl font-semibold text-white">Register</h2>
      <p className="mt-2 text-sm text-slate-400">
        Create your GameVault account.
      </p>
      <form
        className="mt-6 space-y-4 text-sm text-slate-300"
        onSubmit={(event) => {
          event.preventDefault()
          const nextErrors = validate()
          setErrors(nextErrors)
          if (Object.keys(nextErrors).length === 0) {
            onRegister(form)
          }
        }}
      >
        <div>
          <label className="text-xs text-slate-400">Username</label>
          <input
            value={form.username}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, username: event.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
          />
          {errors.username ? (
            <p className="mt-1 text-xs text-ember">{errors.username}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs text-slate-400">Email</label>
          <input
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-ember">{errors.email}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs text-slate-400">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-ember">{errors.password}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs text-slate-400">Confirm Password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                confirmPassword: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
          />
          {errors.confirmPassword ? (
            <p className="mt-1 text-xs text-ember">
              {errors.confirmPassword}
            </p>
          ) : null}
        </div>
        <button className="w-full rounded-full bg-ember px-4 py-3 text-sm font-semibold text-white">
          Create Account
        </button>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300"
        >
          Go to Login
        </button>
      </form>
    </div>
  )
}

const ThumbIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 9V5a3 3 0 0 0-6 0v4" />
    <path d="M5 15V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a4 4 0 0 1-4 4H7a2 2 0 0 1-2-2z" />
  </svg>
)

const App = () => {
  const [activePage, setActivePage] = useState('home')
  const [currentUser, setCurrentUser] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [transactions, setTransactions] = useState([])
  const [reviews, setReviews] = useState([])
  const [selectedGameId, setSelectedGameId] = useState(mockData.games[0].id)
  const [selectedPublisherId, setSelectedPublisherId] = useState(
    mockData.publishers[0].id,
  )
  const [checkoutGameId, setCheckoutGameId] = useState(mockData.games[0].id)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (currentUser) return
    if (activePage === 'profile' || activePage === 'payment') {
      setActivePage('login')
    }
  }, [activePage, currentUser])

  const isAuthenticated = Boolean(currentUser)

  const libraryIds = useMemo(
    () => new Set(transactions.map((transaction) => transaction.gameId)),
    [transactions],
  )
  const selectedGame = mockData.games.find((game) => game.id === selectedGameId)
  const checkoutGame = mockData.games.find((game) => game.id === checkoutGameId)
  const storePublisher = mockData.publishers.find(
    (publisher) => publisher.id === selectedGame?.publisherId,
  )
  const selectedPublisher = mockData.publishers.find(
    (publisher) => publisher.id === selectedPublisherId,
  )

  const hydrateDemoSession = () => {
    setWishlist([...mockData.wishlist])
    setTransactions([...mockData.transactions])
    setReviews([...mockData.reviews])
  }

  const clearSessionData = () => {
    setWishlist([])
    setTransactions([])
    setReviews([])
  }

  const handleNavigate = (page) => {
    if (!currentUser && (page === 'profile' || page === 'payment')) {
      setToast('Login required to access that page.')
      setActivePage('login')
      return
    }
    setActivePage(page)
  }

  const handleLogin = (form) => {
    setCurrentUser({
      ...mockData.user,
      email: form.email || mockData.user.email,
    })
    hydrateDemoSession()
    setSelectedGameId(mockData.games[0].id)
    setCheckoutGameId(mockData.games[0].id)
    setActivePage('home')
    setToast('Logged in successfully.')
  }

  const handleRegister = (form) => {
    const username = form.username.trim() || 'New Player'
    setCurrentUser({
      id: `user-${Date.now()}`,
      username,
      email: form.email,
      balance: 500000,
      level: 'Starter',
      memberSince: new Date().getFullYear().toString(),
      status: 'Online',
    })
    clearSessionData()
    setSelectedGameId(mockData.games[0].id)
    setCheckoutGameId(mockData.games[0].id)
    setActivePage('home')
    setToast('Account created. You are now signed in.')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    clearSessionData()
    setActivePage('home')
    setToast('Logged out.')
  }

  const addToWishlist = (gameId, priority, notifyOnSale) => {
    if (!currentUser) {
      setToast('Login required to save wishlist items.')
      setActivePage('login')
      return
    }
    if (wishlist.some((item) => item.gameId === gameId)) return
    setWishlist((prev) => [...prev, { gameId, priority, notifyOnSale }])
    setToast('Added to wishlist.')
  }

  const updateWishlist = (gameId, updates) => {
    setWishlist((prev) =>
      prev.map((item) =>
        item.gameId === gameId ? { ...item, ...updates } : item,
      ),
    )
  }

  const removeFromWishlist = (gameId) => {
    setWishlist((prev) => prev.filter((item) => item.gameId !== gameId))
  }

  const handleConfirmPayment = (gameId, method) => {
    if (!currentUser) {
      return { ok: false, message: 'Login required to complete checkout.' }
    }
    if (libraryIds.has(gameId)) {
      return { ok: false, message: 'Game already in library.' }
    }
    const game = mockData.games.find((item) => item.id === gameId)
    if (!game) {
      return { ok: false, message: 'Game not found.' }
    }
    const pricePaid = getDiscountedPrice(game)
    if (method === 'Balance' && currentUser.balance < pricePaid) {
      return { ok: false, message: 'Insufficient balance.' }
    }
    if (method === 'Balance') {
      setCurrentUser((prev) => ({ ...prev, balance: prev.balance - pricePaid }))
    }
    const invoiceId = `INV-${Date.now()}`
    const date = new Date().toISOString().slice(0, 10)
    setTransactions((prev) => [
      { id: invoiceId, gameId, date, method, pricePaid },
      ...prev,
    ])
    setWishlist((prev) => prev.filter((item) => item.gameId !== gameId))
    setToast('Payment confirmed. Added to library.')
    return { ok: true, message: 'Payment confirmed.' }
  }

  const handleTopUp = (amount, method) => {
    if (!currentUser) {
      setToast('Login required to top up saldo.')
      setActivePage('login')
      return
    }
    if (!amount || amount <= 0) return
    setCurrentUser((prev) => ({ ...prev, balance: prev.balance + amount }))
    setToast(`Top up successful via ${method}.`)
  }

  const handleSubmitReview = (gameId, reviewData) => {
    if (!currentUser) return
    if (!libraryIds.has(gameId)) return
    if (reviews.some((review) => review.gameId === gameId && review.userId === currentUser.id)) {
      return
    }
    setReviews((prev) => [
      {
        id: `rev-${Date.now()}`,
        gameId,
        userId: currentUser.id,
        username: currentUser.username,
        ...reviewData,
        helpful: 0,
      },
      ...prev,
    ])
    setToast('Review submitted.')
  }

  const handleHelpful = (reviewId) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review,
      ),
    )
  }

  const goToGame = (gameId) => {
    setSelectedGameId(gameId)
    setActivePage('store')
  }

  const goToCheckout = (gameId) => {
    if (!currentUser) {
      setToast('Login required to buy games.')
      setActivePage('login')
      return
    }
    setCheckoutGameId(gameId)
    setActivePage('payment')
  }

  const goToProfile = () => {
    handleNavigate('profile')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        user={currentUser ?? mockData.user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-10 md:px-8">
        {activePage === 'home' && (
          <HomePage
            games={mockData.games}
            onSelectGame={goToGame}
            onBuyNow={goToCheckout}
            libraryIds={libraryIds}
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
          />
        )}
        {activePage === 'browse' && (
          <BrowsePage
            games={mockData.games}
            onSelectGame={goToGame}
            onBuyNow={goToCheckout}
            libraryIds={libraryIds}
            isAuthenticated={isAuthenticated}
          />
        )}
        {activePage === 'store' && selectedGame && storePublisher && (
          <GameStorePage
            game={selectedGame}
            publisher={storePublisher}
            isInLibrary={libraryIds.has(selectedGame.id)}
            isInWishlist={wishlist.some((item) => item.gameId === selectedGame.id)}
            isAuthenticated={isAuthenticated}
            onAddWishlist={addToWishlist}
            onBuyNow={goToCheckout}
            onPlayGame={() => handleNavigate('library')}
            onRequireLogin={() => handleNavigate('login')}
            reviews={reviews}
            currentUserId={currentUser?.id ?? null}
            onSubmitReview={(reviewData) =>
              handleSubmitReview(selectedGame.id, reviewData)
            }
            onHelpful={handleHelpful}
          />
        )}
        {activePage === 'library' && (
          <LibraryPage
            games={mockData.games}
            libraryIds={libraryIds}
            isAuthenticated={isAuthenticated}
            onNavigate={handleNavigate}
          />
        )}
        {activePage === 'wishlist' && (
          <WishlistPage
            wishlist={wishlist}
            games={mockData.games}
            isAuthenticated={isAuthenticated}
            onNavigate={handleNavigate}
            onRemove={removeFromWishlist}
            onUpdate={updateWishlist}
            onBuyNow={goToCheckout}
          />
        )}
        {activePage === 'payment' && (
          <PaymentPage
            game={checkoutGame}
            balance={currentUser?.balance ?? 0}
            isAuthenticated={isAuthenticated}
            onNavigate={handleNavigate}
            onConfirmPayment={handleConfirmPayment}
            onPaymentSuccess={goToGame}
          />
        )}
        {activePage === 'profile' && currentUser && (
          <ProfilePage
            user={currentUser}
            games={mockData.games}
            libraryIds={libraryIds}
            wishlist={wishlist}
            transactions={transactions}
            onNavigate={handleNavigate}
          />
        )}
        {activePage === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => handleNavigate('register')}
          />
        )}
        {activePage === 'register' && (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => handleNavigate('login')}
          />
        )}
      </main>
      <Footer />
      {toast ? <Toast message={toast} /> : null}
    </div>
  )
}

export default App
