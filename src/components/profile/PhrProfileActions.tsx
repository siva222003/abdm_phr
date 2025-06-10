import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, FileUpIcon, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type PhrProfileActionsProps = {
  onSwitchProfile: () => void;
  onSelectPreferredAbha: () => void;
  onDownloadAbha: () => void;
};

const PhrProfileActions = ({
  onSwitchProfile,
  onSelectPreferredAbha,
  onDownloadAbha,
}: PhrProfileActionsProps): React.ReactNode => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row items-center"
          data-cy="add-files-button"
        >
          <FileUpIcon className="h-4 w-4 mr-1" />
          <span>Actions</span>
          <ChevronDown className="ml-21 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2.5rem)] sm:w-full"
        data-cy="file-upload-dropdown"
      >
        <DropdownMenuItem asChild>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSwitchProfile()}
            className="flex flex-row justify-stretch items-center w-full "
            data-cy="open-camera-button"
          >
            <Users className="h-4 w-4 mr-2" />
            <span>Switch Profile</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSelectPreferredAbha()}
            className="flex flex-row justify-stretch items-center w-full "
            data-cy="open-camera-button"
          >
            <span>Selct this as preferred abha</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDownloadAbha()}
            className="flex flex-row justify-stretch items-center w-full "
            data-cy="record-audio-button"
          >
            <Zap className="h-4 w-4 mr-2" />
            <span>Download ABHA</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PhrProfileActions;
