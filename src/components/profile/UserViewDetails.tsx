// import { formatPhoneNumberIntl } from "react-phone-number-input";
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
        <span id={`view-${id}`} className="text-sm truncate">
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
        className={`
          inline-flex items-center rounded-full text-base font-semibold
         ${textColor} ${className}
        `}
      >
        {text}
      </span>
    </div>
  );
};

export const BasicInfoDetails = ({ user }: UserViewDetailsProps) => {
  return (
    <div className="pt-2 pb-5">
      <Badge text="Basic Information" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue
          id="abha_number"
          label="ABHA Number"
          value={user?.abhaNumber}
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

export const ContactInfoDetails = ({ user }: UserViewDetailsProps) => {
  return (
    <div className="pt-2 pb-5">
      <div className="flex justify-between">
        <Badge text="Contact Information" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              {/* <CareIcon icon="l-ellipsis-h" /> */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Button
                size="sm"
                onClick={() => {}}
                variant="ghost"
                className="w-full flex flex-row justify-stretch items-center"
              >
                {/* <CareIcon icon="l-envelope" className="mr-1" /> */}
                <span>Update Email</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                size="sm"
                onClick={() => {}}
                variant="ghost"
                className="w-full flex flex-row justify-stretch items-center"
              >
                {/* <CareIcon icon="l-outgoing-call" className="mr-1" /> */}
                <span>Update Mobile</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue id="email" label="email" value={user.email} />
        <LabelValue
          id="phone_number"
          label="phone_number"
          // value={user.mobile && formatPhoneNumberIntl(user.mobile)}
        />
      </div>
    </div>
  );
};

export const GeoOrgDetails = ({ user }: UserViewDetailsProps) => {
  return (
    <div className="pt-2 pb-5">
      <Badge text="location" />
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
