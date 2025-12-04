import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      // Ignorar erro
    }
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Só faz logout em caso de 401 (não autenticado)
    // 403 (sem permissão) não deve fazer logout, apenas mostrar erro
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export type Aluno = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  saldoMoedas: number;
  instituicaoEnsinoId?: number;
  instituicaoEnsinoNome?: string;
};

export type AlunoRequest = {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  instituicaoEnsinoId: number;
};

export type Empresa = {
  id: number;
  nome: string;
  email: string;
  cnpj: string;
};

export type EmpresaRequest = {
  nome: string;
  email: string;
  senha: string;
  cnpj: string;
};

export type InstituicaoEnsino = {
  id: number;
  nome: string;
};

export const AlunosApi = {
  list: async (): Promise<Aluno[]> => (await api.get("/api/alunos")).data,
  get: async (id: number): Promise<Aluno> =>
    (await api.get(`/api/alunos/${id}`)).data,
  create: async (payload: AlunoRequest): Promise<Aluno> =>
    (await api.post("/api/alunos", payload)).data,
  update: async (id: number, payload: AlunoRequest): Promise<Aluno> =>
    (await api.put(`/api/alunos/${id}`, payload)).data,
  remove: async (id: number): Promise<void> => {
    await api.delete(`/api/alunos/${id}`);
  },
};

export const EmpresasApi = {
  list: async (): Promise<Empresa[]> => (await api.get("/api/empresas")).data,
  get: async (id: number): Promise<Empresa> =>
    (await api.get(`/api/empresas/${id}`)).data,
  create: async (payload: EmpresaRequest): Promise<Empresa> =>
    (await api.post("/api/empresas", payload)).data,
  update: async (id: number, payload: EmpresaRequest): Promise<Empresa> =>
    (await api.put(`/api/empresas/${id}`, payload)).data,
  remove: async (id: number): Promise<void> => {
    await api.delete(`/api/empresas/${id}`);
  },
};

export const InstituicoesApi = {
  list: async (): Promise<InstituicaoEnsino[]> =>
    (await api.get("/api/instituicoes")).data,
};

export type EnvioMoedasRequest = {
  professorNome: string;
  alunoId: number;
  valor: number;
  descricao: string;
};

export type Transacao = {
  id: number;
  alunoId: number;
  alunoNome: string;
  alunoEmail?: string;
  valor: number;
  tipo: string;
  responsavelTipo: string;
  responsavelNome: string;
  descricao: string;
  criadoEm: string;
};

export const MoedasApi = {
  enviar: async (payload: EnvioMoedasRequest): Promise<Transacao> =>
    (await api.post("/api/moedas/professores/envio", payload)).data,
  extratoAluno: async (alunoId: number): Promise<Transacao[]> =>
    (await api.get(`/api/moedas/alunos/${alunoId}/extrato`)).data,
  extratoProfessor: async (professorNome: string): Promise<Transacao[]> =>
    (
      await api.get(`/api/moedas/professores/extrato`, {
        params: { nome: professorNome },
      })
    ).data,
  trocarVantagem: async (alunoId: number, vantagemId: number): Promise<Transacao> =>
    (await api.post(`/api/moedas/alunos/${alunoId}/trocar-vantagem/${vantagemId}`)).data,
};

export type Professor = { id: number; nome: string; email?: string; departamento?: string };

export type ProfessorRequest = {
  nome: string;
  email: string;
  senha?: string;
  departamento: string;
};

export const ProfessoresApi = {
  list: async (): Promise<Professor[]> =>
    (await api.get("/api/professores")).data,
  get: async (id: number): Promise<Professor> =>
    (await api.get(`/api/professores/${id}`)).data,
  update: async (id: number, payload: ProfessorRequest): Promise<Professor> =>
    (await api.put(`/api/professores/${id}`, payload)).data,
};

export type Vantagem = {
  id: number;
  nome: string;
  descricao: string;
  custoMoedas: number;
  imagemUrl?: string;
  empresaParceiraId: number;
  empresaParceiraNome: string;
};

export type VantagemRequest = {
  nome: string;
  descricao: string;
  custoMoedas: number;
  imagemUrl?: string;
  empresaParceiraId: number;
};

export const VantagensApi = {
  list: async (): Promise<Vantagem[]> =>
    (await api.get("/api/vantagens")).data,
  get: async (id: number): Promise<Vantagem> =>
    (await api.get(`/api/vantagens/${id}`)).data,
  create: async (payload: VantagemRequest): Promise<Vantagem> =>
    (await api.post("/api/vantagens", payload)).data,
  update: async (id: number, payload: VantagemRequest): Promise<Vantagem> =>
    (await api.put(`/api/vantagens/${id}`, payload)).data,
  remove: async (id: number): Promise<void> => {
    await api.delete(`/api/vantagens/${id}`);
  },
};

export type VantagemAdquirida = {
  id: number;
  vantagemId: number;
  vantagemNome: string;
  vantagemDescricao: string;
  vantagemImagemUrl?: string;
  empresaParceiraNome: string;
  codigoUso: string;
  resgatado: boolean;
  dataAdquisicao: string;
  dataResgate?: string;
};

export const VantagensAdquiridasApi = {
  list: async (alunoId: number): Promise<VantagemAdquirida[]> =>
    (await api.get(`/api/vantagens-adquiridas/alunos/${alunoId}`)).data,
  resgatar: async (codigoUso: string): Promise<VantagemAdquirida> =>
    (await api.post(`/api/vantagens-adquiridas/resgatar/${codigoUso}`)).data,
};