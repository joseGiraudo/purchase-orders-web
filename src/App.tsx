import { Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";


function HomePage() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Hola, {user?.name}</h1>
      <p className="text-gray-600">Rol: {user?.role}</p>
      <button onClick={logout} className="mt-4 text-blue-600 underline">
        Cerrar sesión
      </button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App
