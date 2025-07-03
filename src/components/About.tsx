import React from 'react';
import { Users, Target, Lightbulb, Award } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Strategic Approach",
      description: "We don't believe in one-size-fits-all solutions. Every strategy is tailored to your unique business needs."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We combine creativity with data-driven strategies to deliver cutting-edge solutions that drive results."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We take time to understand your business from the inside out, creating meaningful partnerships."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Our commitment to quality ensures every project exceeds expectations and delivers measurable impact."
    }
  ];

  const teamMembers = [
    {
      name: "Andrea Cozart-Lundin",
      position: "Co-Founder & CTO",
      company: "Cozyartz Media Group",
      image: "/AndreaProfile.jpeg",
      description: "Andrea is a certified commercial drone pilot and creative technologist who leads Cozyartz's technical and production direction. With expertise in drone cinematography, web development, video editing, and graphic design, she fuses technology with storytelling to deliver high-impact visual content."
    },
    {
      name: "Amy Cozart-Lundin",
      position: "Co-Founder & CEO",
      company: "Cozyartz Media Group",
      image: "/C3FE986E-EA23-4996-A5D2-8CEEF3C2C4FB_4_5005_c.jpeg",
      description: "Amy is an instructional designer and corporate learning expert with an M.Ed. in eLearning and instructional design. As CEO, she guides Cozyartz's strategic vision — combining educational depth with creative media to craft experiences that inform, engage, and inspire."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Who <span className="text-teal-500">We Are</span>
            </h2>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-lg">
                We believe in a unique, innovative approach that combines creativity with data-driven 
                strategies, amplifying your business growth.
              </p>
              
              <p>
                At Cozyartz Media Group, we don't believe in one-size-fits-all solutions. We understand 
                that every business has a unique story, unique goals, and unique customers. And that's why 
                our strategies are as diverse as our clients.
              </p>
              
              <p>
                We take the time to understand your business from the inside out, enabling us to create 
                tailored strategies that resonate with your target audience and drive meaningful engagement.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="text-3xl font-bold text-teal-600 mb-2">65%</div>
                <div className="text-sm text-gray-600">Enhanced Message Relevance</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-sm text-gray-600">SEO Improvement</div>
              </div>
            </div>
          </div>

          {/* Right Column - Values */}
          <div className="space-y-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="bg-teal-100 p-3 rounded-full flex-shrink-0">
                    <Icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our founding team brings together expertise in creative technology and instructional design 
              to deliver exceptional results that drive business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">{member.name}</h4>
                <p className="text-teal-600 font-semibold text-lg mb-2">{member.position}</p>
                <p className="text-gray-500 font-medium mb-4">{member.company}</p>
                <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;