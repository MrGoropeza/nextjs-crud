"use client";

import { Field, FieldProps, Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { object, string, type InferType } from "yup";
import { createTodo, updateTodo } from "../services/todo.service";
import { ApiCreateTodo, ApiUpdateTodo, Todo } from "../types/todo.type";

const validationSchema = object({
  id: string(),
  title: string().required("Required field."),
  description: string().required("Required field."),
});

type FormValues = InferType<typeof validationSchema>;

const AdapterUpdateTodo = (data: FormValues): ApiUpdateTodo => {
  return {
    id: data.id ?? "",
    title: data.title,
    description: data.description,
  };
};

const AdapterCreateTodo = (data: FormValues): ApiCreateTodo => {
  return {
    title: data.title,
    description: data.description,
  };
};

interface Props {
  todo?: Todo;
}

const CrudForm = ({ todo }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValues: FormValues = {
    id: todo?.id ?? "",
    title: todo?.title ?? "",
    description: todo?.description ?? "",
  };

  const handleSubmit = async (data: FormValues) => {
    const { id } = data;

    id
      ? await updateTodo(AdapterUpdateTodo(data))
      : await createTodo(AdapterCreateTodo(data));

    // await fetch(`/api/cache/invalidate-path?path=/(pages)/ssr-crud`);
    // await fetch(`/api/cache/invalidate-path?path=/(pages)/ssr-crud/[id]`);
    router.refresh();
    router.replace(`/ssr-crud?${searchParams.toString()}`);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form className="grid gap-4">
          <Field name="title">
            {({ field, form, meta }: FieldProps<string, FormValues>) => (
              <div className="flex flex-col gap-2">
                <label htmlFor={field.name}>Title</label>
                <InputText
                  className={`${meta.touched && meta.error ? "p-invalid" : ""}`}
                  disabled={form.isSubmitting}
                  {...field}
                />
                <small className="text-red-600">
                  {meta.touched && meta.error}
                </small>
              </div>
            )}
          </Field>

          <Field name="description">
            {({ field, form, meta }: FieldProps<string, FormValues>) => (
              <div className="flex flex-col gap-2">
                <label htmlFor={field.name}>Description</label>
                <InputText
                  className={`${meta.touched && meta.error ? "p-invalid" : ""}`}
                  disabled={form.isSubmitting}
                  {...field}
                />
                <small className="text-red-600">
                  {meta.touched && meta.error}
                </small>
              </div>
            )}
          </Field>

          <footer className="flex justify-end gap-2">
            <Button
              type="button"
              severity="danger"
              onClick={() => {
                router.refresh();
                router.replace(`/ssr-crud?${searchParams.toString()}`);
              }}
              label="Cancel"
              loading={formik.isSubmitting}
            />
            <Button
              type="submit"
              severity="success"
              label="Submit"
              loading={formik.isSubmitting}
            />
          </footer>
        </Form>
      )}
    </Formik>
  );
};
export default CrudForm;
