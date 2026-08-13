import { Spinner } from '@heroui/react';

interface AuthorStats {
  id: string;
  name: string;
  totalArticles: number;
}

interface AuthorsStatsProps {
  authors: AuthorStats[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null
}

export function AuthorsStats({
  authors,
  isLoading,
  isError,
  error
}: AuthorsStatsProps) {
  return (
    <div className="w-full">

      <div className="mb-3 flex items-end justify-between">

        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Autores
          </h2>

          <p className="text-xs text-slate-500">
            Cantidad de artículos publicados
          </p>
        </div>

        {!isLoading && !isError && (
          <span className="text-xs font-semibold text-slate-400">
            {authors.length}{' '}
            {authors.length === 1
              ? 'autor'
              : 'autores'}
          </span>
        )}

      </div>

      {isLoading && (
        <div className="flex h-24 items-center justify-center rounded-2xl border border-teal-900/10 bg-slate-50">

          <div className="flex items-center gap-2">

            <Spinner size="sm" />

            <span className="text-sm text-slate-500">
              Cargando autores...
            </span>

          </div>

        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error?.message || "No se pudieron cargar las estadísticas de los autores."}
        </div>
      )}

      {!isLoading &&
        !isError &&
        authors.length === 0 && (
          <div className="rounded-2xl border border-teal-900/10 bg-slate-50 p-5 text-center text-sm text-slate-500">
            No hay autores registrados.
          </div>
        )}

      {!isLoading &&
        !isError &&
        authors.length > 0 && (
          <div className="flex w-full gap-3 overflow-x-auto pb-2">

            {authors.map((author) => (
              <div
                key={author.id}
                className="min-w-[170px] flex-shrink-0 rounded-2xl border border-teal-900/10 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >

                <div className="flex flex-col gap-1">

                  <span className="truncate text-sm font-bold text-[#1d5b79]">
                    {author.name}
                  </span>

                  <span className="text-xs font-medium text-slate-500">
                    {author.totalArticles}{' '}
                    {author.totalArticles === 1
                      ? 'artículo'
                      : 'artículos'}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

    </div>
  );
}