import * as React from "react"
import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

const NavigationMenu = React.forwardRef(({
  className,
  children,
  viewport = true,
  ...props
}, ref) => {
  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}>
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
})
NavigationMenu.displayName = "NavigationMenu"

const NavigationMenuList = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      data-slot="navigation-menu-list"
      className={cn("group flex list-none items-center justify-center", className)}
      {...props}>
      {children}
    </NavigationMenuPrimitive.List>
  );
})
NavigationMenuList.displayName = "NavigationMenuList"

const NavigationMenuItem = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <NavigationMenuPrimitive.Item
      ref={ref}
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props} />
  );
})
NavigationMenuItem.displayName = "NavigationMenuItem"

const navigationMenuTriggerStyle = cva("")

const NavigationMenuTrigger = React.forwardRef(({
  className,
  children,
  hideIcon = false,
  ...props
}, ref) => {
  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group outline-none", className)}
      {...props}>
      {children}{" "}
      {!hideIcon && (
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180"
          aria-hidden="true" />
      )}
    </NavigationMenuPrimitive.Trigger>
  );
})
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

const NavigationMenuContent = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      data-slot="navigation-menu-content"
      className={cn(
        "left-0 top-0 w-full md:absolute md:w-auto",
        className
      )}
      {...props} />
  );
})
NavigationMenuContent.displayName = "NavigationMenuContent"

const NavigationMenuViewport = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <div
      className={cn("absolute top-[calc(100%-8px)] left-0 isolate z-50 flex justify-center w-full")}>
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-[14px] bg-[#2A2A2A] text-popover-foreground shadow-[0_10px_40px_rgba(0,0,0,0.5)] md:w-(--radix-navigation-menu-viewport-width)",
          className
        )}
        {...props} />
    </div>
  );
})
NavigationMenuViewport.displayName = "NavigationMenuViewport"

const NavigationMenuLink = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      data-slot="navigation-menu-link"
      className={cn("outline-none", className)}
      {...props} />
  );
})
NavigationMenuLink.displayName = "NavigationMenuLink"

const NavigationMenuIndicator = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[51] flex h-[14px] items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}>
      <div className="relative top-[8px]">
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.03688 2C8.57648 -0.66667 12.4255 -0.666667 13.9651 2L20.4603 13.25C21.9999 15.9167 20.0754 19.25 16.9962 19.25H4.00578C0.926581 19.25 -0.997917 15.9167 0.541684 13.25L7.03688 2Z" fill="#2A2A2A"/>
        </svg>
      </div>
    </NavigationMenuPrimitive.Indicator>
  );
})
NavigationMenuIndicator.displayName = "NavigationMenuIndicator"

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
