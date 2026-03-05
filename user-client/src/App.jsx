import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

/* PAGES */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import Offers from "./pages/Offers";
import OrderSuccess from "./pages/Order";
import Boys from "./pages/BoysProducts";
import Girls from "./pages/GirlsProducts";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Contact from "./pages/Contact";
import GoogleSuccess from "./pages/GoogleSuccess";
import Shipping from "./pages/Shipping";
import About from "./pages/About";
import Returns from "./pages/Returns";
import FAQ from "./pages/FAQ";
import SearchResults from "./pages/SearchResults";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiePolicy from "./pages/CookiePolicy";

/* COMPONENTS */
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

/* 🔐 PRIVATE ROUTE */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  return token ? children : <Navigate to="/" replace />;
};

/* 🔹 MAIN LAYOUT */
function Layout() {
  const location = useLocation();

  // Routes where header/footer should NOT appear
  const hideLayoutRoutes = ["/", "/register", "/forgot"];

  const shouldHideLayout = hideLayoutRoutes.includes(
    location.pathname
  );

  // ✅ Newsletter ONLY on Home page
  const showNewsletter = location.pathname === "/home";

  return (
    <>
      {/* HEADER */}
      {!shouldHideLayout && <Header />}

      {/* ROUTES */}
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/girls"
          element={
            <PrivateRoute>
              <Girls />
            </PrivateRoute>
          }
        />

        <Route
          path="/boys"
          element={
            <PrivateRoute>
              <Boys />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <PrivateRoute>
              <Contact />
            </PrivateRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />

        <Route
          path="/offers"
          element={
            <PrivateRoute>
              <Offers />
            </PrivateRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          }
        />

        <Route
          path="/shipping"
          element={
            <PrivateRoute>
              <Shipping />
            </PrivateRoute>
          }
        />

        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />

        <Route
          path="/returns"
          element={
            <PrivateRoute>
              <Returns />
            </PrivateRoute>
          }
        />

        <Route
          path="/faq"
          element={
            <PrivateRoute>
              <FAQ />
            </PrivateRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* FOOTER (ONLY ONCE) */}
      {!shouldHideLayout && (
        <Footer showNewsletter={showNewsletter} />
      )}
    </>
  );
}

/* 🔹 APP ROOT */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
      <CookieConsent />
    </BrowserRouter>
  );
}
