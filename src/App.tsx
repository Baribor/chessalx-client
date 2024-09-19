import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import MainLayout from "./components/layout/MainLayout"
import Login from "./pages/Login"
import SignUp from "./pages/Signup"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from "recoil"
import PassNPlayBoard from "./components/board/PassNPlay"
import OnlineBoard from "./components/board/OnlineBoard"
import ComputerBoard from "./components/board/Computer"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RecoilRoot><MainLayout /></RecoilRoot>,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <SignUp />
      },
      {
        path: 'passNplay',
        element: <PassNPlayBoard />
      },
      {
        path: 'online',
        element: <OnlineBoard />
      },
      {
        path: 'computer',
        element: <ComputerBoard />
      },
    ]
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
