import { ApiCreateTodo, ApiUpdateTodo } from "../../models/todo.type";
import { SSRCrudFormValues } from "../models/form.model";

export const AdapterUpdateTodo = (data: SSRCrudFormValues): ApiUpdateTodo => {
  return {
    id: data.id ?? "",
    title: data.title,
    description: data.description,
  };
};

export const AdapterCreateTodo = (data: SSRCrudFormValues): ApiCreateTodo => {
  return {
    title: data.title,
    description: data.description,
  };
};
