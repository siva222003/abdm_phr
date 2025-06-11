import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

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
    link.download = "abha-card.png";
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
    toast.success("ABHA card downloaded successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95%] max-w-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Download ABHA Card</DialogTitle>
          <DialogDescription>
            View and download your ABHA card below.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-2">
          <img
            src={abhaCardUrl}
            alt="ABHA Card"
            className="w-full max-xs:h-[40vh] h-[50vh] sm:h-[70vh] object-cover rounded-md shadow-sm"
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
