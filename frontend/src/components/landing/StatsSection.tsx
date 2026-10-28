import { Percent, Clock, BarChart2, ShieldCheck } from 'lucide-react';

const STATS = [
  {
    icon: Percent,
    value: '99.2%',
    label: 'Occupancy Rate',
    description: 'Maximize your space utilization with real-time insights.',
  },
  {
    icon: Clock,
    value: '3.5 Hrs',
    label: 'Onboarding Time',
    description: 'Get started quickly and manage your property in no time.',
  },
  {
    icon: BarChart2,
    value: '120K+',
    label: 'Active residents Managed',
    description: 'Trusted by PGs, hostels and co-living spaces across India.',
  },
  {
    icon: ShieldCheck,
    value: '4.9 / 5',
    label: 'Customer Satisfaction',
    description: 'Loved by operators for our simple and reliable platform.',
  },
];

export default function StatsSection() {
  return (
    <section id="features" className="py-16 bg-brand-light-mint">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
              >
                <div className="w-12 h-12 rounded-full bg-brand-light-mint flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-brand-teal" />
                </div>
                <div className="text-3xl font-bold text-brand-navy mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-brand-teal mb-3 uppercase tracking-wider">
                  {stat.label}
                </div>
                <p className="text-sm text-brand-secondary leading-relaxed mt-auto">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
