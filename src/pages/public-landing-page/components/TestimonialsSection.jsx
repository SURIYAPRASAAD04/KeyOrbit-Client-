import React from 'react';
import Icon from '../../../components/AppIcon';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "KeyOrbit KMS has transformed our security posture. The quantum-ready features give us confidence for the future.",
      author: "Sarah Chen",
      title: "CISO",
      company: "TechCorp Industries",
      rating: 5,
      avatar: null
    },
    {
      quote: "Implementation was seamless and the support team is exceptional. Our compliance audits are now effortless.",
      author: "Marcus Rodriguez",
      title: "Security Architect",
      company: "Financial Services Inc",
      rating: 5,
      avatar: null
    },
    {
      quote: "The performance is outstanding. We've reduced key operation latency by 80% while improving security.",
      author: "Emma Thompson",
      title: "Lead Developer",
      company: "CloudScale Systems",
      rating: 5,
      avatar: null
    }
  ];

  const certifications = [
    {
      name: "SOC 2 Type II",
      icon: "Shield",
      description: "Independently audited security controls"
    },
    {
      name: "FIPS 140-2",
      icon: "Lock",
      description: "Level 3 cryptographic module validation"
    },
    {
      name: "Common Criteria",
      icon: "CheckCircle",
      description: "International security certification"
    },
    {
      name: "ISO 27001",
      icon: "Globe",
      description: "Information security management"
    }
  ];

  const getInitials = (name) => {
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase();
  };

  const renderStars = (rating) => {
    return Array?.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? "text-accent fill-accent" : "text-muted-foreground"}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Trusted by Industry Leaders
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Join hundreds of enterprises that trust KeyOrbit KMS to protect their most critical cryptographic assets.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {testimonials?.map((testimonial, index) => (
          <div
            key={index}
            className="glass-card rounded-lg p-8 hover:shadow-orbital-lg transition-all duration-300"
          >
            {/* Rating */}
            <div className="flex items-center space-x-1 mb-4">
              {renderStars(testimonial?.rating)}
            </div>

            {/* Quote */}
            <blockquote className="text-foreground mb-6 leading-relaxed">
              "{testimonial?.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {getInitials(testimonial?.author)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-foreground">{testimonial?.author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial?.title} at {testimonial?.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Certifications */}
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Security Certifications & Compliance
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our platform meets the highest industry standards for security and compliance, 
          giving you confidence in your key management infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {certifications?.map((cert, index) => (
          <div
            key={index}
            className="glass-card rounded-lg p-6 text-center hover:shadow-orbital-lg transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <Icon name={cert?.icon} size={32} className="text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">{cert?.name}</h4>
            <p className="text-sm text-muted-foreground">{cert?.description}</p>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="glass-card rounded-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Enterprise Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10B+</div>
            <div className="text-sm text-muted-foreground">Keys Protected</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">99.99%</div>
            <div className="text-sm text-muted-foreground">Uptime Achievement</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Countries Served</div>
          </div>
        </div>
      </div>

      {/* Customer Logos */}
      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-8">Trusted by leading organizations worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {/* Placeholder for customer logos */}
          <div className="glass-card rounded-lg px-8 py-4">
            <span className="text-lg font-bold text-muted-foreground">TechCorp</span>
          </div>
          <div className="glass-card rounded-lg px-8 py-4">
            <span className="text-lg font-bold text-muted-foreground">FinanceSecure</span>
          </div>
          <div className="glass-card rounded-lg px-8 py-4">
            <span className="text-lg font-bold text-muted-foreground">CloudScale</span>
          </div>
          <div className="glass-card rounded-lg px-8 py-4">
            <span className="text-lg font-bold text-muted-foreground">DataGuard</span>
          </div>
          <div className="glass-card rounded-lg px-8 py-4">
            <span className="text-lg font-bold text-muted-foreground">SecureBank</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;