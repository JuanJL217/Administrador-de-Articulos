import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from '@tanstack/react-router';
import {
  Card,
  CardHeader,
  Button,
} from '@heroui/react';

import {
  registerSchema,
  type RegisterFormData,
} from '../features/schemas/registerSchema';

import { registerRequest } from '../service/account/register';

import { FormInput } from './common/form/Input';

export function RegisterForm() {
  const navigate = useNavigate();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: registerRequest,

    onSuccess: () => {
      navigate({
        to: '/my-articles',
      });
    },

    onError: (error: Error) => {
      setServerError(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    } as RegisterFormData,

    validators: {
      onChange: registerSchema,
    },

    onSubmit: async ({ value }) => {
      setServerError(null);

      mutation.mutate(value);
    },
  });

  return (
    <Card className="w-full max-w-md rounded-3xl border border-teal-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md">

      <CardHeader className="flex flex-col items-center gap-1.5 border-b border-teal-950/10 px-0 pb-4 text-center">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Crear Cuenta
        </h1>
      </CardHeader>

      <div className="flex flex-col gap-5 py-3">

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
          className="flex flex-col gap-5"
        >

          {serverError && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              <span className="font-semibold">
                Error:
              </span>

              {serverError}
            </div>
          )}

          <form.Field name="name">
            {(field) => (
              <FormInput
                label="Nombre"
                placeholder="Tu nombre"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                isTouched={field.state.meta.isTouched}
                error={
                  field.state.meta.errors
                    .map((error: any) =>
                      typeof error === 'string'
                        ? error
                        : error.message
                    )
                    .join(', ')
                }
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <FormInput
                label="Correo Electrónico"
                placeholder="example@correo.com"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                isTouched={field.state.meta.isTouched}
                error={
                  field.state.meta.errors
                    .map((error: any) =>
                      typeof error === 'string'? error : error.message
                    )
                    .join(', ')
                }
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <FormInput
                label="Contraseña"
                type="password"
                placeholder="*******"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                isTouched={field.state.meta.isTouched}
                error={
                  field.state.meta.errors
                    .map((error: any) =>
                      typeof error === 'string'? error : error.message
                    )
                    .join(', ')
                }
              />
            )}
          </form.Field>

          <Button
            type="submit"
            size="lg"
            isPending={mutation.isPending}
            className="mt-3 h-12 w-full rounded-2xl bg-[#1d5b79] font-bold text-white shadow-lg shadow-[#1d5b79]/25 transition-all duration-200 hover:scale-[1.01] hover:bg-[#16475f] active:scale-[0.99]"
          >
            {mutation.isPending
              ? 'Registrando...'
              : 'Registrarse'}
          </Button>

        </form>

        <div className="border-t border-slate-100 pt-4 text-center text-small font-medium text-slate-500">
          ¿Tenés cuenta?{' '}

          <Link
            to="/login"
            className="font-bold text-[#1d5b79] hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-4 text-center text-small font-medium text-slate-500">
          <Link
            to="/"
            className="font-bold text-[#1d5b79] hover:underline"
          >
            Volver al menú principal
          </Link>
        </div>

      </div>
    </Card>
  );
}