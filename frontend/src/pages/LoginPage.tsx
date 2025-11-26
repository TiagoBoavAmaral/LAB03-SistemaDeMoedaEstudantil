import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Garantir que o vídeo reproduza automaticamente
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Ignorar erros de autoplay
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, senha);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* Vídeo de fundo */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.3,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <source src="/timelapseCoreu.mp4" type="video/mp4" />
      </video>

      {/* Overlay escuro para melhorar contraste */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(15, 23, 42, 0.5)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        className="card"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          padding: "32px",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img
            src="/logomoedaa.png"
            alt="Logo Moeda Estudantil"
            style={{
              width: "80px",
              height: "80px",
              marginBottom: "16px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <h2 style={{ margin: 0 }}>Sistema de Moeda Estudantil</h2>
        </div>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: "18px",
          }}
        >
          Login
        </h3>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #ef4444",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ gridColumn: "1 / -1" }}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ gridColumn: "1 / -1" }}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn"
            style={{ gridColumn: "1 / -1" }}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
