import React from 'react';
import { ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { db } from '@/services/mockDb';
import { Client, Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/MaskedInput';
import { FormSectionHeader } from '@/components/FormSectionHeader';
import { BrandLogo } from '@/components/BrandLogo';
import { toast } from 'sonner';
import { formatPhone, isValidCpf, onlyDigits } from '@/lib/utils';
import { fetchAddressByCep } from '@/services/viaCep';

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

interface ClientRegistrationPageProps {
  onRegistrationComplete?: () => void;
  invitationToken?: string;
}

export const ClientRegistrationPage: React.FC<ClientRegistrationPageProps> = ({ 
  onRegistrationComplete, 
  invitationToken 
}) => {
  const [formData, setFormData] = React.useState<Client>(emptyClient);
  const [errors, setErrors] = React.useState<any>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isLoadingCep, setIsLoadingCep] = React.useState(false);

  const requiredMessages: Record<string, string> = {
    nome: 'Nome é obrigatório',
    cpf: 'CPF é obrigatório',
    dataNascimento: 'Data de nascimento é obrigatória',
    email: 'Email é obrigatório',
    celular: 'Celular é obrigatório',
    cep: 'CEP é obrigatório',
    logradouro: 'Logradouro é obrigatório',
    numero: 'Número é obrigatório',
    bairro: 'Bairro é obrigatório',
    cidade: 'Cidade é obrigatória',
    uf: 'UF é obrigatório'
  };

  const validateCpfField = (value: string) => {
    const digits = onlyDigits(value);
    if (!digits) return requiredMessages.cpf;
    if (digits.length !== 11) return 'CPF inválido. Informe os 11 dígitos';
    if (!isValidCpf(digits)) return 'CPF inválido';
    return undefined;
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email é obrigatório';
    if (!emailRegex.test(value)) return 'Email inválido';
    return undefined;
  };

  const handleCepChange = async (cep: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: { ...prev.endereco, cep }
    }));
    clearFieldErrorIfValid('cep', cep);

    const cleanCep = onlyDigits(cep);
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const data = await fetchAddressByCep(cleanCep);
        if (data) {
          setFormData(prev => ({
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
        toast.error('Erro ao buscar CEP');
      } finally {
        setIsLoadingCep(false);
      }
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: any = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    const cpfError = validateCpfField(formData.cpf);
    if (cpfError) newErrors.cpf = cpfError;
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    if (!formData.celular) newErrors.celular = 'Celular é obrigatório';
    if (!formData.endereco.cep) newErrors.cep = 'CEP é obrigatório';
    if (!formData.endereco.logradouro) newErrors.logradouro = 'Logradouro é obrigatório';
    if (!formData.endereco.numero) newErrors.numero = 'Número é obrigatório';
    if (!formData.endereco.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.endereco.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.endereco.uf) newErrors.uf = 'UF é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      db.saveClient(formData);
      setIsSuccess(true);
      toast.success('Cadastro realizado com sucesso!');
      
      setTimeout(() => {
        if (onRegistrationComplete) {
          onRegistrationComplete();
        }
      }, 2000);
    } catch (error) {
      toast.error('Erro ao realizar cadastro');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f4e8cf] to-[#ffe8c0] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#dcc8a1] bg-white p-8 shadow-lg text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-[#d8ba89] p-4">
              <Check className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-700">Cadastro Realizado!</h2>
          <p className="mb-6 text-[#8a7452]">
            Seu cadastro foi concluído com sucesso. Em breve você receberá um email com as próximas instruções.
          </p>
          <p className="text-sm text-[#8a7452]">
            Redirecionando para login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4e8cf] to-[#ffe8c0]">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#d8ba89] to-[#c9a876] flex-col justify-between p-12">
          <BrandLogo />
          <div className="text-white">
            <h1 className="mb-4 text-4xl font-bold">Bem-vindo!</h1>
            <p className="mb-8 text-lg opacity-90">
              Complete seu cadastro para acessar nossos serviços de estética e saúde.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white flex-shrink-0">
                  <span className="text-sm font-bold text-[#d8ba89]">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Acesso à plataforma</p>
                  <p className="text-sm opacity-90">Gerencie seus agendamentos</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white flex-shrink-0">
                  <span className="text-sm font-bold text-[#d8ba89]">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Historico de atendimentos</p>
                  <p className="text-sm opacity-90">Acompanhe seu histórico</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center p-6 sm:p-8 lg:p-12">
          <div className="lg:hidden mb-8">
            <BrandLogo />
          </div>

          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-700 mb-2">Criar Conta</h2>
              <p className="text-[#8a7452]">Preencha os dados abaixo para se registrar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormSectionHeader title="DADOS PESSOAIS" />

              {/* CPF and Nome */}
              <div className="space-y-4">
                <div>
                  <MaskedInput
                    label="CPF"
                    mask="000.000.000-00"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(val) => {
                      setFormData({ ...formData, cpf: val });
                      const validationError = validateCpfField(val);
                      if (!validationError && errors.cpf) {
                        setErrors((prev: any) => ({ ...prev, cpf: undefined }));
                      }
                    }}
                    onBlur={() => {
                      const validationError = validateCpfField(formData.cpf);
                      setErrors((prev: any) => ({ ...prev, cpf: validationError }));
                    }}
                    required
                    error={errors.cpf}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Nome Completo <span className="text-destructive">*</span></Label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => {
                      setFormData({ ...formData, nome: e.target.value });
                      clearFieldErrorIfValid('nome', e.target.value);
                    }}
                    onBlur={(e) => setFieldError('nome', e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="h-10 mt-1.5"
                  />
                  {errors.nome && <p className="text-xs text-destructive mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Data de Nascimento <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => {
                      setFormData({ ...formData, dataNascimento: e.target.value });
                      clearFieldErrorIfValid('dataNascimento', e.target.value);
                    }}
                    onBlur={(e) => setFieldError('dataNascimento', e.target.value)}
                    className="h-10 mt-1.5"
                  />
                  {errors.dataNascimento && <p className="text-xs text-destructive mt-1">{errors.dataNascimento}</p>}
                </div>
              </div>

              <FormSectionHeader title="CONTATO" />

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Email <span className="text-destructive">*</span></Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      clearFieldErrorIfValid('email', e.target.value);
                    }}
                    onBlur={(e) => {
                      const emailError = validateEmail(e.target.value);
                      setErrors((prev: any) => ({ ...prev, email: emailError }));
                    }}
                    placeholder="seu.email@exemplo.com"
                    className="h-10 mt-1.5"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <MaskedInput
                    label="Celular"
                    mask="(00) 00000-0000"
                    placeholder="(00) 00000-0000"
                    value={formData.celular}
                    onChange={(val) => {
                      setFormData({ ...formData, celular: val });
                      clearFieldErrorIfValid('celular', val);
                    }}
                    onBlur={(e) => setFieldError('celular', e.currentTarget.value)}
                    required
                    error={errors.celular}
                  />
                </div>
              </div>

              <FormSectionHeader title="ENDEREÇO" />

              <div className="space-y-4">
                <div>
                  <MaskedInput
                    label="CEP"
                    mask="00000-000"
                    placeholder="00000-000"
                    value={formData.endereco.cep}
                    onChange={(val) => handleCepChange(val)}
                    onBlur={() => {
                      const cleanCep = onlyDigits(formData.endereco.cep);
                      if (cleanCep.length !== 8) {
                        setErrors((prev: any) => ({ ...prev, cep: 'CEP inválido' }));
                      }
                    }}
                    required
                    error={errors.cep}
                    disabled={isLoadingCep}
                  />
                  {isLoadingCep && <p className="text-xs text-[#8a7452] mt-1">Buscando endereço...</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Logradouro <span className="text-destructive">*</span></Label>
                  <Input
                    value={formData.endereco.logradouro}
                    onChange={(e) => {
                      setFormData({ ...formData, endereco: { ...formData.endereco, logradouro: e.target.value } });
                      clearFieldErrorIfValid('logradouro', e.target.value);
                    }}
                    onBlur={(e) => setFieldError('logradouro', e.target.value)}
                    placeholder="Rua, Avenida, etc"
                    className="h-10 mt-1.5"
                  />
                  {errors.logradouro && <p className="text-xs text-destructive mt-1">{errors.logradouro}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Número <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.endereco.numero}
                      onChange={(e) => {
                        setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } });
                        clearFieldErrorIfValid('numero', e.target.value);
                      }}
                      onBlur={(e) => setFieldError('numero', e.target.value)}
                      placeholder="123"
                      className="h-10 mt-1.5"
                    />
                    {errors.numero && <p className="text-xs text-destructive mt-1">{errors.numero}</p>}
                  </div>

                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-slate-700">Complemento</Label>
                    <Input
                      value={formData.endereco.complemento}
                      onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, complemento: e.target.value } })}
                      placeholder="Apt 101, Sala 02, etc"
                      className="h-10 mt-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Bairro <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.endereco.bairro}
                      onChange={(e) => {
                        setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } });
                        clearFieldErrorIfValid('bairro', e.target.value);
                      }}
                      onBlur={(e) => setFieldError('bairro', e.target.value)}
                      placeholder="Nome do bairro"
                      className="h-10 mt-1.5"
                    />
                    {errors.bairro && <p className="text-xs text-destructive mt-1">{errors.bairro}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700">Cidade <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.endereco.cidade}
                      onChange={(e) => {
                        setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } });
                        clearFieldErrorIfValid('cidade', e.target.value);
                      }}
                      onBlur={(e) => setFieldError('cidade', e.target.value)}
                      placeholder="Nome da cidade"
                      className="h-10 mt-1.5"
                    />
                    {errors.cidade && <p className="text-xs text-destructive mt-1">{errors.cidade}</p>}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">UF <span className="text-destructive">*</span></Label>
                  <Input
                    maxLength={2}
                    value={formData.endereco.uf}
                    onChange={(e) => {
                      setFormData({ ...formData, endereco: { ...formData.endereco, uf: e.target.value.toUpperCase() } });
                      clearFieldErrorIfValid('uf', e.target.value);
                    }}
                    onBlur={(e) => setFieldError('uf', e.target.value)}
                    placeholder="SP"
                    className="h-10 mt-1.5 uppercase"
                  />
                  {errors.uf && <p className="text-xs text-destructive mt-1">{errors.uf}</p>}
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Após completar o cadastro, você receberá um email para confirmar sua conta e acessar a plataforma.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base font-medium"
              >
                {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
              </Button>

              <p className="text-center text-sm text-[#8a7452]">
                Ao se registrar, você concorda com nossos termos de serviço e política de privacidade.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
