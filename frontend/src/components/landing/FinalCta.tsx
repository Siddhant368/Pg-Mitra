import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import Footer from './Footer';

export default function FinalCta() {
  return (
    <section className="bg-brand-bg pt-10 lg:pt-16">
      {/* Full width container with rounded top corners */}
      <div className="relative rounded-t-[32px] lg:rounded-t-[48px] overflow-hidden bg-brand-dark-teal flex flex-col items-center shadow-2xl w-full">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-navy/80 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Property Interior" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content Container (constrained width) */}
        <div className="relative z-20 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 flex flex-col items-center flex-1 text-center">
          <div className="inline-flex items-center rounded-full bg-brand-teal/20 border border-brand-teal/30 px-4 py-1.5 text-xs font-bold text-brand-light-mint tracking-widest mb-6 uppercase backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-mint-400" />
            See PGMitra In Action
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight max-w-3xl">
            Ready to put your PG & hostel operations on autopilot?
          </h2>
          
          <p className="text-lg text-brand-light-mint/80 mb-8 max-w-2xl leading-relaxed">
            Schedule a personalized 15-minute walkthrough. We will demonstrate live how PGMitra manages rooms, rents, and residents seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 w-full sm:w-auto">
            <Link 
              href="/book-demo" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand-teal hover:bg-teal-500 px-10 py-4 text-white text-lg font-bold transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] group border border-teal-300/30"
            >
              <Calendar className="w-5 h-5 mr-3 text-brand-light-mint" />
              <span>Book a Free Live Demo</span>
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer stretches full width but content inside is constrained */}
        <div className="relative z-20 w-full mt-auto">
          <Footer />
        </div>
      </div>
    </section>
  );
}
