import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { VantagensAdquiridasApi, VantagemAdquirida } from "../api/client";

export function VantagensAdquiridasPage() {
  const { user, hasRole } = useAuth();
  const [vantagens, setVantagens] = useState<VantagemAdquirida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && hasRole("ALUNO")) {
      loadVantagens();
    }
  }, [user]);

  const loadVantagens = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await VantagensAdquiridasApi.list(user.id);
      setVantagens(data);
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Erro ao carregar vantagens adquiridas");
    } finally {
      setLoading(false);
    }
  };

  const handleResgatar = async (codigoUso: string) => {
    if (!confirm("Deseja resgatar esta vantagem? O código só pode ser usado uma vez.")) {
      return;
    }

    try {
      await VantagensAdquiridasApi.resgatar(codigoUso);
      alert("Vantagem resgatada com sucesso!");
      await loadVantagens();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao resgatar vantagem");
    }
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    alert("Código copiado para a área de transferência!");
  };

  if (!hasRole("ALUNO")) {
    return (
      <div>
        <h2 className="section-title">Vantagens Adquiridas</h2>
        <p style={{ color: "#ef4444" }}>Acesso restrito apenas para alunos.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">Minhas Vantagens Adquiridas</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p style={{ color: "#ef4444" }}>{error}</p>
      ) : vantagens.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          Você ainda não adquiriu nenhuma vantagem.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {vantagens.map((v) => (
            <div
              key={v.id}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {v.vantagemImagemUrl && (
                <img
                  src={v.vantagemImagemUrl}
                  alt={v.vantagemNome}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "4px",
                }}
              >
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
                  {v.vantagemNome}
                </h4>
                {v.resgatado && (
                  <span
                    style={{
                      background: "#10b981",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Resgatado
                  </span>
                )}
                {!v.resgatado && (
                  <span
                    style={{
                      background: "#f59e0b",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Pendente
                  </span>
                )}
              </div>
              <p
                style={{
                  margin: 0,
                  color: "var(--muted)",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {v.vantagemDescricao}
              </p>
              <div
                style={{
                  marginTop: "8px",
                  paddingTop: "8px",
                  borderTop: "1px solid var(--border)",
                  fontSize: "12px",
                  color: "var(--muted)",
                }}
              >
                Empresa: {v.empresaParceiraNome}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  paddingTop: "8px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Código de Uso:
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <code
                      style={{
                        flex: 1,
                        background: v.resgatado
                          ? "rgba(255, 255, 255, 0.02)"
                          : "rgba(255, 255, 255, 0.05)",
                        padding: "8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                        border: "1px solid var(--border)",
                        color: v.resgatado ? "var(--muted)" : "var(--text)",
                        opacity: v.resgatado ? 0.5 : 1,
                        textDecoration: v.resgatado ? "line-through" : "none",
                      }}
                    >
                      {v.codigoUso}
                    </code>
                    {!v.resgatado && (
                      <button
                        onClick={() => copiarCodigo(v.codigoUso)}
                        style={{
                          padding: "8px 12px",
                          background: "var(--primary)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Copiar
                      </button>
                    )}
                  </div>
                </div>
                {!v.resgatado && (
                  <button
                    onClick={() => handleResgatar(v.codigoUso)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Resgatar Vantagem
                  </button>
                )}
                {v.resgatado && v.dataResgate && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      textAlign: "center",
                      padding: "8px",
                      background: "rgba(16, 185, 129, 0.1)",
                      borderRadius: "6px",
                    }}
                  >
                    Resgatado em: {new Date(v.dataResgate).toLocaleString("pt-BR")}
                  </div>
                )}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "11px",
                  color: "var(--muted)",
                  textAlign: "center",
                }}
              >
                Adquirido em: {new Date(v.dataAdquisicao).toLocaleString("pt-BR")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

