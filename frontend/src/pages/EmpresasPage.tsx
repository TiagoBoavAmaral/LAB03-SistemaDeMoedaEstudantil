import { useEffect, useState } from "react";
import { EmpresasApi, Empresa, EmpresaRequest } from "../api/client";

export function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<EmpresaRequest>({
    nome: "",
    email: "",
    senha: "",
    cnpj: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setEmpresas(await EmpresasApi.list());
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Erro ao carregar empresas");
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
      if (editingId) {
        await EmpresasApi.update(editingId, form);
      } else {
        await EmpresasApi.create(form);
      }
      setForm({ nome: "", email: "", senha: "", cnpj: "" });
      setEditingId(null);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao salvar empresa");
    }
  };

  const edit = (e: Empresa) => {
    setEditingId(e.id);
    setForm({ nome: e.nome, email: e.email, senha: "", cnpj: e.cnpj });
  };

  const remove = async (id: number) => {
    if (!confirm("Remover empresa?")) return;
    await EmpresasApi.remove(id);
    await load();
  };

  return (
    <div>
      <h2 className="section-title">Empresas</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p style={{ color: "#ef4444" }}>{error}</p>
      ) : null}

      <form onSubmit={submit} className="form-grid">
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          type="email"
        />
        <input
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
          required
          type="password"
        />
        <input
          placeholder="CNPJ"
          value={form.cnpj}
          onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
          required
        />
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
          <button type="submit" className="btn">
            {editingId ? "Atualizar" : "Criar"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ nome: "", email: "", senha: "", cnpj: "" });
              }}
              className="btn secondary"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Nome</th>
            <th>Email</th>
            <th>CNPJ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((e) => (
            <tr key={e.id}>
              <td>{e.nome}</td>
              <td>{e.email}</td>
              <td>{e.cnpj}</td>
              <td>
                <div className="toolbar">
                  <button className="btn secondary" onClick={() => edit(e)}>
                    Editar
                  </button>
                  <button className="btn danger" onClick={() => remove(e.id)}>
                    Remover
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
