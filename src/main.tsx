import { Fragment, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import Layout from "./layout"
import Home from "./pages/home"
import { RecoilRoot } from "recoil"

import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Fragment>
        <RecoilRoot>
          <Layout>
            <Outlet />
          </Layout>
        </RecoilRoot>
      </Fragment>
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
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
