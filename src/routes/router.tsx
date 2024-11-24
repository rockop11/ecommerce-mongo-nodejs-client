import { createBrowserRouter } from "react-router-dom";
import {
    IndexPage,
    LoginPage,
    ProductsPage,
    ProductsCreatePage,
    ProductDetailPage,
    ProfilePage,
    RegisterPage,
    RecoveryEmailPage,
    RecoveryPasswordPage,
    EditUserPage,
    UsersPage,
    EditProductsPage
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
                path: 'editProduct/:id',
                element: <EditProductsPage />
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
    },
    {
        path: '/recoveryPassword',
        element: <RecoveryEmailPage />
    },
    {
        path: '/recoveryPassword/:token',
        element: <RecoveryPasswordPage />
    }
])