import { ArticleDetailModal } from './ArticleDetailView';

const NO_IMAGEN =
  "https://img.magnific.com/vector-premium/no-hay-foto-disponible-icono-vectorial-simbolo-imagen-predeterminado-imagen-proximamente-sitio-web-o-aplicacion-movil_87543-10615.jpg";

interface ArticlesListProps {
  articles: any[];
  isError: boolean;
  error: Error | null;
}

export function ArticlesList({
  articles,
  isError,
  error,
}: ArticlesListProps) {
  
  if (isError) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
        <span className="font-semibold"></span>

        <span>
         { error?.message || "Error al cargar los artículos" }
        </span>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="py-10 text-center text-base font-medium text-slate-500">
        No se encontraron artículos con estos filtros.
      </div>
    );
  }

  return (
    <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-4">
      {articles.map((item) => {
        const articleId = item.id || item._id;

        return (
          <ArticleDetailModal
            key={articleId}
            articleId={articleId}
            triggerComponent={
              <article className="flex h-[360px] w-full cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-teal-900/10 bg-white/50 p-4 text-left shadow-sm transition-all hover:bg-white">

                <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={item.urlImage?.trim() || NO_IMAGEN}
                    alt={`Imagen para ${item.title}`}
                    className="block h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = NO_IMAGEN;
                    }}
                  />
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-1.5">
                  <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[#1d5b79]">
                    {item.title}
                  </h3>

                  <p className="line-clamp-4 text-sm text-slate-600">
                    {item.content || 'Sin contenido...'}
                  </p>
                </div>

              </article>
            }
          />
        );
      })}
    </div>
  );
}