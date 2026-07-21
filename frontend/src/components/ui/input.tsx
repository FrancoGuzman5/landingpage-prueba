import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={twMerge(
        "w-full rounded-md border border-kumelenGold/40 bg-white px-3 py-2 text-sm text-kumelenDark placeholder:text-kumelenDark/50 focus:border-kumelenGold focus:outline-none focus:ring-2 focus:ring-kumelenGold",
        className
      )}
      {...props}
    />
  );
}
