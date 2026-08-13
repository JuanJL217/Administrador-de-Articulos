import { useEffect, useState } from 'react';
import {
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  Spinner,
  Button,
} from '@heroui/react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { getArticlesFiltered } from '../service/article/getArticles';
import { getAllAuthorsWithStats } from '../service/user/user';

import { AuthorsStats } from '../components/Home/AuthorsStats';
import { ArticleFilters } from '../components/Home/ArticleFilters';
import { ArticlesList } from '../components/Home/ArticlesList';
import { Pagination } from '../components/common/Pagination';
import { CreateArticleModal } from '../components/CreateArticleModal';

import { GoToMyArticlesButton } from '../components/common/buttons/GoToMyArticlesButton';
import { LogoutButton } from '../components/common/buttons/LogOutButton';
import { LoginButton } from '../components/common/buttons/GoToLoginPage';
import { getSessionRequest } from '../service/account/session';

export function MenuPage() {
  const navigate = useNavigate();

  const search = useSearch({
    from: '/',
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const limit = 8;

  const page = search.page ||1;
  const author = search.author;
  const title = search.title;
  const content = search.content;

  const { data: sessionData } = useQuery({
    queryKey: ['auth-session'],
    queryFn: getSessionRequest,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isAuthenticated = !!sessionData?.user;

  const {
    data: authorsData,
    isLoading: isLoadingAuthors,
    isError: isAuthorsError,
  } = useQuery({
    queryKey: ['authors-stats'],
    queryFn: getAllAuthorsWithStats,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: [
      'filtered-articles',
      page,
      limit,
      author,
      title,
      content,
    ],
    queryFn: () =>
      getArticlesFiltered({
        page,
        limit,
        author,
        title,
        content,
      }),
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const articlesList = data?.data ?? [];

  const totalPages = Math.max(
    data?.meta?.totalPages ?? 1,
    1
  );

  useEffect(() => {
    document.title =
      totalPages > 1
        ? `Menú - Página ${page}`
        : 'Menú';
  }, [page, totalPages]);

  const changeSearch = (changes: {
    page?: number;
    author?: string;
    title?: string;
    content?: string;
  }) => {
    navigate({
      to: '/',
      search: {
        page: changes.page ?? page,
        author: changes.author ?? author,
        title: changes.title ?? title,
        content: changes.content ?? content,
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    changeSearch({
      page: newPage,
    });
  };

  const handleAuthorChange = (value: string) => {
    changeSearch({
      author: value,
      page: 1,
    });
  };

  const handleTitleChange = (value: string) => {
    changeSearch({
      title: value,
      page: 1,
    });
  };

  const handleContentChange = (value: string) => {
    changeSearch({
      content: value,
      page: 1,
    });
  };

  const resetFilters = () => {
    navigate({
      to: '/',
    });
  };

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[100vh] flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0a5c85] via-[#1073a3] to-[#064360]">
        <Spinner
          size="lg"
          className="text-white"
        />

        <span className="text-sm font-medium text-white">
          Cargando artículos...
        </span>
      </div>
    );
  }

  return (
    <Card className="-mt-6 w-full max-w-7xl rounded-3xl border border-teal-900/10 bg-white/95 p-6 shadow-xl backdrop-blur-md">
      <CardHeader className="flex flex-col items-start gap-6 border-b border-teal-950/10 px-0 pb-6">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onPress={resetFilters}
              className="p-0 text-2xl font-black tracking-tight text-slate-900 shadow-none hover:bg-transparent hover:shadow-none focus:bg-transparent focus:shadow-none"
            >
              Explorar Artículos
            </Button>

            {isFetching && (
              <Spinner size="sm" />
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-3 md:flex">
                  <GoToMyArticlesButton />

                  <CreateArticleModal />

                  <LogoutButton />
                </div>

                <div className="relative md:hidden">
                  <Button
                    isIconOnly
                    variant="secondary"
                    aria-label="Menú"
                    onPress={() =>
                      setIsMobileMenuOpen(
                        (previous) => !previous
                      )
                    }
                    className="text-xl"
                  >
                    ☰
                  </Button>

                  {isMobileMenuOpen && (
                    <div className="absolute right-0 top-12 z-50 flex w-52 flex-col items-stretch gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                      
                        <GoToMyArticlesButton className="w-full"
                          onNavigate={() =>
                            setIsMobileMenuOpen(false)
                          }
                        />

                        <CreateArticleModal className="w-full"/>

                        <LogoutButton className="w-full"
                          onLogout={() =>
                            setIsMobileMenuOpen(false)
                          }
                        />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>

        <AuthorsStats
          authors={authorsData ?? []}
          isLoading={isLoadingAuthors}
          isError={isAuthorsError}
          error={error}
        />

        <ArticleFilters
          author={author || ''}
          title={title || ''}
          content={content || ''}
          onAuthorChange={handleAuthorChange}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
        />
      </CardHeader>

      <div className="flex flex-col gap-5 py-5">
        <ArticlesList
          articles={articlesList}
          isError={isError}
          error={error}
        />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Card>
  );
}