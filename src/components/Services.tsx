import React, { useEffect, useRef, useState } from 'react';
import { Monitor, BookOpen, Video, CheckCircle } from 'lucide-react';

const Services = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.service-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: BookOpen,
      title: "Instructional Design",
      number: "01.",
      description: "Our foundational expertise since 2016. We create high-impact learning experiences and training programs that drive measurable results. Led by Amy's Master's degree in Instructional Design and Education, we specialize in adult learning and corporate training solutions.",
      features: ["E-Learning Development", "Corporate Training Programs", "Assessment Design", "Learning Management Systems", "Educational Content Strategy"],
      benefits: ["50% improvement in learning outcomes", "Higher completion rates", "Measurable ROI", "Engaging, retention-focused content"]
    },
    {
      icon: Monitor,
      title: "Web & Graphic Design",
      number: "02.",
      description: "Our web and graphic design services combine creativity and functionality to create visually stunning digital experiences that captivate audiences and drive engagement.",
      features: ["Responsive Web Design", "Brand Identity", "UI/UX Design", "Print Materials"],
      benefits: ["Increased user engagement", "Professional brand image", "Mobile-optimized experience", "Conversion-focused design"]
    },
    {
      icon: Video,
      title: "Multimedia Production",
      number: "03.",
      description: "Our video production and aerial photography services bring your vision to life, delivering high-quality, captivating videos that effectively communicate your message and engage your target audience.",
      features: ["Video Production", "Aerial Photography", "Motion Graphics", "Post-Production"],
      benefits: ["Professional storytelling", "Stunning visual content", "Brand differentiation", "Increased social engagement"]
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Our <span className="text-teal-500">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded as an instructional design firm in 2016, we've expanded to offer comprehensive 
            creative solutions that combine educational expertise with innovative design and technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isVisible = visibleCards.includes(index);
            
            return (
              <div
                key={index}
                className={`service-card group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } hover:-translate-y-2 hover:scale-105`}
              >
                <div className="flex items-center mb-6">
                  <span className="text-4xl font-bold text-teal-500 mr-4">{service.number}</span>
                  <div className="bg-teal-100 p-3 rounded-full group-hover:bg-teal-500 transition-colors duration-300">
                    <Icon className="h-8 w-8 text-teal-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">What We Offer:</h4>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Process</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We follow a proven methodology to ensure every project delivers exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", description: "Understanding your goals and requirements" },
              { step: "02", title: "Strategy", description: "Developing tailored solutions and roadmap" },
              { step: "03", title: "Creation", description: "Bringing your vision to life with expertise" },
              { step: "04", title: "Delivery", description: "Launching and optimizing for success" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">{process.title}</h4>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;