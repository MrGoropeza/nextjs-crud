import { InferType, object, string } from "yup";
import { BaseModel } from "./base.interface";

export interface ClientTodo extends BaseModel {
  title: string;
  description: string;
  created: Date;
  updated: Date;
}

export const ClientCrudValidationSchema = object({
  id: string(),
  title: string().required("Required field."),
  description: string().required("Required field."),
});

export type ClientCrudFormValues = InferType<typeof ClientCrudValidationSchema>;

export interface ApiUpdateTodo {
  id: string;
  title: string;
  description: string;
}

export interface ApiCreateTodo {
  title: string;
  description: string;
}
