import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PolicyDetailsModal = ({ policy, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!policy) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'rules', label: 'Rules', icon: 'Settings' },
    { id: 'compliance', label: 'Compliance', icon: 'Shield' },
    { id: 'impact', label: 'Impact', icon: 'TrendingUp' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Policy Name</label>
                  <p className="text-lg font-semibold text-foreground">{policy?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm text-foreground">{policy?.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                    {policy?.type}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy?.status)}`}>
                      {policy?.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Enforcement</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${policy?.enforcement ? 'bg-success' : 'bg-muted-foreground'}`} />
                    <span className="text-sm">{policy?.enforcement ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scope</label>
                  <div className="flex items-center space-x-1 mt-1">
                    <Icon 
                      name={policy?.scope === 'Organization' ? 'Building' : policy?.scope === 'Global' ? 'Globe' : 'Users'} 
                      size={14} 
                      className="text-muted-foreground" 
                    />
                    <span className="text-sm">{policy?.scope}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Created</label>
                  <p className="font-medium">{formatDate(policy?.lastModified)}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Modified By</label>
                  <p className="font-medium">{policy?.modifiedBy}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Policy ID</label>
                  <p className="font-mono text-xs">{policy?.id}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Template</label>
                  <p className="font-medium">{policy?.template}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'rules':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Policy Rules</h3>
              <span className="text-sm text-muted-foreground">{policy?.rulesCount} rules configured</span>
            </div>

            <div className="space-y-3">
              {[
                { rule: 'Key Rotation', requirement: 'Every 90 days', status: 'active' },
                { rule: 'Minimum Key Length', requirement: '2048 bits for RSA', status: 'active' },
                { rule: 'Multi-Factor Authentication', requirement: 'Required for key access', status: 'active' },
                { rule: 'Backup Requirements', requirement: 'Secure storage backup', status: 'active' },
                { rule: 'Audit Logging', requirement: 'All operations logged', status: 'active' },
                { rule: 'Access Review', requirement: 'Monthly access review', status: 'pending' }
              ]?.map((rule, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{rule?.rule}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rule?.requirement}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rule?.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {rule?.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Rule Builder Preview</h4>
              <p className="text-sm text-muted-foreground">
                Rules are defined using a combination of conditions, operators, and actions. 
                Each rule is evaluated in real-time during key operations.
              </p>
            </div>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Compliance Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-12 bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-success"
                    style={{ width: `${policy?.complianceScore}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-success">{policy?.complianceScore}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="CheckCircle" size={24} className="text-success" />
                </div>
                <h4 className="font-semibold text-foreground">Compliant</h4>
                <p className="text-2xl font-bold text-success mt-1">241</p>
                <p className="text-xs text-muted-foreground">Keys passing all rules</p>
              </div>

              <div className="p-4 border border-border rounded-lg text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="AlertTriangle" size={24} className="text-warning" />
                </div>
                <h4 className="font-semibold text-foreground">Warning</h4>
                <p className="text-2xl font-bold text-warning mt-1">5</p>
                <p className="text-xs text-muted-foreground">Keys needing attention</p>
              </div>

              <div className="p-4 border border-border rounded-lg text-center">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="XCircle" size={24} className="text-destructive" />
                </div>
                <h4 className="font-semibold text-foreground">Non-Compliant</h4>
                <p className="text-2xl font-bold text-destructive mt-1">1</p>
                <p className="text-xs text-muted-foreground">Keys violating rules</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Recent Compliance Events</h4>
              <div className="space-y-2">
                {[
                  { event: 'Key rotation overdue', severity: 'high', time: '2 hours ago' },
                  { event: 'Access review completed', severity: 'info', time: '1 day ago' },
                  { event: 'Policy rule violation detected', severity: 'medium', time: '3 days ago' }
                ]?.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        event?.severity === 'high' ? 'bg-destructive' : 
                        event?.severity === 'medium' ? 'bg-warning' : 'bg-success'
                      }`} />
                      <span className="text-sm">{event?.event}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{event?.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'impact':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Policy Impact Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Affected Keys</h4>
                    <p className="text-3xl font-bold text-primary">{policy?.affectedKeys?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total keys under this policy</p>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Cost Impact</h4>
                    <p className="text-sm text-muted-foreground">Estimated operational cost per month</p>
                    <p className="text-xl font-semibold text-foreground mt-1">$2,450</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Performance Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Key Generation:</span>
                        <span className="text-green-600">+5ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Key Validation:</span>
                        <span className="text-green-600">+2ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Audit Overhead:</span>
                        <span className="text-yellow-600">+8ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Resource Usage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">CPU Usage:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-1">
                            <div className="h-1 rounded-full bg-success w-3/4" />
                          </div>
                          <span>75%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Memory:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-1">
                            <div className="h-1 rounded-full bg-warning w-1/2" />
                          </div>
                          <span>50%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Potential Conflicts</h4>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">No conflicts detected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This policy does not conflict with existing policies or system constraints.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-4xl rounded-2xl border border-border max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{policy?.name}</h2>
            <p className="text-sm text-muted-foreground">{policy?.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onEdit}>
              <Icon name="Edit" size={16} className="mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailsModal;