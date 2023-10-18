import { ApiEndpoints } from "@app/enums";
import { BaseModel } from "../models/interfaces/base.interface";
import { ListPageCriteria } from "../models/interfaces/list-criteria.interface";
import { ListPageResponse } from "../models/interfaces/list-response.interface";

const API_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

export interface BaseApiType<Model extends BaseModel> {
  get: (id: string) => Promise<Model>;
  list: (criteria: ListPageCriteria) => Promise<ListPageResponse<Model>>;
  update: (id: string, data: Partial<Model>) => Promise<Partial<Model>>;
  create: (data: Partial<Model>) => Promise<Partial<Model>>;
}

interface BaseApiOptions {
  get?: { customEndpoint?: `${string}{id}${string}`; adapter?: Function };
  list?: { customEndpoint?: string; adapter?: Function };
  create?: { customEndpoint?: string; adapter?: Function };
  update?: { customEndpoint?: `${string}{id}${string}`; adapter?: Function };
  delete?: { customEndpoint?: `${string}{id}${string}`; adapter?: Function };
}

export const BaseApi = <Model extends BaseModel>(
  endpoint: ApiEndpoints,
  options?: BaseApiOptions,
): BaseApiType<Model> => {
  const get = async (id: string): Promise<Model> => {
    const getOptions = options?.get;

    const res = await fetch(
      `${API_URL}/${
        getOptions?.customEndpoint
          ? `${getOptions.customEndpoint.replace("{id}", id)}`
          : `${endpoint}/${id}`
      }`,
    );

    if (!res.ok) {
      try {
        const error = await res.json();
        throw error;
      } catch (e: any) {
        throw { code: res.status, ...e };
      }
    }

    const data = await res.json();

    return getOptions?.adapter ? getOptions.adapter(data) : data;
  };

  const list = async (
    criteria: ListPageCriteria,
  ): Promise<ListPageResponse<any>> => {
    const listOptions = options?.list;

    const params = new URLSearchParams();
    params.set("page", `${criteria.start / criteria.length + 1}`);
    params.set("perPage", `${criteria.length}`);
    criteria.query.sorts.length > 0 &&
      params.set(
        "sort",
        `${criteria.query.sorts
          .map((sort) => `${sort.descending ? "-" : "+"}${sort.propertyName}`)
          .join(",")}`,
      );
    params.set("filter", `title~'${criteria.query.search}'`);

    const res = await fetch(
      `${API_URL}/${
        listOptions?.customEndpoint || endpoint
      }?${params.toString()}`,
    );

    if (!res.ok) {
      try {
        const error = await res.json();
        throw error;
      } catch (e: any) {
        throw { code: res.status, ...e };
      }
    }

    const data = await res.json();

    return listOptions?.adapter ? listOptions.adapter(data) : data;
  };

  const update = async (
    id: string,
    data: Partial<Model>,
  ): Promise<Partial<Model>> => {
    const updateOptions = options?.update;

    const payload = updateOptions?.adapter ? updateOptions.adapter(data) : data;

    const res = await fetch(
      `${API_URL}/${
        updateOptions?.customEndpoint
          ? `${updateOptions.customEndpoint.replace("{id}", id)}`
          : `${endpoint}/${id}`
      }`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      },
    );

    if (!res.ok) {
      try {
        const error = await res.json();
        throw error;
      } catch (e: any) {
        throw { code: res.status, ...e };
      }
    }

    return data;
  };

  const create = async (data: Partial<Model>): Promise<Partial<Model>> => {
    const createOptions = options?.create;

    const payload = createOptions?.adapter ? createOptions.adapter(data) : data;

    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!res.ok) {
      try {
        const error = await res.json();
        throw error;
      } catch (e: any) {
        throw { code: res.status, ...e };
      }
    }

    return data;
  };

  return { get, list, update, create };
};
