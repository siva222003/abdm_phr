import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Award, Ellipsis, ImageDown, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type ProfileActionsProps = {
  onSwitchProfile: () => void;
  onSelectPreferredAbha: () => void;
  onDownloadAbha: () => void;
  canSelectPreferredAbha: boolean;
  switchProfileEnabled: boolean;
};

const ProfileActions = ({
  onSwitchProfile,
  onSelectPreferredAbha,
  onDownloadAbha,
  canSelectPreferredAbha,
  switchProfileEnabled,
}: ProfileActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canSelectPreferredAbha && (
          <DropdownMenuItem asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSelectPreferredAbha()}
              className="flex justify-stretch items-center w-full cursor-pointer"
            >
              <Award className="size-4" />
              <span>Set as preferred ABHA</span>
            </Button>
          </DropdownMenuItem>
        )}
        {switchProfileEnabled && (
          <DropdownMenuItem asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSwitchProfile()}
              className="flex justify-stretch items-center w-full cursor-pointer"
            >
              <Users className="size-4" />
              <span>Switch Profile</span>
            </Button>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDownloadAbha()}
            className="flex justify-stretch items-center w-full cursor-pointer"
          >
            <ImageDown className="size-4" />
            <span>Download ABHA</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileActions;
