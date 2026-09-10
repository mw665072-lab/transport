"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {
  ChevronDown,
  Mail,
  Menu,
  Phone,
  Route,
  ShieldCheck,
  Truck,
  Zap,
  Package,
  Boxes,
  Building2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { NAV, type NavChild, type NavItem } from "@/lib/data/nav";
import { COMPANY } from "@/lib/data/company";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/cn";

const serviceIcons: Record<string, typeof Truck> = {
  "/services/box-truck-transportation": Truck,
  "/services/hotshot-services": Zap,
  "/services/cargo-van-delivery": Package,
  "/services/sprinter-van-transportation": Route,
  "/services/freight-transportation": Boxes,
};

const companyIcons: Record<string, typeof Building2> = {
  "/about": Building2,
  "/coverage-area": MapPin,
  "/equipment": Truck,
  "/experience-authority": ShieldCheck,
};

function getNavIcon(href: string, isServices: boolean) {
  if (isServices) {
    return serviceIcons[href] || Truck;
  }
  return companyIcons[href] || Building2;
}

export function Header({ nav = NAV }: { nav?: readonly NavItem[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = !isHome || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[70] h-16 transition-all duration-300 md:h-20",
        solid ? "bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container-site flex h-full items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Zewar Transport home"
          className="shrink-0 transition-opacity hover:opacity-95"
        >
          <Image
            src="/images/logo.png"
            alt="Zewar Transport LLC"
            width={256}
            height={256}
            priority
            className="h-12 w-auto object-contain drop-shadow-sm md:h-14"
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu.Root
          className="hidden lg:block relative"
          delayDuration={100}
          skipDelayDuration={200}
        >
          <NavigationMenu.List className="flex items-center gap-1">
            {nav.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);

              if (hasChildren && item.children) {
                const isServices = item.label === "Services";
                return (
                  <NavigationMenu.Item key={item.label} className="relative">
                    <NavigationMenu.Trigger
                      className={cn(
                        // Slightly tighter at lg, where the nav and both CTAs are closest.
                        "group flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 xl:px-3.5",
                        solid ? "text-navy-900 hover:bg-slate-100" : "text-white",
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-gold-400" />
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content
                      className={cn(
                        "absolute top-full left-0 mt-2 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xl duration-200",
                        "data-[motion=from-start]:animate-in data-[motion=from-start]:fade-in data-[motion=from-start]:slide-in-from-top-2",
                        "before:absolute before:-top-3 before:inset-x-0 before:h-3", // invisible hover bridge
                        isServices ? "w-[620px]" : "w-[380px]",
                      )}
                    >
                      <div
                        className={cn("grid gap-3", isServices && "grid-cols-[1.25fr_.95fr]")}
                      >
                        <div>
                          <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-steel-600">
                            {isServices ? "Our Freight Services" : "Company Overview"}
                          </p>
                          <div className="mt-1 space-y-1">
                            {item.children.map((child: NavChild) => {
                              const Icon = getNavIcon(child.href, isServices);
                              return (
                                <NavigationMenu.Link asChild key={child.href}>
                                  <Link
                                    href={child.href}
                                    className="group flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                                  >
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-500 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="block text-sm font-semibold text-navy-900 group-hover:text-gold-600 transition-colors">
                                        {child.label}
                                      </span>
                                      {child.description && (
                                        <span className="block text-xs text-steel-600 leading-snug">
                                          {child.description}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                </NavigationMenu.Link>
                              );
                            })}
                          </div>
                        </div>

                        {isServices && (
                          <div className="flex flex-col justify-between rounded-xl bg-navy-950 p-5 text-white shadow-inner">
                            <div>
                              <span className="inline-block rounded-full bg-gold-500/20 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                                Direct Dispatch
                              </span>
                              <p className="mt-3 text-lg font-bold leading-snug">
                                Need a freight quote or fast booking?
                              </p>
                              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                                Speak directly with our operations team for immediate lane
                                coverage.
                              </p>
                              <a
                                href={COMPANY.phoneHref}
                                className="mt-3 flex items-center gap-2 text-sm font-semibold text-gold-400 hover:underline"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                {COMPANY.phone}
                              </a>
                            </div>
                            <Button asChild size="sm" className="mt-4 w-full">
                              <Link href="/freight-quote">
                                Get a Quote <ArrowRight className="ml-1 h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                );
              }

              return (
                <NavigationMenu.Item key={item.label}>
                  <NavigationMenu.Link asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 xl:px-3.5",
                        solid ? "text-navy-900 hover:bg-slate-100" : "text-white",
                        pathname === item.href &&
                          "after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:bg-gold-500 xl:after:inset-x-3.5",
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              );
            })}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Right actions. The menu button lives in here too: with it as a
            separate flex child, `justify-between` pushed the CTAs into the
            middle of the bar on tablets, where the desktop nav is hidden. */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            asChild
            className={cn(
              "hidden md:inline-flex font-semibold",
              solid
                ? "border-navy-900 text-navy-900 hover:bg-slate-50"
                : "border-white/80 text-white hover:bg-white/10 hover:text-white",
            )}
          >
            <Link href="/owner-operator">For Owner Operator</Link>
          </Button>
          <Button asChild className="hidden md:inline-flex font-semibold shadow-md">
            <Link href="/freight-quote">Get a Quote</Link>
          </Button>

          {/* Mobile Navigation Sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-lg lg:hidden transition",
                  solid ? "text-navy-900 hover:bg-slate-100" : "text-white hover:bg-white/10",
                )}
                aria-label="Open navigation"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <div className="pr-12">
                <Image
                  src="/images/logo.png"
                  alt="Zewar Transport LLC"
                  width={256}
                  height={256}
                  className="h-12 w-auto object-contain drop-shadow-sm"
                />
              </div>
              <nav className="mt-8">
                <Accordion type="multiple">
                  {nav.map((item) =>
                    item.children ? (
                      <AccordionItem value={item.label} key={item.label}>
                        <AccordionTrigger className="text-base font-semibold text-navy-900">
                          {item.label}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-1 pl-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-navy-900 hover:bg-slate-50"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex min-h-12 items-center border-b border-slate-200 font-semibold text-navy-900"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </Accordion>
              </nav>
              <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                <Button asChild className="w-full">
                  <Link href="/freight-quote">Get a Quote</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-navy-900 text-navy-900"
                >
                  <Link href="/owner-operator">For Owner Operator</Link>
                </Button>
                <a
                  href={COMPANY.phoneHref}
                  className="flex min-h-11 items-center gap-3 text-sm font-medium text-navy-900"
                >
                  <Phone className="h-5 w-5 text-gold-500" />
                  {COMPANY.phone}
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex min-h-11 items-center gap-3 text-sm font-medium text-navy-900"
                >
                  <Mail className="h-5 w-5 text-gold-500" />
                  {COMPANY.email}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
