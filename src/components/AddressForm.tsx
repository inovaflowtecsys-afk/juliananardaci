import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MaskedInput } from './MaskedInput';
import { fetchAddressByCep } from '@/services/viaCep';
import { Address } from '@/types';

interface AddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
  errors?: any;
}

export const AddressForm: React.FC<AddressFormProps> = ({ address, onChange, errors }) => {
  const handleCepChange = async (cep: string) => {
    onChange({ ...address, cep });
    if (cep.length === 8) {
      const data = await fetchAddressByCep(cep);
      if (data) {
        onChange({
          ...address,
          cep,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf
        });
      }
    }
  };

  const handleChange = (field: keyof Address, value: string) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Endereço</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MaskedInput
          label="CEP"
          mask="00000-000"
          value={address.cep}
          onChange={handleCepChange}
          required
          error={errors?.cep}
        />
        <div className="md:col-span-2 space-y-1.5">
          <Label>Logradouro <span className="text-destructive">*</span></Label>
          <Input 
            value={address.logradouro} 
            onChange={(e) => handleChange('logradouro', e.target.value)}
            required
          />
          {errors?.logradouro && <p className="text-xs text-destructive">{errors.logradouro}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Número <span className="text-destructive">*</span></Label>
          <Input 
            value={address.numero} 
            onChange={(e) => handleChange('numero', e.target.value)}
            required
          />
          {errors?.numero && <p className="text-xs text-destructive">{errors.numero}</p>}
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label>Complemento</Label>
          <Input 
            value={address.complemento} 
            onChange={(e) => handleChange('complemento', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Bairro <span className="text-destructive">*</span></Label>
          <Input 
            value={address.bairro} 
            onChange={(e) => handleChange('bairro', e.target.value)}
            required
          />
          {errors?.bairro && <p className="text-xs text-destructive">{errors.bairro}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Cidade <span className="text-destructive">*</span></Label>
          <Input 
            value={address.cidade} 
            onChange={(e) => handleChange('cidade', e.target.value)}
            required
          />
          {errors?.cidade && <p className="text-xs text-destructive">{errors.cidade}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>UF <span className="text-destructive">*</span></Label>
          <Input 
            value={address.uf} 
            onChange={(e) => handleChange('uf', e.target.value)}
            required
            maxLength={2}
          />
          {errors?.uf && <p className="text-xs text-destructive">{errors.uf}</p>}
        </div>
      </div>
    </div>
  );
};
