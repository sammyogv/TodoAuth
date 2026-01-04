
import { createBrowserRouter } from "react-router"
import Todo from "./pages/Todo.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"





const router = createBrowserRouter([
    {
        path: "/",
        element: <Todo/>
    },
    {
        path: "/Login",
        Component: Login,
        
    },
    {
        path: "/Signup",
        Component: Signup,
    }
])

export default router

