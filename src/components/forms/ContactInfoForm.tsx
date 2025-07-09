import React from "react";
import { Control, useController } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { ContactInfo } from "@/types/invoice";
import { InvoiceFormValues } from "@/lib/validations/invoice";

interface ContactInfoFormProps {
  control: Control<InvoiceFormValues>;
  name: "issuer" | "client";
  title: string;
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  control,
  name,
  title,
}) => {
  const { field: companyNameField, fieldState: companyNameState } =
    useController({
      control,
      name: `${name}.companyName`,
    });

  const { field: contactPersonField, fieldState: contactPersonState } =
    useController({
      control,
      name: `${name}.contactPerson`,
    });

  const { field: addressLine1Field, fieldState: addressLine1State } =
    useController({
      control,
      name: `${name}.addressLine1`,
    });

  const { field: addressLine2Field, fieldState: addressLine2State } =
    useController({
      control,
      name: `${name}.addressLine2`,
    });

  const { field: cityField, fieldState: cityState } = useController({
    control,
    name: `${name}.city`,
  });

  const { field: stateField, fieldState: stateState } = useController({
    control,
    name: `${name}.state`,
  });

  const { field: zipCodeField, fieldState: zipCodeState } = useController({
    control,
    name: `${name}.zipCode`,
  });

  const { field: countryField, fieldState: countryState } = useController({
    control,
    name: `${name}.country`,
  });

  const { field: phoneField, fieldState: phoneState } = useController({
    control,
    name: `${name}.phone`,
  });

  const { field: emailField, fieldState: emailState } = useController({
    control,
    name: `${name}.email`,
  });

  const { field: taxIdField, fieldState: taxIdState } = useController({
    control,
    name: `${name}.taxId`,
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          {...companyNameField}
          label="Company Name *"
          error={companyNameState.error?.message}
          placeholder="Enter company name"
        />

        <Input
          {...contactPersonField}
          label="Contact Person"
          error={contactPersonState.error?.message}
          placeholder="Enter contact person name"
        />

        <Input
          {...addressLine1Field}
          label="Address Line 1"
          error={addressLine1State.error?.message}
          placeholder="Enter street address"
          className="sm:col-span-2"
        />

        <Input
          {...addressLine2Field}
          label="Address Line 2"
          error={addressLine2State.error?.message}
          placeholder="Enter suite, unit, etc."
          className="sm:col-span-2"
        />

        <Input
          {...cityField}
          label="City"
          error={cityState.error?.message}
          placeholder="Enter city"
        />

        <Input
          {...stateField}
          label="State/Province"
          error={stateState.error?.message}
          placeholder="Enter state or province"
        />

        <Input
          {...zipCodeField}
          label="ZIP/Postal Code"
          error={zipCodeState.error?.message}
          placeholder="Enter ZIP or postal code"
        />

        <Input
          {...countryField}
          label="Country"
          error={countryState.error?.message}
          placeholder="Enter country"
        />

        <Input
          {...phoneField}
          label="Phone"
          error={phoneState.error?.message}
          placeholder="Enter phone number"
          type="tel"
        />

        <Input
          {...emailField}
          label="Email"
          error={emailState.error?.message}
          placeholder="Enter email address"
          type="email"
        />

        <Input
          {...taxIdField}
          label="Tax ID"
          error={taxIdState.error?.message}
          placeholder="Enter tax ID"
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
};
