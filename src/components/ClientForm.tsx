import React from 'react';
import { FormRow, FormField, Input } from '../components/FormComponents';

export const ClientForm = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 rounded-lg border border-slate-200">
      <form>
        {/* Row 1 */}
        <FormRow>
          <FormField label="CPF" colSpan={3}>
            <Input placeholder="000.000.000-00" />
          </FormField>
          <FormField label="Nome completo" colSpan={6}>
            <Input placeholder="Digite o nome completo" />
          </FormField>
          <FormField label="Nascimento" colSpan={3}>
            <Input type="date" />
          </FormField>
        </FormRow>

        <h3 className="text-lg font-semibold text-slate-800 mb-4 mt-6">ENDEREÇO</h3>

        {/* Row 2 */}
        <FormRow>
          <FormField label="CEP" colSpan={3}>
            <Input placeholder="00000-000" />
          </FormField>
          <FormField label="Logradouro" colSpan={6}>
            <Input placeholder="Rua, Avenida..." />
          </FormField>
          <FormField label="Número" colSpan={1}>
            <Input />
          </FormField>
          <FormField label="Complemento" colSpan={2}>
            <Input />
          </FormField>
        </FormRow>

        {/* Row 3 */}
        <FormRow>
          <FormField label="Bairro" colSpan={4}>
            <Input />
          </FormField>
          <FormField label="Cidade" colSpan={5}>
            <Input />
          </FormField>
          <FormField label="UF" colSpan={3}>
            <Input />
          </FormField>
        </FormRow>

        {/* Row 4 */}
        <FormRow>
          <FormField label="E-mail" colSpan={6}>
            <Input type="email" placeholder="exemplo@email.com" />
          </FormField>
          <FormField label="Celular" colSpan={6}>
            <Input placeholder="(00) 00000-0000" />
          </FormField>
        </FormRow>
      </form>
    </div>
  );
};
