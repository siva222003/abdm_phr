import { Ellipsis, Mail, Phone } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { PhrProfile } from "@/types/profile";

interface UserViewDetailsProps {
  user: PhrProfile;
  setShowUpdateMobile?: Dispatch<SetStateAction<boolean>>;
  setShowUpdateEmail?: Dispatch<SetStateAction<boolean>>;
}

const LabelValue = ({
  label,
  value,
  id,
}: {
  label: string;
  value?: string | null;
  id?: string;
}) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm text-gray-500">{label}</p>
    <Tooltip>
      <TooltipTrigger asChild>
        <span id={`view-${id}`} className="text-sm truncate w-fit">
          {value || "-"}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{value || "-"}</TooltipContent>
    </Tooltip>
  </div>
);

interface BadgeProps {
  text: string;
  textColor?: string;
  className?: string;
}

export const Badge = ({
  text,
  textColor = "text-black",
  className = "",
}: BadgeProps) => {
  return (
    <div className="mb-4">
      <div className="my-1 h-1 w-6 bg-blue-600" />
      <span
        className={cn(
          "inline-flex items-center rounded-full text-base font-semibold",
          textColor,
          className,
        )}
      >
        {text}
      </span>
    </div>
  );
};

export const BasicInfo = ({ user }: UserViewDetailsProps) => {
  return (
    <div className="pt-2 pb-5">
      <Badge text="Basic Information" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue
          id="abha_number"
          label="ABHA Number"
          value={user.abhaNumber}
        />
        <LabelValue
          id="abha_address"
          label="ABHA Address"
          value={user.abhaAddress}
        />
        <LabelValue id="first_name" label="First Name" value={user.firstName} />
        <LabelValue
          id="middle_name"
          label="Middle Name"
          value={user.middleName}
        />
        <LabelValue id="last_name" label="Last Name" value={user.lastName} />
        <LabelValue
          id="date_of_birth"
          label="Date of Birth"
          value={user.dateOfBirth}
        />
        <LabelValue id="gender" label="Gender" value={user.gender} />
      </div>
    </div>
  );
};

export const ContactInfo = ({
  user,
  setShowUpdateMobile,
  setShowUpdateEmail,
}: UserViewDetailsProps) => {
  return (
    <div className="pt-2 pb-5">
      <div className="flex justify-between">
        <Badge text="Contact Information" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Button
                size="sm"
                onClick={() => setShowUpdateEmail?.(true)}
                variant="ghost"
                className="w-full flex flex-row justify-stretch items-center"
              >
                <Mail className="mr-1" />
                <span>Update Email</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                size="sm"
                onClick={() => setShowUpdateMobile?.(true)}
                variant="ghost"
                className="w-full flex flex-row justify-stretch items-center"
              >
                <Phone className="mr-1" />
                <span>Update Mobile</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue id="email" label="Email" value={user.email} />
        <LabelValue id="phone_number" label="Mobile" value={user.mobile} />
      </div>
    </div>
  );
};

export const LocationInfo = ({ user }: UserViewDetailsProps) => {
  return (
    <div className="pt-2 pb-5">
      <Badge text="Location" />
      <div className="space-y-4">
        <LabelValue id="address" label="Address" value={user.address} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <LabelValue
            id="district"
            label="District"
            value={user.districtName}
          />
          <LabelValue id="state" label="State" value={user.stateName} />
          <LabelValue id="pincode" label="Pincode" value={user.pinCode} />
        </div>
      </div>
    </div>
  );
};
