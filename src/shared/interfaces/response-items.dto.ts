export interface ResponseItems<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ResponseItemsDto<T> implements ResponseItems<T> {
  public readonly data: T[];
  public readonly page: number;
  public readonly pageSize: number;
  public readonly total: number;
  public readonly totalPages: number;
  constructor(
    data: T[],
    page: number,
    pageSize: number,
    total: number,
    totalPages: number,
  ) {
    this.data = data;
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
    this.totalPages = totalPages;
  }
}
