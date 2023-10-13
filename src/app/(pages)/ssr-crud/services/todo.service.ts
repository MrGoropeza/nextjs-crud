import { ApiEndpoints } from "@app/enums";
import { AdapterListPage } from "../adapters/list.page.adapter";
import { AdapterTodo } from "../adapters/todo.adapter";
import {
  ApiListPageResponse,
  ListPageData,
  ListPageRequest,
} from "../types/list-page.type";
import { ApiCreateTodo, ApiUpdateTodo, Todo } from "../types/todo.type";

const API_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "";

export const getTodos = async ({
  page = 1,
  rows = 10,
  sort,
}: ListPageRequest): Promise<ListPageData<Todo>> => {
  const params = new URLSearchParams();
  params.set("page", `${page}`);
  params.set("perPage", `${rows}`);
  params.set("sort", sort ?? "id");

  // await new Promise<Response>((resolve) => setTimeout(resolve, 2000));

  const res = await fetch(
    `${API_URL}/${ApiEndpoints.Todos}?${params.toString()}`,
    { cache: "no-cache" },
  );

  if (!res.ok) {
    let error = {};

    try {
      error = await res.json();
    } catch (error) {
      error = error;
    }

    throw new Error(JSON.stringify(error, undefined, 4));
  }

  const data: ApiListPageResponse<Todo> = await res.json();

  return AdapterListPage(data, AdapterTodo);
};

export const getTodo = async (id: string): Promise<Todo> => {
  // await new Promise<Response>((resolve) => setTimeout(resolve, 2000));

  const res = await fetch(`${API_URL}/${ApiEndpoints.Todos}/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    let error = {};

    try {
      error = await res.json();
    } catch (error) {
      error = error;
    }

    throw new Error(JSON.stringify(error, undefined, 4));
  }

  const data: Todo = await res.json();

  return AdapterTodo(data);
};

export const createTodo = async (data: ApiCreateTodo) => {
  const res = await fetch(`${API_URL}/${ApiEndpoints.Todos}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let error = {};

    try {
      error = await res.json();
    } catch (error) {
      error = error;
    }

    throw new Error(JSON.stringify(error, undefined, 4));
  }

  return res;
};

export const updateTodo = async (data: ApiUpdateTodo) => {
  const res = await fetch(`${API_URL}/${ApiEndpoints.Todos}/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let error = {};

    try {
      error = await res.json();
    } catch (error) {
      error = error;
    }

    throw new Error(JSON.stringify(error, undefined, 4));
  }

  return res;
};

export const deleteTodo = async (id: string) => {
  // await new Promise<Response>((resolve) => setTimeout(resolve, 2000));

  const res = await fetch(`${API_URL}/${ApiEndpoints.Todos}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let error = {};

    try {
      error = await res.json();
    } catch (error) {
      error = error;
    }

    throw new Error(JSON.stringify(error, undefined, 4));
  }

  return res;
};
