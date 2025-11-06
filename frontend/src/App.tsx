import { Link, Route, Routes, Navigate } from "react-router-dom";
import { AlunosPage } from "./pages/AlunosPage";
import { EmpresasPage } from "./pages/EmpresasPage";
import { MoedasPage } from "./pages/MoedasPage";
import { ExtratosPage } from "./pages/ExtratosPage";
import { VantagensPage } from "./pages/VantagensPage";

export default function App() {
  return (
    <div className="container">
      <header className="app-header">
        <div className="brand">
          <div className="logo" />
          <h1 className="title">Moeda Estudantil</h1>
        </div>
        <nav className="nav">
          <Link to="/alunos">Alunos</Link>
          <Link to="/empresas">Empresas</Link>
          <Link to="/vantagens">Vantagens</Link>
          <Link to="/moedas">Moedas</Link>
          <Link to="/extratos">Extratos</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/alunos" replace />} />
        <Route
          path="/alunos"
          element={
            <div className="card">
              <AlunosPage />
            </div>
          }
        />
        <Route
          path="/empresas"
          element={
            <div className="card">
              <EmpresasPage />
            </div>
          }
        />
        <Route
          path="/vantagens"
          element={
            <div className="card">
              <VantagensPage />
            </div>
          }
        />
        <Route
          path="/moedas"
          element={
            <div className="card">
              <MoedasPage />
            </div>
          }
        />
        <Route
          path="/extratos"
          element={
            <div className="card">
              <ExtratosPage />
            </div>
          }
        />
      </Routes>
    </div>
  );
}
