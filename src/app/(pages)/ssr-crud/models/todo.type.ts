export interface ApiTodo {
  id: string;
  description: string;
  title: string;
  created: Date;
  updated: Date;
}

export interface ApiUpdateTodo {
  id: string;
  title: string;
  description: string;
}

export interface ApiCreateTodo {
  title: string;
  description: string;
}

export interface Todo {
  id: string;
  description: string;
  title: string;
  created: Date;
  updated: Date;
}
