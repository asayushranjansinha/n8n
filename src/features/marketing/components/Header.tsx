import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const links = [
    {
      label: "Features",
      href: "#",
    },
    {
      label: "Pricing",
      href: "#",
    },
    {
      label: "About",
      href: "#",
    },
  ];

  return (
    <header
      className={cn(
        "sticky top-5 z-50",
        "mx-auto w-full max-w-3xl rounded-lg border shadow",
        "bg-background/95 supports-backdrop-filter:bg-background/80 backdrop-blur-lg"
      )}
    >
      <nav className="mx-auto flex items-center justify-between p-1.5">
        <Link
          prefetch
          href="/"
          className="flex self-center items-center gap-2 text-xl font-semibold"
        >
          <Image
            src="/logo.svg"
            alt="N8N"
            width={32}
            height={32}
            className="size-[32px]"
          />
          N8N
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/workflows">Get Started</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="lg:hidden">
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="bg-background/95 supports-backdrop-filter:bg-background/80 gap-0 backdrop-blur-lg"
              side="left"
            >
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    className={buttonVariants({
                      variant: "ghost",
                      className: "justify-start",
                    })}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <SheetFooter>
                <Button asChild>
                  <Link href="/workflows">Get Started</Link>
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
