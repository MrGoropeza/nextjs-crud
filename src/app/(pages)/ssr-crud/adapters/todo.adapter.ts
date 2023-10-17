import { ApiTodo, Todo } from "../models/todo.type";

export function AdapterTodo(data: ApiTodo): Todo {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    created: data.created,
    updated: data.updated,
  };
}
