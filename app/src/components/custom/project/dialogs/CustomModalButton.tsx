"use client";

import { Button } from "@/components/ui/button";


export function ModalButton2({
  label,
  loadingLabel,
  onProcess,
  className,
  ...props
}: {
  label: string;
  loadingLabel?: string;
  onProcess: boolean;
  className?: string;
}) {
  return (
    <Button
      className={`w-full justify-center ${className}`}
      disabled={onProcess}
      {...props}
    >
      {onProcess ? loadingLabel ?? label : label}
    </Button>
  );
}
