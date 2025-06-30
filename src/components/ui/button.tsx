import { ButtonHTMLAttributes } from "react"
import clsx from "clsx"

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-2xl shadow",
        className
      )}
    />
  )
}
