import { useEffect, useState } from "react";
import {
  VantagensApi,
  Vantagem,
  VantagemRequest,
  EmpresasApi,
  Empresa,
} from "../api/client";

export function VantagensPage() {
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<VantagemRequest>({
    nome: "",
    descricao: "",
    custoMoedas: 0,
    empresaParceiraId: 0,
  });

  const load = async () => {
    setLoading(true);
    try {
      const [vantagensData, empresasData] = await Promise.all([
        VantagensApi.list(),
        EmpresasApi.list(),
      ]);
      setVantagens(vantagensData);
      setEmpresas(empresasData);
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      await VantagensApi.create(form);
      setForm({
        nome: "",
        descricao: "",
        custoMoedas: 0,
        empresaParceiraId: 0,
      });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao salvar vantagem");
    }
  };

  return (
    <div>
      <h2 className="section-title">Vantagens</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p style={{ color: "#ef4444" }}>{error}</p>
      ) : null}

      <form onSubmit={submit} className="form-grid">
        <input
          placeholder="Nome da Vantagem"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
          style={{ gridColumn: "1 / -1" }}
        />
        <textarea
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          required
          rows={3}
          style={{ gridColumn: "1 / -1" }}
        />
        <input
          placeholder="Custo em Moedas"
          type="number"
          min="0"
          step="0.01"
          value={form.custoMoedas || ""}
          onChange={(e) =>
            setForm({ ...form, custoMoedas: Number(e.target.value) })
          }
          required
        />
        <select
          value={form.empresaParceiraId}
          onChange={(e) =>
            setForm({ ...form, empresaParceiraId: Number(e.target.value) })
          }
          required
        >
          <option value="">Selecione uma empresa</option>
          {empresas.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.nome}
            </option>
          ))}
        </select>
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
          <button type="submit" className="btn">
            Cadastrar Vantagem
          </button>
        </div>
      </form>

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>
          Vantagens Disponíveis
        </h3>
        {vantagens.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>
            Nenhuma vantagem cadastrada ainda.
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "4px",
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
                    {v.nome}
                  </h4>
                  <span
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {v.custoMoedas} moedas
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: "var(--muted)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {v.descricao}
                </p>
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "8px",
                    borderTop: "1px solid var(--border)",
                    fontSize: "12px",
                    color: "var(--muted)",
                  }}
                >
                  Empresa: {v.empresaParceiraNome}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

