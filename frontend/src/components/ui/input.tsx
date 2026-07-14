import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={twMerge(
        "w-full rounded-md border border-kum_gold/40 bg-white px-3 py-2 text-sm text-kum_dark placeholder:text-kum_dark/50 focus:border-kum_gold focus:outline-none focus:ring-2 focus:ring-kum_gold",
        className
      )}
      {...props}
    />
  );
}
