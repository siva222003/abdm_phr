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
import PhrProfileActions from "@/components/profile/ProfileActions";
import ProfileColumns from "@/components/profile/ProfileColumns";
// import UserAvatar from "@/components/profile/UserAvatar";
import {
  BasicInfo,
  ContactInfo,
  LocationInfo,
} from "@/components/profile/ProfileViewDetails";
import ResetPassword from "@/components/profile/ResetPassword";
import SelectPreferredAbhaDialog from "@/components/profile/SelectPreferredAbhaDialog";
import SwitchProfileDialog from "@/components/profile/SwitchProfileDialog";
import UpdateEmailDialog from "@/components/profile/UpdateEmailDialog";
import UpdateMobileDialog from "@/components/profile/UpdateMobileDialog";

import { useAuthContext } from "@/hooks/useAuth";

const Profile = () => {
  const { user: userData, switchProfileEnabled } = useAuthContext();
  const [showPhrProfileEditSheet, setShowPhrProfileEditSheet] = useState(false);
  const [showSwitchProfileDialog, setShowSwitchProfileDialog] = useState(false);
  const [showSelectPreferredAbhaDialog, setShowSelectPreferredAbhaDialog] =
    useState(false);
  const [showDownloadAbhaDialog, setShowDownloadAbhaDialog] = useState(false);
  const [showAbhaUnlinkDialog, setShowAbhaUnlinkDialog] = useState(false);
  const [showUpdateMobileDialog, setShowUpdateMobileDialog] = useState(false);
  const [showUpdateEmailDialog, setShowUpdateEmailDialog] = useState(false);

  if (!userData) {
    return null;
  }

  const isKYCVerified =
    !!userData.abhaNumber && userData?.kycStatus === "VERIFIED";

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
        <ContactInfo
          setShowUpdateMobile={setShowUpdateMobileDialog}
          setShowUpdateEmail={setShowUpdateEmailDialog}
          user={userData}
        />
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

  const kycStatusBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 flex items-center whitespace-nowrap"
        >
          <CircleCheckIcon className="h-3 w-3 mr-2" aria-hidden="true" />
          <span>KYC Verified</span>
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-yellow-100 text-yellow-700 flex items-center whitespace-nowrap"
      >
        <CircleAlertIcon className="h-3 w-3 mr-2" aria-hidden="true" />
        <span>Self Declared</span>
      </Badge>
    );
  };
  const { profilePhoto, abhaAddress, abhaNumber } = userData;

  const imageUrl = profilePhoto
    ? `data:image/jpeg;base64,${profilePhoto}`
    : undefined;

  return (
    <Page title="Abha Profile" hideTitleOnPage>
      <div className="flex gap-2 items-start">
        <Avatar
          imageUrl={imageUrl}
          name={abhaAddress}
          className="size-20 shrink-0 md:mr-2"
        />

        <div className="grid grid-cols-1 self-center min-w-0">
          {" "}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xl font-bold truncate">{abhaAddress}</div>
              </TooltipTrigger>
              <TooltipContent side="top">{abhaAddress}</TooltipContent>
            </Tooltip>
            <div className="text-sm shrink-0">
              {kycStatusBadge(isKYCVerified)}
            </div>
          </div>
          {isKYCVerified && abhaNumber ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-left text-sm font-light leading-relaxed text-secondary-600 truncate">
                  {abhaNumber}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom">{abhaNumber}</TooltipContent>
            </Tooltip>
          ) : (
            <p className="text-sm leading-relaxed text-secondary-600 truncate">
              No ABHA Number Linked
            </p>
          )}
        </div>
      </div>
      <EditProfileSheet
        open={showPhrProfileEditSheet}
        setOpen={setShowPhrProfileEditSheet}
        userData={userData}
        isKYCVerified={isKYCVerified}
      />

      <SwitchProfileDialog
        open={showSwitchProfileDialog}
        setOpen={setShowSwitchProfileDialog}
        currentAbhaAddress={userData.abhaAddress}
      />

      <DownloadAbhaDialog
        open={showDownloadAbhaDialog}
        setOpen={setShowDownloadAbhaDialog}
      />

      <UpdateMobileDialog
        open={showUpdateMobileDialog}
        setOpen={setShowUpdateMobileDialog}
      />

      <UpdateEmailDialog
        open={showUpdateEmailDialog}
        setOpen={setShowUpdateEmailDialog}
      />

      <SelectPreferredAbhaDialog
        open={showSelectPreferredAbhaDialog}
        setOpen={setShowSelectPreferredAbhaDialog}
        existingAbhaNumber={abhaNumber || ""}
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
            canSelectPreferredAbha={
              userData.preferredAbhaAddress !== userData.abhaAddress &&
              isKYCVerified
            }
            switchProfileEnabled={switchProfileEnabled}
          />
        </div>

        {/* <ProfileColumns
            heading="Edit Avatar"
            note={
              "You can change your avatar here. This will be visible to other users."
            }
            Child={UserAvatar}
            childProps={userData}
          /> */}

        <ProfileColumns
          heading="Basic Information"
          note="This section contains your personal information."
          Child={renderBasicInfo}
          childProps={userData}
        />
        <ProfileColumns
          heading="Contact Information"
          note="This section contains your contact details."
          Child={renderContactInfo}
          childProps={userData}
        />
        <ProfileColumns
          heading="Location Information"
          note="Your location details are important for service delivery."
          Child={renderLocationInfo}
          childProps={userData}
        />

        <ProfileColumns
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
