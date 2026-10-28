'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Are there extra charges for additional rooms or features?',
    a: 'No. Our pricing is transparent and tied to the plan you choose. There are no hidden fees or extra charges as long as you stay within your plan\'s limits.',
  },
  {
    q: 'How does the rent collection process work?',
    a: 'We automate rent invoices and send reminders via WhatsApp/Email. residents can pay using UPI, cards, or net banking, and the dashboard updates in real-time.',
  },
  {
    q: 'Can I migrate my existing data from Excel or other systems?',
    a: 'Yes, we provide easy-to-use CSV import templates. Our support team can also assist you in migrating your existing resident and property data seamlessly.',
  },
  {
    q: 'Do you provide training and support after onboarding?',
    a: 'Absolutely. We offer comprehensive documentation, video tutorials, and dedicated support to ensure you and your staff can use the platform effectively.',
  },
  {
    q: 'Is there a mobile app available?',
    a: 'Yes, our platform is fully responsive on mobile browsers, and we offer dedicated apps for iOS and Android for on-the-go management.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-32 bg-brand-light-mint">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-teal tracking-widest mb-6 uppercase shadow-sm">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy mb-6 tracking-tight">
            Frequently Answered Questions
          </h2>
          <p className="text-lg text-brand-secondary">
            Everything you need to know about our platform, pricing and features.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-inset"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-semibold text-brand-navy pr-8">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-brand-teal text-white' : 'bg-brand-light-mint text-brand-teal'}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <div 
                  id={`faq-answer-${index}`}
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-brand-secondary leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
