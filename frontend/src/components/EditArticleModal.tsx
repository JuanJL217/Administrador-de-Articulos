import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Modal, Button, Input, TextArea, useOverlayState, TextField, Label, FieldError 
} from '@heroui/react';
import { useForm } from '@tanstack/react-form';
import { updateArticleRequest } from '../service/article/update';
import { type ArticleData } from '../features/schemas/article/articleSchema';
import { updateArticleSchema, type UpdateArticleData } from '../features/schemas/article/updateArticleSchema';

export function EditArticleModal({ article }: { article: ArticleData }) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const state = useOverlayState({ isOpen, onOpenChange: setIsOpen });

  const updateMutation = useMutation({
    mutationFn: updateArticleRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      setIsOpen(false);
    },
    onError: (err: Error) => {
      setServerError(err.message);
    }
  });

  const form = useForm({
    defaultValues: {
      title: article.title || '',
      content: article.content || '',
      urlImage: article.urlImage || '',
    } as UpdateArticleData,
    validators: {
      onChange: updateArticleSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      updateMutation.mutate({
        id: article.id,
        ...value
      });
    },
  });

  return (
    <Modal state={state}>
      <Modal.Trigger>
        <Button size="sm" className="font-bold">
          Editar
        </Button>
      </Modal.Trigger>

      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center">
          <Modal.Dialog>
            
            <Modal.Header>
              <Modal.Heading className="flex flex-col gap-1 text-[#1d5b79] font-black text-xl">
                Editar Artículo
              </Modal.Heading>
            </Modal.Header>
            
            <Modal.Body>
              <form
                id="edit-article-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-4"
              >
                {serverError && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
                    <span className="font-semibold">Error:</span> {serverError}
                  </div>
                )}

                {/* Campo Título */}
                <form.Field name="title">
                  {(field) => {
                    const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    
                    return (
                      <TextField 
                        isInvalid={hasError} 
                        className="flex flex-col gap-1"
                      >
                        <Label>Título</Label>
                        
                        <Input
                          placeholder="Escribí el título acá..."
                          variant="primary"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        
                        <FieldError>
                          {field.state.meta.errors.map((err: any) => 
                            typeof err === 'string' ? err : err.message
                          ).join(', ')}
                        </FieldError>
                      </TextField>
                    );
                  }}
                </form.Field>

                {/* Campo Contenido */}
                <form.Field name="content">
                  {(field) => {
                    const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    
                    return (
                      <TextField 
                        isInvalid={hasError} 
                        className="flex flex-col gap-1"
                      >
                        <Label>Contenido</Label>
                        
                        <TextArea
                          placeholder="Desarrollá tu artículo..."
                          className="min-h-50"
                          variant="primary"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        
                        <FieldError>
                          {field.state.meta.errors.map((err: any) => 
                            typeof err === 'string' ? err : err.message
                          ).join(', ')}
                        </FieldError>
                      </TextField>
                    );
                  }}
                </form.Field>

                {/* Campo URL de Imagen */}
                <form.Field name="urlImage">
                  {(field) => {
                    const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                    
                    return (
                      <TextField 
                        isInvalid={hasError} 
                        className="flex flex-col gap-1"
                      >
                        <Label>URL de la imagen (opcional)</Label>
                        
                        <Input
                          placeholder="https://ejemplo.com/imagen.jpg"
                          variant="primary"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />

                        <FieldError>
                          {field.state.meta.errors.map((err: any) => 
                            typeof err === 'string' ? err : err.message
                          ).join(', ')}
                        </FieldError>
                      </TextField>
                    );
                  }}
                </form.Field>

              </form>
            </Modal.Body>
            
            <Modal.Footer>
              <Button variant="danger" onPress={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                className="bg-[#1d5b79] text-white font-bold"
                type="submit" 
                form="edit-article-form"
                isPending={updateMutation.isPending}
              >
                Guardar Cambios
              </Button>
            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}