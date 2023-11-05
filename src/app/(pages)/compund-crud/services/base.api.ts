import { ListPageCriteria, ListPageResponse } from "../models/list.model";
import { DELETE, GET, POST, PUT } from "./rest.api";

export interface BaseApiType<T> {
  get: (id: string) => Promise<T>;
  list: (criteria: ListPageCriteria) => Promise<ListPageResponse<T>>;
  create: (data: T) => Promise<void>;
  update: (data: T) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  deleteMultiple: (ids: string[]) => Promise<void>;
}

export enum ApiEndpoints {
  Todos = "todos",
}

const API_URL = process.env.NEXT_PUBLIC_UTHER_API;

export const BaseApi = <T>(endpoint: ApiEndpoints): BaseApiType<T> => {
  const get = async (id: string): Promise<T> => {
    const response = await GET<T>(`${API_URL}/${endpoint}/${id}`);

    return response;
  };

  const list = async (
    criteria: ListPageCriteria,
  ): Promise<ListPageResponse<T>> => {
    const params = new URLSearchParams();
    params.set("start", `${criteria.start}`);
    params.set("length", `${criteria.length}`);
    params.set("query", `${btoa(JSON.stringify(criteria.query))}`);
    params.set("includes", `${criteria.includes ?? false}`);

    const url = `${API_URL}/${endpoint}?${params.toString()}`;

    const response = await GET<ListPageResponse<T>>(url);

    return response;
  };

  const create = async (data: T): Promise<void> => {
    await POST(`${API_URL}/${endpoint}`, data);
  };

  const update = async (data: T): Promise<void> => {
    await PUT(`${API_URL}/${endpoint}`, data);
  };

  const deleteOne = async (id: string): Promise<void> => {
    await DELETE(`${API_URL}/${endpoint}/${id}`);
  };

  const deleteMultiple = async (ids: string[]): Promise<void> => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("ids", id));

    await DELETE(`${API_URL}/${endpoint}?${params.toString()}`);
  };

  return { get, list, create, update, deleteOne, deleteMultiple };
};
