import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  BasicDetailsSection,
  LocationDetailsSection,
} from "@/components/profile/ProfileFormSections";

import { PhrProfile } from "@/types/profile";

type PhrProfileFormProps = {
  userData: PhrProfile;
  onUpdateSuccess: () => void;
};

export default function PhrProfileForm({
  userData,
  onUpdateSuccess,
}: PhrProfileFormProps) {
  // const queryClient = useQueryClient();

  const phrFormSchema = z.object({
    first_name: z.string().nonempty({
      message: "First name is required",
    }),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    gender: z.enum(["M", "F", "O"], {
      required_error: "Gender is required",
    }),
    date_of_birth: z.string({
      required_error: "Date of birth is required",
    }),
    state_code: z.number({ required_error: "State is required" }),
    state_name: z.string(),
    district_code: z
      .number({ required_error: "District is required" })
      .min(1, { message: "Select a district" }),
    district_name: z.string(),
    address: z.string().min(1, "Address is required"),
    pin_code: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
  });

  const form = useForm({
    resolver: zodResolver(phrFormSchema),
    defaultValues: {
      first_name: userData.firstName,
      middle_name: userData.middleName || "",
      last_name: userData.lastName || "",
      gender: userData.gender,
      date_of_birth: userData.dateOfBirth,
      state_code: Number(userData.stateCode),
      district_code: Number(userData.districtCode),
      state_name: userData.stateName,
      district_name: userData.districtName,
      address: userData.address,
      pin_code: userData.pinCode,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("Profile updated successfully");
        }, 1000);
      });
    },
    onSuccess: () => {
      //TODO: INVALIDATE QUERIES AND CLOSE SHEET
      toast.success("Profile updated successfully");
      onUpdateSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const onSubmit = (values: z.infer<typeof phrFormSchema>) => {
    const payload = {
      firstName: values.first_name,
      middleName: values.middle_name,
      lastName: values.last_name,
      gender: values.gender,
      yearOfBirth: values.date_of_birth.split("-")[0],
      monthOfBirth: values.date_of_birth.split("-")[1],
      dayOfBirth: values.date_of_birth.split("-")[2],
      stateCode: values.state_code.toString(),
      stateName: values.state_name,
      districtCode: values.district_code.toString(),
      districtName: values.district_name,
      address: values.address,
      pinCode: values.pin_code,
      mobile: userData.mobile,
      email: userData.email,
    };

    console.log(payload);

    updateProfileMutation.mutate();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium">Basic Details</h3>
          <BasicDetailsSection
            form={form}
            className="grid grid-cols-1 gap-4 items-start sm:grid-cols-3"
          />
        </div>

        <div className="space-y-4 rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium">Location Details</h3>
          <LocationDetailsSection
            form={form}
            className="grid grid-cols-1 gap-4 items-start sm:grid-cols-2"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          variant="primary"
          disabled={!form.formState.isDirty || updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <Loader2Icon className="text-white animate-spin scale-150" />
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  );
}
