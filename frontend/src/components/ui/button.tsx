import { twMerge } from "tailwind-merge";

type Variant = "solid" | "outline";
type Size = "md" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants: Record<Variant, string> = {
  solid:   "bg-kum_gold text-kum_dark hover:opacity-90 focus:ring-kum_gold",
  outline: "border border-kum_gold text-kum_gold hover:bg-kum_gold/10 focus:ring-kum_gold",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  sm: "h-9  px-3 text-xs",
};

export function Button({
  variant = "solid",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
