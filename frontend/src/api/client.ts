import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

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
