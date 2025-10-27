import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group toast group-[.toaster]:!bg-primary group-[.toaster]:!text-primary-foreground group-[.toaster]:!border-primary [&>svg]:!text-primary-foreground",
          error:
            "group toast group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground group-[.toaster]:!border-destructive [&>svg]:!text-destructive-foreground",
          warning:
            "group toast group-[.toaster]:!bg-accent group-[.toaster]:!text-accent-foreground group-[.toaster]:!border-accent [&>svg]:!text-accent-foreground",
          info:
            "group toast group-[.toaster]:!bg-secondary group-[.toaster]:!text-secondary-foreground group-[.toaster]:!border-secondary [&>svg]:!text-secondary-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
