import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { PASSWORD_VALIDATION_RULES } from "@/lib/validators";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/input-password";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import ValidationHelper from "@/components/common/ValidationHelper";

import routes from "@/api";
import { query } from "@/utils/request/request";

type PhrProfileFormSectionsProps = {
  form: UseFormReturn<any>;
  className?: string;
  showEmail?: boolean;
};

const BASIC_FIELDS = [
  {
    name: "first_name",
    label: "First Name",
    placeholder: "John",
    required: true,
  },
  {
    name: "middle_name",
    label: "Middle Name",
    placeholder: "Optional",
    required: false,
  },
  {
    name: "last_name",
    label: "Last Name",
    placeholder: "Doe",
    required: false,
  },
];

const GENDER_OPTIONS = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "Other" },
] as const;

export const BasicDetailsSection = ({
  form,
  className,
  showEmail = false,
}: PhrProfileFormSectionsProps) => {
  return (
    <>
      <div className={cn("space-y-4", className)}>
        {BASIC_FIELDS.map(({ name, label, placeholder, required }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required={required}>{label}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={placeholder} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GENDER_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {showEmail && (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export const LocationDetailsSection = ({
  form,
  className,
}: PhrProfileFormSectionsProps) => {
  const { control, setValue, watch } = form;
  const watchStateCode = watch("state_code");

  const { data: states = [] } = useQuery({
    queryKey: ["states"],
    queryFn: query(routes.utility.states),
  });

  const { data: districts = [] } = useQuery({
    queryKey: ["districts", watchStateCode],
    queryFn: query(routes.utility.districts, {
      pathParams: { stateCode: watchStateCode?.toString() },
    }),
    enabled: !!watchStateCode,
  });

  const handleStateChange = (value: string) => {
    const code = Number(value);
    const selected = states.find((s) => s.state_code === code);

    setValue("state_code", code, { shouldValidate: true, shouldDirty: true });
    setValue("state_name", selected?.state_name ?? "");
    setValue("district_code", undefined);
    setValue("district_name", "");
  };

  const handleDistrictChange = (value: string) => {
    const code = Number(value);
    const selected = districts.find((d) => d.district_code === code);

    setValue("district_code", code, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("district_name", selected?.district_name ?? "");
  };

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <FormField
          control={control}
          name="state_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required>State</FormLabel>
              <Select
                onValueChange={handleStateChange}
                value={field.value?.toString() ?? ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map(({ state_code, state_name }) => (
                    <SelectItem key={state_code} value={state_code.toString()}>
                      {state_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="district_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required>District</FormLabel>
              <Select
                onValueChange={handleDistrictChange}
                value={field.value?.toString() ?? ""}
                disabled={!watchStateCode || !districts.length}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a district" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map(({ district_code, district_name }) => (
                    <SelectItem
                      key={district_code}
                      value={district_code.toString()}
                    >
                      {district_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="pincode"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required>Pin Code</FormLabel>
            <FormControl>
              <Input
                {...field}
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter pincode"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required>Address</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={2}
                maxLength={250}
                placeholder="Full address"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export const SetPasswordSection = ({
  form,
  className,
}: PhrProfileFormSectionsProps) => {
  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false);

  const passwordInput = form.watch("password") || "";

  const shouldShowValidation =
    isPasswordFieldFocused || !!form.formState.errors.password;

  return (
    <div className={cn("space-y-4", className)}>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <PasswordInput
                {...field}
                placeholder="Enter Password"
                onFocus={() => setIsPasswordFieldFocused(true)}
                onBlur={() => setIsPasswordFieldFocused(false)}
              />
            </FormControl>
            {shouldShowValidation && (
              <FormDescription>
                {PASSWORD_VALIDATION_RULES(passwordInput).map((validation) => (
                  <ValidationHelper key={validation.content} {...validation} />
                ))}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <PasswordInput {...field} placeholder="Confirm password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
