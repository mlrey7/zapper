import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const IftaInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, value, ...props }, ref) => {
    return (
      <div
        className={cn(
          "group relative h-14 rounded-md border border-input bg-background px-3 py-2 pt-7 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
          {
            "input-has-value": !!value,
          },
        )}
      >
        <label
          className={cn(
            "absolute left-3 top-1/2 h-fit -translate-y-1/2 text-sm text-gray-500 transition-all",
            "group-focus-within:-translate-x-0.5 group-focus-within:-translate-y-5 group-focus-within:scale-90 group-focus-within:text-blue-500",
            "group-[.input-has-value]:-translate-x-0.5 group-[.input-has-value]:-translate-y-5 group-[.input-has-value]:scale-90",
          )}
        >
          {label}
        </label>
        <input
          type={type}
          className={cn(
            "flex w-full bg-background text-sm focus-within:outline-none",
            className,
          )}
          ref={ref}
          value={value}
          {...props}
        />
      </div>
    );
  },
);
IftaInput.displayName = "IftaInput";

export { IftaInput };
