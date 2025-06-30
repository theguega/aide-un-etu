import { InputHTMLAttributes } from "react"
import clsx from "clsx"

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "border border-gray-300 rounded-xl px-4 py-2 text-black dark:text-white dark:bg-black dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500",
        className
      )}
    />
  )
}
