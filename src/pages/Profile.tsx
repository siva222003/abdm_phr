import {
  CircleCheckIcon,
  Link2Icon,
  SquarePen,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

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
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-yellow-50 text-yellow-700 border-yellow-200"
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

const DangerZone = ({
  isKYCVerified,
  onUnlink,
}: {
  isKYCVerified: boolean;
  onUnlink: () => void;
}) => (
  <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
        <div className="text-sm text-red-700 space-y-1">
          <p className="font-medium">Unlink ABHA Account</p>
          <p>
            This action will permanently disconnect your ABHA account and remove
            all associated data. This cannot be undone.
          </p>
          {!isKYCVerified && (
            <p className="text-red-600 font-medium">
              ⚠️ Your account is not KYC verified. Unlinking will permanently
              delete your profile.
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={onUnlink}
        variant={isKYCVerified ? "destructive" : "outline"}
        className={`flex items-center gap-2 ${
          !isKYCVerified
            ? "border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
            : ""
        }`}
      >
        <Link2Icon className="size-4" />
        {isKYCVerified ? "Unlink ABHA" : "Delete Account"}
      </Button>
    </div>
  </div>
);

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

        {/* Danger Zone */}
        <DangerZone
          isKYCVerified={isKYCVerified}
          onUnlink={() => toggleModal("abhaUnlink")}
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
