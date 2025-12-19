import React from 'react';
import Icon from '../../../components/AppIcon';

const ResourcesSection = () => {
  const resources = [
    {
      category: 'Whitepapers',
      icon: 'FileText',
      items: [
        {
          title: 'Quantum-Safe Cryptography Guide',
          description: 'Prepare your organization for the post-quantum era with this comprehensive guide.',
          downloadCount: '2.3K',
          type: 'PDF'
        },
        {
          title: 'Enterprise Key Management Best Practices',
          description: 'Industry best practices for implementing and managing cryptographic keys at scale.',
          downloadCount: '1.8K',
          type: 'PDF'
        },
        {
          title: 'Compliance Framework Mapping',
          description: 'How KeyOrbit KMS helps you meet SOC 2, FIPS 140-2, and other regulatory requirements.',
          downloadCount: '1.2K',
          type: 'PDF'
        }
      ]
    },
    {
      category: 'Documentation',
      icon: 'Book',
      items: [
        {
          title: 'API Reference Guide',
          description: 'Complete documentation for our REST APIs with code examples and best practices.',
          type: 'Web',
          link: true
        },
        {
          title: 'Integration Tutorials',
          description: 'Step-by-step tutorials for integrating KeyOrbit KMS with popular platforms.',
          type: 'Web',
          link: true
        },
        {
          title: 'Administrator Manual',
          description: 'Comprehensive guide for system administrators and security teams.',
          type: 'PDF'
        }
      ]
    },
    {
      category: 'Security Guides',
      icon: 'Shield',
      items: [
        {
          title: 'Zero Trust Architecture with KMS',
          description: 'Implementing zero trust security principles with centralized key management.',
          downloadCount: '950',
          type: 'PDF'
        },
        {
          title: 'Incident Response Playbook',
          description: 'Security incident response procedures specific to key management systems.',
          downloadCount: '720',
          type: 'PDF'
        },
        {
          title: 'Security Audit Checklist',
          description: 'Complete checklist for auditing your key management implementation.',
          type: 'PDF'
        }
      ]
    }
  ];

  const webinars = [
    {
      title: 'Getting Started with Enterprise Key Management',
      date: 'March 15, 2024',
      duration: '45 min',
      speaker: 'Sarah Chen, CISO',
      registered: 892
    },
    {
      title: 'Quantum Computing Threats and Mitigation Strategies',
      date: 'March 22, 2024',
      duration: '60 min',
      speaker: 'Dr. Marcus Rodriguez, Cryptographer',
      registered: 1247
    },
    {
      title: 'Compliance Made Easy: SOC 2 and FIPS 140-2',
      date: 'March 29, 2024',
      duration: '30 min',
      speaker: 'Emma Thompson, Compliance Expert',
      registered: 634
    }
  ];

  const handleResourceDownload = (resource) => {
    console.log('Downloading:', resource?.title);
    // This would typically trigger a download or show a lead capture form
  };

  const handleWebinarRegistration = (webinar) => {
    console.log('Registering for webinar:', webinar?.title);
    // This would typically show a registration form
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Resources & Learning Center
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Expand your knowledge with our comprehensive library of guides, documentation, 
          and educational content on key management and cryptographic security.
        </p>
      </div>

      {/* Resource Categories */}
      <div className="space-y-16">
        {resources?.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={category?.icon} size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{category?.category}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category?.items?.map((resource, resourceIndex) => (
                <div
                  key={resourceIndex}
                  className="glass-card rounded-lg p-6 hover:shadow-orbital-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {resource?.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                        {resource?.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {resource?.description}
                  </p>

                  <div className="flex items-center justify-between">
                    {resource?.downloadCount && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Icon name="Download" size={14} />
                        <span>{resource?.downloadCount} downloads</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleResourceDownload(resource)}
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-200 text-sm font-medium"
                    >
                      <span>{resource?.link ? 'View' : 'Download'}</span>
                      <Icon name={resource?.link ? "ExternalLink" : "Download"} size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Webinars */}
      <div className="mt-20">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={24} className="text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Upcoming Webinars</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {webinars?.map((webinar, index) => (
            <div
              key={index}
              className="glass-card rounded-lg p-6 hover:shadow-orbital-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-sm text-accent font-medium">
                  {webinar?.date}
                </div>
                <div className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                  {webinar?.duration}
                </div>
              </div>

              <h4 className="text-lg font-semibold text-foreground mb-2">
                {webinar?.title}
              </h4>

              <p className="text-sm text-muted-foreground mb-4">
                Presented by {webinar?.speaker}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="Users" size={14} />
                  <span>{webinar?.registered} registered</span>
                </div>
                <button
                  onClick={() => handleWebinarRegistration(webinar)}
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors duration-200"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="glass-card rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Mail" size={32} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Stay Updated on Key Management Trends
          </h3>
          <p className="text-muted-foreground mb-8">
            Get the latest insights, security updates, and best practices delivered to your inbox monthly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
            />
            <button className="btn-glow bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime. View our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesSection;