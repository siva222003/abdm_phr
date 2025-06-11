import {
  CircleAlertIcon,
  CircleCheckIcon,
  Link2Icon,
  SquarePen,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar } from "@/components/common/Avatar";
import Page from "@/components/common/Page";
import AbhaUnlinkDialog from "@/components/profile/AbhaUnlinkDialog";
import DownloadAbhaDialog from "@/components/profile/DownloadAbhaDialog";
import EditProfileSheet from "@/components/profile/EditProfileSheet";
import PhrProfileColumns from "@/components/profile/PhrProfileColumns";
import PhrProfileActions from "@/components/profile/ProfileActions";
// import UserAvatar from "@/components/profile/UserAvatar";
import {
  BasicInfo,
  ContactInfo,
  LocationInfo,
} from "@/components/profile/ProfileViewDetails";
import ResetPassword from "@/components/profile/ResetPassword";
import SelectPreferredAbhaDialog from "@/components/profile/SelectPreferredAbhaDialog";
import SwitchProfileDialog from "@/components/profile/SwitchProfileDialog";
import UpdateMobileDialog from "@/components/profile/UpdateMobileDialog";

import { PhrProfile as PhrProfileType } from "@/types/profile";

const Profile = () => {
  const userData: PhrProfileType = {
    abhaAddress: "91316778610170@sbx",
    abhaNumber: "91-3167-7861-0170",
    address: "123 Adventure Lane",
    dateOfBirth: "2000-05-15",
    dayOfBirth: "15",
    districtCode: "1",
    districtName: "Explorer District",
    email: "dora@example.com",
    emailVerified: "true" as "true" | "false",
    firstName: "Dora",
    fullName: "Dora Explorer",
    gender: "F" as "M" | "F" | "O",
    kycStatus: "VERIFIED" as "VERIFIED" | "PENDING",
    lastName: "Explorer",
    middleName: null,
    mobile: "+919876543210",
    mobileVerified: "true" as "true" | "false",
    monthOfBirth: "05",
    pinCode: "400001",
    profilePhoto:
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stateCode: "1",
    stateName: "Maharashtra",
    status: "ACTIVE",
    yearOfBirth: "2000",
  };
  const [showPhrProfileEditSheet, setShowPhrProfileEditSheet] = useState(false);
  const [showSwitchProfileDialog, setShowSwitchProfileDialog] = useState(false);
  const [showSelectPreferredAbhaDialog, setShowSelectPreferredAbhaDialog] =
    useState(false);
  const [showDownloadAbhaDialog, setShowDownloadAbhaDialog] = useState(false);
  const [showAbhaUnlinkDialog, setShowAbhaUnlinkDialog] = useState(false);
  const [showUpdateMobileDialog, setShowUpdateMobileDialog] = useState(false);

  const phrProfiles = [
    "91316778610170@sbx",
    "91316778610171@sbx",
    "91316778610172@sbx",
    "91316778610173@sbx",
    "91316778610174@sbx",
    "91316778610175@sbx",
  ];

  if (!userData) {
    return null;
  }

  const renderBasicInfo = () => {
    return (
      <div className="overflow-visible px-4 py-5 sm:px-6 rounded-lg shadow-sm sm:rounded-lg bg-white">
        <BasicInfo user={userData} />
      </div>
    );
  };

  const renderContactInfo = () => {
    return (
      <div className="overflow-visible px-4 py-5 sm:px-6 rounded-lg shadow-sm sm:rounded-lg bg-white">
        <ContactInfo user={userData} />
      </div>
    );
  };

  const renderLocationInfo = () => {
    return (
      <div className="overflow-visible px-4 py-5 sm:px-6 rounded-lg shadow-sm sm:rounded-lg bg-white">
        <LocationInfo user={userData} />
      </div>
    );
  };

  const isKYCVerified =
    userData.abhaNumber && userData?.kycStatus === "VERIFIED";

  return (
    <Page title="Abha Profile" hideTitleOnPage>
      <div className="flex gap-2">
        <Avatar
          imageUrl="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          name={userData.abhaAddress}
          className="size-20 md:mr-2"
        />
        <div className="grid grid-cols-1 self-center">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <h1 className="text-xl font-bold truncate">
                  {userData.abhaAddress}
                </h1>
              </TooltipTrigger>
              <TooltipContent side="top">{userData.abhaAddress}</TooltipContent>
            </Tooltip>
            <div className="text-sm text-secondary-600">
              {isKYCVerified ? (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 flex items-center whitespace-nowrap"
                >
                  <CircleCheckIcon className="h-3 w-3 mr-2" />
                  <span>KYC Verified</span>
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-700 flex items-center whitespace-nowrap"
                >
                  <CircleAlertIcon className="h-3 w-3 mr-2" />
                  <span>Self Declared</span>
                </Badge>
              )}
            </div>
          </div>
          {isKYCVerified ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-left text-sm font-light leading-relaxed text-secondary-600 truncate">
                  {userData.abhaNumber}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {userData.abhaNumber}
              </TooltipContent>
            </Tooltip>
          ) : (
            <p className="text-sm leading-relaxed truncate">
              No ABHA Number Linked
            </p>
          )}
        </div>
      </div>

      <EditProfileSheet
        open={showPhrProfileEditSheet}
        setOpen={setShowPhrProfileEditSheet}
        userData={userData}
      />

      <SwitchProfileDialog
        open={showSwitchProfileDialog}
        setOpen={setShowSwitchProfileDialog}
        currentAbhaAddress={userData.abhaAddress}
        phrProfiles={phrProfiles}
        onSwitchProfileSuccess={() => {
          setShowSwitchProfileDialog(false);
        }}
      />

      <SelectPreferredAbhaDialog
        open={showSelectPreferredAbhaDialog}
        setOpen={setShowSelectPreferredAbhaDialog}
      />

      <DownloadAbhaDialog
        open={showDownloadAbhaDialog}
        setOpen={setShowDownloadAbhaDialog}
        abhaCardUrl={userData.profilePhoto!}
      />

      <UpdateMobileDialog
        open={showUpdateMobileDialog}
        setOpen={setShowUpdateMobileDialog}
      />

      <AbhaUnlinkDialog
        open={showAbhaUnlinkDialog}
        setOpen={setShowAbhaUnlinkDialog}
      />

      <div className="mt-10 flex flex-col gap-y-6">
        <div className="flex gap-4 self-end">
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => setShowPhrProfileEditSheet(true)}
          >
            <SquarePen />
            Edit User
          </Button>
          <PhrProfileActions
            onSwitchProfile={() => setShowSwitchProfileDialog(true)}
            onSelectPreferredAbha={() => setShowSelectPreferredAbhaDialog(true)}
            onDownloadAbha={() => setShowDownloadAbhaDialog(true)}
          />
        </div>

        {/* <PhrProfileColumns
            heading="Edit Avatar"
            note={
              "You can change your avatar here. This will be visible to other users."
            }
            Child={UserAvatar}
            childProps={userData}
          /> */}

        <PhrProfileColumns
          heading="Basic Information"
          note="This section contains your personal information."
          Child={renderBasicInfo}
          childProps={userData}
        />
        <PhrProfileColumns
          heading="Contact Information"
          note="This section contains your contact details."
          Child={renderContactInfo}
          childProps={userData}
        />
        <PhrProfileColumns
          heading="Location Information"
          note="Your location details are important for service delivery."
          Child={renderLocationInfo}
          childProps={userData}
        />

        <PhrProfileColumns
          heading="Reset Password"
          note="Change your password to keep your account secure."
          Child={ResetPassword}
          childProps={userData}
        />

        <div className="mt-3 flex flex-col items-center gap-5 border-t-2 pt-5 sm:flex-row">
          <div className="sm:w-1/4">
            <div className="my-1 text-sm leading-5">
              <p className="mb-2 font-semibold">Delete Account</p>
              <p className="text-secondary-600">
                This action will permanently delete your account and all
                associated data. Please proceed with caution.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-3/4">
            <Button
              onClick={() => setShowAbhaUnlinkDialog(true)}
              variant="destructive"
              data-testid="user-delete-button"
              className="my-1 inline-flex"
            >
              <Link2Icon className="h-4 w-4 mr-2" />
              <span className="">Unlink ABHA</span>
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Profile;
