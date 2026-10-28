import Link from 'next/link';
import { Star, ArrowRight, Calendar } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-16 pb-12 lg:pt-20 lg:pb-16 flex items-center min-h-[60vh]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-navy/30 z-10"></div> {/* Lighter overlay to make image visible */}
        <img 
          src="/images/hero-image.png" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-white shadow-lg mb-8">
          Smart • Simple • Complete
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8 drop-shadow-xl">
          Property Management <br className="hidden sm:block" />
          Built for Modern <br className="hidden sm:block" />
          <span className="text-brand-teal drop-shadow-md">PG & Co-Living</span> <br className="hidden sm:block" />
          Operators
        </h1>
        
        <p className="text-lg sm:text-xl text-white font-medium mb-10 max-w-2xl leading-relaxed drop-shadow-md">
          Automate rent collection, manage residents, track maintenance, and streamline daily operations — all in one powerful platform. Built for PGs, hostels and co-living spaces.
        </p>
        
        <div className="flex flex-col items-center justify-center mb-10 w-full sm:w-auto">
          <Link 
            href="/book-demo" 
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand-teal hover:bg-brand-dark-teal px-10 py-4 text-white text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 group border border-teal-300/30"
          >
            <Calendar className="w-5 h-5 mr-3 text-brand-light-mint" />
            <span>Book a Free Demo</span>
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1.5 transition-transform" />
          </Link>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-xs sm:text-sm text-brand-light-mint/90 font-medium">
            <span className="inline-flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400 mr-2"></span>
              15-Min Live Walkthrough
            </span>
            <span className="inline-flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400 mr-2"></span>
              No Credit Card Required
            </span>
            <span className="inline-flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400 mr-2"></span>
              WhatsApp or Call
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-brand-light-mint">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-white">4.8/5 Rating</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30"></div>
          <div>Trusted by 2,000+ PGs & Hostels Across India</div>
        </div>
      </div>
    </section>
  );
}
