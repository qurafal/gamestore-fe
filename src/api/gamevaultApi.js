const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://gamestore-be-1.onrender.com"
).replace(/\/$/, "");
const TOKEN_STORAGE_KEY = "gamevault.token";
const PROFILE_STORAGE_KEY = "gamevault.profile";
const DEFAULT_AVATAR_URL =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Default avatar"><defs><linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.55"/><stop offset="100%" stop-color="#f97316" stop-opacity="0.35"/></linearGradient></defs><rect width="128" height="128" rx="64" fill="#0f1115"/><circle cx="64" cy="50" r="24" fill="url(#g)"/><path d="M24 108c6-24 24-38 40-38s34 14 40 38" fill="url(#g)" opacity="0.95"/><circle cx="50" cy="50" r="4" fill="#fff" fill-opacity="0.9"/><circle cx="78" cy="50" r="4" fill="#fff" fill-opacity="0.9"/></svg>',
  );

const normalizeAvatarUrl = (value) => {
  if (!value) return DEFAULT_AVATAR_URL;

  const trimmed = String(value).trim();

  if (/^https:\/\/https\/\//i.test(trimmed)) {
    return trimmed.replace(/^https:\/\/https\/\//i, "https://");
  }

  if (/^https\/\//i.test(trimmed)) {
    return `https://${trimmed.slice(7)}`;
  }

  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  if (/^\/\//.test(trimmed)) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return `${API_BASE_URL}${trimmed}`;
  }

  return trimmed;
};

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const readStoredToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) || "";
};

const readStoredProfile = () => {
  if (typeof window === "undefined") return null;

  const rawProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!rawProfile) return null;

  try {
    return JSON.parse(rawProfile);
  } catch (error) {
    return null;
  }
};

const storeToken = (token) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

const storeProfile = (profile) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

const clearStoredToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
};

const clearStoredProfile = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
};

const request = async (path, { method = "GET", body, token } = {}) => {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  let response;

  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!isFormData && body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
      },
      body:
        body === undefined
          ? undefined
          : isFormData
            ? body
            : JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      `Backend API tidak dapat dijangkau di ${API_BASE_URL}. Jalankan server backend terlebih dahulu.`,
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = payload?.data;
    throw error;
  }

  return payload;
};

const normalizeDecimal = (value) => Number(value ?? 0);
const normalizeProduct = (product) => ({
  id: product.product_id ?? product.id,
  productId: product.product_id ?? product.id,
  title: product.title,
  description: product.description || "Deskripsi belum tersedia dari backend.",
  price: normalizeDecimal(product.price),
  discount: Number(product.discount || 0),
  releaseDate: product.release_date || null,
  ageRating: product.age_rating || "Unknown",
  coverUrl: product.cover_url || null,
  
  publisher: product.publisher_id 
    ? { 
        id: product.publisher_id, 
        // Jika backend tidak mengirim nama, gunakan nama sementara agar UI tidak error
        name: product.publisher?.name || "Studio Anda" 
      } 
    : null,

  platforms: Array.isArray(product.platforms)
    ? product.platforms.map((platform) => ({
        id: platform.platform_id ?? platform.id,
        name: platform.name,
      }))
    : [],

  reviews: Array.isArray(product.reviews)
    ? product.reviews.map((r) => ({
        id: r.review_id || r.id, // Menerjemahkan review_id dari backend menjadi id
        rating: Number(r.rating || 5),
        review_text: r.review_text || '',
        is_recommend: Boolean(r.is_recommend),
        helpful_count: Number(r.helpful_count || 0),
        user: {
          username: r.user?.username || r.username || 'Anonymous'
        }
      }))
    : []
});

const normalizeProfile = (profile) => ({
  id: profile.user_id ?? profile.id,
  username: profile.username,
  email: profile.email,
  role: profile.role || profile.user_role || "USER",
  avatarUrl: normalizeAvatarUrl(profile.avatar_url || profile.avatarUrl),
  
  // ✅ PERBARUI BARIS INI: Ambil dari objek bersarang 'publisher' jika ada
  publisherId: profile.publisher_id ?? profile.publisherId ?? profile.publisher?.publisher_id ?? profile.publisher?.id ?? null,
  
  balance: normalizeDecimal(profile.balance),
});

const normalizeWishlistItem = (item) => ({
  id: item.wishlist_id ?? item.id,
  productId: item.product_id ?? item.productId,
  priority: item.priority || "medium",
  notifyDiscount: Boolean(item.notify_discount),
  product: normalizeProduct(item.product),
});

const normalizeLibraryItem = (item) => ({
  id: item.id,
  productId: item.product_id ?? item.productId,
  acquiredAt: item.acquired_at,
  status: item.status,
  product: normalizeProduct(item.product),
});

const login = (payload) =>
  request("/api/auth/login", { method: "POST", body: payload });
const register = (payload) =>
  request("/api/auth/register", { method: "POST", body: payload });
const getProfile = (token) => request("/api/users/profile", { token });
const getProducts = (search = "", token) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return request(`/api/products${query}`, { token });
};
const getProductDetail = (productId, token) =>
  request(`/api/products/${productId}`, { token });
const createProduct = (token, payload) =>
  request("/api/products", { method: "POST", token, body: payload });
const updateProductCover = (token, productId, formData) =>
  request(`/api/products/${productId}/cover`, {
    method: "PATCH",
    token,
    body: formData,
  });
const updateProfilePicture = (token, formData) =>
  request("/api/users/profile-picture", {
    method: "PATCH",
    token,
    body: formData,
  });
const getWishlist = (token) => request("/api/wishlists", { token });
const addWishlist = (token, productId, priority = "medium") =>
  request("/api/wishlists", {
    method: "POST",
    token,
    body: { product_id: productId, priority },
  });
const deleteWishlist = (token, wishlistId) =>
  request(`/api/wishlists/${wishlistId}`, { method: "DELETE", token });
const bulkDeleteWishlists = (token, wishlistIds) =>
  request("/api/wishlists", {
    method: "DELETE",
    token,
    body: { wishlist_ids: wishlistIds },
  });
const getLibrary = (token) => request("/api/library", { token });
const checkout = (token, payload) =>
  request("/api/checkout", { method: "POST", token, body: payload });
const topUp = (token, payload) =>
  request("/api/wallet/topup", { method: "POST", token, body: payload });
const createReview = (token, productId, payload) =>
  request(`/api/products/${productId}/reviews`, {
    method: "POST",
    token,
    body: payload,
  });
const markHelpful = (token, reviewId) =>
  request(`/api/reviews/${reviewId}/helpful`, { method: "POST", token });

export {
  API_BASE_URL,
  DEFAULT_AVATAR_URL,
  TOKEN_STORAGE_KEY,
  addWishlist,
  bulkDeleteWishlists,
  clearStoredToken,
  clearStoredProfile,
  checkout,
  createProduct,
  createReview,
  deleteWishlist,
  getLibrary,
  getProductDetail,
  getProducts,
  getProfile,
  getWishlist,
  login,
  markHelpful,
  normalizeLibraryItem,
  normalizeProfile,
  normalizeProduct,
  normalizeWishlistItem,
  readStoredToken,
  readStoredProfile,
  register,
  request,
  normalizeAvatarUrl,
  storeToken,
  storeProfile,
  topUp,
  updateProductCover,
  updateProfilePicture,
};
