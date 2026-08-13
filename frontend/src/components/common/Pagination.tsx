import { Pagination as HeroPagination } from '@heroui/react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const currentPage = Math.max(1, page);
  const pages = Math.max(1, totalPages);

  const getPaginationPages = (): (number | 'ellipsis')[] => {
    if (pages <= 7) {
      return Array.from(
        { length: pages },
        (_, index) => index + 1
      );
    }

    const result: (number | 'ellipsis')[] = [1];

    if (currentPage > 4) {
      result.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(pages - 1, currentPage + 1);

    for (let pageNumber = start; pageNumber <= end; pageNumber++) {
      result.push(pageNumber);
    }

    if (currentPage < pages - 3) {
      result.push('ellipsis');
    }

    result.push(pages);

    return result;
  };

  const paginationPages = getPaginationPages();

  const handlePreviousPage = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(pages, currentPage + 1));
  };

  return (
    <div className="mt-2 flex w-full justify-center border-t border-slate-100 pt-4">
      <HeroPagination className="w-auto">
        <HeroPagination.Content className="flex w-full justify-center">

          <HeroPagination.Item>
            <HeroPagination.Previous
              isDisabled={currentPage === 1}
              onPress={handlePreviousPage}
            >
              <HeroPagination.PreviousIcon />
            </HeroPagination.Previous>
          </HeroPagination.Item>

          {paginationPages.map((item, index) => {
            if (item === 'ellipsis') {
              return (
                <HeroPagination.Item key={`ellipsis-${index}`}>
                  <HeroPagination.Ellipsis />
                </HeroPagination.Item>
              );
            }

            return (
              <HeroPagination.Item key={item}>
                <HeroPagination.Link
                  isActive={currentPage === item}
                  onPress={() => onPageChange(item)}
                  className={
                    currentPage === item
                      ? 'bg-[#1d5b79] font-bold text-white'
                      : ''
                  }
                >
                  {item}
                </HeroPagination.Link>
              </HeroPagination.Item>
            );
          })}

          <HeroPagination.Item>
            <HeroPagination.Next
              isDisabled={currentPage === pages}
              onPress={handleNextPage}
            >
              <HeroPagination.NextIcon />
            </HeroPagination.Next>
          </HeroPagination.Item>

        </HeroPagination.Content>
      </HeroPagination>
    </div>
  );
}