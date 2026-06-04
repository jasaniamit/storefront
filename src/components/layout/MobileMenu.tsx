// src/components/layout/MobileMenu.tsx
"use client";

import type { Category } from "@spree/sdk";
import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import {
  Grid, MapPin, BookOpen, Box, PenTool,
  User, ShoppingBag, ShieldAlert, Settings, X,
  ArrowLeft, ChevronRight, Check, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/contexts/StoreContext";
import { useCountrySwitch } from "@/hooks/useCountrySwitch";

// Convert ISO country code to flag emoji safely
function countryToFlag(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return "";
  const firstChar = code.charCodeAt(0) - 65 + 0x1f1e6;
  const secondChar = code.charCodeAt(1) - 65 + 0x1f1e6;
  return String.fromCodePoint(firstChar, secondChar);
}

type PanelType =
  | { kind: "main" }
  | { kind: "category"; category: Category }
  | { kind: "country" };

interface MobileMenuProps {
  rootCategories: Category[];
  basePath: string;
}

export function MobileMenu({ rootCategories = [], basePath }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [panelStack, setPanelStack] = useState<PanelType[]>([{ kind: "main" }]);
  const [animatedIndex, setAnimatedIndex] = useState(0);

  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { country, currency, countries } = useStore();
  const { isCountryNavigating, handleCountrySelect } = useCountrySwitch({
    currentCountry: country,
    onBeforeNavigate: () => setOpen(false),
  });

  const currentPanel = panelStack[panelStack.length - 1];

  const cancelPendingCallbacks = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const pushPanel = (panel: PanelType) => {
    cancelPendingCallbacks();
    flushSync(() => {
      setPanelStack((prev) => [...prev, panel]);
    });
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setAnimatedIndex((prev) => prev + 1);
    });
  };

  const popPanel = () => {
    cancelPendingCallbacks();
    setAnimatedIndex((prev) => Math.max(0, prev - 1));
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setPanelStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }, 300);
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      cancelPendingCallbacks();
      setPanelStack([{ kind: "main" }]);
      setAnimatedIndex(0);
    }
  };

  // Clean single file component unmount lifecycle hook tracking
  useEffect(() => {
    return () => cancelPendingCallbacks();
  }, []);

  const linkItemClass = "flex items-center gap-4 text-gray-300 hover:text-white rounded-xl px-4 py-3.5 text-[17px] font-semibold transition-all active:bg-zinc-900/60 w-full text-left cursor-pointer";
  const panelHeaderClass = "flex items-center gap-3 px-5 py-4 border-b border-zinc-800/40 text-white font-bold text-lg bg-black shrink-0";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {/* TRIGGER BUTTON */}
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={() => setOpen(!open)}
        className="relative z-50 cursor-pointer text-slate-900"
        aria-label="Toggle Navigation Menu"
      >
        <div className="flex flex-col gap-1.5 w-5 justify-center items-center">
          <span className="w-full h-0.5 bg-current rounded-full" />
          <span className="w-full h-0.5 bg-current rounded-full" />
          <span className="w-full h-0.5 bg-current rounded-full" />
        </div>
      </Button>

      <SheetContent
        side="left"
        className="flex flex-col !gap-0 !rounded-none overflow-hidden w-full max-w-lg !border-r-0 !bg-black p-0"
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Artolika Mobile Portal Menu</SheetTitle>

        {/* DYNAMIC SUB-PANELS SLIDING LAYER CONTAINER */}
        <div className="relative flex-1 overflow-hidden w-full h-full bg-black">

          {/* VIEWPORT 1: MAIN NAVIGATION PANEL */}
          <div
            className={`absolute inset-0 flex flex-col bg-black transition-transform duration-300 ease-in-out ${animatedIndex === 0 && currentPanel.kind === "main" ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            {/* Upper Control Bar */}
            <div className="flex items-center justify-end px-5 py-4 border-b border-zinc-800/40">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white p-1 bg-transparent rounded-lg outline-none cursor-pointer"
              >
                <X className="w-6 h-6" strokeWidth={1.8} />
              </button>
            </div>

            {/* Flat list stack items */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {/* Products Link */}
              <Link href={`${basePath}/products`} onClick={() => setOpen(false)} className={linkItemClass}>
                <Grid className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                <span>Products</span>
              </Link>

              {/* SPREE NESTED CATEGORIES DIRECTORY ROW ITEMS */}
              {rootCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => pushPanel({ kind: "category", category })}
                  className={linkItemClass}
                >
                  <Grid className="w-[19px] h-[19px] text-gray-500" strokeWidth={2} />
                  <span className="flex-1 truncate text-left">{category.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto shrink-0" />
                </button>
              ))}

              {/* Where to Buy Link */}
              <Link href={`${basePath}/locate-stores`} onClick={() => setOpen(false)} className={linkItemClass}>
                <MapPin className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                <span>Where to Buy?</span>
              </Link>

              {/* Catalogs Link */}
              <Link href={`${basePath}/catalog`} onClick={() => setOpen(false)} className={linkItemClass}>
                <BookOpen className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                <span>Catalogs</span>
              </Link>

              {/* VR 360 Placeholder */}
              <Link href="#" className={`${linkItemClass} opacity-50 cursor-not-allowed`}>
                <Box className="w-[19px] h-[19px] text-gray-500" strokeWidth={2} />
                <span>VR 360°</span>
              </Link>

              {/* ProDesign Placeholder */}
              <Link href="#" className={`${linkItemClass} opacity-50 cursor-not-allowed`}>
                <PenTool className="w-[19px] h-[19px] text-gray-500" strokeWidth={2} />
                <span>ProDesign™</span>
              </Link>

              {/* Account Profile Entry */}
              <Link href={`${basePath}/account`} onClick={() => setOpen(false)} className={linkItemClass}>
                <User className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                <span>Account</span>
              </Link>

              {/* Orders Segment */}
              <Link href={`${basePath}/account/orders`} onClick={() => setOpen(false)} className={linkItemClass}>
                <ShoppingBag className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                <span>Orders</span>
              </Link>

              {/* My Cart Section */}
              <Link href={`${basePath}/cart`} onClick={() => setOpen(false)} className={linkItemClass}>
                <ShoppingBag className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                <span>My Cart</span>
              </Link>

              {/* Payments Area */}
              <Link href={`${basePath}/account/credit-cards`} onClick={() => setOpen(false)} className={linkItemClass}>
                <ShieldAlert className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                <span>Payment</span>
              </Link>

              {/* Operational Settings Profile Link */}
              <Link href={`${basePath}/account/profile`} onClick={() => setOpen(false)} className={linkItemClass}>
                <Settings className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                <span>Settings</span>
              </Link>

              {/* HIGH-FIDELITY COUNTRY SELECTION TRIGGER ROW */}
              <button
                type="button"
                onClick={() => pushPanel({ kind: "country" })}
                className={`${linkItemClass} border-t border-zinc-800/60 mt-4 pt-4`}
              >
                <Globe className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                <span className="text-lg leading-none">{countryToFlag(country)}</span>
                <span className="font-semibold text-white uppercase">{country}</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400 text-sm">{currency}</span>
                <ChevronRight className="w-4 h-4 text-gray-500 ml-auto shrink-0" />
              </button>
            </div>
          </div>

          {/* VIEWPORT 2: CATEGORIES NESTED VIEW PANEL LOOPS */}
          {panelStack.map((panel, idx) => {
            if (panel.kind !== "category") return null;
            const isAnimatedIn = idx <= animatedIndex;
            let positionClass = "translate-x-full";
            if (isAnimatedIn && idx < panelStack.length - 1) {
              positionClass = "-translate-x-full";
            } else if (isAnimatedIn) {
              positionClass = "translate-x-0";
            }

            return (
              <div
                key={`category-sliding-viewport-${panel.category.id}-${idx}`}
                className={`absolute inset-0 flex flex-col bg-black transition-transform duration-300 ease-in-out ${positionClass}`}
              >
                {/* Back Trigger Panel Header Header */}
                <div className={panelHeaderClass}>
                  <button
                    type="button"
                    onClick={popPanel}
                    className="text-gray-300 hover:text-white flex items-center justify-center p-1 cursor-pointer bg-transparent border-0"
                    title="Return to baseline panel stack"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <span className="truncate">{panel.category.name}</span>
                </div>

                {/* Dynamic Sub-nodes content rendering container */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                  {panel.category.children?.map((child) =>
                    child.children && child.children.length > 0 ? (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => pushPanel({ kind: "category", category: child })}
                        className={linkItemClass}
                      >
                        <Grid className="w-[19px] h-[19px] text-gray-500" strokeWidth={2} />
                        <span className="flex-1 text-left truncate">{child.name}</span>
                        <ChevronRight className="w-4 h-4 text-gray-500 ml-auto shrink-0" />
                      </button>
                    ) : (
                      <Link
                        key={child.id}
                        href={`${basePath}/c/${child.permalink}`}
                        onClick={() => handleOpenChange(false)}
                        className={linkItemClass}
                      >
                        <Grid className="w-[19px] h-[19px] text-gray-400" strokeWidth={2} />
                        <span>{child.name}</span>
                      </Link>
                    )
                  )}
                </div>

                {/* View All Category Fallback Button Segment */}
                <div className="border-t border-zinc-800/40 px-4 py-3 bg-zinc-950">
                  <Link
                    href={`${basePath}/c/${panel.category.permalink}`}
                    onClick={() => handleOpenChange(false)}
                    className="block w-full text-center text-sm text-gray-400 hover:text-white py-2 transition-colors font-semibold"
                  >
                    View All {panel.category.name}
                  </Link>
                </div>
              </div>
            );
          })}

          {/* VIEWPORT 3: MULTI-COUNTRY LOCALE SELECTOR PANEL */}
          <div
            className={`absolute inset-0 flex flex-col bg-black transition-transform duration-300 ease-in-out ${currentPanel.kind === "country" && animatedIndex === panelStack.length - 1 ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className={panelHeaderClass}>
              <button
                type="button"
                onClick={popPanel}
                className="text-gray-300 hover:text-white flex items-center justify-center p-1 cursor-pointer bg-transparent border-0"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <span>Select Country</span>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {countries.map((targetCountry) => {
                const isSelected = targetCountry.iso.toLowerCase() === country.toLowerCase();
                return (
                  <button
                    key={targetCountry.iso}
                    type="button"
                    disabled={isCountryNavigating}
                    onClick={() => handleCountrySelect(targetCountry)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[17px] font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none ${isSelected ? "bg-zinc-900 text-white" : "text-gray-300 hover:bg-zinc-900/50 hover:text-white"
                      }`}
                  >
                    <span className="text-xl leading-none shrink-0">{countryToFlag(targetCountry.iso)}</span>
                    <span className="flex-1 text-left truncate">{targetCountry.name}</span>
                    <span className="text-sm text-zinc-500 uppercase shrink-0 font-medium">{targetCountry.currency}</span>
                    {isSelected && <Check className="w-4 h-4 text-white ml-auto shrink-0" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
