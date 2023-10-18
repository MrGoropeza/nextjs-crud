import {
  ApiUpdateTodo,
  ClientCrudFormValues,
} from "../models/interfaces/todo.interface";

export const AdapterUpdateTodo = (
  data: ClientCrudFormValues,
): ApiUpdateTodo => {
  return {
    id: data.id ?? "",
    title: data.title,
    description: data.description,
  };
};
