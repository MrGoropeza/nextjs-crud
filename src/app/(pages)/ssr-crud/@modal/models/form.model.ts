import { InferType, object, string } from "yup";

export const SSRCrudValidationSchema = object({
  id: string(),
  title: string().required("Required field."),
  description: string().required("Required field."),
});

export type SSRCrudFormValues = InferType<typeof SSRCrudValidationSchema>;
