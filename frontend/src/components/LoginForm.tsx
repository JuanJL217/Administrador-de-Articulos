import { useForm } from '@tanstack/react-form';
import { loginSchema, type LoginFormData } from '../features/auth/schemas/auth.schema';
import { loginRequest } from '../features/auth/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { Card, CardHeader, Input, Button } from '@heroui/react';
// import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export function LoginForm() {
//   const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: loginRequest,
    // onSuccess: () => {
    //   navigate({ 
    //     to: '/profile' 
    //   });
    // },
    onError: (error: Error) => {
      setServerError(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginFormData,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      mutation.mutate(value);
    },
  });

  return (
    <div className="flex justify-center items-center min-h-[100vh] bg-gradient-to-br from-[#0a5c85] via-[#1073a3] to-[#064360] p-4 relative overflow-hidden">
        
      <Card className="max-w-md w-full p-6 shadow-xl border border-teal-900/10 rounded-3xl bg-white/95 backdrop-blur-md">
        <CardHeader className="flex flex-col gap-1.5 items-center px-0 pb-4 border-b border-teal-950/10 text-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Iniciar Sesión</h1>
        </CardHeader>
        
        <div className="flex flex-col gap-5 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-5"
          >
            {serverError && (
              <div className="p-3.5 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-2">
                <span className="font-semibold">Error:</span> {serverError}
              </div>
            )}

            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-small font-semibold text-slate-700">Correo Electrónico</label>
                  <Input
                    placeholder="puto-el-que-lo-lea@correo.com"
                    color="bordered"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-small font-semibold text-slate-700">Contraseña</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    color="bordered"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-3 font-bold text-white bg-[#1d5b79] hover:bg-[#16475f] shadow-lg shadow-[#1d5b79]/25 rounded-2xl h-12 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              {mutation.isPending ? 'Cargando...' : 'Entrar'}
            </Button>
          </form>

        <div className="text-center mt-2 pt-4 border-t border-slate-100 text-small text-slate-500 font-medium">
            ¿No tenés una cuenta?{' '}
            <a href="/register" className="text-[#1d5b79] font-bold hover:underline">
              Regístrate aquí
            </a>
          </div>

        </div>
      </Card>
    </div>
  );
}