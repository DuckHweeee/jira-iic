import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

import { ResponsiveModal } from "@/components/responisive-modal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "primary"
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfirmationDialong = () => {
    return (
      <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardDescription>{message}</CardDescription>
          </CardContent>
          <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-rơ gap-x-2 items-center justify-between">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className="w-full lg:w-auto bg-red-600"
            >
              Confirm
            </Button>
          </div>
        </Card>
      </ResponsiveModal>
    );
  };

  return [ConfirmationDialong, confirm];
};
