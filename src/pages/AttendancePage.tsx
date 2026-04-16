import React from 'react';
import { Plus, Search, Edit2, Trash2, ClipboardList, Calendar as CalendarIcon } from 'lucide-react';
import { db } from '@/services/mockDb';
import { Attendance, Client, Treatment, Professional, AttendanceStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const emptyAttendance: Attendance = {
  id: '',
  clientId: '',
  treatmentId: '',
  valor: 0,
  status: 'Orçamento',
  professionalId: '',
  dataAtendimento: new Date().toISOString().split('T')[0],
  observacoes: '',
  createdAt: ''
};

const statusColors: Record<AttendanceStatus, string> = {
  'Orçamento': 'bg-[#f4e8cf] text-[#6f5d3d]',
  'Agendado': 'bg-[#e8f6fa] text-[#0f6f8d]',
  'Realizado': 'bg-[#e7f4ef] text-[#1d6f68]',
  'Cancelado': 'bg-red-100 text-red-700'
};

export const AttendancePage: React.FC = () => {
  const [attendances, setAttendances] = React.useState<Attendance[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [treatments, setTreatments] = React.useState<Treatment[]>([]);
  const [professionals, setProfessionals] = React.useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingAttendance, setEditingAttendance] = React.useState<Attendance>(emptyAttendance);
  const [errors, setErrors] = React.useState<any>({});

  const loadData = () => {
    setAttendances(db.getAttendances());
    setClients(db.getClients());
    setTreatments(db.getTreatments());
    setProfessionals(db.getProfessionals());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const filteredAttendances = attendances.filter(a => {
    const client = clients.find(c => c.id === a.clientId);
    const treatment = treatments.find(t => t.id === a.treatmentId);
    return (
      client?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment?.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleTreatmentChange = (treatmentId: string) => {
    const treatment = treatments.find(t => t.id === treatmentId);
    setEditingAttendance({
      ...editingAttendance,
      treatmentId,
      valor: treatment ? treatment.valor : 0
    });
  };

  const handleSave = () => {
    const newErrors: any = {};
    if (!editingAttendance.clientId) newErrors.clientId = 'Cliente é obrigatório';
    if (!editingAttendance.treatmentId) newErrors.treatmentId = 'Tratamento é obrigatório';
    if (!editingAttendance.professionalId) newErrors.professionalId = 'Profissional é obrigatório';
    if (!editingAttendance.dataAtendimento) newErrors.dataAtendimento = 'Data é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    db.saveAttendance(editingAttendance);
    toast.success(editingAttendance.id ? 'Atendimento atualizado' : 'Atendimento registrado');
    setIsDialogOpen(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este atendimento?')) {
      db.deleteAttendance(id);
      toast.success('Atendimento excluído');
      loadData();
    }
  };

  const openNew = () => {
    setEditingAttendance({ ...emptyAttendance });
    setErrors({});
    setIsDialogOpen(true);
  };

  const openEdit = (attendance: Attendance) => {
    setEditingAttendance({ ...attendance });
    setErrors({});
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b79d74]" size={18} />
          <Input 
            placeholder="Buscar por cliente ou tratamento..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus size={18} /> Novo Atendimento
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#dcc8a1] bg-[#fffdfa] shadow-[0_18px_40px_rgba(223,198,150,0.10)]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="hidden md:table-cell">Cliente</TableHead>
                <TableHead className="hidden lg:table-cell">Tratamento</TableHead>
                <TableHead className="hidden lg:table-cell">Profissional</TableHead>
                <TableHead className="hidden md:table-cell">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.length > 0 ? (
                filteredAttendances.map((attendance) => {
                  const client = clients.find(c => c.id === attendance.clientId);
                  const treatment = treatments.find(t => t.id === attendance.treatmentId);
                  const professional = professionals.find(p => p.id === attendance.professionalId);
                  
                  return (
                    <TableRow key={attendance.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={14} className="text-[#b79d74]" />
                            {new Date(attendance.dataAtendimento).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="md:hidden text-xs text-[#8a7452]">
                            {client?.nome || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium">{client?.nome || 'N/A'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{treatment?.nome || 'N/A'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{professional?.nome || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(attendance.valor)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColors[attendance.status]}>
                          {attendance.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(attendance)} className="h-8 w-8">
                            <Edit2 size={14} className="text-[#6d5a3d]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(attendance.id)} className="h-8 w-8">
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-[#8a7452]">
                    Nenhum atendimento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingAttendance.id ? 'Editar Atendimento' : 'Novo Atendimento'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Cliente <span className="text-destructive">*</span></Label>
                <Select 
                  value={editingAttendance.clientId} 
                  onValueChange={(val) => setEditingAttendance({...editingAttendance, clientId: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && <p className="text-xs text-destructive">{errors.clientId}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Data do Atendimento <span className="text-destructive">*</span></Label>
                <Input 
                  type="date"
                  value={editingAttendance.dataAtendimento} 
                  onChange={(e) => setEditingAttendance({...editingAttendance, dataAtendimento: e.target.value})}
                  required
                />
                {errors.dataAtendimento && <p className="text-xs text-destructive">{errors.dataAtendimento}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tratamento <span className="text-destructive">*</span></Label>
                <Select 
                  value={editingAttendance.treatmentId} 
                  onValueChange={handleTreatmentChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tratamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatments.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.treatmentId && <p className="text-xs text-destructive">{errors.treatmentId}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Valor (R$)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  value={editingAttendance.valor} 
                  onChange={(e) => setEditingAttendance({...editingAttendance, valor: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Profissional <span className="text-destructive">*</span></Label>
                <Select 
                  value={editingAttendance.professionalId} 
                  onValueChange={(val) => setEditingAttendance({...editingAttendance, professionalId: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.professionalId && <p className="text-xs text-destructive">{errors.professionalId}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select 
                  value={editingAttendance.status} 
                  onValueChange={(val: AttendanceStatus) => setEditingAttendance({...editingAttendance, status: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Orçamento">Orçamento</SelectItem>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Realizado">Realizado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Observações</Label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editingAttendance.observacoes} 
                onChange={(e) => setEditingAttendance({...editingAttendance, observacoes: e.target.value})}
              />
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
