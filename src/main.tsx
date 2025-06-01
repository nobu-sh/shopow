import * as React from "react";
import { RecoilRoot } from "recoil";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Layout from "./layout";
import Home from "./pages/home";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <React.Fragment>
        <RecoilRoot>
          <Layout>
            <Outlet />
          </Layout>
        </RecoilRoot>
      </React.Fragment>
    ),
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "*",
        element: <Home />
      }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
