import { db } from '@/services/mockDb';
import { AuthSession, AuthenticatedUser, Professional } from '@/types';

const SESSION_KEY = 'clinica_auth_session';
const DEMO_PASSWORD = '123456';
const DEFAULT_AVATAR = 'https://www.inovaflowtec.com.br/svg/junadarci.png';

function mapProfessionalToUser(professional: Professional): AuthenticatedUser {
  return {
    uid: professional.authUid ?? `auth-${professional.id}`,
    professionalId: professional.id,
    nome: professional.nome,
    email: professional.email,
    cargo: professional.cargo,
    avatarUrl: DEFAULT_AVATAR
  };
}

function buildSession(professional: Professional): AuthSession {
  return {
    user: mapProfessionalToUser(professional),
    accessToken: `mock-token-${professional.id}`
  };
}

export const mockAuth = {
  getSession(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  signIn(email: string, password: string) {
    const professional = db.getProfessionals().find(p => p.email.toLowerCase() === email.trim().toLowerCase());

    if (!professional) {
      throw new Error('Nenhum profissional vinculado a este e-mail');
    }

    if (password !== DEMO_PASSWORD) {
      throw new Error('Senha inválida');
    }

    const session = buildSession(professional);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  signOut() {
    localStorage.removeItem(SESSION_KEY);
  },

  getDemoPassword() {
    return DEMO_PASSWORD;
  }
};
