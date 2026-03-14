export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export const getPagination = ({ page = 1, limit = 10 }: PaginationQuery) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};
