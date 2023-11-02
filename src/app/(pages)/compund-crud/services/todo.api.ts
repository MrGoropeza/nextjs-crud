import { ApiEndpoints } from "@app/enums";

const API_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

export interface BaseApi {
  get: (id: string) => Promise<void>;
  list: (
    page?: number,
    rows?: number,
    sorts?: {
      propertyName: string;
      descending: boolean;
    }[],
  ) => Promise<ListResponse<Todo>>;
  create: (data: any) => Promise<void>;
  update: (id: string, data: any) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export interface ListResponse<T = any> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  created: string;
  updated: string;
}

export const TodoApi = () => {
  const list = async (
    page: number = 1,
    rows: number = 5,
    sorts: { propertyName: string; descending: boolean }[] = [],
  ) => {
    const params = new URLSearchParams();
    params.set("page", `${page}`);
    params.set("perPage", `${rows}`);
    sorts.length > 0 &&
      params.set(
        "sort",
        `${sorts
          .map((sort) => `${sort.descending ? "-" : "+"}${sort.propertyName}`)
          .join(",")}`,
      );

    const res = await fetch(
      `${API_URL}/${ApiEndpoints.Todos}?${params.toString()}`,
    );

    if (!res.ok) {
      try {
        const error = await res.json();
        throw error;
      } catch (e: any) {
        throw { code: res.status, ...e };
      }
    }

    const data: ListResponse<Todo> = await res.json();

    return data;
  };

  return {
    get: async (id: string) => {},
    list,
    create: async (data: any) => {},
    update: async (id: string, data: any) => {},
    delete: async (id: string) => {},
  };
};
