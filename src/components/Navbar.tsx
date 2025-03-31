import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Link } from "react-router-dom";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#about",
    label: "About Us",
  },
  {
    href: "#features",
    label: "What We Do",
  },
  {
    href: "#team",
    label: "Meet The Team",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
  {
    href: "/preliminary",
    label: "418 Screening",
  },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex items-center"
            >
              <img
                src="https://i.ibb.co/0mN0h4n/icon-trans.png"
                alt="Logo"
                className="h-10 w-10 mr-2"
              />
              Enigma
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-4">
                  {routeList.map((route) => (
                    <div key={route.label}>
                      {route.href.startsWith("/") ? (
                        <Link
                          to={route.href}
                          className="block px-2 py-1 text-lg"
                          onClick={() => setOpen(false)}
                        >
                          {route.label}
                        </Link>
                      ) : (
                        <a
                          href={route.href}
                          className="block px-2 py-1 text-lg"
                        >
                          {route.label}
                        </a>
                      )}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              {routeList.map((route) => (
                <NavigationMenuItem key={route.label}>
                  {route.href.startsWith("/") ? (
                    <Link
                      to={route.href}
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    >
                      {route.label}
                    </Link>
                  ) : (
                    <a
                      href={route.href}
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    >
                      {route.label}
                    </a>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden md:flex gap-2">
            <a
              rel="noreferrer noopener"
              href="https://github.com/MU-Enigma"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              Github
            </a>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
