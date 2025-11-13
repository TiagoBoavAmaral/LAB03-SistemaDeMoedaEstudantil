import { useEffect, useState, useRef } from "react";
import {
  VantagensApi,
  Vantagem,
  VantagemRequest,
  EmpresasApi,
  Empresa,
  MoedasApi,
  AlunosApi,
  Aluno,
} from "../api/client";
import { useAuth } from "../contexts/AuthContext";

export function VantagensPage() {
  const { user, hasRole } = useAuth();
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);

  const [form, setForm] = useState<VantagemRequest>({
    nome: "",
    descricao: "",
    custoMoedas: 0,
    empresaParceiraId: 0,
    imagemUrl: "",
  });
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const promises: Promise<any>[] = [VantagensApi.list()];
      if (hasRole("EMPRESA")) {
        promises.push(EmpresasApi.list());
      }
      if (hasRole("ALUNO") && user) {
        promises.push(AlunosApi.get(user.id));
      }
      const results = await Promise.all(promises);
      setVantagens(results[0]);
      if (hasRole("EMPRESA")) {
        setEmpresas(results[1]);
      }
      if (hasRole("ALUNO") && user) {
        setAluno(results[hasRole("EMPRESA") ? 2 : 1]);
      }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm({ ...form, imagemUrl: base64String });
        setImagemPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setForm({ ...form, imagemUrl: url });
    setImagemPreview(url || null);
    // Limpar o input de arquivo quando uma URL é digitada
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearImage = () => {
    setForm({ ...form, imagemUrl: "" });
    setImagemPreview(null);
    // Limpar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      if (editingId) {
        await VantagensApi.update(editingId, form);
      } else {
        await VantagensApi.create(form);
      }
      resetForm();
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao salvar vantagem");
    }
  };

  const resetForm = () => {
    setForm({
      nome: "",
      descricao: "",
      custoMoedas: 0,
      empresaParceiraId: 0,
      imagemUrl: "",
    });
    setImagemPreview(null);
    setEditingId(null);
    // Limpar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (vantagem: Vantagem) => {
    setForm({
      nome: vantagem.nome,
      descricao: vantagem.descricao,
      custoMoedas: vantagem.custoMoedas,
      empresaParceiraId: vantagem.empresaParceiraId,
      imagemUrl: vantagem.imagemUrl || "",
    });
    setImagemPreview(vantagem.imagemUrl || null);
    setEditingId(vantagem.id);
    // Scroll para o formulário
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta vantagem?")) {
      return;
    }
    try {
      await VantagensApi.remove(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao excluir vantagem");
    }
  };

  const handleTrocarVantagem = async (vantagemId: number) => {
    if (!user || !hasRole("ALUNO")) return;
    if (
      !confirm(
        `Deseja trocar ${
          vantagens.find((v) => v.id === vantagemId)?.custoMoedas
        } moedas por esta vantagem?`
      )
    ) {
      return;
    }
    try {
      await MoedasApi.trocarVantagem(user.id, vantagemId);
      alert("Vantagem adquirida com sucesso!");
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao trocar vantagem");
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

      {hasRole("ALUNO") && aluno && (
        <div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
            color: "var(--text)",
          }}
        >
          <strong>Seu saldo:</strong> {aluno.saldoMoedas} moedas
        </div>
      )}

      {editingId && (
        <div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
            color: "var(--text)",
          }}
        >
          <strong>Editando vantagem:</strong> Preencha os campos abaixo e clique
          em "Atualizar Vantagem" para salvar as alterações.
        </div>
      )}

      {hasRole("EMPRESA") && (
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
          <div style={{ gridColumn: "1 / -1" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Imagem da Vantagem (URL ou upload)
            </label>
            <input
              placeholder="URL da imagem (opcional)"
              type="text"
              value={form.imagemUrl || ""}
              onChange={handleImageUrlChange}
              style={{ marginBottom: "8px" }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginBottom: "8px" }}
            />
            {imagemPreview && (
              <div
                style={{
                  marginTop: "8px",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <img
                  src={imagemPreview}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                />
                <button
                  type="button"
                  onClick={clearImage}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Remover
                </button>
              </div>
            )}
          </div>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
            <button type="submit" className="btn">
              {editingId ? "Atualizar Vantagem" : "Cadastrar Vantagem"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn"
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

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
                {v.imagemUrl && (
                  <img
                    src={v.imagemUrl}
                    alt={v.nome}
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
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  {hasRole("ALUNO") && aluno && (
                    <button
                      onClick={() => handleTrocarVantagem(v.id)}
                      disabled={aluno.saldoMoedas < v.custoMoedas}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background:
                          aluno.saldoMoedas >= v.custoMoedas
                            ? "var(--primary)"
                            : "#666",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor:
                          aluno.saldoMoedas >= v.custoMoedas
                            ? "pointer"
                            : "not-allowed",
                        fontSize: "14px",
                      }}
                    >
                      {aluno.saldoMoedas >= v.custoMoedas
                        ? "Trocar"
                        : "Saldo Insuficiente"}
                    </button>
                  )}
                  {hasRole("EMPRESA") && (
                    <>
                      <button
                        onClick={() => handleEdit(v)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: "var(--primary)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
