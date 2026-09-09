import * as React from "react";
import { cn } from "@/lib/cn";
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-navy-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
