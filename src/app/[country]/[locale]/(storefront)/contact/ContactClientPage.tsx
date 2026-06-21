// src/app/[country]/[locale]/(storefront)/contact/ContactClientPage.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";

// Web3Forms access key (from your Web3Forms dashboard / form setup)
const WEB3FORMS_ACCESS_KEY = "4e4f0952-a768-4529-9f62-07ceb1f30593";

// Common countries with their dial code, flag, and expected mobile number
// length. "Other" is a catch-all for any country not listed, with a looser
// length check. Add more rows here any time without installing anything.
const COUNTRIES = [
    { name: "India", dial: "+91", flag: "🇮🇳", digits: 10 },
    { name: "United States", dial: "+1", flag: "🇺🇸", digits: 10 },
    { name: "Canada", dial: "+1", flag: "🇨🇦", digits: 10 },
    { name: "United Kingdom", dial: "+44", flag: "🇬🇧", digits: 10 },
    { name: "United Arab Emirates", dial: "+971", flag: "🇦🇪", digits: 9 },
    { name: "Saudi Arabia", dial: "+966", flag: "🇸🇦", digits: 9 },
    { name: "Qatar", dial: "+974", flag: "🇶🇦", digits: 8 },
    { name: "Kuwait", dial: "+965", flag: "🇰🇼", digits: 8 },
    { name: "Australia", dial: "+61", flag: "🇦🇺", digits: 9 },
    { name: "Singapore", dial: "+65", flag: "🇸🇬", digits: 8 },
    { name: "Germany", dial: "+49", flag: "🇩🇪", digits: 10 },
    { name: "France", dial: "+33", flag: "🇫🇷", digits: 9 },
    { name: "Other", dial: "", flag: "🌐", digits: 0 },
];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function ContactClientPage() {
    const [email, setEmail] = useState("");
    const [countryIndex, setCountryIndex] = useState(0); // defaults to India
    const [phoneDigits, setPhoneDigits] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<SubmitStatus>("idle");

    const selectedCountry = COUNTRIES[countryIndex];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Strip anything that isn't a digit, and cap the length to what the
        // selected country expects (skip capping for "Other").
        const digitsOnly = e.target.value.replace(/\D/g, "");
        const limit = selectedCountry.digits || 15;
        setPhoneDigits(digitsOnly.slice(0, limit));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const expectedLength = selectedCountry.digits;
        if (
            !phoneDigits ||
            (expectedLength > 0 && phoneDigits.length !== expectedLength)
        ) {
            setPhoneError(
                expectedLength > 0
                    ? `Please enter a valid ${expectedLength}-digit mobile number for ${selectedCountry.name}.`
                    : "Please enter a valid mobile number.",
            );
            return;
        }
        setPhoneError("");
        setStatus("submitting");

        const fullPhoneNumber = `${selectedCountry.dial}${phoneDigits}`;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    email,
                    phone: fullPhoneNumber,
                    subject,
                    message,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Submission failed");
            }

            setStatus("success");
            setEmail("");
            setPhoneDigits("");
            setSubject("");
            setMessage("");
        } catch (error) {
            console.error("Contact form submission error:", error);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pb-16 sm:pb-24 font-sans antialiased selection:bg-gray-900 selection:text-white">

            {/* HERO SEGMENT WITH INTEGRATED VISUAL OVERLAY */}
            <div className="relative w-full h-[38vh] min-h-[280px] sm:h-[45vh] flex items-center justify-start px-6 sm:px-12 lg:px-24 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/contact/hero-bg.webp"
                        alt="Artolika Customer Relationship and Operations Center"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    {/* Exact CSS overlay mapping from your old WordPress architecture */}
                    <div
                        className="absolute inset-0 transition-all duration-300"
                        style={{
                            opacity: 0.65,
                            backgroundColor: "#002847"
                        }}
                    />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-xs">
                        Get in touch
                    </h1>
                </div>
            </div>

            {/* SPLIT BASELINE CONTENT AREA: TEXT PARAGRAPHS & FLOATING FORM OVERLAY */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-16 sm:-mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Column Text Group */}
                    <div className="lg:col-span-7 bg-transparent pt-20 lg:pt-32 space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight max-w-md">
                            We're Here to Help
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed max-w-2xl">
                            Have a question about our fragrances, need assistance, or want to share a suggestion? We'd love to hear from you — please fill out the form below and we'll get back to you shortly.
                        </p>
                    </div>

                    {/* Right Column Floating Context Form Block */}
                    <div className="lg:col-span-5 bg-[#ebf0f5] rounded-2xl border border-white/60 p-6 sm:p-8 shadow-md">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-900">
                                <Phone className="w-5 h-5 text-gray-800" strokeWidth={2.2} />
                                <h3 className="text-xl font-bold tracking-tight">Contact us</h3>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                                Say Hello! to our team over whatsapp and let your help get done within a day.
                            </p>

                            <div className="border-t border-gray-300/40 pt-4 space-y-1">
                                <h4 className="text-sm font-bold text-gray-900 tracking-tight">
                                    Need Help With Your Order?
                                </h4>
                                <p className="text-xs text-gray-400 font-medium">
                                    Use the form below or send us an email
                                </p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-3.5 pt-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors shadow-2xs"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={countryIndex}
                                        onChange={(e) => {
                                            setCountryIndex(Number(e.target.value));
                                            setPhoneDigits("");
                                        }}
                                        className="bg-white border border-gray-200 rounded-xl px-2 py-3 text-xs font-semibold text-gray-800 outline-none focus:border-gray-400 transition-colors shadow-2xs"
                                    >
                                        {COUNTRIES.map((country, index) => (
                                            <option key={country.name} value={index}>
                                                {country.flag} {country.dial || "+__"}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={phoneDigits}
                                        onChange={handlePhoneChange}
                                        placeholder="Mobile Number"
                                        required
                                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors shadow-2xs"
                                    />
                                </div>
                                {phoneError && (
                                    <p className="text-xs font-semibold text-red-600 -mt-2">
                                        {phoneError}
                                    </p>
                                )}
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Subject"
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors shadow-2xs"
                                />
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Your Message"
                                    rows={4}
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors shadow-2xs resize-none"
                                />
                                {status === "success" && (
                                    <p className="text-xs font-semibold text-emerald-600">
                                        Thanks! Your message has been sent — we'll get back to you shortly.
                                    </p>
                                )}
                                {status === "error" && (
                                    <p className="text-xs font-semibold text-red-600">
                                        Something went wrong sending your message. Please try again.
                                    </p>
                                )}
                                <div className="flex justify-end pt-1">
                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="bg-black hover:bg-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wide px-6 py-3 rounded-lg transition-colors shadow-xs"
                                    >
                                        {status === "submitting" ? "Sending..." : "Submit Form"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

                {/* LOWER CHANNELS MATRICES SEGMENT */}
                <div className="mt-20 sm:mt-32 space-y-8">

                    {/* WhatsApp Support */}
                    <div className="bg-white border border-gray-200/70 rounded-3xl p-6 sm:p-10 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xs hover:shadow-xs transition-shadow">
                        <div className="md:col-span-6 order-2 md:order-1 flex justify-center md:justify-start w-full">
                            <div className="w-full max-w-[220px] aspect-square relative">
                                <Image
                                    src="/icons/whatsapp.svg"
                                    alt="WhatsApp"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-6 order-1 md:order-2 space-y-4 md:pl-10">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                                WhatsApp Support
                            </h3>
                            <div className="space-y-0.5 text-xs sm:text-sm text-gray-400 font-semibold tracking-normal">
                                <p className="text-gray-900 font-bold">Customer Support</p>
                                <p>Professional Support</p>
                                <p>(9-10) Monday – Saturday</p>
                            </div>
                            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                <a
                                    href="https://wa.me/919499521425"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors w-full sm:w-auto justify-center shadow-2xs"
                                >
                                    <MessageCircle className="w-4 h-4 text-emerald-600" strokeWidth={2.2} />
                                    <span>Whatsapp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
