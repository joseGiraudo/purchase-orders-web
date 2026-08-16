import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";



export function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
        await login({ email, password });
        navigate('/');
        } catch {
        setError('Email o contraseña incorrectos.');
        } finally {
        setIsSubmitting(false);
        }
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
        >
            <h1 className="mb-6 text-2xl font-bold text-gray-800"
            >Iniciar sesión</h1>

            {error && (
            <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">
                {error}
            </p>
            )}

            <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
            </label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded border border-gray-300 p-2"
            required
            />

            <label className="mb-1 block text-sm font-medium text-gray-700">
            Contraseña
            </label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded border border-gray-300 p-2"
            required
            />

            <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-blue-600 p-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
        </form>
        </div>
    );

}