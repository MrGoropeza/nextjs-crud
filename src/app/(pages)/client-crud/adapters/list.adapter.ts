import { ListPageResponse } from "../models/interfaces/list-response.interface";
import { ClientTodo } from "../models/interfaces/todo.interface";

interface ApiListResponse {
  items: ApiTodo[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface ApiTodo {
  id: string;
  description: string;
  title: string;
  created: Date;
  updated: Date;
}

export const AdapterListTodo = (
  data: ApiListResponse,
): ListPageResponse<ClientTodo> => {
  return {
    start: (data.page - 1) * data.perPage,
    length: data.perPage,
    count: data.totalItems,
    data: data.items.map((item) => ({
      id: item.id,
      _label: item.title,
      _search: item.title,
      title: item.title,
      description: item.description,
      created: item.created,
      updated: item.updated,
    })),
  };
};
