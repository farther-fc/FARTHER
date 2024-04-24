import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const containerVariants = cva("container prose", {
  variants: {
    variant: {
      textBlock: "max-w-[800px] mx-auto",
      page: "min-h-[calc(100vh-300px)]",
    },
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container: React.FC<ContainerProps> = ({
  className,
  children,
  variant,
  ...props
}) => {
  const containerClasses = cn(containerVariants({ variant }), className);

  return (
    <section className={containerClasses} {...props}>
      {children}
    </section>
  );
};

export { Container, containerVariants };
