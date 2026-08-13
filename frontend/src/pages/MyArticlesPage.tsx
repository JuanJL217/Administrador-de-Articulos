import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, Spinner } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';

import { getMyArticles } from '../service/article/getArticles';
import { getSessionRequest } from '../service/account/session';

import { CreateArticleModal } from '../components/CreateArticleModal';
import { Pagination } from '../components/common/Pagination';
import { MyArticlesGrid } from '../components/MyArticlesGrig';
import { LogoutButton } from '../components/common/buttons/LogOutButton';
import { GoToMenuButton } from '../components/common/buttons/GoToMenuButton';

export function MyArticlesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Mis Articulos';
  }, []);

  const [page, setPage] = useState(1);
  const limit = 6;

  const { 
    data: sessionData, 
    isLoading: isLoadingSession
  } = useQuery({
    queryKey: ['auth-session'],
    queryFn: getSessionRequest,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isAuthenticated = !!sessionData?.user;

  useEffect(() => {
    if (!isLoadingSession && !isAuthenticated) {
      navigate({
        to: '/login',
        replace: true,
      });
    }
  }, [isLoadingSession, isAuthenticated, navigate]);

  const {
    data,
    isLoading: isLoadingArticles,
    isError,
    error,
  } = useQuery({
    queryKey: ['my-articles', page, limit],
    queryFn: () => getMyArticles(page, limit),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isAuthenticated,
  });

  if (isLoadingSession || (isLoadingArticles && isAuthenticated)) {
    return (
      <div className="flex min-h-[100vh] flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0a5c85] via-[#1073a3] to-[#064360]">
        <Spinner
          size="lg"
          className="text-white"
        />

        <span className="text-sm font-medium text-white">
          Cargando tus artículos...
        </span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }

  const articlesList = data?.data ?? [];

  const totalPages = Math.max(
    Number(data?.meta?.totalPages ?? 1),
    1
  );

  return (
    <Card className="-mt-6 w-full max-w-7xl rounded-3xl border border-teal-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md">

      <CardHeader className="flex flex-col items-start justify-between gap-4 border-b border-teal-950/10 px-0 pb-4 sm:flex-row sm:items-center">

        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Mis Artículos
        </h1>

        <div className="flex flex-wrap items-center gap-2">

          <GoToMenuButton />

          <CreateArticleModal />

          <LogoutButton />

        </div>

      </CardHeader>

      <div className="flex flex-col gap-5 py-5">

        <MyArticlesGrid
          articles={articlesList}
          isError={isError}
          error={error}
        />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

      </div>

    </Card>
  );
}