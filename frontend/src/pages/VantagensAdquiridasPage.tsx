import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { VantagensAdquiridasApi, VantagemAdquirida } from "../api/client";
import { useNotification } from "../contexts/NotificationContext";
import { QRCodeSVG } from "qrcode.react";

export function VantagensAdquiridasPage() {
  const { user, hasRole } = useAuth();
  const { showNotification, confirm } = useNotification();
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
    const confirmed = await confirm("Deseja resgatar esta vantagem? O código só pode ser usado uma vez.", {
      title: "Resgatar Vantagem",
      type: "warning",
      confirmText: "Resgatar",
      cancelText: "Cancelar",
    });
    
    if (!confirmed) {
      return;
    }

    try {
      await VantagensAdquiridasApi.resgatar(codigoUso);
      showNotification("Vantagem resgatada com sucesso!", "success");
      await loadVantagens();
    } catch (e: any) {
      showNotification(e?.response?.data?.error || "Erro ao resgatar vantagem", "error");
    }
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
                      marginBottom: "8px",
                      textAlign: "center",
                    }}
                  >
                    Código QR para Resgate:
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "16px",
                      background: "white",
                      borderRadius: "8px",
                      opacity: v.resgatado ? 0.5 : 1,
                    }}
                  >
                    <QRCodeSVG
                      value={v.codigoUso}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  {v.resgatado && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        textAlign: "center",
                        marginTop: "8px",
                        marginBottom: 0,
                      }}
                    >
                      QR Code já utilizado
                    </p>
                  )}
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

