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
import { enviarEmailsTransacao } from "../services/emailService";
import { useAuth } from "../contexts/AuthContext";

export function MoedasPage() {
  const { user } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [envio, setEnvio] = useState<EnvioMoedasRequest>({
    professorNome: user?.nome || "",
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
        if (user?.nome) {
          setEnvio((prev) => ({ ...prev, professorNome: user.nome }));
        }
        setError(null);
      } catch (e: any) {
        setError(e?.response?.data?.error || "Erro ao carregar alunos");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const submitEnvio = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      const tx = await MoedasApi.enviar(envio);
      setResultadoEnvio(tx);
      
      // Buscar informações do aluno e professor para enviar emails
      const alunoSelecionado = alunos.find(a => a.id === envio.alunoId);
      const professorSelecionado = professores.find(p => p.nome === envio.professorNome);
      
      if (alunoSelecionado && professorSelecionado && alunoSelecionado.email && professorSelecionado.email) {
        try {
          // Enviar emails via EmailJS
          await enviarEmailsTransacao({
            professorNome: envio.professorNome,
            professorEmail: professorSelecionado.email,
            alunoNome: alunoSelecionado.nome,
            alunoEmail: alunoSelecionado.email,
            valor: envio.valor,
            descricao: envio.descricao,
            dataTransacao: new Date().toLocaleString('pt-BR'),
          });
          alert("Moedas enviadas com sucesso! Emails de confirmação enviados.");
        } catch (emailError) {
          console.error("Erro ao enviar emails:", emailError);
          alert("Moedas enviadas com sucesso! Porém, houve um erro ao enviar os emails de confirmação.");
        }
      } else {
        alert("Moedas enviadas com sucesso! (Emails não enviados: informações de email não encontradas)");
      }
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
          <input
            type="text"
            value={envio.professorNome}
            readOnly
            style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.05)" }}
          />
          <label style={{ gridColumn: "1 / -1", fontSize: "12px", color: "var(--muted)" }}>
            Professor: {user?.nome}
          </label>
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
