import React from 'react';
import { Users, UserRound, Truck, Syringe, ClipboardList, TrendingUp } from 'lucide-react';
import { db } from '@/services/mockDb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = React.useState({
    clients: 0,
    professionals: 0,
    suppliers: 0,
    treatments: 0,
    attendances: 0,
    revenue: 0
  });

  React.useEffect(() => {
    const clients = db.getClients().length;
    const professionals = db.getProfessionals().length;
    const suppliers = db.getSuppliers().length;
    const treatments = db.getTreatments().length;
    const attendances = db.getAttendances();
    const revenue = attendances.reduce((acc, curr) => acc + curr.valor, 0);

    setStats({
      clients,
      professionals,
      suppliers,
      treatments,
      attendances: attendances.length,
      revenue
    });
  }, []);

  const cards = [
    { title: 'Total de Clientes', value: stats.clients, icon: Users, color: 'text-[#1d6f68]', bg: 'bg-[#f4e8cf]' },
    { title: 'Profissionais', value: stats.professionals, icon: UserRound, color: 'text-[#0ea5e9]', bg: 'bg-[#f3ead8]' },
    { title: 'Fornecedores', value: stats.suppliers, icon: Truck, color: 'text-[#846b45]', bg: 'bg-[#faefdc]' },
    { title: 'Tratamentos', value: stats.treatments, icon: Syringe, color: 'text-[#115e59]', bg: 'bg-[#edf7f3]' },
    { title: 'Atendimentos', value: stats.attendances, icon: ClipboardList, color: 'text-[#2f6d62]', bg: 'bg-[#f1e7d4]' },
    { title: 'Faturamento Total', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.revenue), icon: TrendingUp, color: 'text-[#214a43]', bg: 'bg-[#f8f1e4]' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#8a7452]">{card.title}</CardTitle>
              <div className={`${card.bg} p-2 rounded-lg`}>
                <card.icon className={card.color} size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#214a43]">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Últimos Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {db.getAttendances().slice(-5).reverse().map((a) => {
                const client = db.getClients().find(c => c.id === a.clientId);
                const treatment = db.getTreatments().find(t => t.id === a.treatmentId);
                return (
                  <div key={a.id} className="flex items-center justify-between rounded-lg bg-[#faf4ea] p-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{client?.nome}</span>
                      <span className="text-xs text-[#8a7452]">{treatment?.nome}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(a.valor)}</div>
                      <div className="text-[10px] text-[#b79d74]">{new Date(a.dataAtendimento).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                );
              })}
              {db.getAttendances().length === 0 && (
                <div className="py-8 text-center text-sm text-[#b79d74]">Nenhum atendimento registrado.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Novos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {db.getClients().slice(-5).reverse().map((c) => (
                <div key={c.id} className="flex items-center gap-4 rounded-lg bg-[#faf4ea] p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e8cf] font-bold text-[#7e6746]">
                    {c.nome.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{c.nome}</span>
                    <span className="text-xs text-[#8a7452]">{c.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
