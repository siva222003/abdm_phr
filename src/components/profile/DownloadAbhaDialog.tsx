import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DownloadAbhaProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  abhaCardUrl: string;
};

const DownloadAbha = ({ open, setOpen, abhaCardUrl }: DownloadAbhaProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = abhaCardUrl;
    link.download = "abha-card.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Download ABHA Card</DialogTitle>
          <DialogDescription>
            View and download your ABHA card below.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <img
            src={abhaCardUrl}
            alt="ABHA Card"
            className="w-full h-[50vh] object-contain rounded-md shadow-sm"
          />
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button className="w-full" onClick={handleDownload}>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadAbha;
