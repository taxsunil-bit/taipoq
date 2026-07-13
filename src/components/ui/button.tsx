import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-[15px] font-medium cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "min-h-11 bg-primary text-primary-foreground shadow-[var(--shadow-subtle)] hover:bg-[var(--cs-primary-hover)]",
        destructive:
          "min-h-11 bg-destructive text-destructive-foreground shadow-[var(--shadow-subtle)] hover:bg-destructive/90",
        outline:
          "min-h-11 border border-primary/40 bg-white text-primary shadow-[var(--shadow-subtle)] hover:bg-[var(--cs-primary-container)] hover:text-[var(--cs-on-primary-container)]",
        secondary:
          "min-h-11 bg-secondary text-secondary-foreground shadow-[var(--shadow-subtle)] hover:bg-[var(--cs-secondary-container)]",
        ghost: "min-h-11 hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-4 py-2",
        sm: "min-h-11 rounded-[12px] px-3 text-sm",
        lg: "min-h-12 rounded-[12px] px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
