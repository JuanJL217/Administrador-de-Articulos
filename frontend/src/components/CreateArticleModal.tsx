import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Modal,
  Button,
  TextArea,
  useOverlayState,
} from '@heroui/react';
import { useForm } from '@tanstack/react-form';

import { createArticleRequest } from '../service/article/create';
import { type ArticleData } from '../features/schemas/article/articleSchema';
import {
  createArticleSchema,
  type CreateArticleData,
} from '../features/schemas/article/createArticleSchema';

import { FormInput } from './common/form/Input';

interface CreateArticleModalProps {
  className?: string;
}

export function CreateArticleModal({
  className = '',
}: CreateArticleModalProps) {
  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const state = useOverlayState({
    isOpen,
    onOpenChange: setIsOpen,
  });

  const createMutation = useMutation({
    mutationFn: createArticleRequest,

    onSuccess: (newArticle: ArticleData) => {
      const updateCacheSafely = (oldData: any) => {
        if (!oldData) {
          return oldData;
        }

        if (Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: [
              newArticle,
              ...oldData.data,
            ],
            meta: {
              ...oldData.meta,
              total: (oldData.meta?.total || 0) + 1,
            },
          };
        }

        if (
          oldData.data?.articles?.data &&
          Array.isArray(oldData.data.articles.data)
        ) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              articles: {
                ...oldData.data.articles,
                data: [
                  newArticle,
                  ...oldData.data.articles.data,
                ],
                total:
                  (oldData.data.articles.total || 0) + 1,
              },
            },
          };
        }

        return oldData;
      };

      queryClient.setQueriesData(
        { queryKey: ['my-articles'] },
        updateCacheSafely
      );

      queryClient.setQueriesData(
        { queryKey: ['filtered-articles'] },
        updateCacheSafely
      );

      form.reset();

      setServerError(null);
      setIsOpen(false);
    },

    onError: (err: Error) => {
      setServerError(err.message);
    },
  });

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
      urlImage: '',
    } as CreateArticleData,

    validators: {
      onChange: createArticleSchema,
    },

    onSubmit: async ({ value }) => {
      setServerError(null);

      createMutation.mutate(value);
    },
  });

  return (
    <Modal state={state}>
      <Modal.Trigger>
        <Button
          variant="primary"
          className={`font-bold ${className}`}
        >
          Crear Artículo
        </Button>
      </Modal.Trigger>

      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center">
          <Modal.Dialog>

            <Modal.Header>
              <Modal.Heading className="text-xl font-black text-[#1d5b79]">
                Crear Nuevo Artículo
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <form
                id="create-article-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  form.handleSubmit();
                }}
                className="flex flex-col gap-4"
              >

                {serverError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <span className="font-semibold">
                      Error:
                    </span>{' '}
                    {serverError}
                  </div>
                )}

                <form.Field name="title">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;

                    const error =
                      field.state.meta.errors
                        .map((err: any) =>
                          typeof err === 'string'
                            ? err
                            : err.message
                        )
                        .join(', ');

                    return (
                      <FormInput
                        label="Título"
                        placeholder="Escribí el título acá..."
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        error={error}
                        isTouched={hasError}
                      />
                    );
                  }}
                </form.Field>

                <form.Field name="content">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;

                    const error =
                      field.state.meta.errors
                        .map((err: any) =>
                          typeof err === 'string'
                            ? err
                            : err.message
                        )
                        .join(', ');

                    return (
                      <div className="flex flex-col gap-1.5">

                        <label className="text-small font-semibold text-slate-700">
                          Contenido
                        </label>

                        <TextArea
                          placeholder="Desarrollá tu artículo..."
                          className={`min-h-50 ${
                            hasError
                              ? 'border-red-500'
                              : ''
                          }`}
                          variant="primary"
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value
                            )
                          }
                          onBlur={field.handleBlur}
                        />

                        {hasError && error && (
                          <span className="text-xs font-medium text-red-500">
                            {error}
                          </span>
                        )}

                      </div>
                    );
                  }}
                </form.Field>

                <form.Field name="urlImage">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;

                    const error =
                      field.state.meta.errors
                        .map((err: any) =>
                          typeof err === 'string'
                            ? err
                            : err.message
                        )
                        .join(', ');

                    return (
                      <FormInput
                        label="URL de la imagen (opcional)"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={field.state.value ?? ''}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        error={error}
                        isTouched={hasError}
                      />
                    );
                  }}
                </form.Field>

              </form>
            </Modal.Body>

            <Modal.Footer>

              <Button
                variant="danger"
                onPress={() => setIsOpen(false)}
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                className="bg-[#1d5b79] font-bold text-white"
                type="submit"
                form="create-article-form"
                isPending={createMutation.isPending}
              >
                Crear Artículo
              </Button>

            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}