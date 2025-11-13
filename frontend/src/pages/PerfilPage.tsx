import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  AlunosApi,
  Aluno,
  AlunoRequest,
  EmpresasApi,
  Empresa,
  EmpresaRequest,
  ProfessoresApi,
  Professor,
  ProfessorRequest,
  InstituicoesApi,
  InstituicaoEnsino,
} from "../api/client";

export function PerfilPage() {
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instituicoes, setInstituicoes] = useState<InstituicaoEnsino[]>([]);

  // Estados para Aluno
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [alunoForm, setAlunoForm] = useState<AlunoRequest | null>(null);

  // Estados para Empresa
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [empresaForm, setEmpresaForm] = useState<EmpresaRequest | null>(null);

  // Estados para Professor
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [professorForm, setProfessorForm] = useState<ProfessorRequest | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [instData] = await Promise.all([InstituicoesApi.list()]);
      setInstituicoes(instData);

      if (hasRole("ALUNO")) {
        const alunoData = await AlunosApi.get(user.id);
        setAluno(alunoData);
        setAlunoForm({
          nome: alunoData.nome,
          email: alunoData.email,
          senha: "",
          cpf: alunoData.cpf,
          rg: alunoData.rg,
          endereco: alunoData.endereco,
          curso: alunoData.curso,
          instituicaoEnsinoId: alunoData.instituicaoEnsinoId || 1,
        });
      } else if (hasRole("EMPRESA")) {
        const empresaData = await EmpresasApi.get(user.id);
        setEmpresa(empresaData);
        setEmpresaForm({
          nome: empresaData.nome,
          email: empresaData.email,
          senha: "",
          cnpj: empresaData.cnpj,
        });
      } else if (hasRole("PROFESSOR")) {
        const profData = await ProfessoresApi.get(user.id);
        setProfessor(profData);
        setProfessorForm({
          nome: profData.nome,
          email: profData.email || "",
          senha: "",
          departamento: profData.departamento || "",
        });
      }
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleAlunoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoForm || !user) return;

    try {
      const payload = { ...alunoForm };
      if (!payload.senha || payload.senha.trim() === "") {
        delete (payload as any).senha;
      }
      await AlunosApi.update(user.id, payload);
      await loadData();
      alert("Perfil atualizado com sucesso!");
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao atualizar perfil");
    }
  };

  const handleEmpresaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaForm || !user) return;

    try {
      const payload = { ...empresaForm };
      if (!payload.senha || payload.senha.trim() === "") {
        delete (payload as any).senha;
      }
      await EmpresasApi.update(user.id, payload);
      await loadData();
      alert("Perfil atualizado com sucesso!");
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao atualizar perfil");
    }
  };

  const handleProfessorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professorForm || !user) return;

    try {
      const payload = { ...professorForm };
      if (!payload.senha || payload.senha.trim() === "") {
        delete payload.senha;
      }
      await ProfessoresApi.update(user.id, payload);
      await loadData();
      alert("Perfil atualizado com sucesso!");
    } catch (e: any) {
      alert(e?.response?.data?.error || "Erro ao atualizar perfil");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p style={{ color: "#ef4444" }}>{error}</p>;
  }

  return (
    <div>
      <h2 className="section-title">Meu Perfil</h2>

      {hasRole("ALUNO") && alunoForm && (
        <form onSubmit={handleAlunoSubmit} className="form-grid">
          <input
            placeholder="Nome"
            value={alunoForm.nome}
            onChange={(e) => setAlunoForm({ ...alunoForm, nome: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={alunoForm.email}
            onChange={(e) => setAlunoForm({ ...alunoForm, email: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            type="password"
            placeholder="Nova Senha (deixe em branco para manter)"
            value={alunoForm.senha}
            onChange={(e) => setAlunoForm({ ...alunoForm, senha: e.target.value })}
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            placeholder="CPF"
            value={alunoForm.cpf}
            onChange={(e) => setAlunoForm({ ...alunoForm, cpf: e.target.value })}
            required
          />
          <input
            placeholder="RG"
            value={alunoForm.rg}
            onChange={(e) => setAlunoForm({ ...alunoForm, rg: e.target.value })}
            required
          />
          <input
            placeholder="Endereço"
            value={alunoForm.endereco}
            onChange={(e) => setAlunoForm({ ...alunoForm, endereco: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            placeholder="Curso"
            value={alunoForm.curso}
            onChange={(e) => setAlunoForm({ ...alunoForm, curso: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <select
            value={alunoForm.instituicaoEnsinoId}
            onChange={(e) =>
              setAlunoForm({ ...alunoForm, instituicaoEnsinoId: Number(e.target.value) })
            }
            required
            style={{ gridColumn: "1 / -1" }}
          >
            <option value="">Selecione uma instituição</option>
            {instituicoes.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.nome}
              </option>
            ))}
          </select>
          {aluno && (
            <div style={{ gridColumn: "1 / -1", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
              <strong>Saldo de Moedas:</strong> {aluno.saldoMoedas}
            </div>
          )}
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn">
              Atualizar Perfil
            </button>
          </div>
        </form>
      )}

      {hasRole("EMPRESA") && empresaForm && (
        <form onSubmit={handleEmpresaSubmit} className="form-grid">
          <input
            placeholder="Nome"
            value={empresaForm.nome}
            onChange={(e) => setEmpresaForm({ ...empresaForm, nome: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={empresaForm.email}
            onChange={(e) => setEmpresaForm({ ...empresaForm, email: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            type="password"
            placeholder="Nova Senha (deixe em branco para manter)"
            value={empresaForm.senha}
            onChange={(e) => setEmpresaForm({ ...empresaForm, senha: e.target.value })}
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            placeholder="CNPJ"
            value={empresaForm.cnpj}
            onChange={(e) => setEmpresaForm({ ...empresaForm, cnpj: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn">
              Atualizar Perfil
            </button>
          </div>
        </form>
      )}

      {hasRole("PROFESSOR") && professorForm && (
        <form onSubmit={handleProfessorSubmit} className="form-grid">
          <input
            placeholder="Nome"
            value={professorForm.nome}
            onChange={(e) => setProfessorForm({ ...professorForm, nome: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={professorForm.email}
            onChange={(e) => setProfessorForm({ ...professorForm, email: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            type="password"
            placeholder="Nova Senha (deixe em branco para manter)"
            value={professorForm.senha}
            onChange={(e) => setProfessorForm({ ...professorForm, senha: e.target.value })}
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            placeholder="Departamento"
            value={professorForm.departamento}
            onChange={(e) => setProfessorForm({ ...professorForm, departamento: e.target.value })}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn">
              Atualizar Perfil
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

