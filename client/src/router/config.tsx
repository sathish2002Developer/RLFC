
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Contact from "../pages/contact/page";
import Products from "../pages/products/page";
import About from "../pages/about/page";
import PharmaceuticalAPIs from "../pages/pharmaceutical-apis/page";
import ContractManufacturing from "../pages/contract-manufacturing/page";
import ResearchDevelopment from "../pages/research-development/page";
import Capabilities from "../pages/capabilities/page";
import AdminLogin from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Sustainability from "../pages/sustainability/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/pharmaceutical-apis",
    element: <PharmaceuticalAPIs />,
  },
  {
    path: "/contract-manufacturing",
    element: <ContractManufacturing />,
  },
  {
    path: "/research-development",
    element: <ResearchDevelopment />,
  },
  {
    path: "/capabilities",
    element: <Capabilities />,
  },
  {
    path: "/sustainability",
    element: <Sustainability />,
  },
  {
    path: "/admin",
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
