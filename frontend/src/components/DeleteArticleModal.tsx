import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Modal, Button, useOverlayState 
} from '@heroui/react';
import { deleteArticleRequest } from '../service/article/delete';

export function DeleteArticleModal({ article }: { article: any }) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const state = useOverlayState({ isOpen, onOpenChange: setIsOpen });

  const deleteMutation = useMutation({
    mutationFn: deleteArticleRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      setIsOpen(false);
    },
    onError: (err: Error) => {
      setServerError(err.message);
    }
  });

  return (
    <Modal state={state}>
      <Modal.Trigger>
        <Button 
          variant="danger" 
          size="sm"
          className="font-bold"
        >
          Eliminar
        </Button>
      </Modal.Trigger>

      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center">
          <Modal.Dialog>
            
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-red-600">
                Eliminar Artículo
              </Modal.Heading>
            </Modal.Header>
            
            <Modal.Body>
              <div className="flex flex-col gap-3 py-2 text-slate-700">
                <p>
                  ¿Estás seguro de que querés eliminar el artículo <strong>"{article.title}"</strong>?
                </p>
                <p className="text-sm text-slate-500">
                  Esta acción no se puede deshacer y perderás el articulo.
                </p>
              </div>

              {serverError && (
                <div className="p-3 mt-2 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
                  <span className="font-semibold">Error:</span> {serverError}
                </div>
              )}
            </Modal.Body>
            
            <Modal.Footer>
              <Button 
                onPress={() => setIsOpen(false)}
                isDisabled={deleteMutation.isPending}
              >
                No, cancelar
              </Button>
              <Button 
                variant="danger" 
                className="font-bold"
                onPress={() => {
                  setServerError(null);
                  deleteMutation.mutate(article.id);
                }}
                isPending={deleteMutation.isPending}
              >
                Sí, eliminar
              </Button>
            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}