import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { InvoiceFormValues } from "@/lib/validations/invoice";
import {
  calculateInvoiceAmounts,
  formatCurrency,
} from "@/lib/utils/invoice-calculations";

interface InvoiceItemsFormProps {
  control: Control<InvoiceFormValues>;
  watch: (name?: string) => any;
}

export const InvoiceItemsForm: React.FC<InvoiceItemsFormProps> = ({
  control,
  watch,
}) => {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });

  const {
    fields: discountFields,
    append: appendDiscount,
    remove: removeDiscount,
  } = useFieldArray({
    control,
    name: "discounts",
  });

  const watchedData = watch();
  const calculations = calculateInvoiceAmounts(watchedData);

  const handleAddItem = () => {
    appendItem({
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      rate: 0,
    });
  };

  const handleAddDiscount = () => {
    appendDiscount({
      id: `discount-${Date.now()}`,
      description: "",
      amount: 0,
    });
  };

  return (
    <div className="space-y-8">
      {/* Invoice Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
          <Button
            type="button"
            onClick={handleAddItem}
            variant="outline"
            size="sm"
          >
            + Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {itemFields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    {...(control as any).register(`items.${index}.description`)}
                    label="Description"
                    placeholder="Enter item description"
                  />
                </div>
                <div className="flex items-end mb-1">
                  <Button
                    type="button"
                    onClick={() => removeItem(index)}
                    variant="danger"
                    size="sm"
                    disabled={itemFields.length === 1}
                  >
                    ×
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Input
                    {...(control as any).register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    label="Quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div>
                  <Input
                    {...(control as any).register(`items.${index}.rate`, {
                      valueAsNumber: true,
                    })}
                    label="Rate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total
                  </label>
                  <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                    {formatCurrency(
                      (watchedData.items?.[index]?.quantity || 0) *
                        (watchedData.items?.[index]?.rate || 0),
                      watchedData.currency || "$"
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discounts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Discounts</h3>
          <Button
            type="button"
            onClick={handleAddDiscount}
            variant="outline"
            size="sm"
          >
            + Add Discount
          </Button>
        </div>

        {discountFields.length > 0 && (
          <div className="space-y-4">
            {discountFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-6"
              >
                <div className="sm:col-span-4">
                  <Input
                    {...(control as any).register(
                      `discounts.${index}.description`
                    )}
                    label="Discount Description"
                    placeholder="Enter discount description"
                  />
                </div>

                <div className="sm:col-span-1">
                  <Input
                    {...(control as any).register(`discounts.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-end mb-1 sm:col-span-1">
                  <Button
                    type="button"
                    onClick={() => removeDiscount(index)}
                    variant="danger"
                    size="sm"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Summary */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Invoice Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>
              {formatCurrency(
                calculations.subtotal,
                watchedData.currency || "$"
              )}
            </span>
          </div>

          {calculations.discountTotal !== 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>
                {formatCurrency(
                  calculations.discountTotal,
                  watchedData.currency || "$"
                )}
              </span>
            </div>
          )}

          {(watchedData.taxRate || 0) > 0 && (
            <div className="flex justify-between">
              <span>Tax ({watchedData.taxRate || 0}%):</span>
              <span>
                {formatCurrency(
                  calculations.taxAmount,
                  watchedData.currency || "$"
                )}
              </span>
            </div>
          )}

          <div className="border-t border-gray-300 pt-2">
            <div className="flex justify-between font-semibold text-base">
              <span>Total:</span>
              <span>
                {formatCurrency(
                  calculations.totalAmount,
                  watchedData.currency || "$"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
