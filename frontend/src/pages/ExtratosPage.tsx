import { useEffect, useMemo, useState } from "react";
import {
  AlunosApi,
  Aluno,
  ProfessoresApi,
  Professor,
  MoedasApi,
  Transacao,
} from "../api/client";
import { useAuth } from "../contexts/AuthContext";

export function ExtratosPage() {
  const { user, hasRole } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado do extrato de aluno
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<number>(0);
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [extratoAluno, setExtratoAluno] = useState<Transacao[]>([]);

  // Estado do extrato de professor
  const [profSelecionadoNome, setProfSelecionadoNome] = useState<string>("");
  const [extratoProfessor, setExtratoProfessor] = useState<Transacao[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (hasRole("ALUNO") && user) {
          // Aluno vê apenas seu próprio extrato
          const [aluno, itens] = await Promise.all([
            AlunosApi.get(user.id),
            MoedasApi.extratoAluno(user.id),
          ]);
          setAlunoSelecionado(aluno);
          setExtratoAluno(itens);
        } else if (hasRole("PROFESSOR") && user) {
          // Professor vê seu próprio extrato
          setProfSelecionadoNome(user.nome);
          const itens = await MoedasApi.extratoProfessor(user.nome);
          setExtratoProfessor(itens);
        } else {
          // Empresa ou outros podem ver todos
          const [listaAlunos, listaProfs] = await Promise.all([
            AlunosApi.list(),
            ProfessoresApi.list(),
          ]);
          setAlunos(listaAlunos);
          setProfessores(listaProfs);
        }
        setError(null);
      } catch (e: any) {
        setError(e?.response?.data?.error || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, hasRole]);

  const consultarExtratoAluno = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!alunoSelecionadoId) return;
    try {
      const [aluno, itens] = await Promise.all([
        AlunosApi.get(alunoSelecionadoId),
        MoedasApi.extratoAluno(alunoSelecionadoId),
      ]);
      setAlunoSelecionado(aluno);
      setExtratoAluno(itens);
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao consultar extrato do aluno");
    }
  };

  const totalAluno = useMemo(
    () =>
      extratoAluno.reduce(
        (acc, t) => acc + (t.tipo === "CREDITO" ? t.valor : -t.valor),
        0
      ),
    [extratoAluno]
  );

  const consultarExtratoProfessor = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!profSelecionadoNome) return;
    try {
      const itens = await MoedasApi.extratoProfessor(profSelecionadoNome);
      setExtratoProfessor(itens);
    } catch (e: any) {
      alert(
        e?.response?.data?.error || "Erro ao consultar extrato do professor"
      );
    }
  };

  const totalConcedidoProfessor = useMemo(
    () => extratoProfessor.reduce((acc, t) => acc + (t.valor || 0), 0),
    [extratoProfessor]
  );

  return (
    <div>
      <h2 className="section-title">Extratos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p style={{ color: "#ef4444" }}>{error}</p>
      ) : null}

      {hasRole("ALUNO") ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3>Meu Extrato</h3>
          {alunoSelecionado && (
            <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
              <strong>Aluno:</strong> {alunoSelecionado.nome}
              <span>Email: {alunoSelecionado.email}</span>
              <span>Curso: {alunoSelecionado.curso}</span>
              <span>
                Instituição: {alunoSelecionado.instituicaoEnsinoNome || "N/A"}
              </span>
              <span>Saldo atual: {alunoSelecionado.saldoMoedas}</span>
              <span>Saldo calculado pelo extrato: {totalAluno}</span>
            </div>
          )}

          {extratoAluno.length > 0 && (
            <table className="table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Responsável</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {extratoAluno.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.criadoEm).toLocaleString()}</td>
                    <td>{t.tipo}</td>
                    <td>{t.valor}</td>
                    <td>{t.responsavelNome}</td>
                    <td>{t.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3>Extrato do Aluno</h3>
          <form onSubmit={consultarExtratoAluno} className="form-grid">
            <select
              value={alunoSelecionadoId}
              onChange={(e) => setAlunoSelecionadoId(Number(e.target.value))}
              required
            >
              <option value="">Selecione um aluno</option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" className="btn">
                Consultar
              </button>
            </div>
          </form>

          {alunoSelecionado && (
            <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
              <strong>Aluno:</strong> {alunoSelecionado.nome}
              <span>Email: {alunoSelecionado.email}</span>
              <span>Curso: {alunoSelecionado.curso}</span>
              <span>
                Instituição: {alunoSelecionado.instituicaoEnsinoNome || "N/A"}
              </span>
              <span>Saldo atual: {alunoSelecionado.saldoMoedas}</span>
              <span>Saldo calculado pelo extrato: {totalAluno}</span>
            </div>
          )}

          {extratoAluno.length > 0 && (
            <table className="table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Responsável</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {extratoAluno.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.criadoEm).toLocaleString()}</td>
                    <td>{t.tipo}</td>
                    <td>{t.valor}</td>
                    <td>{t.responsavelNome}</td>
                    <td>{t.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {hasRole("PROFESSOR") ? (
        <div className="card">
          <h3>Meu Extrato</h3>
          {profSelecionadoNome && (
            <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
              <strong>Professor:</strong> {profSelecionadoNome}
              <span>
                Total concedido (nesta base): {totalConcedidoProfessor}
              </span>
              <span>Nº de transações: {extratoProfessor.length}</span>
            </div>
          )}

          {extratoProfessor.length > 0 && (
            <table className="table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Aluno</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {extratoProfessor.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.criadoEm).toLocaleString()}</td>
                    <td>{t.alunoNome}</td>
                    <td>{t.tipo}</td>
                    <td>{t.valor}</td>
                    <td>{t.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : hasRole("EMPRESA") ? (
        <div className="card">
          <h3>Extrato do Professor</h3>
          <form onSubmit={consultarExtratoProfessor} className="form-grid">
            <select
              value={profSelecionadoNome}
              onChange={(e) => setProfSelecionadoNome(e.target.value)}
              required
            >
              <option value="">Selecione um professor</option>
              {professores.map((p) => (
                <option key={p.id} value={p.nome}>
                  {p.nome}
                </option>
              ))}
            </select>
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" className="btn">
                Consultar
              </button>
            </div>
          </form>

          {profSelecionadoNome && (
            <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
              <strong>Professor:</strong> {profSelecionadoNome}
              <span>
                Total concedido (nesta base): {totalConcedidoProfessor}
              </span>
              <span>Nº de transações: {extratoProfessor.length}</span>
            </div>
          )}

          {extratoProfessor.length > 0 && (
            <table className="table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Aluno</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {extratoProfessor.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.criadoEm).toLocaleString()}</td>
                    <td>{t.alunoNome}</td>
                    <td>{t.tipo}</td>
                    <td>{t.valor}</td>
                    <td>{t.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
    </div>
  );
}
