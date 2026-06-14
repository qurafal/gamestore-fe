import { useEffect, useMemo, useState } from "react";
import {
  addWishlist,
  bulkDeleteWishlists,
  clearStoredToken,
  checkout,
  createProduct,
  createReview,
  deleteWishlist,
  clearStoredProfile,
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
  normalizeAvatarUrl,
  readStoredProfile,
  readStoredToken,
  register,
  storeProfile,
  storeToken,
  topUp,
  updateProductCover,
  updateProfilePicture,
} from "./api/gamevaultApi";
import { createToastState, dedupeById } from "./appBackend/appBackendUtils";
import { AppNavbar, ShellFrame, Toast } from "./gamevault/components";
import { HomePage } from "./gamevault/pages/HomePage";
import { BrowsePage } from "./gamevault/pages/BrowsePage";
import { ProductPage } from "./gamevault/pages/ProductPage";
import {
  WishlistPage,
  LibraryPage,
  ProfilePage,
} from "./gamevault/pages/account";
import { PublisherPage } from "./gamevault/pages/publisher";
import { AuthPage } from "./gamevault/pages/auth";
import { CheckoutPage } from "./gamevault/pages/checkout";

const parseAuthResponse = (response) => {
  const payload = response?.data || response || {};
  return {
    token: payload.token || payload.accessToken || payload.access_token || "",
    user: payload.user || payload.profile || payload,
  };
};

const AppBackend = () => {
  const [activePage, setActivePage] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [token, setToken] = useState(() => readStoredToken());
  const [currentUser, setCurrentUser] = useState(() => readStoredProfile());
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [library, setLibrary] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedPublisherId, setSelectedPublisherId] = useState(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loadingSession, setLoadingSession] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [reviewedProductIds, setReviewedProductIds] = useState([]);
  const [catalogQuery, setCatalogQuery] = useState("");
  // const [product, setProduct] = useState(null);
  const [product, setProduct] = useState();
  const [reviews, setReviews] = useState([]);
  // const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token && currentUser);
  const hasPublisherAccess = currentUser?.role === "PUBLISHER";
  const loadProductDetail = async (id) => {
    try {
      // setLoading(true); // Opsional jika Anda ingin indikator loading
      const response = await getProductDetail(id); // Gunakan import fungsi yang sudah ada
      const data = response.data || response; // Sesuaikan dengan struktur API Anda

      setProduct(data);
      setReviews(data.reviews || []);
      console.log(reviews);
    } catch (error) {
      console.error("Gagal memuat detail:", error);
      showToast("Gagal memuat detail produk", "error");
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    if (activePage === "product" && selectedProductId) {
      loadProductDetail(selectedProductId);
      console.log(reviews)
    }
  }, [activePage, selectedProductId]);
  const showToast = (message, kind = "success") => {
    setToast(createToastState(message, kind));
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const loadCatalog = async (search = catalogQuery) => {
    setLoadingCatalog(true);
    setError("");
    try {
      const response = await getProducts(search);
      const normalized = dedupeById(
        (response.data || []).map(normalizeProduct),
      );

      const sortedNewestFirst = [...normalized].sort((a, b) => b.id - a.id);

      setProducts(sortedNewestFirst);
      setCatalogQuery(search);

      if (!selectedProductId && sortedNewestFirst.length > 0)
        setSelectedProductId(sortedNewestFirst[0].id);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingCatalog(false);
    }
  };

  const refreshSession = async (accessToken = token) => {
    if (!accessToken) return;
    setLoadingSession(true);
    try {
      const [profileResponse, wishlistResponse, libraryResponse] =
        await Promise.all([
          getProfile(accessToken),
          getWishlist(accessToken),
          getLibrary(accessToken),
        ]);

      const normalizedProfile = normalizeProfile(
        profileResponse.data || profileResponse,
      );
      setCurrentUser(normalizedProfile);
      storeProfile(normalizedProfile);
      setWishlist(
        dedupeById((wishlistResponse.data || []).map(normalizeWishlistItem)),
      );
      setLibrary(
        dedupeById((libraryResponse.data || []).map(normalizeLibraryItem)),
      );
    } catch (requestError) {
      if (requestError.status === 401) {
        clearStoredToken();
        clearStoredProfile();
        setToken("");
        setCurrentUser(null);
        setWishlist([]);
        setLibrary([]);
        showToast("Sesi login habis. Silakan login ulang.", "error");
      } else {
        showToast(requestError.message, "error");
      }
    } finally {
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    if (token) {
      refreshSession(token);
    } else {
      setCurrentUser(null);
      clearStoredProfile();
      setWishlist([]);
      setLibrary([]);
      setReviewedProductIds([]);
      setSelectedPublisherId(null);
    }
  }, [token]);

  useEffect(() => {
    // Jika user punya akses Publisher dan sedang tidak melihat studio lain, kunci ke studionya sendiri
    if (hasPublisherAccess && !selectedPublisherId) {
      setSelectedPublisherId(currentUser?.publisherId || null);
    }
  }, [hasPublisherAccess, currentUser?.publisherId, selectedPublisherId]);

  const ownedProductIds = useMemo(
    () => new Set(library.map((item) => item.productId)),
    [library],
  );

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || null,
    [products, selectedProductId],
  );

  const publisherCatalog = useMemo(
    () =>
      products.filter(
        (product) => product.publisher?.id === selectedPublisherId,
      ),
    [products, selectedPublisherId],
  );

  const featuredProduct = useMemo(
    () =>
      [...products].sort(
        (left, right) =>
          right.discount - left.discount || left.price - right.price,
      )[0] || null,
    [products],
  );

  const selectedPublisher = useMemo(() => {
    if (!hasPublisherAccess) return null;

    if (selectedPublisherId) {
      return (
        products.find(
          (product) => product.publisher?.id === selectedPublisherId,
        )?.publisher || null
      );
    }

    return null;
  }, [hasPublisherAccess, products, selectedPublisherId]);

  const handleNavigate = (page) => {
    const protectedPages = new Set([
      "wishlist",
      "library",
      "profile",
      "checkout",
    ]);
    if (page === "register") {
      setAuthMode("register");
      setActivePage("login");
      return;
    }

    if (page === "login") {
      setAuthMode("login");
      setActivePage("login");
      return;
    }

    if (!isAuthenticated && protectedPages.has(page)) {
      setActivePage("login");
      setAuthMode("login");
      showToast("Login diperlukan untuk membuka halaman itu.", "error");
      return;
    }

    if (page === "publisher") {
      // if (!hasPublisherAccess) {
      //   showToast(
      //     "Akses dashboard publisher hanya untuk akun dengan role PUBLISHER.",
      //     "error",
      //   );
      //   return;
      // }
      // ✅ TAMBAHKAN BARIS INI: Kunci dashboard ke ID Publisher milik sendiri
      setSelectedPublisherId(currentUser?.publisherId || null);
    }

    setActivePage(page);
  };

  const handleOpenProduct = async (productId) => {
    setSelectedProductId(productId);
    try {
      const response = await getProductDetail(productId);
      // JSON Anda memiliki struktur { data: { product_id, reviews, ... } }
      const productData = response.data.data;

      setProduct(productData); // Simpan objek produk
      setReviews(productData.reviews || []); // Simpan array reviews

      // Opsional: update juga produk di list global
      setProducts((current) =>
        current.map((item) =>
          item.id === productData.product_id ? productData : item,
        ),
      );
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
    setActivePage("product");
  };

  const handleOpenCheckout = (productId) => {
    setSelectedProductId(productId);
    setActivePage("checkout");
  };

  const handleOpenPublisher = (publisherId) => {
    // if (!hasPublisherAccess) {
    //   showToast(
    //     "Akses dashboard publisher hanya untuk akun dengan role PUBLISHER.",
    //     "error",
    //   );
    //   return;
    // }

    if (currentUser?.publisherId && currentUser.publisherId !== publisherId) {
      showToast(
        "Kamu hanya bisa membuka dashboard publisher milik akunmu sendiri.",
        "error",
      );
      return;
    }

    setSelectedPublisherId(currentUser?.publisherId || null);
    setActivePage("publisher");
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await login({ email, password });
      const { token: accessToken, user } = parseAuthResponse(response);
      const normalizedUser = normalizeProfile(user);
      storeToken(accessToken);
      storeProfile(normalizedUser);
      setToken(accessToken);
      setCurrentUser(normalizedUser);
      setAuthMode("login");
      setActivePage("home");
      showToast("Login berhasil");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      await register({ username, email, password });
      const loginResponse = await login({ email, password });
      const { token: accessToken, user } = parseAuthResponse(loginResponse);
      const normalizedUser = normalizeProfile(user);
      storeToken(accessToken);
      storeProfile(normalizedUser);
      setToken(accessToken);
      setCurrentUser(normalizedUser);
      setAuthMode("login");
      setActivePage("home");
      showToast("Akun berhasil dibuat dan langsung masuk ke sistem.");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    clearStoredProfile();
    setToken("");
    setCurrentUser(null);
    setWishlist([]);
    setLibrary([]);
    setReviewedProductIds([]);
    setSelectedPublisherId(null);
    setActivePage("home");
    showToast("Logout berhasil");
  };

  const handleAddWishlist = async (productId, priority) => {
    if (!isAuthenticated) {
      setActivePage("login");
      setAuthMode("login");
      showToast("Login dulu untuk menyimpan wishlist.", "error");
      return;
    }

    try {
      await addWishlist(token, productId, priority);
      await refreshSession(token);
      showToast("Game berhasil ditambahkan ke wishlist");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleDeleteWishlist = async (wishlistId) => {
    try {
      await deleteWishlist(token, wishlistId);
      await refreshSession(token);
      showToast("Wishlist berhasil dihapus");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleBulkDeleteWishlists = async (wishlistIds) => {
    try {
      await bulkDeleteWishlists(token, wishlistIds);
      await refreshSession(token);
      showToast("Wishlist terpilih berhasil dihapus");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleTopUp = async (amount, paymentMethod) => {
    if (!isAuthenticated) {
      setActivePage("login");
      setAuthMode("login");
      showToast("Login dulu untuk top up saldo.", "error");
      return;
    }

    try {
      const response = await topUp(token, {
        amount: Number(amount),
        payment_method: paymentMethod,
      });
      if (response?.data?.new_balance !== undefined) {
        setCurrentUser((current) =>
          current
            ? { ...current, balance: Number(response.data.new_balance) }
            : current,
        );
      }
      await refreshSession(token);
      showToast(response.message || "Top up berhasil");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleCheckout = async (productId, paymentMethod) => {
    if (!isAuthenticated) {
      setActivePage("login");
      setAuthMode("login");
      showToast("Login dulu untuk checkout.", "error");
      return;
    }

    try {
      const response = await checkout(token, {
        product_id: Number(productId),
        payment_method: paymentMethod,
      });
      if (response?.data?.remaining_balance !== undefined) {
        setCurrentUser((current) =>
          current
            ? { ...current, balance: Number(response.data.remaining_balance) }
            : current,
        );
      }
      await refreshSession(token);
      setSelectedProductId(productId);
      setActivePage("product");
      showToast(response.message || "Pembelian berhasil");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleSubmitReview = async (productId, payload) => {
    if (!isAuthenticated) {
      showToast("Login dulu untuk submit review.", "error");
      return;
    }

    try {
      await createReview(token, Number(productId), payload);
      setReviewedProductIds((current) => [
        ...new Set([...current, Number(productId)]),
      ]);
      showToast("Review berhasil dikirim");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    // if (!reviewId) {
    //   showToast("Masukkan review ID terlebih dahulu.", "error");
    //   return;
    // }

    // try {
    //   await markHelpful(token, Number(reviewId));
    //   showToast("Helpful vote berhasil dikirim");
    // } catch (requestError) {
    //   showToast(requestError.message, "error");
    // }
    console.log("ID Ulasan yang diklik:", reviewId);
    if (!isAuthenticated) {
      showToast('Login terlebih dahulu untuk memberikan vote.', 'error')
      return
    }
    try {
      // Menembak endpoint POST /api/reviews/:id/helpful
      await markHelpful(token, Number(reviewId))
      showToast('Ulasan ditandai sebagai bermanfaat!')
      
      // Refresh halaman detail produk untuk memperbarui jumlah helpful_count di layar
      if (selectedProductId) {
        await handleOpenProduct(selectedProductId)
      }
    } catch (requestError) {
      showToast(requestError.message, 'error')
    }
  };
  const handleCreateProduct = async ({ title, price, studioName }) => {
    try {
      const payload = {
        title,
        price: Number(price),
      };

      // Jika ini pembuatan studio pertama, sertakan namanya
      if (studioName) {
        payload.publisher_name = studioName;
      }

      // 1. Eksekusi pembuatan game di backend
      const response = await createProduct(token, payload);

      // Ambil ID game baru dari respons backend
      const newGameId =
        response.data?.product_id || response.data?.id || response.product_id;

      // 2. Tarik ulang sesi pengguna (agar Role berubah jadi PUBLISHER)
      await refreshSession(token);

      // 3. ✨ KUNCI PERBAIKAN ✨
      // Tarik ulang seluruh katalog agar game baru turun membawa relasi nama Publisher-nya secara utuh
      await loadCatalog(catalogQuery);

      // 4. Pastikan state Dashboard Publisher mengunci ke ID Studio Anda yang baru
      const updatedProfile = readStoredProfile();
      if (updatedProfile?.publisherId) {
        setSelectedPublisherId(updatedProfile.publisherId);
      }

      showToast(response.message || "Studio dan game berhasil dibuat!");

      // Kembalikan objek ID agar modal bisa lanjut ke Langkah 2 (Unggah Kover)
      return { id: newGameId };
    } catch (requestError) {
      showToast(requestError.message, "error");
      throw requestError;
    }
  };

  const handleUploadProductCover = async (productId, coverFile) => {
    if (!coverFile) return;
    try {
      const formData = new FormData();
      formData.append("cover", coverFile);
      const response = await updateProductCover(token, productId, formData);
      const updatedProduct = response?.data
        ? normalizeProduct(response.data)
        : null;
      if (updatedProduct) {
        setProducts((current) =>
          current.map((item) =>
            item.id === updatedProduct.id ? updatedProduct : item,
          ),
        );
      }
      showToast(response.message || "Kover game berhasil diperbarui.");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleUploadAvatar = async (avatarFile) => {
    if (!avatarFile) return;
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const response = await updateProfilePicture(token, formData);
      if (response?.data?.avatar_url) {
        setCurrentUser((current) =>
          current
            ? {
                ...current,
                avatarUrl: normalizeAvatarUrl(response.data.avatar_url),
              }
            : current,
        );
      }
      await refreshSession(token);
      showToast(response.message || "Profile picture berhasil diperbarui.");
    } catch (requestError) {
      showToast(requestError.message, "error");
    }
  };

  const handleSearchCatalog = async (query) => {
    await loadCatalog(query);
    setActivePage("browse");
  };

  const loading = loadingCatalog || (isAuthenticated && loadingSession);

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight text-slate-300">
        <div className="rounded-3xl border border-white/10 bg-carbon/80 px-6 py-5 text-sm text-slate-200 shadow-2xl shadow-black/20">
          Loading GameVault...
        </div>
      </div>
    );
  }

  const ownedCount = library.length;
  const wishlistCount = wishlist.length;

  //   const [reviews, setReviews] = useState([]);

  return (
    <div className="flex min-h-screen flex-col bg-midnight text-slate-100">
      <AppNavbar
        activePage={activePage}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        user={
          currentUser || {
            username: "Guest",
            balance: 0,
            role: "GUEST",
            avatarUrl: "",
          }
        }
        onLogout={handleLogout}
      />

      <ShellFrame loading={false} error={error}>
        {activePage === "home" ? (
          <HomePage
            products={products}
            featuredProduct={featuredProduct}
            onOpenProduct={handleOpenProduct}
            isAuthenticated={isAuthenticated}
            ownedCount={ownedCount}
            wishlistCount={wishlistCount}
            balance={currentUser?.balance || 0}
          />
        ) : null}

        {activePage === "browse" ? (
          <BrowsePage
            products={products}
            onOpenProduct={handleOpenProduct}
            onSearchCatalog={handleSearchCatalog}
          />
        ) : null}

        {activePage === "product" ? (
          <ProductPage
            reviews={reviews}
            product={selectedProduct}
            isAuthenticated={isAuthenticated}
            isOwned={
              selectedProduct ? ownedProductIds.has(selectedProduct.id) : false
            }
            onOpenPublisher={handleOpenPublisher}
            onOpenLibrary={() => handleNavigate("library")}
            onOpenLogin={() => {
              setAuthMode("login");
              handleNavigate("login");
            }}
            onOpenCheckout={handleOpenCheckout}
            onAddWishlist={handleAddWishlist}
            onSubmitReview={handleSubmitReview}
            onMarkHelpful={handleMarkHelpful}
            reviewSubmitted={
              selectedProduct
                ? reviewedProductIds.includes(selectedProduct.id)
                : false
            }
          />
        ) : null}

        {activePage === "wishlist" ? (
          <WishlistPage
            wishlist={wishlist}
            isAuthenticated={isAuthenticated}
            onOpenProduct={handleOpenProduct}
            onOpenCheckout={handleOpenCheckout}
            onLogin={() => handleNavigate("login")}
            onDeleteWishlist={handleDeleteWishlist}
            onBulkDeleteWishlists={handleBulkDeleteWishlists}
          />
        ) : null}

        {activePage === "library" ? (
          <LibraryPage
            library={library}
            isAuthenticated={isAuthenticated}
            onOpenProduct={handleOpenProduct}
            onLogin={() => handleNavigate("login")}
          />
        ) : null}

        {activePage === "profile" ? (
          <ProfilePage
            user={currentUser}
            libraryCount={ownedCount}
            wishlistCount={wishlistCount}
            onTopUp={handleTopUp}
            onUploadAvatar={handleUploadAvatar}
            onNavigate={handleNavigate}
          />
        ) : null}

        {activePage === "publisher" ? (
          <PublisherPage
            publisher={selectedPublisher}
            products={publisherCatalog}
            onOpenProduct={handleOpenProduct}
            onBack={() => handleNavigate("product")}
            onCreateProduct={handleCreateProduct}
            onUploadProductCover={handleUploadProductCover}
            canManagePublisher={hasPublisherAccess}
          />
        ) : null}

        {activePage === "checkout" ? (
          <CheckoutPage
            product={selectedProduct}
            currentBalance={currentUser?.balance || 0}
            onConfirmPayment={handleCheckout}
            onCancel={() => handleNavigate("product")}
          />
        ) : null}

        {activePage === "login" ? (
          <AuthPage
            mode={authMode}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onSwitchMode={() =>
              setAuthMode((current) =>
                current === "login" ? "register" : "login",
              )
            }
          />
        ) : null}
      </ShellFrame>

      <footer className="border-t border-white/5 bg-black/40 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3 md:px-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">GameVault</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Frontend ini tersambung ke backend GameVault API dengan struktur
              yang dipisah per domain.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            <p className="font-semibold text-slate-200">Protected</p>
            <p className="mt-2">Profile</p>
            <p>Library</p>
            <p>Wishlist</p>
            <p>Checkout</p>
            <p>Publisher tools</p>
          </div>
          <div className="text-sm text-slate-400">
            <p className="font-semibold text-slate-200">Backend Scope</p>
            <p className="mt-2">
              Auth, products, wishlist, checkout, review, top up, avatar, cover
              upload
            </p>
          </div>
        </div>
      </footer>

      {toast ? <Toast toast={toast} /> : null}
    </div>
  );
};

export default AppBackend;
