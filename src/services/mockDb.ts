import { Client, Professional, Supplier, Treatment, Attendance, Sector, Role } from '../types';

// Initial Mock Data
const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    cpf: '123.456.789-00',
    dataNascimento: '1990-05-15',
    email: 'maria@example.com',
    celular: '(11) 98765-4321',
    endereco: {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      numero: '100',
      bairro: 'Sé',
      cidade: 'São Paulo',
      uf: 'SP'
    },
    createdAt: new Date().toISOString()
  }
];

const INITIAL_TREATMENTS: Treatment[] = [
  { id: '1', nome: 'Limpeza de Pele', valor: 150.00 },
  { id: '2', nome: 'Peeling Químico', valor: 250.00 },
  { id: '3', nome: 'Botox', valor: 1200.00 }
];

const INITIAL_SECTORS: Sector[] = [
  { id: '1', nome: 'Estética Facial' },
  { id: '2', nome: 'Estética Corporal' }
];

const INITIAL_ROLES: Role[] = [
  { id: '1', nome: 'Esteticista' },
  { id: '2', nome: 'Dermatologista' }
];

const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    authUid: 'auth-1',
    nome: 'Dra. Juliana Nardaci',
    cpf: '987.654.321-11',
    dataNascimento: '1985-10-20',
    email: 'juliana@clinica.com',
    celular: '(11) 99999-9999',
    setor: 'Estética Facial',
    cargo: 'Dermatologista',
    endereco: {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      numero: '200',
      bairro: 'Sé',
      cidade: 'São Paulo',
      uf: 'SP'
    },
    createdAt: new Date().toISOString()
  }
];

class MockDb {
  private clients: Client[] = [...INITIAL_CLIENTS];
  private professionals: Professional[] = [...INITIAL_PROFESSIONALS];
  private suppliers: Supplier[] = [];
  private treatments: Treatment[] = [...INITIAL_TREATMENTS];
  private attendances: Attendance[] = [];
  private sectors: Sector[] = [...INITIAL_SECTORS];
  private roles: Role[] = [...INITIAL_ROLES];

  // Helper to save to localStorage for persistence during session
  private persist() {
    localStorage.setItem('clinica_db', JSON.stringify({
      clients: this.clients,
      professionals: this.professionals,
      suppliers: this.suppliers,
      treatments: this.treatments,
      attendances: this.attendances,
      sectors: this.sectors,
      roles: this.roles
    }));
  }

  constructor() {
    const saved = localStorage.getItem('clinica_db');
    if (saved) {
      const data = JSON.parse(saved);
      this.clients = data.clients || INITIAL_CLIENTS;
      this.professionals = data.professionals || INITIAL_PROFESSIONALS;
      this.suppliers = data.suppliers || [];
      this.treatments = data.treatments || INITIAL_TREATMENTS;
      this.attendances = data.attendances || [];
      this.sectors = data.sectors || INITIAL_SECTORS;
      this.roles = data.roles || INITIAL_ROLES;
    }
  }

  // Clients
  getClients() { return this.clients; }
  saveClient(client: Client) {
    const index = this.clients.findIndex(c => c.id === client.id);
    if (index >= 0) this.clients[index] = client;
    else this.clients.push({ ...client, id: Math.random().toString(36).substr(2, 9) });
    this.persist();
  }
  deleteClient(id: string) {
    this.clients = this.clients.filter(c => c.id !== id);
    this.persist();
  }

  // Professionals
  getProfessionals() { return this.professionals; }
  saveProfessional(prof: Professional) {
    const index = this.professionals.findIndex(p => p.id === prof.id);
    if (index >= 0) this.professionals[index] = prof;
    else {
      const generatedId = Math.random().toString(36).substr(2, 9);
      this.professionals.push({ ...prof, id: generatedId, authUid: prof.authUid ?? `auth-${generatedId}` });
    }
    this.persist();
  }
  deleteProfessional(id: string) {
    this.professionals = this.professionals.filter(p => p.id !== id);
    this.persist();
  }

  // Sectors & Roles
  getSectors() { return this.sectors; }
  addSector(nome: string) {
    if (!this.sectors.find(s => s.nome === nome)) {
      this.sectors.push({ id: Math.random().toString(36).substr(2, 9), nome });
      this.persist();
    }
  }
  getRoles() { return this.roles; }
  addRole(nome: string) {
    if (!this.roles.find(r => r.nome === nome)) {
      this.roles.push({ id: Math.random().toString(36).substr(2, 9), nome });
      this.persist();
    }
  }

  // Suppliers
  getSuppliers() { return this.suppliers; }
  saveSupplier(supplier: Supplier) {
    const index = this.suppliers.findIndex(s => s.id === supplier.id);
    if (index >= 0) this.suppliers[index] = supplier;
    else this.suppliers.push({ ...supplier, id: Math.random().toString(36).substr(2, 9) });
    this.persist();
  }
  deleteSupplier(id: string) {
    this.suppliers = this.suppliers.filter(s => s.id !== id);
    this.persist();
  }

  // Treatments
  getTreatments() { return this.treatments; }
  saveTreatment(treatment: Treatment) {
    const index = this.treatments.findIndex(t => t.id === treatment.id);
    if (index >= 0) this.treatments[index] = treatment;
    else this.treatments.push({ ...treatment, id: Math.random().toString(36).substr(2, 9) });
    this.persist();
  }
  deleteTreatment(id: string) {
    this.treatments = this.treatments.filter(t => t.id !== id);
    this.persist();
  }

  // Attendances
  getAttendances(clientId?: string) {
    if (clientId) return this.attendances.filter(a => a.clientId === clientId);
    return this.attendances;
  }
  saveAttendance(attendance: Attendance) {
    const index = this.attendances.findIndex(a => a.id === attendance.id);
    if (index >= 0) this.attendances[index] = attendance;
    else this.attendances.push({ ...attendance, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() });
    this.persist();
  }
  deleteAttendance(id: string) {
    this.attendances = this.attendances.filter(a => a.id !== id);
    this.persist();
  }
}

export const db = new MockDb();
