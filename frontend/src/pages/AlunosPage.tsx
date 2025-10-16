import { useEffect, useState } from "react";
import { AlunosApi, Aluno, AlunoRequest } from "../api/client";

export function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<AlunoRequest>({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    rg: "",
    endereco: "",
    curso: "",
    instituicaoEnsinoId: 1,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setAlunos(await AlunosApi.list());
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Erro ao carregar alunos");
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
        await AlunosApi.update(editingId, form);
      } else {
        await AlunosApi.create(form);
      }
      setForm({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        rg: "",
        endereco: "",
        curso: "",
        instituicaoEnsinoId: 1,
      });
      setEditingId(null);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao salvar aluno");
    }
  };

  const edit = (a: Aluno) => {
    setEditingId(a.id);
    setForm({
      nome: a.nome,
      email: a.email,
      senha: "",
      cpf: a.cpf,
      rg: a.rg,
      endereco: a.endereco,
      curso: a.curso,
      instituicaoEnsinoId: a.instituicaoEnsinoId || 1,
    });
  };

  const remove = async (id: number) => {
    if (!confirm("Remover aluno?")) return;
    await AlunosApi.remove(id);
    await load();
  };

  return (
    <div>
      <h2 className="section-title">Alunos</h2>
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
          placeholder="CPF"
          value={form.cpf}
          onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          required
        />
        <input
          placeholder="RG"
          value={form.rg}
          onChange={(e) => setForm({ ...form, rg: e.target.value })}
          required
        />
        <input
          placeholder="Endereço"
          value={form.endereco}
          onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          required
        />
        <input
          placeholder="Curso"
          value={form.curso}
          onChange={(e) => setForm({ ...form, curso: e.target.value })}
          required
        />
        <input
          placeholder="InstituiçãoEnsinoId"
          value={form.instituicaoEnsinoId}
          onChange={(e) =>
            setForm({ ...form, instituicaoEnsinoId: Number(e.target.value) })
          }
          required
          type="number"
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
                setForm({
                  nome: "",
                  email: "",
                  senha: "",
                  cpf: "",
                  rg: "",
                  endereco: "",
                  curso: "",
                  instituicaoEnsinoId: 1,
                });
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
            <th>CPF</th>
            <th>Curso</th>
            <th>Saldo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((a) => (
            <tr key={a.id}>
              <td>{a.nome}</td>
              <td>{a.email}</td>
              <td>{a.cpf}</td>
              <td>{a.curso}</td>
              <td>{a.saldoMoedas}</td>
              <td>
                <div className="toolbar">
                  <button className="btn secondary" onClick={() => edit(a)}>
                    Editar
                  </button>
                  <button className="btn danger" onClick={() => remove(a.id)}>
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
