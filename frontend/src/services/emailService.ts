import emailjs from "@emailjs/browser";

// Configurações do EmailJS
// Credenciais configuradas
const EMAILJS_SERVICE_ID = "service_vrfvy9b";
const EMAILJS_TEMPLATE_ID_PROFESSOR = "template_tj9qayg"; // Template para professor
const EMAILJS_TEMPLATE_ID_ALUNO = "template_tw3bot2"; // Template para aluno
const EMAILJS_PUBLIC_KEY = "aRmB-4voYoePWx-Ut";

// Inicializar EmailJS (chamar uma vez no início da aplicação)
export const initEmailJS = () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
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

/**
 * Envia email para o professor confirmando o envio de moedas
 */
export const enviarEmailProfessor = async (data: EmailData): Promise<void> => {
  try {
    const templateParams = {
      professor_nome: data.professorNome,
      professor_email: data.professorEmail,
      aluno_nome: data.alunoNome,
      valor: data.valor.toString(),
      descricao: data.descricao,
      data_transacao: data.dataTransacao,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_PROFESSOR,
      templateParams
    );
  } catch (error) {
    console.error("Erro ao enviar email para o professor:", error);
    throw error;
  }
};

/**
 * Envia email para o aluno notificando o recebimento de moedas
 */
export const enviarEmailAluno = async (data: EmailData): Promise<void> => {
  try {
    const templateParams = {
      aluno_nome: data.alunoNome,
      aluno_email: data.alunoEmail,
      professor_nome: data.professorNome,
      valor: data.valor.toString(),
      descricao: data.descricao,
      data_transacao: data.dataTransacao,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ALUNO,
      templateParams
    );
  } catch (error) {
    console.error("Erro ao enviar email para o aluno:", error);
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
