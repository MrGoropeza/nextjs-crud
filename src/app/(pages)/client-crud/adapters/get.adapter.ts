import { ClientTodo } from "../models/interfaces/todo.interface";

interface ApiTodo {
  id: string;
  description: string;
  title: string;
  created: Date;
  updated: Date;
}

export const AdapterGetTodo = (data: ApiTodo): ClientTodo => {
  return {
    id: data.id,
    _label: data.title,
    _search: data.title,
    title: data.title,
    description: data.description,
    created: data.created,
    updated: data.updated,
  };
};
