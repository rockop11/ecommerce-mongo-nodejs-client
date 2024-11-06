import axios, { isAxiosError } from 'axios';

interface ApiResponse {
    status: number;
    message: string;
    data: string;
}

export const login = async (username: string, password: string) => {
    try {
        const { data } = await axios.post<ApiResponse>(`${import.meta.env.VITE_API_URL}/auth/login`, {
            username,
            password
        });

        localStorage.setItem('token', data.data)

        return data;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Error en la autenticación');
        } else {
            throw new Error('Error inesperado en la solicitud de login');
        }
    }
};