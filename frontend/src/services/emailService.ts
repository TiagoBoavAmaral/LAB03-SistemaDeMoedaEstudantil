import emailjs from "@emailjs/browser";

// Configurações do EmailJS
// Credenciais configuradas (conta antiga)
const EMAILJS_SERVICE_ID = "service_vrfvy9b";
const EMAILJS_TEMPLATE_ID_PROFESSOR = "template_tj9qayg"; // Template para professor
const EMAILJS_TEMPLATE_ID_ALUNO = "template_tw3bot2"; // Template para aluno
const EMAILJS_PUBLIC_KEY = "aRmB-4voYoePWx-Ut";

// Configurações do EmailJS para confirmação de troca de vantagem (nova conta)
const EMAILJS_SERVICE_ID_VANTAGEM = "service_oxdm839";
const EMAILJS_TEMPLATE_ID_VANTAGEM = "template_pw50cin";
const EMAILJS_PUBLIC_KEY_VANTAGEM = "Pw4IN8xkVCM4bD5CX";

// Inicializar EmailJS (chamar uma vez no início da aplicação)
export const initEmailJS = () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
};

// Flag para garantir inicialização do EmailJS principal
let emailJSInitialized = false;
const ensureEmailJSInitialized = () => {
  if (!emailJSInitialized) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    emailJSInitialized = true;
  }
};

// Inicializar EmailJS para vantagens (pode ser chamado separadamente)
let vantagemEmailJSInitialized = false;
const initEmailJSVantagem = () => {
  if (!vantagemEmailJSInitialized) {
    emailjs.init(EMAILJS_PUBLIC_KEY_VANTAGEM);
    vantagemEmailJSInitialized = true;
  }
};

export interface EmailData {
  professorNome: string;
  professorEmail: string;
  alunoNome: string;
  alunoEmail: string;
  valor: number;
  descricao: string;
  dataTransacao: string;
}

export interface EmailVantagemData {
  alunoNome: string;
  alunoEmail: string;
  vantagemNome: string;
  vantagemDescricao: string;
  vantagemImagemUrl?: string;
  custoMoedas: number;
  empresaParceiraNome: string;
  dataTroca: string;
  saldoRestante: number;
}

/**
 * Envia email para o professor confirmando o envio de moedas
 */
export const enviarEmailProfessor = async (data: EmailData): Promise<void> => {
  try {
    // Garantir que EmailJS está inicializado
    ensureEmailJSInitialized();

    // Sanitizar e validar dados
    const professorEmail = sanitizeString(data.professorEmail);
    if (!professorEmail) {
      console.warn("Email do professor não disponível, não é possível enviar email de confirmação");
      throw new Error("Email do professor não disponível");
    }

    const templateParams: Record<string, string> = {
      professor_nome: sanitizeString(data.professorNome) || "Professor",
      professor_email: professorEmail,
      aluno_nome: sanitizeString(data.alunoNome) || "Aluno",
      valor: sanitizeString(data.valor) || "0",
      descricao: sanitizeString(data.descricao) || "Sem descrição",
      data_transacao: sanitizeString(data.dataTransacao) || new Date().toLocaleString("pt-BR"),
    };

    // Log para debug
    console.log("Enviando email para o professor com parâmetros:", {
      ...templateParams,
      professor_email: templateParams.professor_email ? "Email presente" : "Sem email",
    });

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_PROFESSOR,
      templateParams
    );

    console.log("Email para o professor enviado com sucesso");
  } catch (error: any) {
    console.error("Erro ao enviar email para o professor:", error);
    console.error("Detalhes do erro:", {
      status: error?.status,
      text: error?.text,
      message: error?.message,
    });
    throw error;
  }
};

/**
 * Envia email para o aluno notificando o recebimento de moedas
 */
export const enviarEmailAluno = async (data: EmailData): Promise<void> => {
  try {
    // Garantir que EmailJS está inicializado
    ensureEmailJSInitialized();

    // Sanitizar e validar dados
    const alunoEmail = sanitizeString(data.alunoEmail);
    if (!alunoEmail) {
      console.warn("Email do aluno não disponível, não é possível enviar email de confirmação");
      throw new Error("Email do aluno não disponível");
    }

    const templateParams: Record<string, string> = {
      aluno_nome: sanitizeString(data.alunoNome) || "Aluno",
      aluno_email: alunoEmail,
      professor_nome: sanitizeString(data.professorNome) || "Professor",
      valor: sanitizeString(data.valor) || "0",
      descricao: sanitizeString(data.descricao) || "Sem descrição",
      data_transacao: sanitizeString(data.dataTransacao) || new Date().toLocaleString("pt-BR"),
    };

    // Log para debug
    console.log("Enviando email para o aluno com parâmetros:", {
      ...templateParams,
      aluno_email: templateParams.aluno_email ? "Email presente" : "Sem email",
    });

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ALUNO,
      templateParams
    );

    console.log("Email para o aluno enviado com sucesso");
  } catch (error: any) {
    console.error("Erro ao enviar email para o aluno:", error);
    console.error("Detalhes do erro:", {
      status: error?.status,
      text: error?.text,
      message: error?.message,
    });
    throw error;
  }
};

/**
 * Envia emails para ambos (professor e aluno)
 */
export const enviarEmailsTransacao = async (data: EmailData): Promise<void> => {
  try {
    // Envia emails em paralelo
    await Promise.all([enviarEmailProfessor(data), enviarEmailAluno(data)]);
  } catch (error) {
    console.error("Erro ao enviar emails:", error);
    throw error;
  }
};

// Função helper para sanitizar strings e garantir que sejam válidas
const sanitizeString = (value: any): string => {
  if (value === null || value === undefined) {
    return "";
  }
  // Converter para string e remover caracteres problemáticos
  return String(value).trim();
};

/**
 * Envia email de confirmação para o aluno quando ele troca moedas por uma vantagem
 */
export const enviarEmailConfirmacaoVantagem = async (data: EmailVantagemData): Promise<void> => {
  try {
    // Inicializar EmailJS com a nova chave pública (apenas uma vez)
    initEmailJSVantagem();

    // Garantir que todas as variáveis tenham valores válidos (não undefined/null)
    const templateParams: Record<string, string> = {
      aluno_nome: sanitizeString(data.alunoNome) || "Aluno",
      aluno_email: sanitizeString(data.alunoEmail),
      vantagem_nome: sanitizeString(data.vantagemNome) || "Vantagem",
      vantagem_descricao: sanitizeString(data.vantagemDescricao) || "Sem descrição",
      vantagem_imagem: sanitizeString(data.vantagemImagemUrl) || "",
      custo_moedas: sanitizeString(data.custoMoedas) || "0",
      empresa_nome: sanitizeString(data.empresaParceiraNome) || "Empresa Parceira",
      data_troca: sanitizeString(data.dataTroca) || new Date().toLocaleString("pt-BR"),
      saldo_restante: sanitizeString(data.saldoRestante) || "0",
    };

    // Validar se o email do aluno está presente
    if (!templateParams.aluno_email) {
      console.warn("Email do aluno não disponível, não é possível enviar email de confirmação");
      return;
    }

    // Log para debug (remover em produção se necessário)
    console.log("Enviando email de confirmação com parâmetros:", {
      ...templateParams,
      vantagem_imagem: templateParams.vantagem_imagem ? "URL presente" : "Sem imagem",
    });

    await emailjs.send(
      EMAILJS_SERVICE_ID_VANTAGEM,
      EMAILJS_TEMPLATE_ID_VANTAGEM,
      templateParams
    );
    
    console.log("Email de confirmação enviado com sucesso");
  } catch (error: any) {
    console.error("Erro ao enviar email de confirmação de vantagem:", error);
    console.error("Detalhes do erro:", {
      status: error?.status,
      text: error?.text,
      message: error?.message,
    });
    // Não lançar erro para não interromper o fluxo da aplicação
    // O email é apenas uma confirmação, não é crítico
  }
};
