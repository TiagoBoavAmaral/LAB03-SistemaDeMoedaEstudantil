import { useEffect, useState } from "react";
import {
  AlunosApi,
  Aluno,
  MoedasApi,
  EnvioMoedasRequest,
  Transacao,
  ProfessoresApi,
  Professor,
} from "../api/client";

export function MoedasPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [envio, setEnvio] = useState<EnvioMoedasRequest>({
    professorNome: "",
    alunoId: 0,
    valor: 0,
    descricao: "",
  });
  const [professores, setProfessores] = useState<Professor[]>([]);

  const [resultadoEnvio, setResultadoEnvio] = useState<Transacao | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [listaAlunos, listaProfs] = await Promise.all([
          AlunosApi.list(),
          ProfessoresApi.list(),
        ]);
        setAlunos(listaAlunos);
        setProfessores(listaProfs);
        setError(null);
      } catch (e: any) {
        setError(e?.response?.data?.error || "Erro ao carregar alunos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const submitEnvio = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      const tx = await MoedasApi.enviar(envio);
      setResultadoEnvio(tx);
      alert("Moedas enviadas com sucesso!");
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao enviar moedas");
    }
  };

  // Extratos disponíveis agora em página separada

  return (
    <div>
      <h2 className="section-title">Moedas</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p style={{ color: "#ef4444" }}>{error}</p>
      ) : null}

      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Enviar moedas (Professor → Aluno)</h3>
        <form onSubmit={submitEnvio} className="form-grid">
          <select
            value={envio.professorNome}
            onChange={(e) =>
              setEnvio({ ...envio, professorNome: e.target.value })
            }
            required
          >
            <option value="">Selecione um professor</option>
            {professores.map((p) => (
              <option key={p.id} value={p.nome}>
                {p.nome}
              </option>
            ))}
          </select>
          <select
            value={envio.alunoId}
            onChange={(e) =>
              setEnvio({ ...envio, alunoId: Number(e.target.value) })
            }
            required
          >
            <option value="">Selecione um aluno</option>
            {alunos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            placeholder="Valor"
            value={envio.valor}
            onChange={(e) =>
              setEnvio({ ...envio, valor: Number(e.target.value) })
            }
            required
          />
          <input
            placeholder="Descrição"
            value={envio.descricao}
            onChange={(e) => setEnvio({ ...envio, descricao: e.target.value })}
            required
          />
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn">
              Enviar
            </button>
          </div>
        </form>
        {resultadoEnvio && (
          <div style={{ marginTop: 8 }}>
            <strong>Transação:</strong> {resultadoEnvio.tipo}{" "}
            {resultadoEnvio.valor} para {resultadoEnvio.alunoNome}
          </div>
        )}
      </div>
      {/* Extratos foram movidos para a página /extratos */}
    </div>
  );
}
