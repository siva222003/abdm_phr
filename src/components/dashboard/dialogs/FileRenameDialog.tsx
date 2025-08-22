import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
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
  const [editError, setEditError] = useState("");

  const { mutateAsync: updateUploadedRecord, isPending } = useMutation({
    mutationFn: mutate(routes.dashboard.updateUploadedRecord, {
      pathParams: { id: editedFile?.id || "" },
    }),
    onSuccess: () => {
      toast.success("File name changed successfully");
      setEditedFile(null);
      queryClient.invalidateQueries({ queryKey: ["uploadedRecords"] });
    },
  });

  const updateFileName = async () => {
    if (!editedFile) return;

    if (editedFile.name?.trim() === "") {
      setEditError("File name cannot be empty");
      return;
    }
    setEditError("");

    await updateUploadedRecord({
      name: editedFile.name || "",
    });
  };

  return (
    <Dialog open={editedFile !== null} onOpenChange={() => setEditedFile(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row">
              <div className="rounded-full bg-primary-100 px-5 py-4">
                <EditIcon className="text-lg text-primary-500" />
              </div>
              <div className="m-4">
                <h1 className="text-xl text-black">Rename File</h1>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event: any) => {
            event.preventDefault();
            updateFileName();
          }}
          className="flex w-full flex-col"
        >
          <div>
            <Label className="mb-3">Enter the file name</Label>
            <Input
              name="editFileName"
              id="edit-file-name"
              value={editedFile?.name}
              onChange={(e) => {
                setEditedFile({
                  ...editedFile,
                  name: e.target.value,
                });
              }}
              data-cy="edit-filename-input"
            />
            {editError && <p className="text-sm text-red-500">{editError}</p>}
          </div>
          <div className="mt-4 flex flex-col-reverse justify-end gap-2 md:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditedFile(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={
                isPending ||
                editedFile?.name === "" ||
                editedFile?.name?.length === 0
              }
            >
              Proceed
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FileRenameDialog;
