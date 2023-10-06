import { ToDo } from "@app/types/Todo.type";

export const Todos: ToDo[] = Array.from({ length: 10 }).map((_, index) => ({
  id: `todo_${index}`,
  title: `todo_title_${index}`,
  created: new Date(),
  description: `todo_description_${index}`,
  updated: new Date(),
}));
