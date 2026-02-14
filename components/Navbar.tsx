"use client";

import { useState } from "react";
import Link from "next/link";
import { Smile, Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenAppointment: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#team", label: "Team" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ onOpenAppointment }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-4 bg-white/80 backdrop-blur-md">
      {/* Main navbar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full bg-gray-100 px-6 py-4 shadow-lg shadow-gray-200/40 hover:shadow-gray-200/60 transition-shadow duration-300">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-dental-primary to-dental-primary-dark text-white shadow-md shadow-dental-primary/30">
              <Smile className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold text-gray-900">SmileCraft</span>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-dental-primary relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-dental-primary to-dental-primary-dark transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right: Button + Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAppointment}
              className="hidden items-center justify-center gap-2 rounded-full bg-linear-to-r from-dental-primary to-dental-primary-dark px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-dental-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-dental-primary/40 active:scale-95 sm:flex hover:scale-105"
            >
              Book Appointment
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-200 hover:text-dental-primary transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" strokeWidth={2.5} />
              ) : (
                <Menu className="h-6 w-6" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 px-4">
          <div className="mx-auto max-w-7xl rounded-3xl bg-gray-50 p-6 shadow-lg shadow-gray-200/40 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-white hover:text-dental-primary hover:shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAppointment();
                }}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-dental-primary to-dental-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-dental-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-dental-primary/40 active:scale-95 w-full hover:scale-105"
              >
                Book Appointment
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

