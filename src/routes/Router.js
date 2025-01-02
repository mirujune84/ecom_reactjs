import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import EditCategory from "../components/dashboard/category/EditCategory";
import AddCategory from "../components/dashboard/category/AddCategory";
import AddProduct from "../components/dashboard/product/AddProduct";
import EditProduct from "../components/dashboard/product/EditProduct";
import ViewProduct from "../components/dashboard/product/ViewProduct";
import ViewOrderDetail from "../components/dashboard/orders/ViewOrderDetail";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout"));

/***** Pages *****/

const Starter = lazy(() => import("../views/Starter"));
const About = lazy(() => import("../views/About"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));
const Login = lazy(() => import("../views/Login"));
const Category = lazy(() => import("../views/ui/Category"));
const Subcategory = lazy(() => import("../views/ui/Subcategory"));
const Product = lazy(() => import("../views/ui/Product"));
const Customer = lazy(() => import("../views/ui/Customers"));
const Transaction = lazy(() => import("../views/ui/Transaction"));
const Order = lazy(() => import("../views/ui/Order"));
/*****Routes******/

const ThemeRoutes = [
  {
    path: "/login",
    exact: true,
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
  }, // Login route
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Suspense>
          <FullLayout />
        </Suspense>
      </PrivateRoute>
    ), // Wrap FullLayout with PrivateRoute and Suspense
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> }, // Default route after login
      {
        path: "/dashboard",
        exact: true,
        element: (
          <Suspense>
            <Starter />
          </Suspense>
        ),
      },
      {
        path: "/product",
        exact: true,
        element: (
          <Suspense>
            <Product />
          </Suspense>
        ),
      },
      {
        path: "/category",
        exact: true,
        element: (
          <Suspense>
            <Category />
          </Suspense>
        ),
      },
      {
        path: "/subcategory",
        exact: true,
        element: (
          <Suspense>
            <Subcategory />
          </Suspense>
        ),
      },
      {
        path: "/customers",
        exact: true,
        element: (
          <Suspense>
            <Customer />
          </Suspense>
        ),
      },
      {
        path: "/orders",
        exact: true,
        element: (
          <Suspense>
            <Order />
          </Suspense>
        ),
      },
      {
        path: "/view-order/:id",
        exact: true,
        element: (
          <Suspense>
            <ViewOrderDetail />
          </Suspense>
        ),
      },
      {
        path: "/transactions",
        exact: true,
        element: (
          <Suspense>
            <Transaction />
          </Suspense>
        ),
      },
      {
        path: "/about",
        exact: true,
        element: (
          <Suspense>
            <About />
          </Suspense>
        ),
      },

      {
        path: "/alerts",
        exact: true,
        element: (
          <Suspense>
            <Alerts />
          </Suspense>
        ),
      },
      {
        path: "/badges",
        exact: true,
        element: (
          <Suspense>
            <Badges />
          </Suspense>
        ),
      },
      {
        path: "/buttons",
        exact: true,
        element: (
          <Suspense>
            <Buttons />
          </Suspense>
        ),
      },
      {
        path: "/cards",
        exact: true,
        element: (
          <Suspense>
            <Cards />
          </Suspense>
        ),
      },
      {
        path: "/grid",
        exact: true,
        element: (
          <Suspense>
            <Grid />
          </Suspense>
        ),
      },
      {
        path: "/table",
        exact: true,
        element: (
          <Suspense>
            <Tables />
          </Suspense>
        ),
      },
      {
        path: "/forms",
        exact: true,
        element: (
          <Suspense>
            <Forms />
          </Suspense>
        ),
      },
      {
        path: "/breadcrumbs",
        exact: true,
        element: (
          <Suspense>
            <Breadcrumbs />
          </Suspense>
        ),
      },

      {
        path: "/edit-category/:id",
        exact: true,
        element: (
          <Suspense>
            <EditCategory />
          </Suspense>
        ),
      },
      {
        path: "/add-category",
        exact: true,
        element: (
          <Suspense>
            <AddCategory />
          </Suspense>
        ),
      },
      {
        path: "/add-product",
        exact: true,
        element: (
          <Suspense>
            <AddProduct />
          </Suspense>
        ),
      },
      {
        path: "/edit-product/:id",
        exact: true,
        element: (
          <Suspense>
            <EditProduct />
          </Suspense>
        ),
      },
      {
        path: "/view-product/:id",
        exact: true,
        element: (
          <Suspense>
            <ViewProduct />
          </Suspense>
        ),
      },
    ],
  },
];

export default ThemeRoutes;
