import { cn } from "@lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const containerVariants = cva("container prose", {
  variants: {
    variant: {
      page: "my-8",
      section: "my-8",
    },
  },
})

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean
}

const Container: React.FC<ContainerProps> = ({
  asChild,
  className,
  children,
  variant,
  ...props
}) => {
  const Comp = asChild
    ? React.Fragment
    : variant === "page"
      ? "main"
      : variant === "section"
        ? "section"
        : "div"
  const containerClasses = cn(containerVariants({ variant }), className)

  return (
    <Comp className={containerClasses} {...props}>
      {children}
    </Comp>
  )
}

export { Container, containerVariants }
