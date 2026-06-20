// src/app/[country]/[locale]/(storefront)/contact/page.tsx
import type { Metadata } from "next";
import ContactClientPage from "./ContactClientPage";

export const metadata: Metadata = {
    title: "Get In Touch - Contact Our Production Specialists",
    description: "Let's print an amazing masterpiece together. Reach out to our technical support team, access live client chat, or find a premium display showroom near you.",
};

export default function ContactPage() {
    return <ContactClientPage />;
}