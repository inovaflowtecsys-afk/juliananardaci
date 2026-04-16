import React from 'react';
import { Plus, Search, Edit2, Trash2, User, Check } from 'lucide-react';
import { db } from '@/services/mockDb';
import { Professional, Address, Sector, Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/MaskedInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { FormSectionHeader } from '@/components/FormSectionHeader';
import { toast } from 'sonner';
import { isValidCpf, onlyDigits, formatCpf } from '@/lib/utils';

const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem'));
    reader.readAsDataURL(file);
  });

const emptyAddress: Address = {
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: ''
};

const emptyProfessional: Professional = {
  id: '',
  fotoBase64: '',
  status: 'Ativo',
  nome: '',
  cpf: '',
  dataNascimento: '',
  email: '',
  celular: '',
  setor: '',
  cargo: '',
  endereco: { ...emptyAddress },
  createdAt: ''
};

export const ProfessionalsPage: React.FC = () => {
  const [professionals, setProfessionals] = React.useState<Professional[]>([]);
  const [sectors, setSectors] = React.useState<Sector[]>([]);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'table' | 'form'>('table');
  const [editingProfessional, setEditingProfessional] = React.useState<Professional>(emptyProfessional);
  const [isAddingSector, setIsAddingSector] = React.useState(false);
  const [isAddingRole, setIsAddingRole] = React.useState(false);
  const [newSectorName, setNewSectorName] = React.useState('');
  const [newRoleName, setNewRoleName] = React.useState('');
  const [errors, setErrors] = React.useState<any>({});

  const requiredMessages: Record<string, string> = {
    nome: 'Nome é obrigatório',
    cpf: 'CPF é obrigatório',
    status: 'Status é obrigatório',
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

  const loadProfessionals = () => {
    setProfessionals(db.getProfessionals());
    setSectors(db.getSectors());
    setRoles(db.getRoles());
  };

  React.useEffect(() => {
    loadProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    onlyDigits(p.cpf).includes(onlyDigits(searchTerm)) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    const newErrors: any = {};
    if (!editingProfessional.nome) newErrors.nome = 'Nome é obrigatório';
    const cpfError = validateCpfField(editingProfessional.cpf);
    if (cpfError) newErrors.cpf = cpfError;
    if (!editingProfessional.status) newErrors.status = 'Status é obrigatório';
    if (!editingProfessional.celular) newErrors.celular = 'Celular é obrigatório';
    if (!editingProfessional.endereco.cep) newErrors.cep = 'CEP é obrigatório';
    if (!editingProfessional.endereco.logradouro) newErrors.logradouro = 'Logradouro é obrigatório';
    if (!editingProfessional.endereco.numero) newErrors.numero = 'Número é obrigatório';
    if (!editingProfessional.endereco.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!editingProfessional.endereco.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!editingProfessional.endereco.uf) newErrors.uf = 'UF é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    db.saveProfessional(editingProfessional);
    toast.success(editingProfessional.id ? 'Profissional atualizado' : 'Profissional cadastrado');
    setViewMode('table');
    loadProfessionals();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este profissional?')) {
      db.deleteProfessional(id);
      toast.success('Profissional excluído');
      loadProfessionals();
    }
  };

  const openNew = () => {
    setEditingProfessional({ ...emptyProfessional, endereco: { ...emptyAddress } });
    setErrors({});
    setViewMode('form');
  };

  const openEdit = (professional: Professional) => {
    setEditingProfessional({ ...professional });
    setErrors({});
    setViewMode('form');
  };

  const handleCancel = () => {
    setViewMode('table');
  };

  const handleCepChange = async (cep: string) => {
    setEditingProfessional(prev => ({...prev, endereco: {...prev.endereco, cep}}));
    clearFieldErrorIfValid('cep', cep);
    
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setEditingProfessional(prev => ({
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

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem válido');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      toast.error('A imagem deve ter no máximo 2MB');
      event.target.value = '';
      return;
    }

    try {
      const encoded = await fileToBase64(file);
      setEditingProfessional(prev => ({ ...prev, fotoBase64: encoded }));
      toast.success('Foto carregada com sucesso');
    } catch {
      toast.error('Não foi possível converter a imagem para Base64');
    } finally {
      event.target.value = '';
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
              <Plus size={18} /> Novo Profissional
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#dcc8a1] bg-[#fffdfa] shadow-[0_18px_40px_rgba(223,198,150,0.10)]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden md:table-cell">Cargo</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessionals.length > 0 ? (
                    filteredProfessionals.map((prof) => (
                      <TableRow key={prof.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              {prof.fotoBase64 ? (
                                <img
                                  src={prof.fotoBase64}
                                  alt={prof.nome}
                                  className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4e8cf] text-[#7e6746] flex-shrink-0">
                                  <User size={16} />
                                </div>
                              )}
                              <span>{prof.nome}</span>
                            </div>
                            <div className="md:hidden flex flex-col gap-0.5 text-xs text-[#8a7452] ml-11">
                              <span>{prof.cargo}</span>
                              <span>{prof.celular}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{prof.cargo}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              prof.status === 'Ativo'
                                ? 'bg-[#ece6d8] text-slate-700'
                                : 'bg-[#f6d4d4] text-[#8a1f1f]'
                            }`}
                          >
                            {prof.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col">
                            <span className="text-sm">{prof.celular}</span>
                            <span className="text-xs text-[#8a7452]">{prof.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(prof)} className="h-8 w-8">
                              <Edit2 size={14} className="text-[#6d5a3d]" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(prof.id)} className="h-8 w-8">
                              <Trash2 size={14} className="text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-[#8a7452]">
                        Nenhum profissional encontrado.
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
          <h2 className="mb-4 text-xl font-bold text-slate-700">{editingProfessional.id ? 'Editar Profissional' : 'Novo Profissional'}</h2>
          <div className="mb-6 rounded-lg border border-[#dcc8a1] bg-[#f8f1e4] px-4 py-3 text-sm text-slate-600">
            O cadastro e a manutenção de profissionais devem ser feitos pelo administrador do sistema.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
            <FormSectionHeader title="DADOS CADASTRAIS" className="col-span-1 md:col-span-12" />

            <div className="col-span-1 md:col-span-12 space-y-2">
              <Label className="text-sm font-medium text-slate-700">Foto do profissional (Base64)</Label>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                {editingProfessional.fotoBase64 ? (
                  <img
                    src={editingProfessional.fotoBase64}
                    alt={editingProfessional.nome || 'Foto do profissional'}
                    className="h-20 w-20 rounded-xl border border-[#dcc8a1] object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-[#dcc8a1] bg-[#fff8eb] text-[#8a7452]">
                    <User size={24} />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="h-10"
                  />
                  <div className="flex items-center gap-3">
                    {editingProfessional.fotoBase64 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingProfessional(prev => ({ ...prev, fotoBase64: '' }))}
                      >
                        Remover foto
                      </Button>
                    )}
                    <span className="text-xs text-[#8a7452]">Limite de 2MB. A imagem será armazenada em Base64.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-6 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Nome completo <span className="text-destructive">*</span></Label>
              <Input 
                value={editingProfessional.nome} 
                onChange={(e) => {
                  setEditingProfessional({...editingProfessional, nome: e.target.value});
                  clearFieldErrorIfValid('nome', e.target.value);
                }}
                onBlur={(e) => setFieldError('nome', e.target.value)}
                required
                className="h-10"
                placeholder="Digite o nome completo"
              />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
            </div>
            <div className="col-span-1 md:col-span-3">
              <MaskedInput
                label="CPF"
                mask="000.000.000-00"
                value={editingProfessional.cpf}
                onChange={(val) => {
                  setEditingProfessional({...editingProfessional, cpf: val});
                  const validationError = validateCpfField(val);
                  if (!validationError && errors.cpf) {
                    setErrors((prev: any) => ({ ...prev, cpf: undefined }));
                  }
                }}
                onBlur={() => {
                  const validationError = validateCpfField(editingProfessional.cpf);
                  setErrors((prev: any) => ({ ...prev, cpf: validationError }));
                }}
                required
                error={errors.cpf}
                className="h-10"
              />
            </div>
            <div className="col-span-1 md:col-span-3">
              <MaskedInput
                label="Celular"
                mask="(00) 00000-0000"
                value={editingProfessional.celular}
                onChange={(val) => {
                  setEditingProfessional({...editingProfessional, celular: val});
                  clearFieldErrorIfValid('celular', val);
                }}
                onBlur={() => setFieldError('celular', editingProfessional.celular)}
                required
                error={errors.celular}
                className="h-10"
                placeholder="(11) 98765-4321"
              />
            </div>
            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">E-mail</Label>
              <Input 
                type="email"
                value={editingProfessional.email} 
                onChange={(e) => setEditingProfessional({...editingProfessional, email: e.target.value})}
                className="h-10 w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent"
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Setor</Label>
              <Select 
                value={editingProfessional.setor} 
                onValueChange={(val) => {
                  if (val === 'new') {
                    setIsAddingSector(true);
                  } else {
                    setEditingProfessional({...editingProfessional, setor: val});
                  }
                }}
              >
                <SelectTrigger className="h-10 w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(s => <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>)}
                  <SelectItem value="new" className="font-bold text-primary">+ Novo Setor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Cargo</Label>
              <Select 
                value={editingProfessional.cargo} 
                onValueChange={(val) => {
                  if (val === 'new') {
                    setIsAddingRole(true);
                  } else {
                    setEditingProfessional({...editingProfessional, cargo: val});
                  }
                }}
              >
                <SelectTrigger className="h-10 w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent">
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => <SelectItem key={r.id} value={r.nome}>{r.nome}</SelectItem>)}
                  <SelectItem value="new" className="font-bold text-primary">+ Novo Cargo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Status de acesso <span className="text-destructive">*</span></Label>
              <Select
                value={editingProfessional.status}
                onValueChange={(val) => {
                  setEditingProfessional({ ...editingProfessional, status: val as 'Ativo' | 'Inativo' });
                  clearFieldErrorIfValid('status', val);
                }}
              >
                <SelectTrigger className="h-10 w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
            </div>
            
            <Dialog open={isAddingSector} onOpenChange={setIsAddingSector}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Setor</DialogTitle>
                </DialogHeader>
                <Input value={newSectorName} onChange={(e) => setNewSectorName(e.target.value)} placeholder="Nome do novo setor" />
                <DialogFooter>
                  <Button onClick={() => {
                    db.addSector(newSectorName);
                    loadProfessionals();
                    setEditingProfessional({...editingProfessional, setor: newSectorName});
                    setNewSectorName('');
                    setIsAddingSector(false);
                  }}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddingRole} onOpenChange={setIsAddingRole}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Cargo</DialogTitle>
                </DialogHeader>
                <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="Nome do novo cargo" />
                <DialogFooter>
                  <Button onClick={() => {
                    db.addRole(newRoleName);
                    loadProfessionals();
                    setEditingProfessional({...editingProfessional, cargo: newRoleName});
                    setNewRoleName('');
                    setIsAddingRole(false);
                  }}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <FormSectionHeader title="ENDEREÇO" className="col-span-1 md:col-span-12 pt-4" />

            <div className="col-span-1 md:col-span-2">
              <MaskedInput
                label="CEP"
                mask="00000-000"
                value={editingProfessional.endereco.cep}
                onChange={handleCepChange}
                onBlur={() => setFieldError('cep', editingProfessional.endereco.cep)}
                required
                error={errors.cep}
                className="h-10"
              />
            </div>
            <div className="col-span-1 md:col-span-5 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Logradouro <span className="text-destructive">*</span></Label>
              <Input 
                value={editingProfessional.endereco.logradouro} 
                onChange={(e) => {
                  setEditingProfessional({...editingProfessional, endereco: {...editingProfessional.endereco, logradouro: e.target.value}});
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
                value={editingProfessional.endereco.numero} 
                onChange={(e) => {
                  setEditingProfessional({...editingProfessional, endereco: {...editingProfessional.endereco, numero: e.target.value}});
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
                value={editingProfessional.endereco.complemento} 
                onChange={(e) => setEditingProfessional({...editingProfessional, endereco: {...editingProfessional.endereco, complemento: e.target.value}})}
                className="h-10"
                placeholder="Apto, bloco, sala"
              />
            </div>
            <div className="col-span-1 md:col-span-4 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Bairro <span className="text-destructive">*</span></Label>
              <Input 
                value={editingProfessional.endereco.bairro} 
                onChange={(e) => {
                  setEditingProfessional({...editingProfessional, endereco: {...editingProfessional.endereco, bairro: e.target.value}});
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
                value={editingProfessional.endereco.cidade} 
                onChange={(e) => {
                  setEditingProfessional({...editingProfessional, endereco: {...editingProfessional.endereco, cidade: e.target.value}});
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
                value={editingProfessional.endereco.uf} 
                onChange={(e) => {
                  setEditingProfessional({...editingProfessional, endereco: {...editingProfessional.endereco, uf: e.target.value}});
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
