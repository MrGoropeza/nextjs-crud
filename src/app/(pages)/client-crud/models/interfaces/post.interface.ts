import { BaseModel } from "./base.interface";

export interface ClientPost extends BaseModel {
  title: string;
  description: string;
  created: Date;
  updated: Date;
}
