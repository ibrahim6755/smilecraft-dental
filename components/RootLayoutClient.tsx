"use client";

import { ReactNode } from "react";
import { AppointmentProvider, useAppointment } from "@/lib/AppointmentContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Chatbot } from "./Chatbot";
import { AppointmentModal } from "./AppointmentModal";

interface RootLayoutClientProps {
  children: ReactNode;
}

function RootLayoutContent({ children }: RootLayoutClientProps) {
  const { isOpen, openModal, closeModal } = useAppointment();

  return (
    <>
      <Navbar
        onOpenAppointment={openModal}
      />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
      <AppointmentModal
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <AppointmentProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </AppointmentProvider>
  );
}
