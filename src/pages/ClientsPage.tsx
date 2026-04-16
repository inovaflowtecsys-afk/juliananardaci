import React from 'react';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import { db } from '@/services/mockDb';
import { Client, Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/MaskedInput';
import { FormSectionHeader } from '@/components/FormSectionHeader';
import { toast } from 'sonner';
import { formatPhone, isValidCpf, onlyDigits, formatCpf } from '@/lib/utils';

const emptyAddress: Address = {
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: ''
};

const emptyClient: Client = {
  id: '',
  nome: '',
  cpf: '',
  dataNascimento: '',
  email: '',
  celular: '',
  endereco: { ...emptyAddress },
  createdAt: ''
};

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'table' | 'form'>('table');
  const [editingClient, setEditingClient] = React.useState<Client>(emptyClient);
  const [errors, setErrors] = React.useState<any>({});

  const requiredMessages: Record<string, string> = {
    nome: 'Nome é obrigatório',
    cpf: 'CPF é obrigatório',
    dataNascimento: 'Data de nascimento é obrigatória',
    celular: 'Celular é obrigatório',
    cep: 'CEP é obrigatório',
    logradouro: 'Logradouro é obrigatório',
    numero: 'Número é obrigatório',
    bairro: 'Bairro é obrigatório',
    cidade: 'Cidade é obrigatória',
    uf: 'UF é obrigatório'
  };

  const setFieldError = (field: string, value: string) => {
    setErrors((prev: any) => ({
      ...prev,
      [field]: value.trim() ? undefined : requiredMessages[field]
    }));
  };

  const clearFieldErrorIfValid = (field: string, value: string) => {
    if (value.trim() && errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCpfField = (value: string) => {
    const digits = onlyDigits(value);
    if (!digits) return requiredMessages.cpf;
    if (digits.length !== 11) return 'CPF inválido. Informe os 11 dígitos';
    if (!isValidCpf(digits)) return 'CPF inválido';
    return undefined;
  };

  const loadClients = () => {
    setClients(db.getClients());
  };

  React.useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    onlyDigits(c.cpf).includes(onlyDigits(searchTerm)) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    const newErrors: any = {};
    if (!editingClient.nome) newErrors.nome = 'Nome é obrigatório';
    const cpfError = validateCpfField(editingClient.cpf);
    if (cpfError) newErrors.cpf = cpfError;
    if (!editingClient.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    if (!editingClient.celular) newErrors.celular = 'Celular é obrigatório';
    if (!editingClient.endereco.cep) newErrors.cep = 'CEP é obrigatório';
    if (!editingClient.endereco.logradouro) newErrors.logradouro = 'Logradouro é obrigatório';
    if (!editingClient.endereco.numero) newErrors.numero = 'Número é obrigatório';
    if (!editingClient.endereco.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!editingClient.endereco.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!editingClient.endereco.uf) newErrors.uf = 'UF é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    db.saveClient(editingClient);
    toast.success(editingClient.id ? 'Cliente atualizado' : 'Cliente cadastrado');
    setViewMode('table');
    loadClients();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este cliente?')) {
      db.deleteClient(id);
      toast.success('Cliente excluído');
      loadClients();
    }
  };

  const openNew = () => {
    setEditingClient({ ...emptyClient, endereco: { ...emptyAddress } });
    setErrors({});
    setViewMode('form');
  };

  const openEdit = (client: Client) => {
    setEditingClient({ ...client });
    setErrors({});
    setViewMode('form');
  };

  const handleCancel = () => {
    setViewMode('table');
  };

  const handleCepChange = async (cep: string) => {
    setEditingClient(prev => ({...prev, endereco: {...prev.endereco, cep}}));
    clearFieldErrorIfValid('cep', cep);
    
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setEditingClient(prev => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf
            }
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {viewMode === 'table' ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b79d74]" size={18} />
              <Input 
                placeholder="Buscar por nome, CPF ou email..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openNew} className="gap-2">
              <Plus size={18} /> Novo Cliente
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#dcc8a1] bg-[#fffdfa] shadow-[0_18px_40px_rgba(223,198,150,0.10)]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden md:table-cell">CPF</TableHead>
                    <TableHead className="hidden lg:table-cell">Contato</TableHead>
                    <TableHead className="hidden md:table-cell">Cidade/UF</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4e8cf] text-[#7e6746] flex-shrink-0">
                                <User size={16} />
                              </div>
                              <span>{client.nome}</span>
                            </div>
                            <div className="md:hidden flex flex-col gap-0.5 text-xs text-[#8a7452] ml-11">
                              <span>{formatCpf(client.cpf)}</span>
                              <span>{formatPhone(client.celular)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatCpf(client.cpf)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-col">
                            <span className="text-sm">{formatPhone(client.celular)}</span>
                            <span className="text-xs text-[#8a7452]">{client.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{client.endereco.cidade}/{client.endereco.uf}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(client)} className="h-8 w-8">
                              <Edit2 size={14} className="text-[#6d5a3d]" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)} className="h-8 w-8">
                              <Trash2 size={14} className="text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-[#8a7452]">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-[#dcc8a1] bg-[#fffdfa] p-6 shadow-[0_18px_40px_rgba(223,198,150,0.10)]">
          <h2 className="mb-6 text-xl font-bold text-slate-700">{editingClient.id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
            <FormSectionHeader title="DADOS CADASTRAIS" className="col-span-1 md:col-span-12" />

            {/* Row 1: CPF, Nome, Nascimento */}
            <div className="col-span-1 md:col-span-2">
              <MaskedInput
                label="CPF"
                mask="000.000.000-00"
                value={editingClient.cpf}
                onChange={(val) => {
                  setEditingClient({...editingClient, cpf: val});
                  const validationError = validateCpfField(val);
                  if (!validationError && errors.cpf) {
                    setErrors((prev: any) => ({ ...prev, cpf: undefined }));
                  }
                }}
                onBlur={() => {
                  const validationError = validateCpfField(editingClient.cpf);
                  setErrors((prev: any) => ({ ...prev, cpf: validationError }));
                }}
                required
                error={errors.cpf}
                className="h-10"
              />
            </div>
            <div className="col-span-1 md:col-span-7 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Nome completo <span className="text-destructive">*</span></Label>
              <Input 
                value={editingClient.nome} 
                onChange={(e) => {
                  setEditingClient({...editingClient, nome: e.target.value});
                  clearFieldErrorIfValid('nome', e.target.value);
                }}
                onBlur={(e) => setFieldError('nome', e.target.value)}
                required
                className="h-10"
                placeholder="Digite seu nome completo"
              />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
            </div>
            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Nascimento <span className="text-destructive">*</span></Label>
              <Input 
                type="date"
                value={editingClient.dataNascimento} 
                onChange={(e) => {
                  setEditingClient({...editingClient, dataNascimento: e.target.value});
                  clearFieldErrorIfValid('dataNascimento', e.target.value);
                }}
                onBlur={(e) => setFieldError('dataNascimento', e.target.value)}
                required
                className="h-10"
              />
              {errors.dataNascimento && <p className="text-xs text-destructive">{errors.dataNascimento}</p>}
            </div>

            {/* Section: ENDEREÇO */}
            <FormSectionHeader title="ENDEREÇO" className="col-span-1 md:col-span-12 pt-4" />

            {/* Row 2: CEP, Logradouro, Número, Complemento */}
            <div className="col-span-1 md:col-span-2">
              <MaskedInput
                label="CEP"
                mask="00000-000"
                value={editingClient.endereco.cep}
                onChange={handleCepChange}
                onBlur={() => setFieldError('cep', editingClient.endereco.cep)}
                required
                error={errors.cep}
                className="h-10"
              />
            </div>
            <div className="col-span-1 md:col-span-5 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Logradouro <span className="text-destructive">*</span></Label>
              <Input 
                value={editingClient.endereco.logradouro} 
                onChange={(e) => {
                  setEditingClient({...editingClient, endereco: {...editingClient.endereco, logradouro: e.target.value}});
                  clearFieldErrorIfValid('logradouro', e.target.value);
                }}
                onBlur={(e) => setFieldError('logradouro', e.target.value)}
                required
                className="h-10"
                placeholder="Nome da rua e número"
              />
              {errors.logradouro && <p className="text-xs text-destructive">{errors.logradouro}</p>}
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Número <span className="text-destructive">*</span></Label>
              <Input 
                value={editingClient.endereco.numero} 
                onChange={(e) => {
                  setEditingClient({...editingClient, endereco: {...editingClient.endereco, numero: e.target.value}});
                  clearFieldErrorIfValid('numero', e.target.value);
                }}
                onBlur={(e) => setFieldError('numero', e.target.value)}
                required
                className="h-10"
                placeholder="123"
              />
              {errors.numero && <p className="text-xs text-destructive">{errors.numero}</p>}
            </div>
            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Complemento</Label>
              <Input 
                value={editingClient.endereco.complemento} 
                onChange={(e) => setEditingClient({...editingClient, endereco: {...editingClient.endereco, complemento: e.target.value}})}
                className="h-10"
                placeholder="Apto, bloco, sala"
              />
            </div>

            {/* Row 3: Bairro, Cidade, UF */}
            <div className="col-span-1 md:col-span-4 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Bairro <span className="text-destructive">*</span></Label>
              <Input 
                value={editingClient.endereco.bairro} 
                onChange={(e) => {
                  setEditingClient({...editingClient, endereco: {...editingClient.endereco, bairro: e.target.value}});
                  clearFieldErrorIfValid('bairro', e.target.value);
                }}
                onBlur={(e) => setFieldError('bairro', e.target.value)}
                required
                className="h-10"
                placeholder="Digite o bairro"
              />
              {errors.bairro && <p className="text-xs text-destructive">{errors.bairro}</p>}
            </div>
            <div className="col-span-1 md:col-span-6 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Cidade <span className="text-destructive">*</span></Label>
              <Input 
                value={editingClient.endereco.cidade} 
                onChange={(e) => {
                  setEditingClient({...editingClient, endereco: {...editingClient.endereco, cidade: e.target.value}});
                  clearFieldErrorIfValid('cidade', e.target.value);
                }}
                onBlur={(e) => setFieldError('cidade', e.target.value)}
                required
                className="h-10"
                placeholder="Digite a cidade"
              />
              {errors.cidade && <p className="text-xs text-destructive">{errors.cidade}</p>}
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">UF <span className="text-destructive">*</span></Label>
              <Input 
                value={editingClient.endereco.uf} 
                onChange={(e) => {
                  setEditingClient({...editingClient, endereco: {...editingClient.endereco, uf: e.target.value}});
                  clearFieldErrorIfValid('uf', e.target.value);
                }}
                onBlur={(e) => setFieldError('uf', e.target.value)}
                required
                maxLength={2}
                className="h-10"
                placeholder="SP"
              />
              {errors.uf && <p className="text-xs text-destructive">{errors.uf}</p>}
            </div>

            {/* Row 4: E-mail, Celular */}
            <div className="col-span-1 md:col-span-6 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">E-mail</Label>
              <Input 
                type="email"
                value={editingClient.email} 
                onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                className="h-10"
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="col-span-1 md:col-span-6">
              <MaskedInput
                label="Celular"
                mask="(00) 00000-0000"
                value={editingClient.celular}
                onChange={(val) => {
                  setEditingClient({...editingClient, celular: val});
                  clearFieldErrorIfValid('celular', val);
                }}
                onBlur={() => setFieldError('celular', editingClient.celular)}
                required
                error={errors.celular}
                className="h-10"
                placeholder="(11) 98765-4321"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#e7d7b8] pt-6">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      )}
    </div>
  );
};
