import React from 'react';
import { Modal } from './Modal';
import { FormRow, FormField, Input } from './FormComponents';

export const ClientModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastro de Cliente" onSave={() => console.log('Salvar')}>
      <form className="space-y-6">
        <FormRow>
          <FormField label="CPF *" colSpan={3}>
            <Input placeholder="000.000.000-00" />
          </FormField>
          <FormField label="Nome completo *" colSpan={6}>
            <Input placeholder="Digite o nome completo" />
          </FormField>
          <FormField label="Nascimento *" colSpan={3}>
            <Input type="date" />
          </FormField>
        </FormRow>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">ENDEREÇO</h3>
          <FormRow>
            <FormField label="CEP *" colSpan={3}>
              <Input placeholder="00000-000" />
            </FormField>
            <FormField label="Logradouro *" colSpan={6}>
              <Input placeholder="Rua, Avenida..." />
            </FormField>
            <FormField label="Número *" colSpan={1}>
              <Input />
            </FormField>
            <FormField label="Complemento" colSpan={2}>
              <Input />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Bairro *" colSpan={4}>
              <Input />
            </FormField>
            <FormField label="Cidade *" colSpan={5}>
              <Input />
            </FormField>
            <FormField label="UF *" colSpan={3}>
              <Input />
            </FormField>
          </FormRow>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <FormRow>
            <FormField label="E-mail" colSpan={6}>
              <Input type="email" placeholder="exemplo@email.com" />
            </FormField>
            <FormField label="Celular *" colSpan={6}>
              <Input placeholder="(00) 00000-0000" />
            </FormField>
          </FormRow>
        </div>
      </form>
    </Modal>
  );
};
