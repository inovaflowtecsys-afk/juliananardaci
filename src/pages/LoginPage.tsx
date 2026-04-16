import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<void> | void;
  demoPassword: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, demoPassword }) => {
  const [email, setEmail] = React.useState('juliana@clinica.com');
  const [password, setPassword] = React.useState(demoPassword);
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await onLogin({ email, password });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível entrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.14),_transparent_28%),linear-gradient(135deg,_#f5fbff_0%,_#f2fcfb_46%,_#f8fafc_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/80 bg-white/82 shadow-[0_32px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-[640px] overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80"
            alt="Ambiente de clínica de estética"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(8,47,73,0.18)_0%,_rgba(15,118,110,0.38)_100%)]" />
        </section>

        <section className="flex items-center bg-white/68 p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="relative flex justify-center">
                  <div className="absolute inset-x-6 top-1/2 h-24 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(244,232,207,0.92)_0%,_rgba(216,186,137,0.34)_46%,_transparent_78%)] blur-2xl" />
                  <img
                    src="https://www.inovaflowtec.com.br/svg/junadarci.png"
                    alt="Logotipo Juna Darci"
                    className="relative h-32 w-auto object-contain drop-shadow-[0_18px_34px_rgba(223,198,150,0.42)] sm:h-36 lg:h-40"
                  />
                </div>
            </div>
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Acesse sua conta</h2>
                <p className="text-sm leading-6 text-slate-500">Entre com login e senha para acessar o painel da clínica.</p>
              </div>
            </div>

            <form className="space-y-5 rounded-[28px] border border-[#dcc8a1] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(250,245,236,0.92)_100%)] p-6 shadow-[0_24px_60px_rgba(223,198,150,0.20)]" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Login</label>
                <Input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="email@clinica.com"
                  className="h-12 rounded-2xl border-[#dcc8a1] bg-[#fffdfa]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  className="h-12 rounded-2xl border-[#dcc8a1] bg-[#fffdfa]"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="h-12 w-full rounded-2xl border border-[#d4be95] bg-[linear-gradient(135deg,_#f4e8cf_0%,_#d8ba89_100%)] text-slate-700 shadow-[0_18px_34px_rgba(223,198,150,0.42)] hover:brightness-[1.02] hover:text-slate-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>

              <button type="button" className="w-full text-center text-sm font-medium text-slate-700 transition-colors hover:text-slate-900">
                Esqueci a senha
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 lg:text-left">
              Demo atual: juliana@clinica.com | senha {demoPassword}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
