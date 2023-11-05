"use client";

import { Field, FieldProps, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InferType, number, object, string } from "yup";
import { useCrudTableContext } from "./CrudTable/context/CrudTableContext";
import { UtherTodo } from "./models/todo.model";
import { ApiEndpoints, BaseApi } from "./services/base.api";

const validationSchema = object({
  todoId: number(),
  title: string().required("Title is required"),
  description: string().required("Description is required"),
});

type FormValues = InferType<typeof validationSchema>;

interface Props {
  row?: UtherTodo;
}

const CompoundForm = ({ row }: Props) => {
  const router = useRouter();
  const { create, update } = BaseApi<UtherTodo>(ApiEndpoints.Todos);
  const {
    formState: { setVisible, setClosable },
  } = useCrudTableContext();

  const initialValues: FormValues = {
    todoId: row?.todoId,
    title: row?.title ?? "",
    description: row?.description ?? "",
  };

  const handleSubmit = async (values: FormValues) => {
    setClosable(false);

    const todo = Object.assign({} as UtherTodo, values);

    values.todoId ? await update(todo) : await create(todo);

    setVisible(false);
    setClosable(true);
    router.refresh();
  };

  const handleCancel = () => {
    setVisible(false);
    setClosable(true);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form>
          <Field name="title">
            {({ field, meta }: FieldProps) => (
              <div className="flex flex-col gap-2">
                <label htmlFor={field.name}>Title</label>
                <InputText {...field} />
                <small className="text-red-500">
                  {meta.touched && meta.error}
                </small>
              </div>
            )}
          </Field>

          <Field name="description">
            {({ field, meta }: FieldProps) => (
              <div className="flex flex-col gap-2">
                <label htmlFor={field.name}>Description</label>
                <InputText {...field} />
                <small className="text-red-500">
                  {meta.touched && meta.error}
                </small>
              </div>
            )}
          </Field>

          <footer className="flex justify-end gap-2">
            <Button
              type="button"
              label="Cancel"
              severity="danger"
              loading={formik.isSubmitting}
              onClick={handleCancel}
            />
            <Button
              type="submit"
              label="Save"
              severity="success"
              loading={formik.isSubmitting}
            />
          </footer>
        </Form>
      )}
    </Formik>
  );
};
export default CompoundForm;
