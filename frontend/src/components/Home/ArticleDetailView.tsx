import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal, Button, Spinner, useOverlayState } from '@heroui/react';
import { getPrivateDataFromArticule } from '../../service/article/getArticles';
import { getSessionRequest } from '../../service/account/session';

interface ArticleDetailModalProps {
  articleId: string;
  triggerComponent: React.ReactNode;
}

export function ArticleDetailModal({ 
  articleId, 
  triggerComponent 
}: ArticleDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const state = useOverlayState({ isOpen, onOpenChange: setIsOpen });

  const { data: sessionData, isLoading: isLoadingSession } = useQuery({
    queryKey: ['auth-session'],
    queryFn: getSessionRequest,
    enabled: isOpen,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isAuthenticated = !!sessionData?.user;

  const {
    data: article,
    isLoading: isLoadingArticle,
    isError,
    error,
  } = useQuery({
    queryKey: ['article-detail', articleId],
    queryFn: () => getPrivateDataFromArticule(articleId),
    enabled: isOpen && isAuthenticated, 
    refetchOnWindowFocus: false,
    retry: false,
  });

  const formattedDate = article?.createdAt
    ? new Date(article.createdAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Fecha desconocida';

  return (
    <Modal state={state}>
      <Modal.Trigger>
        {triggerComponent}
      </Modal.Trigger>

      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center">
          <Modal.Dialog className="max-w-3xl bg-white p-6 rounded-3xl shadow-xl">
            
            <Modal.Header>
              <Modal.Heading className="text-2xl font-black text-[#1d5b79]">
                {isLoadingArticle ? 'Cargando artículo...' : (article?.title || 'Detalle del artículo')}
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="py-4">
              {isLoadingSession ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10">
                  <Spinner size="lg" />
                  <span className="text-sm font-medium text-slate-500">
                    Verificando permisos...
                  </span>
                </div>
              ) 
              
              : !isAuthenticated ? (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-lg font-semibold text-amber-700">
                  No podés ver la información del articulo si no iniciaste sesión.
                </div>
              ) 
              
              : isLoadingArticle ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10">
                  <Spinner size="lg" />
                  <span className="text-sm font-medium text-slate-500">
                    Cargando información privada...
                  </span>
                </div>
              ) 
              
              : isError ? (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-center font-semibold text-red-600">
                  {error?.message || 'No se pudo cargar el artículo.'}
                </div>
              ) 
              
              : !article ? (
                <div className="mb-4 text-center font-semibold text-slate-700">
                  No se encontró el artículo.
                </div>
              ) 
              
              : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-slate-200 pb-3 text-sm text-slate-500">
                    <span className="font-semibold text-[#1d5b79]">
                      Por: {article.author || 'Desconocido'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Creado el {formattedDate}</span>
                  </div>

                  {article.urlImage && (
                    <div className="h-64 w-full overflow-hidden rounded-2xl sm:h-72">
                      <img
                        src={article.urlImage}
                        alt={`Imagen del artículo ${article.title}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="whitespace-pre-line text-base leading-7 text-slate-700">
                    {article.content || 'Este artículo no tiene contenido.'}
                  </div>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onPress={() => setIsOpen(false)}>
                Cerrar
              </Button>
            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}