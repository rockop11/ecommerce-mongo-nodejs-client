import { createBrowserRouter } from "react-router-dom";
import {
    IndexPage,
    LoginPage,
    ProductsPage,
    ProductsCreatePage,
    ProductDetailPage,
    ProfilePage,
    RegisterPage,
    EditUserPage,
    UsersPage
} from "./index"
import { Layout } from "./Layout";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <IndexPage />
            },
            {
                path: "/products",
                element: <ProductsPage />
            },
            {
                path: 'product/:id',
                element: <ProductDetailPage />
            },
            {
                path: '/products/create',
                element: <ProductsCreatePage />
            },
            {
                path: '/profile',
                element: <ProfilePage />
            },
            {
                path: '/editUser',
                element: <EditUserPage />
            },
            {
                path: '/users',
                element: <UsersPage />
            }
        ]
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        path: '/changePassword',
        element: <>ChangePasswordPage</>
    }
])