import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  // Every size is at least 44px tall, so the tap target is met without a
  // min-height that silently overrides the size variants.
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gold-500 text-navy-950 hover:bg-gold-400 active:bg-gold-400",
        // Light-surface default. Dark sections pass their own white border and
        // hover, since a translucent white hover is invisible on white.
        outline:
          "border border-current bg-transparent hover:bg-navy-900/5 active:bg-navy-900/10",
        navy: "bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-800",
        ghost: "text-navy-900 hover:bg-slate-50 active:bg-slate-100",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-11 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
