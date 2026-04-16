export interface Address {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Client {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  celular: string;
  endereco: Address;
  createdAt: string;
}

export interface Professional {
  id: string;
  authUid?: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  celular: string;
  setor: string;
  cargo: string;
  endereco: Address;
  createdAt: string;
}

export interface Supplier {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  tipo: 'Física' | 'Jurídica';
  documento: string; // CPF or CNPJ
  email: string;
  celular: string;
  nomeContato: string;
  endereco: Address;
  createdAt: string;
}

export interface Treatment {
  id: string;
  nome: string;
  valor: number;
}

export type AttendanceStatus = 'Orçamento' | 'Agendado' | 'Realizado' | 'Cancelado';

export interface Attendance {
  id: string;
  clientId: string;
  treatmentId: string;
  valor: number;
  status: AttendanceStatus;
  professionalId: string;
  dataAtendimento: string;
  observacoes?: string;
  createdAt: string;
}

export interface Sector {
  id: string;
  nome: string;
}

export interface Role {
  id: string;
  nome: string;
}

export interface AuthenticatedUser {
  uid: string;
  professionalId: string;
  nome: string;
  email: string;
  cargo?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: AuthenticatedUser;
  accessToken: string;
}
