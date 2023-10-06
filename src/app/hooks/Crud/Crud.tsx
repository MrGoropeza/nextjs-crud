import { CrudService } from "@app/types";
import { ListPageCriteria } from "@app/types/ListCriteria.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Reducer, useCallback, useReducer } from "react";
import type { Action } from "./CrudActions";

type CrudState = {} & ListPageCriteria;

const initialState: CrudState = {
  page: 1,
  rows: 10,
};

export const useCrud = <T,>(service: CrudService<T>) => {
  const queryClient = useQueryClient();

  const reducer: Reducer<CrudState, Action> = useCallback(
    (prevState, action) => {
      if (action.type === "refresh") {
        queryClient.invalidateQueries({ queryKey: ["crudList"] });
      }

      return prevState;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const { data } = useQuery(["crudList", state.page, state.rows], () =>
    service.listPage({ page: state.page, rows: state.rows })
  );

  return { state, dispatch };
};
