import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import routes from "@/api";
import { UploadedRecord } from "@/types/dashboard";
import { mutate } from "@/utils/request/request";

interface FileRenameDialogProps {
  editedFile: UploadedRecord | null;
  setEditedFile: Dispatch<SetStateAction<UploadedRecord | null>>;
}

const FileRenameDialog = ({
  editedFile,
  setEditedFile,
}: FileRenameDialogProps) => {
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (editedFile?.name && editedFile.name !== fileName) {
      setFileName(editedFile.name);
      setEditError("");
    }
  }, [editedFile?.name]);

  const { mutate: updateUploadedRecord, isPending } = useMutation({
    mutationFn: mutate(routes.dashboard.updateUploadedRecord, {
      pathParams: { id: editedFile?.id || "" },
    }),
    onSuccess: () => {
      toast.success("File name changed successfully");
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["uploadedRecords"] });
    },
  });

  const validateFileName = (name: string): string | null => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return "File name cannot be empty";
    }

    if (trimmedName.length > 255) {
      return "File name cannot exceed 255 characters";
    }

    return null;
  };

  const handleClose = () => {
    setEditedFile(null);
    setFileName("");
    setEditError("");
  };

  const updateFileName = () => {
    if (!editedFile) return;

    const validationError = validateFileName(fileName);
    if (validationError) {
      setEditError(validationError);
      return;
    }

    if (fileName.trim() === editedFile.name?.trim()) {
      handleClose();
      return;
    }

    setEditError("");

    updateUploadedRecord({
      name: fileName.trim(),
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateFileName();
  };

  const handleFileNameChange = (value: string) => {
    setFileName(value);
    if (editError && value.trim()) {
      setEditError("");
    }
  };

  return (
    <Dialog
      open={editedFile !== null}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row">
              <div className="rounded-full bg-primary-100 py-4 px-5 flex items-center justify-center">
                <EditIcon className="size-5 text-primary-500" />
              </div>
              <div className="m-4">
                <h1 className="text-xl text-black">Rename File</h1>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex w-full flex-col">
          <div>
            <Label htmlFor="edit-file-name" className="mb-3">
              Enter the file name
            </Label>
            <Input
              name="editFileName"
              id="edit-file-name"
              value={fileName}
              onChange={(e) => handleFileNameChange(e.target.value)}
              data-cy="edit-filename-input"
              placeholder="Enter file name..."
              autoFocus
              maxLength={255}
            />
            {editError && (
              <p className="text-sm text-red-500 mt-1" role="alert">
                {editError}
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-col-reverse justify-end gap-2 md:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={
                isPending ||
                validateFileName(fileName) !== null ||
                fileName.trim() === editedFile?.name?.trim()
              }
            >
              {isPending ? "Updating..." : "Proceed"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FileRenameDialog;
