type RefreshAction = {
  type: "refresh";
};

const refresh = (): RefreshAction => {
  return { type: "refresh" };
};

export type Action = RefreshAction;
export const CrudActions = { refresh };
