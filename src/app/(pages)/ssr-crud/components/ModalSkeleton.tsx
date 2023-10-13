"use client";

import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";

const ModalSkeleton = () => {
  return (
    <Dialog
      header={"Loading todo..."}
      visible
      closable={false}
      onHide={() => {}}
    >
      <ProgressBar mode="indeterminate" />
    </Dialog>
  );
};
export default ModalSkeleton;
