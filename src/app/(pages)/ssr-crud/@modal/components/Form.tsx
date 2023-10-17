"use client";

import { Field, FieldProps, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Todo } from "../../models/todo.type";
import { createTodo, updateTodo } from "../../services/todo.service";
import { AdapterCreateTodo, AdapterUpdateTodo } from "../adapters/form.adapter";
import { useModalHide } from "../hooks/useModalHide";
import {
  SSRCrudFormValues,
  SSRCrudValidationSchema,
} from "../models/form.model";

interface Props {
  todo?: Todo;
}

const SSRCrudForm = ({ todo }: Props) => {
  const handleHide = useModalHide();

  const initialValues: SSRCrudFormValues = {
    id: todo?.id ?? "",
    title: todo?.title ?? "",
    description: todo?.description ?? "",
  };

  const handleSubmit = async (data: SSRCrudFormValues) => {
    const { id } = data;

    id
      ? await updateTodo(AdapterUpdateTodo(data))
      : await createTodo(AdapterCreateTodo(data));

    handleHide();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SSRCrudValidationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form className="grid gap-4">
          <Field name="title">
            {({ field, form, meta }: FieldProps<string, SSRCrudFormValues>) => (
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
            {({ field, form, meta }: FieldProps<string, SSRCrudFormValues>) => (
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
              onClick={handleHide}
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
export default SSRCrudForm;
