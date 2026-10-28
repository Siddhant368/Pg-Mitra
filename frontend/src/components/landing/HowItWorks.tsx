export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: 'Add your PG',
      desc: 'Create your property, rooms and beds.',
    },
    {
      num: 2,
      title: 'Add residents',
      desc: 'Assign each resident to a bed.',
    },
    {
      num: 3,
      title: 'Track rent',
      desc: 'Generate rent monthly and mark it paid.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-page border-y border-line">
      <div className="max-w-[1152px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink">Up and running in three steps</h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-line -z-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-page shadow-sm flex items-center justify-center text-xl font-bold text-forest-700 mb-6">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-ink mb-3">{step.title}</h3>
                <p className="text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
