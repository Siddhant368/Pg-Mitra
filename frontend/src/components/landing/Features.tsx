import { DoorOpen, Users, IndianRupee, BellRing, FileText, Building2 } from 'lucide-react';

const FEATURES = [
  {
    icon: DoorOpen,
    title: 'Rooms and beds',
    description: 'Add rooms and beds are created for you. See vacant and occupied at a glance.',
  },
  {
    icon: Users,
    title: 'resident records',
    description: 'Name, phone, ID proof, deposit and joining date in one place.',
  },
  {
    icon: IndianRupee,
    title: 'Rent tracking',
    description: 'Monthly rent is generated for you. Mark paid by cash or UPI.',
  },
  {
    icon: BellRing,
    title: 'Pending alerts',
    description: 'See overdue and pending rent on your dashboard every day.',
  },
  {
    icon: FileText,
    title: 'Collection reports',
    description: "This month's collection and dues, without a calculator.",
  },
  {
    icon: Building2,
    title: 'Multiple PGs',
    description: 'Run more than one property from the same login.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1152px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">Everything a PG owner needs</h2>
          <p className="text-lg text-muted">
            Built for the daily work of running a PG, nothing extra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-white rounded-2xl border border-line p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-mint-400/20 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-forest-700" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
