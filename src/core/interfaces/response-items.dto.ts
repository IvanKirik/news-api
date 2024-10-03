export interface ResponseItems<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
