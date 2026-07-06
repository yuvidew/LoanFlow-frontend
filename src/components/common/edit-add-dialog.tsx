"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the props for the EditAndAddDialog component, which includes handlers for open state changes, the open state itself, the form component to be rendered, and optional title and description text.
type EditAndAddDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  formComponent : React.ReactNode;
  title ?: string;
  description ?: string;
};

// The EditAndAddDialog component is a reusable dialog component that can be used for both editing and adding products. It takes in props for handling the open state, rendering the form component, and displaying optional title and description text.
export const EditAndAddDialog = ({
  onOpenChange,
  open,
  formComponent,
  title,
  description
}: EditAndAddDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title || "Add Product"}</DialogTitle>
          <DialogDescription>
            {description || "Create a loan product and define its eligibility criteria."}
          </DialogDescription>
        </DialogHeader>
        {formComponent}
      </DialogContent>
    </Dialog>
  );
};
