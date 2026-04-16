import React from 'react';
import { Plus, Search, Edit2, Trash2, Syringe } from 'lucide-react';
import { db } from '@/services/mockDb';
import { Treatment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const emptyTreatment: Treatment = {
  id: '',
  nome: '',
  valor: 0
};

export const TreatmentsPage: React.FC = () => {
  const [treatments, setTreatments] = React.useState<Treatment[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTreatment, setEditingTreatment] = React.useState<Treatment>(emptyTreatment);
  const [errors, setErrors] = React.useState<any>({});

  const loadTreatments = () => {
    setTreatments(db.getTreatments());
  };

  React.useEffect(() => {
    loadTreatments();
  }, []);

  const filteredTreatments = treatments.filter(t => 
    t.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    const newErrors: any = {};
    if (!editingTreatment.nome) newErrors.nome = 'Nome é obrigatório';
    if (editingTreatment.valor <= 0) newErrors.valor = 'Valor deve ser maior que zero';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    db.saveTreatment(editingTreatment);
    toast.success(editingTreatment.id ? 'Tratamento atualizado' : 'Tratamento cadastrado');
    setIsDialogOpen(false);
    loadTreatments();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este tratamento?')) {
      db.deleteTreatment(id);
      toast.success('Tratamento excluído');
      loadTreatments();
    }
  };

  const openNew = () => {
    setEditingTreatment({ ...emptyTreatment });
    setErrors({});
    setIsDialogOpen(true);
  };

  const openEdit = (treatment: Treatment) => {
    setEditingTreatment({ ...treatment });
    setErrors({});
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b79d74]" size={18} />
          <Input 
            placeholder="Buscar por nome do tratamento..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus size={18} /> Novo Tratamento
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#dcc8a1] bg-[#fffdfa] shadow-[0_18px_40px_rgba(223,198,150,0.10)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Tratamento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTreatments.length > 0 ? (
              filteredTreatments.map((treatment) => (
                <TableRow key={treatment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4e8cf] text-[#7e6746]">
                        <Syringe size={16} />
                      </div>
                      {treatment.nome}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(treatment.valor)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(treatment)}>
                        <Edit2 size={16} className="text-[#6d5a3d]" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(treatment.id)}>
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-[#8a7452]">
                  Nenhum tratamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTreatment.id ? 'Editar Tratamento' : 'Novo Tratamento'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label>Nome do Tratamento <span className="text-destructive">*</span></Label>
              <Input 
                value={editingTreatment.nome} 
                onChange={(e) => setEditingTreatment({...editingTreatment, nome: e.target.value})}
                required
              />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Valor (R$) <span className="text-destructive">*</span></Label>
              <Input 
                type="number"
                step="0.01"
                value={editingTreatment.valor} 
                onChange={(e) => setEditingTreatment({...editingTreatment, valor: parseFloat(e.target.value) || 0})}
                required
              />
              {errors.valor && <p className="text-xs text-destructive">{errors.valor}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
