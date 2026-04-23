import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm focus:ring-primary-500",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 shadow-sm focus:ring-secondary-500",
        outline: "border border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-700 focus:ring-primary-500",
        ghost: "bg-transparent hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-500",
        link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500",
        twitter: "bg-primary-600 text-white hover:bg-primary-700 rounded-full px-6 py-2 font-semibold shadow-sm hover:shadow-md",
        twitterOutline: "border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-full px-6 py-2 font-semibold",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-sm",
        lg: "px-6 py-3 text-lg",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { Button, buttonVariants };
