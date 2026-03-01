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
     
    </div>
  );
};

export default ResourcesSection;