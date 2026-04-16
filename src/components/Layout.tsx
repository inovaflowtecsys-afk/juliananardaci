import React from 'react';
import { 
  Users, 
  UserRound, 
  Truck, 
  Syringe, 
  ClipboardList, 
  LayoutDashboard,
  CloudSun,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { AuthenticatedUser } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: AuthenticatedUser;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'professionals', label: 'Profissionais', icon: UserRound },
  { id: 'suppliers', label: 'Fornecedores', icon: Truck },
  { id: 'treatments', label: 'Tratamentos', icon: Syringe },
  { id: 'attendances', label: 'Atendimentos', icon: ClipboardList },
];

const weatherLabels: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predomínio de sol',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina intensa',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa forte',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  80: 'Pancadas leves',
  81: 'Pancadas moderadas',
  82: 'Pancadas fortes',
  95: 'Trovoadas'
};

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, currentUser, onLogout }) => {
  const [weather, setWeather] = React.useState<{ temperature: number; label: string } | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-22.7856&longitude=-43.3117&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo');
        const data = await response.json();
        if (cancelled) return;

        const temperature = data?.current?.temperature_2m;
        const weatherCode = data?.current?.weather_code;
        if (typeof temperature === 'number') {
          setWeather({
            temperature,
            label: weatherLabels[weatherCode] ?? 'Condição estável'
          });
        }
      } catch {
        if (!cancelled) {
          setWeather(null);
        }
      }
    };

    loadWeather();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,232,207,0.65),_transparent_24%),linear-gradient(180deg,_#fcfaf5_0%,_#f8f2e7_40%,_#fcfaf5_100%)] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-24 flex-col border-r border-[#e7d7b8] bg-[linear-gradient(180deg,_#fffdfa_0%,_#f8f1e4_34%,_#f2e2c4_100%)] px-3 py-6 text-[#6f6045] shadow-[28px_0_70px_rgba(223,198,150,0.18)] lg:w-80 lg:px-5">
        <div className="flex justify-center py-2 lg:py-4">
          <div className="relative flex justify-center">
            <div className="absolute inset-x-4 top-1/2 h-20 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(244,232,207,0.92)_0%,_rgba(216,186,137,0.34)_46%,_transparent_78%)] blur-2xl" />
            <img
              src="https://www.inovaflowtec.com.br/svg/junadarci.png"
              alt="Logotipo Juna Darci"
              className="relative h-16 w-auto object-contain drop-shadow-[0_18px_34px_rgba(223,198,150,0.42)] lg:h-24"
            />
          </div>
        </div>

        <ScrollArea className="mt-6 flex-1 pr-1">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  'h-12 w-full justify-start gap-3 rounded-2xl border border-transparent px-4 text-sm transition-all',
                  activeTab === item.id
                    ? 'border-[#dcc8a1] bg-[#fffdfa] text-[#6f6045] shadow-[0_14px_34px_rgba(223,198,150,0.16)]'
                    : 'text-[#7b6a4d] hover:border-[#e7d7b8] hover:bg-[#fff9ef] hover:text-[#5d503c]'
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Button>
            ))}
          </nav>
        </ScrollArea>

        <div className="px-1 pb-2 lg:px-2">
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <img src={currentUser.avatarUrl} alt={currentUser.nome} className="h-12 w-12 rounded-2xl object-cover" />
            <div className="hidden min-w-0 lg:block">
              <div className="truncate text-sm font-semibold text-[#5d503c]">{currentUser.nome}</div>
              <div className="truncate text-xs text-[#8a7452]">{currentUser.cargo ?? 'Profissional'}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-h-screen pl-24 lg:pl-80">
        <header className="sticky top-0 z-30 border-b border-[#e7d7b8] bg-[rgba(255,253,250,0.9)] backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-5 sm:px-8 lg:px-10">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.22em] text-[#9b8258]">Painel administrativo</div>
              <h2 className="mt-1 text-xl font-semibold text-[#5d503c]">
            {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#dcc8a1] bg-[#fffdfa] px-3 py-2 shadow-[0_12px_30px_rgba(223,198,150,0.18)]">
              <div className="hidden items-center gap-2 rounded-xl bg-[#faf4ea] px-3 py-2 sm:flex">
                <CloudSun size={16} className="text-[#8a7452]" />
                <div className="leading-tight">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b8258]">Duque de Caxias</div>
                  <div className="text-xs text-[#6f6045]">
                    {weather ? `${Math.round(weather.temperature)}°C · ${weather.label}` : 'Clima indisponível'}
                  </div>
                </div>
              </div>
              <img src={currentUser.avatarUrl} alt={currentUser.nome} className="h-11 w-11 rounded-2xl object-cover" />
              <div className="hidden min-w-0 sm:block">
                <div className="truncate text-sm font-semibold text-[#5d503c]">{currentUser.nome}</div>
                <div className="truncate text-xs text-[#8a7452]">{currentUser.email}</div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl text-[#8a7452] hover:bg-[#f6ecda] hover:text-[#5d503c]" onClick={onLogout} aria-label="Sair para login">
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </header>

        <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
