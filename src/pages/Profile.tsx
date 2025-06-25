import {
  CircleCheckIcon,
  Link2Icon,
  SquarePen,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import UserAvatar from "@/components/profile/UserAvatar";

import { useAuthContext } from "@/hooks/useAuth";

import { KYC_STATUS, PhrProfile } from "@/types/profile";
import { getProfilePhotoUrl } from "@/utils";

const KYCStatusBadge = ({ isVerified }: { isVerified: boolean }) => (
  <Badge
    variant="outline"
    className={`flex items-center whitespace-nowrap ${
      isVerified
        ? "bg-green-50 text-primary-500 border-primary-200"
        : "bg-yellow-50 text-warning-500 border-yellow-200"
    }`}
  >
    {isVerified ? (
      <CircleCheckIcon className="h-3 w-3 mr-2" aria-hidden="true" />
    ) : (
      <TriangleAlert className="h-3 w-3 mr-2" aria-hidden="true" />
    )}
    <span>{isVerified ? "KYC Verified" : "Self Declared"}</span>
  </Badge>
);

const AbhaNumberDisplay = ({
  isKYCVerified,
  abhaNumber,
}: {
  isKYCVerified: boolean;
  abhaNumber?: string;
}) => (
  <>
    {isKYCVerified && abhaNumber ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-sm font-light text-gray-600 truncate">
            ABHA Number: {abhaNumber}
          </p>
        </TooltipTrigger>
        <TooltipContent side="bottom">{abhaNumber}</TooltipContent>
      </Tooltip>
    ) : (
      <p className="text-sm text-gray-500">No ABHA Number Linked</p>
    )}
  </>
);

const ProfileHeader = ({
  userData,
  isKYCVerified,
}: {
  userData: PhrProfile;
  isKYCVerified: boolean;
}) => (
  <div className="flex gap-4 items-start">
    <Avatar
      imageUrl={getProfilePhotoUrl(userData.profilePhoto)}
      name={userData.abhaAddress}
      className="size-20 shrink-0"
    />

    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-center gap-3 flex-wrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <h1 className="text-xl font-bold truncate">
              {userData.abhaAddress}
            </h1>
          </TooltipTrigger>
          <TooltipContent side="top">{userData.abhaAddress}</TooltipContent>
        </Tooltip>
        <KYCStatusBadge isVerified={isKYCVerified} />
      </div>

      <AbhaNumberDisplay
        isKYCVerified={isKYCVerified}
        abhaNumber={userData.abhaNumber}
      />
    </div>
  </div>
);

const AbhaManagementSection = ({
  isKYCVerified,
  onAction,
}: {
  isKYCVerified: boolean;
  onAction: () => void;
}) => {
  if (isKYCVerified) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            ABHA Account Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-md border p-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Unlink ABHA Number</h3>
              <p className="text-sm text-gray-700">
                Disconnect your ABHA number from this account. This will remove
                verification benefits but won't delete your profile.
              </p>
            </div>
            <Button onClick={onAction} variant="destructive" className="w-fit">
              <Link2Icon className="h-4 mr-2" />
              Unlink ABHA
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className="border-warning">
        <CardHeader>
          <CardTitle className="text-warning">Complete ABHA Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-md border p-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Link ABHA Number</h3>
              <p className="text-sm text-gray-700">
                Your account is incomplete. Link your ABHA number to verify your
                identity and access full health services.
              </p>
            </div>
            <Button
              onClick={onAction}
              className="w-fit bg-warning hover:bg-warning/90 text-white"
            >
              <Link2Icon className="h-4 mr-2" />
              Link ABHA Number
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
};

const Profile = () => {
  const { user, switchProfileEnabled } = useAuthContext();

  const [modals, setModals] = useState({
    editProfile: false,
    switchProfile: false,
    selectPreferredAbha: false,
    downloadAbha: false,
    abhaUnlink: false,
    updateMobile: false,
    updateEmail: false,
  });

  const toggleModal = (modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: !prev[modalName] }));
  };

  const isKYCVerified = user?.kycStatus === KYC_STATUS.VERIFIED;

  const ContactInfoWithHandlers = (user: PhrProfile) => (
    <ContactInfo
      user={user}
      setShowUpdateMobile={() => toggleModal("updateMobile")}
      setShowUpdateEmail={() => toggleModal("updateEmail")}
    />
  );

  const profileSections = useMemo(
    () => [
      {
        id: "avatar",
        heading: "Profile Picture",
        note: "Upload and manage your profile picture.",
        Component: UserAvatar,
        props: user,
      },
      {
        id: "basic",
        heading: "Basic Information",
        note: "Your personal details and identification information.",
        Component: BasicInfo,
        props: user,
      },
      {
        id: "contact",
        heading: "Contact Information",
        note: "Manage your contact details for communication.",
        Component: ContactInfoWithHandlers,
        props: user,
      },
      {
        id: "location",
        heading: "Location Information",
        note: "Your address and location details for service delivery.",
        Component: LocationInfo,
        props: user,
      },
      {
        id: "security",
        heading: "Security",
        note: "Manage your account password and security settings.",
        Component: ResetPassword,
        props: user,
      },
    ],
    [user],
  );

  if (!user) {
    return null;
  }

  return (
    <Page title="ABHA Profile" hideTitleOnPage>
      <div className="mx-auto space-y-8">
        {/* Profile Header */}
        <ProfileHeader userData={user} isKYCVerified={isKYCVerified} />

        {/* Profile Actions */}
        <div className="flex gap-3 justify-end flex-wrap">
          <Button
            variant="outline"
            onClick={() => toggleModal("editProfile")}
            className="flex items-center gap-2"
          >
            <SquarePen className="size-4" />
            Edit Profile
          </Button>

          <PhrProfileActions
            onSwitchProfile={() => toggleModal("switchProfile")}
            onSelectPreferredAbha={() => toggleModal("selectPreferredAbha")}
            onDownloadAbha={() => toggleModal("downloadAbha")}
            canSelectPreferredAbha={
              user.preferredAbhaAddress !== user.abhaAddress && isKYCVerified
            }
            switchProfileEnabled={switchProfileEnabled}
          />
        </div>

        {/* Profile Sections */}
        <div className="space-y-8">
          {profileSections.map(({ id, heading, note, Component, props }) => (
            <ProfileColumns
              key={id}
              heading={heading}
              note={note}
              Child={Component}
              childProps={props!}
            />
          ))}
        </div>

        {/* ABHA Management Section */}
        <AbhaManagementSection
          isKYCVerified={!isKYCVerified}
          onAction={() => toggleModal("abhaUnlink")}
        />
      </div>

      {/* All Modals */}
      <EditProfileSheet
        open={modals.editProfile}
        setOpen={() => toggleModal("editProfile")}
        userData={user}
        isKYCVerified={isKYCVerified}
      />

      <SwitchProfileDialog
        open={modals.switchProfile}
        setOpen={() => toggleModal("switchProfile")}
        currentAbhaAddress={user.abhaAddress}
      />

      <DownloadAbhaDialog
        open={modals.downloadAbha}
        setOpen={() => toggleModal("downloadAbha")}
      />

      <UpdateMobileDialog
        open={modals.updateMobile}
        setOpen={() => toggleModal("updateMobile")}
      />

      <UpdateEmailDialog
        open={modals.updateEmail}
        setOpen={() => toggleModal("updateEmail")}
      />

      <SelectPreferredAbhaDialog
        open={modals.selectPreferredAbha}
        setOpen={() => toggleModal("selectPreferredAbha")}
        existingAbhaNumber={user.abhaNumber || ""}
      />

      <AbhaUnlinkDialog
        open={modals.abhaUnlink}
        setOpen={() => toggleModal("abhaUnlink")}
        existingAbhaNumber={user.abhaNumber || ""}
        isKYCVerified={isKYCVerified}
      />
    </Page>
  );
};

export default Profile;
