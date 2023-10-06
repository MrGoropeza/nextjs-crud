import { ListPageCriteria } from "./ListCriteria.type";

export type CrudService<T> = {
  listPage: (criteria: ListPageCriteria) => Promise<any>;
  listAll: () => Promise<T[]>;
  get: () => Promise<T>;
  create: <ReturnType>(data: T) => Promise<ReturnType>;
  update: <ReturnType>(data: T) => Promise<ReturnType>;
  deleteOne: <ReturnType>(data: T) => Promise<ReturnType>;
};
