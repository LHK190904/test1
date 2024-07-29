import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import About from "./pages/about";
import Designs from "./pages/designs";
import Collections from "./pages/collections";
import Blog from "./pages/blog";
import Register from "./pages/register";
import Layout from "./components/layout";
import Error from "./pages/error";
import Admin from "./pages/admin";
import ProductDetails from "./pages/product-details";
import ManagerRequest from "./pages/manager/request";
import ManagerOrder from "./pages/manager/order";
import ProtectedRoute from "./components/protectedRoute";
import authService from "./services/authService";
import ProductionStaff from "./pages/production-staff/process-orders";
import ProcessRequests from "./pages/saler/process_requests";
import ReceiveRequests from "./pages/saler/receive_requests";
import CartRequest from "./pages/cart/request";
import CartOrder from "./pages/cart/order";
import Dashboard from "./pages/dashboard";
import PriceGold from "./pages/price/gold";
import PriceMaterial from "./pages/price/material";
import ProcessOrder from "./pages/designer/process_orders";
import ManageDesign from "./pages/designer/manage_designs";
import Authenticate from "./pages/auth/Authenticate";
import ManageMaterial from "./pages/production-staff/manage-materials";
import Post from "./pages/posts/[slug]";
import SearchPage from "./pages/search";
import ForgotPassword from "./pages/forgot-password";
import Profile from "./pages/profile";
import Unauthorize from "./pages/unauthorized";
import RequestDetail from "./pages/cart/request_detail";

const getCurrentUser = () => {
  return authService.getCurrentUser();
};

const isAuthenticated = () => {
  const user = getCurrentUser();
  return user && user.token;
};

const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.title === "ADMIN";
};


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,

      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/designs",
          element: <Designs />,
        },
        {
          path: "/collections",
          element: <Collections />,
        },
        {
          path: "/blog",
          element: <Blog />,
        },
        {
          path: "/posts/:slug",
          element: <Post />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/product-details/:productId",
          element: <ProductDetails />,
        },
        {
          path: "/cart/request",
          element: <CartRequest />,
        },
        {
          path: "/cart/order/:requestID",
          element: <CartOrder />,
        },
        {
          path: "/cart/request_detail/:requestID",
          element: <RequestDetail />,
        },
        {
          path: "/price/gold",
          element: <PriceGold />,
        },
        {
          path: "/price/material",
          element: <PriceMaterial />,
        },
        {
          path: "/search/:query",
          element: <SearchPage />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/profile/",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/error",
      element: <Error />,
    },
    {
      path: "/admin",
      element: <ProtectedRoute element={<Admin />} isAllowed={isAdmin()} />,
    },
    {
      path: "/saler/receive_requests",
      element: (
        <ProtectedRoute
          element={<ReceiveRequests />}
          isAllowed={isAuthenticated()}
        />
      ),
    },
    {
      path: "/saler/process_requests",
      element: (
        <ProtectedRoute
          element={<ProcessRequests />}
          isAllowed={isAuthenticated()}
        />
      ),
    },
    {
      path: "/manager/request",
      element: (
        <ProtectedRoute
          element={<ManagerRequest />}
          isAllowed={isAuthenticated()}
        />
      ),
    },
    {
      path: "/manager/order",
      element: (
        <ProtectedRoute
          element={<ManagerOrder />}
          isAllowed={isAuthenticated()}
        />
      ),
    },
    {
      path: "/designer/process_orders",
      element: (
        <ProtectedRoute
          element={<ProcessOrder />}
          isAllowed={isAuthenticated()}
        />
      ),
    },
    {
      path: "/designer/manage_designs",
      element: (
        <ProtectedRoute
          element={<ManageDesign />}
          isAllowed={isAuthenticated()}
        />
      ),
    },
    {
      path: "/production-staff/process-orders",
      element: (
        <ProtectedRoute
          element={<ProductionStaff />}
          isAllowed={isAuthenticated()}
        />
      ),
    },
    {
      path: "/production-staff/manage-materials",
      element: (
        <ProtectedRoute
          element={<ManageMaterial />}
          isAllowed={isAuthenticated()}
        />
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute element={<Dashboard />} isAllowed={isAuthenticated()} />
      ),
    },
    {
      path: "/authenticate",
      element: <Authenticate />,
    },
    {
      path: "/unauthorized",
      element: <Unauthorize />,
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
