import React from "react";
import { Control, useController } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { InvoiceFormValues } from "@/lib/validations/invoice";
import { Language, t } from "@/lib/i18n/translations";

interface ContactInfoFormProps {
  control: Control<InvoiceFormValues>;
  name: "issuer" | "client";
  title: string;
  language: Language;
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  control,
  name,
  title,
  language,
}) => {
  const tr = t(language);

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
          label={tr.companyName}
          error={companyNameState.error?.message}
          placeholder={tr.companyName.replace(" *", "")}
        />

        <Input
          {...contactPersonField}
          label={tr.contactPerson}
          error={contactPersonState.error?.message}
          placeholder={tr.contactPerson}
        />

        <Input
          {...addressLine1Field}
          label={tr.addressLine1}
          error={addressLine1State.error?.message}
          placeholder={tr.addressLine1}
          className="sm:col-span-2"
        />

        <Input
          {...addressLine2Field}
          label={tr.addressLine2}
          error={addressLine2State.error?.message}
          placeholder={tr.addressLine2}
          className="sm:col-span-2"
        />

        <Input
          {...cityField}
          label={tr.city}
          error={cityState.error?.message}
          placeholder={tr.city}
        />

        <Input
          {...stateField}
          label={tr.stateProvince}
          error={stateState.error?.message}
          placeholder={tr.stateProvince}
        />

        <Input
          {...zipCodeField}
          label={tr.zipCode}
          error={zipCodeState.error?.message}
          placeholder={tr.zipCode}
        />

        <Input
          {...countryField}
          label={tr.country}
          error={countryState.error?.message}
          placeholder={tr.country}
        />

        <Input
          {...phoneField}
          label={tr.phone}
          error={phoneState.error?.message}
          placeholder={tr.phone}
          type="tel"
        />

        <Input
          {...emailField}
          label={tr.email}
          error={emailState.error?.message}
          placeholder={tr.email}
          type="email"
        />

        <Input
          {...taxIdField}
          label={tr.taxId}
          error={taxIdState.error?.message}
          placeholder={tr.taxId}
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
};
