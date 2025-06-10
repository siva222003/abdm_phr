import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
import { Edit2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SetPasswordSection } from "@/components/profile/ProfileFormSections";

// import { mutate } from "@/utils/request/request";

export default function ResetPassword() {
  const [isEditing, setIsEditing] = useState(false);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$^-])[A-Za-z\d!@#$%^&*-]{8,}$/;

  const schema = z
    .object({
      password: z.string().regex(passwordRegex),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  // const { mutate: resetPassword, isPending } = useMutation({
  //   mutationFn: mutate(routes.updatePassword),
  //   onSuccess: () => {
  //     toast.success(t("password_updated"));
  //     form.reset();
  //   },
  // });

  const handleSubmitPassword = async () => {
    // const form: UpdatePasswordForm = {
    //   old_password: formData.old_password,
    //   username: userData.username,
    //   new_password: formData.new_password_1,
    // };
    // resetPassword(form);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:rounded-lg sm:px-6">
      {!isEditing && (
        <div className="mb-4 flex justify-start">
          <Button
            onClick={() => setIsEditing(true)}
            type="button"
            id="change-edit-password-button"
            variant="primary"
          >
            <Edit2Icon
              // icon={isEditing ? "l-times" : "l-pen"}
              className="size-4"
            />
            Update Password
          </Button>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitPassword)}
            className="space-y-4"
          >
            <SetPasswordSection
              form={form}
              className="grid grid-cols-1 gap-4 items-start sm:grid-cols-2"
            />

            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                // disabled={isPending}
                onClick={() => {
                  form.reset();
                  setIsEditing(false);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isDirty}
                variant="primary"
              >
                {/* {isPending && (
                  <CareIcon
                    icon="l-spinner"
                    className="mr-2 size-4 animate-spin"
                  />
                )}
                {isPending ? t("updating") : t("update_password")} */}
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
