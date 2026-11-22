"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <span className="font-label-md text-[10px] md:text-xs uppercase tracking-[0.25em] text-on-surface-variant block mb-3">
          Get in Touch
        </span>
        <h1 className="font-headline-lg lg:font-display-md text-3xl md:text-4xl text-on-surface mb-4">
          Contact & Customer Support
        </h1>
        <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
          Have a question about our saree collection, need assistance tracking an order, or looking for grievance redressal? Our customer support team in Shahdara, Delhi is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Verified Business Information */}
        <div className="space-y-8 bg-surface-container-low p-6 md:p-8 rounded-2xl border border-outline-variant/30">
          <div>
            <h2 className="font-headline-md text-xl text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">storefront</span>
              Shop Location
            </h2>
            <div className="font-body-md text-sm text-on-surface-variant space-y-1 leading-relaxed">
              <p className="font-semibold text-on-surface">Sanskriti Sarees Mill</p>
              <p>D 663, Main 100 Feet Rd, Chanderlok Colony,</p>
              <p>Durgapuri Extension, Chanderlok,</p>
              <p>Shahdara, Delhi, 110093, India</p>
            </div>
            <div className="mt-4">
              <a
                href="https://maps.google.com/?q=D+663+Main+100+Feet+Rd+Chanderlok+Shahdara+Delhi+110093"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary underline underline-offset-4 hover:opacity-80"
              >
                <span className="material-symbols-outlined text-base">directions</span>
                View on Google Maps / Directions
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant/20">
            <h2 className="font-headline-md text-xl text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mail</span>
              Official Contact Email
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mb-2">
              For general inquiries, catalog questions, and order support:
            </p>
            <a
              href="mailto:sanskritisareeemail@gmail.com"
              className="text-sm font-semibold text-primary underline underline-offset-4 hover:opacity-80"
            >
              sanskritisareeemail@gmail.com
            </a>
          </div>

          <div className="pt-6 border-t border-outline-variant/20">
            <h2 className="font-headline-md text-xl text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">support_agent</span>
              Customer Grievance & Redressal
            </h2>
            <p className="font-body-md text-xs text-on-surface-variant leading-relaxed mb-2">
              In accordance with the Consumer Protection (E-Commerce) Rules, any consumer complaints or grievances sent to our official email are acknowledged within 48 hours and resolved promptly through our designated grievance officer.
            </p>
            <p className="text-xs text-on-surface">
              <strong>Support Email:</strong>{" "}
              <a href="mailto:sanskritisareeemail@gmail.com" className="text-primary underline">
                sanskritisareeemail@gmail.com
              </a>
            </p>
            <p className="text-[11px] text-on-surface-variant mt-2 italic">
              *Direct phone concierge support line will be updated once confirmed by the proprietor.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/30">
          <h2 className="font-headline-md text-2xl text-on-surface mb-2">Send an Inquiry</h2>
          <p className="text-xs text-on-surface-variant mb-6">
            Fill in the details below and our team will get back to you via email.
          </p>

          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 p-6 rounded-xl text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-emerald-700">check_circle</span>
              <h3 className="font-bold text-base text-gray-900">Message Received</h3>
              <p className="text-xs text-gray-700">
                Thank you for contacting Sanskriti Sarees Mill. We have received your inquiry and will respond to your email shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs text-primary font-semibold underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="e.g. Priya Sharma"
                    className="border border-outline-variant/60 rounded-lg bg-surface px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="name@example.com"
                    className="border border-outline-variant/60 rounded-lg bg-surface px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Inquiry Type *
                </label>
                <select
                  id="subject"
                  className="border border-outline-variant/60 rounded-lg bg-surface px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="general">General Saree Inquiry</option>
                  <option value="order">Order Tracking & Status</option>
                  <option value="bridal">Bridal & Festive Inquiry</option>
                  <option value="returns">Returns & Grievances</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Please describe your question or order query..."
                  className="border border-outline-variant/60 rounded-lg bg-surface px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest py-3.5 rounded-lg hover:bg-tertiary-container transition-colors shadow-md cursor-pointer font-semibold"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
