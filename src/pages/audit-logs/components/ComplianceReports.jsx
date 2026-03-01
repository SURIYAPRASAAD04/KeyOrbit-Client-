import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ComplianceReports = ({ onGenerateReport, stats }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [reportConfig, setReportConfig] = useState({
    startDate: '',
    endDate: '',
    includeDetails: true,
    format: 'pdf'
  });

  const complianceTemplates = [
    {
      value: 'sox',
      label: 'SOX Compliance Report',
      description: 'Sarbanes-Oxley Act compliance reporting for financial controls',
      icon: 'FileBarChart',
      requirements: ['Key access controls', 'User authentication logs', 'Policy changes', 'Administrative actions']
    },
    {
      value: 'hipaa',
      label: 'HIPAA Audit Report',
      description: 'Health Insurance Portability and Accountability Act audit trail',
      icon: 'Shield',
      requirements: ['Data access logs', 'User activity tracking', 'Security incidents', 'Access control changes']
    },
    {
      value: 'gdpr',
      label: 'GDPR Compliance Report',
      description: 'General Data Protection Regulation compliance documentation',
      icon: 'Lock',
      requirements: ['Data processing activities', 'User consent tracking', 'Data breach incidents', 'Access requests']
    },
    {
      value: 'pci',
      label: 'PCI DSS Report',
      description: 'Payment Card Industry Data Security Standard compliance',
      icon: 'CreditCard',
      requirements: ['Cardholder data access', 'Security controls', 'Network monitoring', 'Vulnerability management']
    }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data Export' }
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Monthly SOX Report',
      template: 'sox',
      schedule: 'Monthly on 1st',
      lastRun: '2025-01-01T00:00:00Z',
      nextRun: '2025-02-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 2,
      name: 'Weekly Security Summary',
      template: 'gdpr',
      schedule: 'Weekly on Monday',
      lastRun: '2025-01-13T00:00:00Z',
      nextRun: '2025-01-20T00:00:00Z',
      status: 'active'
    },
    {
      id: 3,
      name: 'Quarterly HIPAA Audit',
      template: 'hipaa',
      schedule: 'Quarterly',
      lastRun: '2024-10-01T00:00:00Z',
      nextRun: '2025-01-01T00:00:00Z',
      status: 'paused'
    }
  ];

  const handleGenerateReport = () => {
    if (!selectedTemplate) return;
    
    const template = complianceTemplates.find(t => t.value === selectedTemplate);
    onGenerateReport({
      template: template,
      config: reportConfig
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-success/10 text-success',
      paused: 'bg-warning/10 text-warning',
      completed: 'bg-muted text-muted-foreground'
    };
    return colors[status] || colors.paused;
  };

  return (
    <div className="space-y-6">
      {/* Generate Report Section */}
      <div className="glass-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Generate Compliance Report</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Report Template
            </label>
            <div className="space-y-3">
              {complianceTemplates.map((template) => (
                <button
                  key={template.value}
                  onClick={() => setSelectedTemplate(template.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-150 ${
                    selectedTemplate === template.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedTemplate === template.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/30 text-muted-foreground'
                    }`}>
                      <Icon name={template.icon} size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{template.label}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {template.requirements.map((req, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-muted/20 rounded-full text-muted-foreground"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedTemplate === template.value && (
                      <Icon name="CheckCircle" size={20} className="text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Report Configuration
            </label>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  label="Start Date"
                  value={reportConfig.startDate}
                  onChange={(e) => setReportConfig({...reportConfig, startDate: e.target.value})}
                />
                <Input
                  type="date"
                  label="End Date"
                  value={reportConfig.endDate}
                  onChange={(e) => setReportConfig({...reportConfig, endDate: e.target.value})}
                />
              </div>

              <Select
                label="Export Format"
                options={formatOptions}
                value={reportConfig.format}
                onChange={(value) => setReportConfig({...reportConfig, format: value})}
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeDetails"
                  checked={reportConfig.includeDetails}
                  onChange={(e) => setReportConfig({...reportConfig, includeDetails: e.target.checked})}
                  className="rounded border-border bg-muted/30 text-primary focus:ring-primary"
                />
                <label htmlFor="includeDetails" className="text-sm text-foreground">
                  Include detailed audit trail
                </label>
              </div>

              {/* Summary Stats */}
              <div className="bg-muted/20 rounded-lg p-4 mt-4">
                <h5 className="text-sm font-medium text-foreground mb-2">Report Summary</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Events:</span>
                    <span className="text-foreground font-medium">{stats?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date Range:</span>
                    <span className="text-foreground">
                      {reportConfig.startDate || 'All'} to {reportConfig.endDate || 'All'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="text-foreground uppercase">{reportConfig.format}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerateReport}
                disabled={!selectedTemplate}
                className="w-full btn-glow"
              >
                <Icon name="FileText" size={16} className="mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="glass-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Scheduled Reports</h3>
          <Button variant="outline" size="sm">
            <Icon name="Plus" size={16} className="mr-2" />
            Schedule New
          </Button>
        </div>

        <div className="space-y-4">
          {scheduledReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/10 border border-border"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-foreground">{report.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="text-muted-foreground">
                    <Icon name="Calendar" size={14} className="inline mr-1" />
                    Schedule: {report.schedule}
                  </span>
                  <span className="text-muted-foreground">
                    <Icon name="Clock" size={14} className="inline mr-1" />
                    Last: {formatDate(report.lastRun)}
                  </span>
                  <span className="text-muted-foreground">
                    <Icon name="Play" size={14} className="inline mr-1" />
                    Next: {formatDate(report.nextRun)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Edit" size={16} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="MoreVertical" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceReports;