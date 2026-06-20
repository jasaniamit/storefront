// src/app/[country]/[locale]/(storefront)/contact/ContactClientPage.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MessageCircle, ArrowRight } from "lucide-react";

export default function ContactClientPage() {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ email, subject, message });
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
                            Let's Print an amazing masterpiece together
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed max-w-2xl">
                            We would love to hear from you. Our experts will cater all your needs and enquiries. Whether you are looking to renovate, reconstruct or upgrade your space, our experts will guide you from conceptualisation to implementation. Leave us a message, and we'll get back to you as soon as possible.
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
                                <div className="flex justify-end pt-1">
                                    <button
                                        type="submit"
                                        className="bg-black hover:bg-zinc-900 text-white font-bold text-xs tracking-wide px-6 py-3 rounded-lg transition-colors shadow-xs"
                                    >
                                        Submit Form
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

                {/* LOWER CHANNELS MATRICES SEGMENT */}
                <div className="mt-20 sm:mt-32 space-y-8">

                    {/* Tier 1: Technical Support */}
                    <div className="bg-white border border-gray-200/70 rounded-3xl p-6 sm:p-10 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xs hover:shadow-xs transition-shadow">
                        <div className="md:col-span-6 space-y-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                                Technical Support
                            </h3>
                            <div className="space-y-0.5 text-xs sm:text-sm text-gray-400 font-semibold tracking-normal">
                                <p className="text-gray-900 font-bold">Print & Design</p>
                                <p>Professional Support</p>
                                <p>(9-10) Monday – Saturday</p>
                            </div>
                            <div className="pt-2 flex items-center gap-2 text-gray-900 font-bold text-sm sm:text-base">
                                <Mail className="w-4 h-4 text-gray-900 shrink-0" strokeWidth={2.5} />
                                <a href="mailto:support@artolika.com" className="hover:underline">
                                    support@artolika.com
                                </a>
                            </div>
                        </div>
                        <div className="md:col-span-6 flex justify-center md:justify-end w-full">
                            {/* Upscaled max-width constraints to expand vector presentation fields */}
                            <div className="w-full max-w-[460px] aspect-[4/3] relative">
                                <Image
                                    src="/images/contact/technical-support.webp"
                                    alt="Technical Support Engineering Vector Representation"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tier 2: Live Chat */}
                    <div className="bg-white border border-gray-200/70 rounded-3xl p-6 sm:p-10 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xs hover:shadow-xs transition-shadow">
                        <div className="md:col-span-6 order-2 md:order-1 flex justify-center md:justify-start w-full">
                            <div className="w-full max-w-[460px] aspect-[4/3] relative">
                                <Image
                                    src="/images/contact/live-chat.webp"
                                    alt="Customer Care Representatives Chatting Live Illustration"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="md:col-span-6 order-1 md:order-2 space-y-4 md:pl-10">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                                Live Chat
                            </h3>
                            <div className="space-y-0.5 text-xs sm:text-sm text-gray-400 font-semibold tracking-normal">
                                <p className="text-gray-900 font-bold">Customer Support</p>
                                <p>Professional Support</p>
                                <p>(9-10) Monday – Saturday</p>
                            </div>
                            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                <a
                                    href="tel:+919390735447"
                                    className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors w-full sm:w-auto justify-center shadow-2xs"
                                >
                                    <Phone className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
                                    <span>Talk to us</span>
                                </a>
                                <a
                                    href="https://wa.me/919390735447"
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

                    {/* Tier 3: Locate Us */}
                    <div className="bg-white border border-gray-200/70 rounded-3xl p-6 sm:p-10 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xs hover:shadow-xs transition-shadow">
                        <div className="md:col-span-6 space-y-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                                Locate Us
                            </h3>
                            <div className="space-y-0.5 text-xs sm:text-sm text-gray-400 font-semibold tracking-normal">
                                <p className="text-gray-900 font-bold">Official Showrooms</p>
                                <p>Order from your Nearest Stores Hassle Free</p>
                            </div>
                            <div className="pt-3">
                                <Link
                                    href="/locate-stores"
                                    className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all group"
                                >
                                    <span>Visit Stores</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </Link>
                            </div>
                        </div>
                        <div className="md:col-span-6 flex justify-center md:justify-end w-full">
                            <div className="w-full max-w-[460px] aspect-[4/3] relative">
                                <Image
                                    src="/images/contact/locate-us.webp"
                                    alt="Clients Reviewing Design Prints Inside Architecture Showroom Center"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}