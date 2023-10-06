import { ToDo } from "@app/types/Todo.type";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useMemo } from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  id: yup.string(),
  title: yup.string().required("Required field"),
  description: yup.string().required("Required field"),
});

type FormValues = yup.InferType<typeof validationSchema>;

type Props = {
  visible: boolean;
  onHide: () => void;
  row?: ToDo;
  onEdit?: (row: Partial<ToDo>) => void;
  onCreate?: (row: Partial<ToDo>) => void;
};

const CrudForm = ({ visible, onHide, row, onCreate, onEdit }: Props) => {
  console.log(row);

  const initialValues: FormValues = useMemo(
    () =>
      row || {
        id: "",
        title: "",
        description: "",
      },
    [row],
  );

  console.log({ row, initialValues });

  const handleSubmit = (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    if (values.id) {
      onEdit && onEdit(values);
      return;
    }

    onCreate && onCreate({ ...values });
  };

  return (
    <>
      {visible && (
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Dialog
              visible={visible}
              onHide={onHide}
              resizable={false}
              header={row ? "Edit" : "Add"}
            >
              <form
                className="flex flex-col gap-4"
                onSubmit={formik.handleSubmit}
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="title">Title</label>
                  <InputText {...formik.getFieldProps("title")} />
                  <ErrorMessage name="title" />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="description">Description</label>
                  <InputText {...formik.getFieldProps("description")} />
                  <ErrorMessage name="description" />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    label="Cancel"
                    severity="danger"
                    onClick={onHide}
                  />
                  <Button type="submit" label="Accept" severity="success" />
                </div>

                <pre>{JSON.stringify(formik.values, undefined, 4)}</pre>
              </form>
            </Dialog>
          )}
        </Formik>
      )}
    </>
  );
};

export default CrudForm;
