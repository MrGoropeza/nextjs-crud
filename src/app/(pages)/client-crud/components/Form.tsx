"use client";

import { ApiEndpoints } from "@app/enums";
import { Field, FieldProps, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";
import { useToast } from "../context/toast.context";
import { useAsync } from "../hooks/useAsync";
import {
  ApiCreateTodo,
  ClientCrudFormValues,
  ClientCrudValidationSchema,
  ClientTodo,
} from "../models/interfaces/todo.interface";
import { BaseApi } from "../services/base.service";
import { useCrudTableContext } from "./CrudTable";

export const AdapterCreateTodo = (
  data: ClientCrudFormValues,
): ApiCreateTodo => {
  return {
    title: data.title,
    description: data.description,
  };
};

const ClientCrudForm = () => {
  const { showSuccess, showError } = useToast();
  const {
    modalState: { id, setDialogVisible },
    refreshTable,
  } = useCrudTableContext();

  const { get, update, create } = BaseApi<ClientTodo>(ApiEndpoints.Todos);

  const { data, loading, error } = useAsync({
    asyncFn: get,
    args: [`${id}`],
    deps: [],
    fetchOnMount: !!id,
  });

  useEffect(() => {
    if (error) {
      showError("Error fetching todo. Please try again.");
      setDialogVisible(false);
    }
  }, [error]);

  const initialValues: ClientCrudFormValues = {
    id: data ? `${data.id}` : "",
    title: data ? `${data.title}` : "",
    description: data ? `${data.description}` : "",
  };

  const handleSubmit = async (data: ClientCrudFormValues) => {
    const { id } = data;

    try {
      id ? await update(id, data) : await create(data);

      showSuccess("Todo saved successfully.");
      setDialogVisible(false);
      refreshTable();
    } catch (error) {
      showError("Error saving todo. Please try again.");
    }
  };

  return (
    <>
      {id && loading && <div>Loading...</div>}
      {(!id || !loading) && (
        <Formik
          initialValues={initialValues}
          validationSchema={ClientCrudValidationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form className="grid gap-4">
              <Field name="title">
                {({
                  field,
                  form,
                  meta,
                }: FieldProps<string, ClientCrudFormValues>) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name}>Title</label>
                    <InputText
                      className={`${
                        meta.touched && meta.error ? "p-invalid" : ""
                      }`}
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
                {({
                  field,
                  form,
                  meta,
                }: FieldProps<string, ClientCrudFormValues>) => (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={field.name}>Description</label>
                    <InputText
                      className={`${
                        meta.touched && meta.error ? "p-invalid" : ""
                      }`}
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
                  onClick={() => setDialogVisible(false)}
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

              {/* <pre>{JSON.stringify(formik.values, undefined, 4)}</pre> */}
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};
export default ClientCrudForm;
