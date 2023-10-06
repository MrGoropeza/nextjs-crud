import { FieldMetaProps } from "formik";
import { ComponentProps } from "react";

type Props = {
  fieldMeta: FieldMetaProps<unknown>;
} & ComponentProps<"small">;

const FormValidator = ({ fieldMeta, className, ...rest }: Props) => {
  if (!fieldMeta.touched || !fieldMeta.error) return <></>;

  return (
    <small className={`text-red-600 ${className ?? ""}`} {...rest}>
      {fieldMeta.error}
    </small>
  );
};
export default FormValidator;
