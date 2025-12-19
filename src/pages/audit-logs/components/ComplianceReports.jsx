import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ComplianceReports = ({ onGenerateReport }) => {
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
    
    const template = complianceTemplates?.find(t => t?.value === selectedTemplate);
    onGenerateReport({
      template: template,
      config: reportConfig
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Generate New Report */}
      <div className="glass-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Generate Compliance Report</h3>
        </div>

        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Compliance Template
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceTemplates?.map((template) => (
                <div
                  key={template?.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-150 ${
                    selectedTemplate === template?.value
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
                  }`}
                  onClick={() => setSelectedTemplate(template?.value)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon name={template?.icon} size={20} className="text-primary mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{template?.label}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{template?.description}</p>
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Includes:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {template?.requirements?.map((req, index) => (
                            <li key={index} className="flex items-center space-x-1">
                              <Icon name="Check" size={12} className="text-success" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Configuration */}
          {selectedTemplate && (
            <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground">Report Configuration</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  value={reportConfig?.startDate}
                  onChange={(e) => setReportConfig({...reportConfig, startDate: e?.target?.value})}
                />
                <Input
                  type="date"
                  label="End Date"
                  value={reportConfig?.endDate}
                  onChange={(e) => setReportConfig({...reportConfig, endDate: e?.target?.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Report Format"
                  options={formatOptions}
                  value={reportConfig?.format}
                  onChange={(value) => setReportConfig({...reportConfig, format: value})}
                />
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="includeDetails"
                    checked={reportConfig?.includeDetails}
                    onChange={(e) => setReportConfig({...reportConfig, includeDetails: e?.target?.checked})}
                    className="rounded border-border"
                  />
                  <label htmlFor="includeDetails" className="text-sm text-foreground">
                    Include detailed event logs
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="default"
                  onClick={handleGenerateReport}
                  iconName="Download"
                  iconPosition="left"
                >
                  Generate Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Scheduled Reports */}
      <div className="glass-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Icon name="Calendar" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Scheduled Reports</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
          >
            New Schedule
          </Button>
        </div>

        <div className="space-y-4">
          {scheduledReports?.map((report) => (
            <div key={report?.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-foreground">{report?.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report?.status === 'active' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                  }`}>
                    {report?.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span>{report?.schedule}</span>
                  <span>•</span>
                  <span>Last run: {formatDate(report?.lastRun)}</span>
                  <span>•</span>
                  <span>Next run: {formatDate(report?.nextRun)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" iconName="Edit" />
                <Button variant="ghost" size="icon" iconName="Trash2" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  iconName={report?.status === 'active' ? "Pause" : "Play"} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceReports;