'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PLANS } from '../../lib/plans';
import { Check } from 'lucide-react';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1);

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-light-mint px-3 py-1 text-xs font-bold text-brand-success tracking-widest mb-6 uppercase">
            Pricing & Plans
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy mb-6 tracking-tight">
            Choose the tier tailored to your bed count
          </h2>
          <p className="text-lg text-brand-secondary">
            Simple, transparent pricing. No hidden fees. Cancel anytime.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-brand-navy' : 'text-brand-secondary'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-brand-teal transition-colors focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2"
              role="switch"
              aria-checked={isAnnual}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? 'text-brand-navy' : 'text-brand-secondary'}`}>
              Annual Billing
              <span className="inline-flex items-center rounded-full bg-brand-success/10 px-2.5 py-0.5 text-xs font-semibold text-brand-success">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto items-stretch">
          {PLANS.map((plan, index) => {
            const price = isAnnual 
              ? Math.floor(plan.monthlyPrice * 0.8) 
              : plan.monthlyPrice;
            
            const isSelected = index === selectedPlanIndex;
              
            return (
              <div 
                key={plan.title} 
                onClick={() => setSelectedPlanIndex(index)}
                className={`relative rounded-2xl p-5 flex flex-col transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  isSelected 
                    ? 'border-2 border-brand-teal bg-brand-light-mint/30 shadow-lg scale-100 md:scale-105 z-10' 
                    : 'border border-brand-border bg-white shadow-sm hover:border-brand-teal/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all">
                    <span className="bg-brand-teal text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full shadow-sm">
                      {plan.isPopular ? 'Most Popular' : 'Selected'}
                    </span>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-[11px] font-bold text-brand-teal uppercase tracking-widest mb-1">{plan.title}</h3>
                  <h4 className="text-lg font-bold text-brand-navy mb-1">{plan.name}</h4>
                  <p className="text-[11px] text-brand-secondary h-8 leading-snug">{plan.description}</p>
                </div>
                
                <div className="mb-5 pb-5 border-b border-brand-border">
                  <div className="flex items-baseline text-brand-navy">
                    <span className="text-xl font-bold">₹</span>
                    <span className="text-3xl font-bold tracking-tight mx-1">{price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-brand-secondary font-medium">/mo</span>
                  </div>
                  {isAnnual && (
                    <div className="text-[11px] text-brand-success font-medium mt-1">
                      Billed ₹{(price * 12).toLocaleString('en-IN')} yrly
                    </div>
                  )}
                </div>
                
                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-brand-secondary">
                      <div className="mr-2 shrink-0 rounded-full bg-brand-light-mint p-0.5 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-brand-teal" />
                      </div>
                      <span className="text-[11px] font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={plan.buttonLink} 
                  className={`w-full flex items-center justify-center rounded-lg px-3 py-2 font-semibold transition-colors min-h-[40px] text-xs ${
                    isSelected
                      ? 'bg-brand-teal text-white hover:bg-brand-dark-teal shadow-md'
                      : 'bg-white border-2 border-brand-border text-brand-navy hover:border-brand-teal hover:text-brand-teal'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
