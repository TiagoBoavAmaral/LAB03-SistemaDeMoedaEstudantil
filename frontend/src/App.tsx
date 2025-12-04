import { Link, Route, Routes, Navigate } from "react-router-dom";
import { AlunosPage } from "./pages/AlunosPage";
import { EmpresasPage } from "./pages/EmpresasPage";
import { MoedasPage } from "./pages/MoedasPage";
import { ExtratosPage } from "./pages/ExtratosPage";
import { VantagensPage } from "./pages/VantagensPage";
import { VantagensAdquiridasPage } from "./pages/VantagensAdquiridasPage";
import { LoginPage } from "./pages/LoginPage";
import { PerfilPage } from "./pages/PerfilPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { useNotification } from "./contexts/NotificationContext";
import { ToastContainer } from "./components/Toast";
import { ConfirmDialog } from "./components/ConfirmDialog";

export default function App() {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const { notifications, removeNotification, confirmDialog } = useNotification();

  if (!isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer notifications={notifications} onRemove={removeNotification} />
        {confirmDialog && (
          <ConfirmDialog
            message={confirmDialog.message}
            title={confirmDialog.title}
            confirmText={confirmDialog.confirmText}
            cancelText={confirmDialog.cancelText}
            type={confirmDialog.type}
            onConfirm={confirmDialog.onConfirm}
            onCancel={confirmDialog.onCancel}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="container">
      <header className="app-header">
        <div className="brand">
          <div className="logo" />
          <h1 className="title">Moeda Estudantil</h1>
        </div>
        <nav className="nav">
          {hasRole("EMPRESA") && (
            <>
              <Link to="/alunos">Alunos</Link>
              <Link to="/empresas">Empresas</Link>
              <Link to="/vantagens">Vantagens</Link>
              <Link to="/moedas">Moedas</Link>
              <Link to="/extratos">Extratos</Link>
            </>
          )}
          {hasRole("PROFESSOR") && (
            <>
              <Link to="/moedas">Enviar Moedas</Link>
              <Link to="/alunos">Alunos</Link>
              <Link to="/extratos">Extratos</Link>
            </>
          )}
          {hasRole("ALUNO") && (
            <>
              <Link to="/vantagens">Vantagens</Link>
              <Link to="/vantagens-adquiridas">Minhas Vantagens</Link>
              <Link to="/extratos">Extratos</Link>
            </>
          )}
          <Link to="/perfil">Perfil</Link>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </nav>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={
                hasRole("EMPRESA")
                  ? "/vantagens"
                  : hasRole("PROFESSOR")
                  ? "/moedas"
                  : "/vantagens"
              }
              replace
            />
          }
        />
        <Route
          path="/login"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <div className="card">
                <PerfilPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alunos"
          element={
            <ProtectedRoute allowedRoles={["EMPRESA", "PROFESSOR"]}>
              <div className="card">
                <AlunosPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresas"
          element={
            <ProtectedRoute allowedRoles={["EMPRESA"]}>
              <div className="card">
                <EmpresasPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vantagens"
          element={
            <ProtectedRoute>
              <div className="card">
                <VantagensPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/moedas"
          element={
            <ProtectedRoute allowedRoles={["PROFESSOR"]}>
              <div className="card">
                <MoedasPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/extratos"
          element={
            <ProtectedRoute>
              <div className="card">
                <ExtratosPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vantagens-adquiridas"
          element={
            <ProtectedRoute allowedRoles={["ALUNO"]}>
              <div className="card">
                <VantagensAdquiridasPage />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      </div>
      <ToastContainer notifications={notifications} onRemove={removeNotification} />
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          title={confirmDialog.title}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </>
  );
}
