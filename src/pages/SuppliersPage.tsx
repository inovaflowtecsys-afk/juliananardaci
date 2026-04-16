import React from 'react';
import { Plus, Search, Edit2, Trash2, Building2 } from 'lucide-react';
import { db } from '@/services/mockDb';
import { Supplier, Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/MaskedInput';
import { FormSectionHeader } from '@/components/FormSectionHeader';
import { isValidCpfOrCnpj, onlyDigits, formatCpfOrCnpj } from '@/lib/utils';
import { toast } from 'sonner';

const emptyAddress: Address = {
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: ''
};

const emptySupplier: Supplier = {
  id: '',
  razaoSocial: '',
  nomeFantasia: '',
  tipo: 'Jurídica',
  documento: '',
  email: '',
  celular: '',
  nomeContato: '',
  endereco: { ...emptyAddress },
  createdAt: ''
};

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'table' | 'form'>('table');
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier>(emptySupplier);
  const [errors, setErrors] = React.useState<any>({});

  const requiredMessages: Record<string, string> = {
    nomeFantasia: 'Nome fantasia é obrigatório',
    documento: 'Documento é obrigatório',
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

  const validateDocument = (value: string) => {
    const digits = onlyDigits(value);
    if (!digits) return requiredMessages.documento;
    if (digits.length !== 11 && digits.length !== 14) return 'Documento inválido. Informe CPF ou CNPJ completo';
    if (!isValidCpfOrCnpj(digits)) return `${digits.length === 11 ? 'CPF' : 'CNPJ'} inválido`;
    return undefined;
  };

  const loadSuppliers = () => {
    setSuppliers(db.getSuppliers());
  };

  React.useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(s => 
    s.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    onlyDigits(s.documento).includes(onlyDigits(searchTerm))
  );

  const handleSave = () => {
    const newErrors: any = {};
    if (!editingSupplier.nomeFantasia) newErrors.nomeFantasia = 'Nome fantasia é obrigatório';
    const documentError = validateDocument(editingSupplier.documento);
    if (documentError) newErrors.documento = documentError;
    if (!editingSupplier.endereco.cep) newErrors.cep = 'CEP é obrigatório';
    if (!editingSupplier.endereco.logradouro) newErrors.logradouro = 'Logradouro é obrigatório';
    if (!editingSupplier.endereco.numero) newErrors.numero = 'Número é obrigatório';
    if (!editingSupplier.endereco.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!editingSupplier.endereco.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!editingSupplier.endereco.uf) newErrors.uf = 'UF é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    db.saveSupplier(editingSupplier);
    toast.success(editingSupplier.id ? 'Fornecedor atualizado' : 'Fornecedor cadastrado');
    setViewMode('table');
    loadSuppliers();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este fornecedor?')) {
      db.deleteSupplier(id);
      toast.success('Fornecedor excluído');
      loadSuppliers();
    }
  };

  const openNew = () => {
    setEditingSupplier({ ...emptySupplier, endereco: { ...emptyAddress } });
    setErrors({});
    setViewMode('form');
  };

  const openEdit = (supplier: Supplier) => {
    setEditingSupplier({ ...supplier });
    setErrors({});
    setViewMode('form');
  };

  const handleCancel = () => {
    setViewMode('table');
  };

  const handleCepChange = async (cep: string) => {
    setEditingSupplier(prev => ({...prev, endereco: {...prev.endereco, cep}}));
    clearFieldErrorIfValid('cep', cep);

    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setEditingSupplier(prev => ({
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
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const documentDigits = onlyDigits(editingSupplier.documento);
  const documentMask = documentDigits.length > 11 ? '00.000.000/0000-00' : '000.000.000-00';
  const documentType = documentDigits.length > 11 ? 'CNPJ' : 'CPF';
  const documentIsComplete = documentType === 'CPF' ? documentDigits.length === 11 : documentDigits.length === 14;
  const documentHelperText = documentDigits.length
    ? `Tipo detectado: ${documentType}${documentIsComplete ? ' (completo)' : ' (incompleto)'}`
    : 'Digite CPF ou CNPJ';

  return (
    <div className="space-y-6">
      {viewMode === 'table' ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b79d74]" size={18} />
              <Input 
                placeholder="Buscar por nome fantasia, razão social ou documento..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openNew} className="gap-2">
              <Plus size={18} /> Novo Fornecedor
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#dcc8a1] bg-[#fffdfa] shadow-[0_18px_40px_rgba(223,198,150,0.10)]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Fantasia</TableHead>
                    <TableHead className="hidden md:table-cell">Documento</TableHead>
                    <TableHead className="hidden lg:table-cell">Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supp) => (
                      <TableRow key={supp.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4e8cf] text-[#7e6746] flex-shrink-0">
                                <Building2 size={16} />
                              </div>
                              <span>{supp.nomeFantasia}</span>
                            </div>
                            <div className="md:hidden flex flex-col gap-0.5 text-xs text-[#8a7452] ml-11">
                              <span>{formatCpfOrCnpj(supp.documento)}</span>
                              <span>{supp.nomeContato}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatCpfOrCnpj(supp.documento)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-col">
                            <span className="text-sm">{supp.nomeContato}</span>
                            <span className="text-xs text-[#8a7452]">{supp.celular}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(supp)} className="h-8 w-8">
                              <Edit2 size={14} className="text-[#6d5a3d]" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(supp.id)} className="h-8 w-8">
                              <Trash2 size={14} className="text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-[#8a7452]">
                        Nenhum fornecedor encontrado.
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
          <h2 className="mb-6 text-xl font-bold text-slate-700">{editingSupplier.id ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
            <FormSectionHeader title="DADOS CADASTRAIS" className="col-span-1 md:col-span-12" />

            <div className="col-span-1 md:col-span-6 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Nome Fantasia <span className="text-destructive">*</span></Label>
              <Input 
                value={editingSupplier.nomeFantasia} 
                onChange={(e) => {
                  setEditingSupplier({...editingSupplier, nomeFantasia: e.target.value});
                  clearFieldErrorIfValid('nomeFantasia', e.target.value);
                }}
                onBlur={(e) => setFieldError('nomeFantasia', e.target.value)}
                required
                className="h-10"
                placeholder="Nome fantasia"
              />
              {errors.nomeFantasia && <p className="text-xs text-destructive">{errors.nomeFantasia}</p>}
            </div>
            <div className="col-span-1 md:col-span-6 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Razão Social</Label>
              <Input 
                value={editingSupplier.razaoSocial} 
                onChange={(e) => setEditingSupplier({...editingSupplier, razaoSocial: e.target.value})}
                className="h-10"
                placeholder="Razão social"
              />
            </div>
            <div className="col-span-1 md:col-span-3">
              <MaskedInput
                label="Documento *"
                mask={documentMask}
                value={editingSupplier.documento} 
                onChange={(value) => {
                  setEditingSupplier({...editingSupplier, documento: value});
                  const validationError = validateDocument(value);
                  if (!validationError && errors.documento) {
                    setErrors((prev: any) => ({ ...prev, documento: undefined }));
                  }
                }}
                onBlur={() => {
                  const validationError = validateDocument(editingSupplier.documento);
                  setErrors((prev: any) => ({ ...prev, documento: validationError }));
                }}
                required
                className="h-10"
                placeholder="CPF ou CNPJ"
                error={errors.documento}
              />
              <p className={`mt-1 text-xs ${documentIsComplete ? 'text-slate-700' : 'text-[#8a7452]'}`}>
                {documentHelperText}
              </p>
            </div>
            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Contato</Label>
              <Input 
                value={editingSupplier.nomeContato} 
                onChange={(e) => setEditingSupplier({...editingSupplier, nomeContato: e.target.value})}
                className="h-10"
                placeholder="Nome do contato"
              />
            </div>
            <div className="col-span-1 md:col-span-6">
              <MaskedInput
                label="Celular"
                mask="(00) 00000-0000"
                value={editingSupplier.celular}
                onChange={(val) => setEditingSupplier({...editingSupplier, celular: val})}
                className="h-10"
                placeholder="(11) 98765-4321"
              />
            </div>

            <FormSectionHeader title="ENDEREÇO" className="col-span-1 md:col-span-12 pt-4" />

            <div className="col-span-1 md:col-span-2">
              <MaskedInput
                label="CEP"
                mask="00000-000"
                value={editingSupplier.endereco.cep}
                onChange={handleCepChange}
                onBlur={() => setFieldError('cep', editingSupplier.endereco.cep)}
                required
                error={errors.cep}
                className="h-10"
              />
            </div>
            <div className="col-span-1 md:col-span-5 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Logradouro <span className="text-destructive">*</span></Label>
              <Input 
                value={editingSupplier.endereco.logradouro} 
                onChange={(e) => {
                  setEditingSupplier({...editingSupplier, endereco: {...editingSupplier.endereco, logradouro: e.target.value}});
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
                value={editingSupplier.endereco.numero} 
                onChange={(e) => {
                  setEditingSupplier({...editingSupplier, endereco: {...editingSupplier.endereco, numero: e.target.value}});
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
                value={editingSupplier.endereco.complemento} 
                onChange={(e) => setEditingSupplier({...editingSupplier, endereco: {...editingSupplier.endereco, complemento: e.target.value}})}
                className="h-10"
                placeholder="Apto, bloco, sala"
              />
            </div>

            <div className="col-span-1 md:col-span-4 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Bairro <span className="text-destructive">*</span></Label>
              <Input 
                value={editingSupplier.endereco.bairro} 
                onChange={(e) => {
                  setEditingSupplier({...editingSupplier, endereco: {...editingSupplier.endereco, bairro: e.target.value}});
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
                value={editingSupplier.endereco.cidade} 
                onChange={(e) => {
                  setEditingSupplier({...editingSupplier, endereco: {...editingSupplier.endereco, cidade: e.target.value}});
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
                value={editingSupplier.endereco.uf} 
                onChange={(e) => {
                  setEditingSupplier({...editingSupplier, endereco: {...editingSupplier.endereco, uf: e.target.value}});
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
