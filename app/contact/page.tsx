import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us | SmileCraft Dental",
  description:
    "Get in touch with SmileCraft Dental. Book an appointment, find our location, or send us a message.",
};

export default function ContactPage() {
  return (
    <div className="bg-dental-white">
      <ContactPageContent />
      <ContactSection />
    </div>
  );
}
