import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import MainLayout from "./components/layout/MainLayout"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
