"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "If I try Basic, can I upgrade?",
    answer:
      "Yes, instantly. Your usage carries over and you get immediate access to all Pro features. No waiting, no setup required.",
  },
  {
    question: "Why is Pro more expensive?",
    answer:
      "Because it includes everything that's missing in Basic. Premium library, GPT optimization, unlimited exports, and priority support. It's the difference between a draft and a finished product.",
  },
  {
    question: "What happens if I exceed the limit?",
    answer:
      "You'll be notified before hitting limits. For Basic users, you can upgrade instantly. Pro users get unlimited access, so no worries about limits.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Cancel with one click. No questions asked. Your account remains active until the end of your billing period.",
  },
  {
    question: "What's included in the 7-day guarantee?",
    answer:
      "Full refund, no questions asked. If PromptForge doesn't save you time and improve your prompts within 7 days, get your money back instantly.",
  },
  {
    question: "How does Team pricing work?",
    answer:
      "Team plans include unlimited seats, white-label options, and dedicated support. Pricing scales with your needs. Contact us for custom enterprise solutions.",
  },
];

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-foreground">
          Everything you need to know about PromptForge pricing
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border/30 rounded-lg glass-effect overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary/10 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-foreground">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
