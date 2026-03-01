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
    <div className="">
      

      
     
    </div>
  );
};

export default TestimonialsSection;