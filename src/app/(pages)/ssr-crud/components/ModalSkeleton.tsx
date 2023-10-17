"use client";

import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";

interface Props {
  loadingText?: string;
}

const ModalSkeleton = ({ loadingText = "Loading..." }: Props) => {
  return (
    <Dialog header={loadingText} visible closable={false} onHide={() => {}}>
      <ProgressBar mode="indeterminate" />
    </Dialog>
  );
};
export default ModalSkeleton;
