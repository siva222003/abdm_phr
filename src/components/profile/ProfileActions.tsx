import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Ellipsis, Users, Zap } from "lucide-react";

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
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2.5rem)] sm:w-full"
      >
        {switchProfileEnabled && (
          <DropdownMenuItem asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSwitchProfile()}
              className="flex flex-row justify-stretch items-center w-full "
            >
              <Users className="h-4 w-4 mr-2" />
              <span>Switch Profile</span>
            </Button>
          </DropdownMenuItem>
        )}
        {canSelectPreferredAbha && (
          <DropdownMenuItem asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSelectPreferredAbha()}
              className="flex flex-row justify-stretch items-center w-full "
            >
              <span>Selct this as preferred abha</span>
            </Button>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDownloadAbha()}
            className="flex flex-row justify-stretch items-center w-full "
          >
            <Zap className="h-4 w-4 mr-2" />
            <span>Download ABHA</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileActions;
