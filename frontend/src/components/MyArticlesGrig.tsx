import { EditArticleModal } from './EditArticleModal';
import { DeleteArticleModal } from './DeleteArticleModal';

const NO_IMAGEN =
  "https://img.magnific.com/vector-premium/no-hay-foto-disponible-icono-vectorial-simbolo-imagen-predeterminado-imagen-proximamente-sitio-web-o-aplicacion-movil_87543-10615.jpg";

interface MyArticlesGridProps {
  articles: any[];
  isError: boolean;
  error: Error | null;
}

export function MyArticlesGrid({
  articles,
  isError,
  error,
}: MyArticlesGridProps) {
  if (isError) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
        <span className="font-semibold">Error:</span>

        <span>
          {error?.message || 'Hubo un error al cargar tus artículos.'}
        </span>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="py-10 text-center text-base font-medium text-slate-500">
        Todavía no tenés artículos escritos.
      </div>
    );
  }

  return (
    <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-3">
      {articles.map((article: any) => (
        <article
          key={article.id}
          className="flex h-full w-full flex-col gap-4 rounded-2xl border border-teal-900/10 bg-white/50 p-4 text-left shadow-sm transition-all hover:bg-white"
        >
          <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-xl">
            <img
              src={article.urlImage?.trim() || NO_IMAGEN}
              alt={`Imagen para ${article.title}`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = NO_IMAGEN;
              }}
            />
          </div>

          <div className="flex flex-grow flex-col justify-start gap-1.5">
            <h3 className="text-lg font-bold leading-tight text-[#1d5b79]">
              {article.title}
            </h3>

            <p className="line-clamp-3 text-sm text-slate-600">
              {article.content}
            </p>
          </div>

          <p className="line-clamp-3 text-sm text-slate-600">
            {article.createdAt}
          </p>
          <div className="mt-auto flex flex-row justify-end gap-2 border-t border-teal-900/10 pt-4">
            <EditArticleModal article={article} />
            <DeleteArticleModal article={article} />
          </div>
        </article>
      ))}
    </div>
  );
}