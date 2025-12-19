import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedKeysPanel = ({ relatedKeys, onViewKey }) => {
  const getKeyTypeIcon = (algorithm) => {
    switch (algorithm?.toLowerCase()) {
      case 'aes-256':
        return 'Shield';
      case 'rsa-2048': case'rsa-4096':
        return 'Key';
      case 'kyber-512': case'kyber-768': case'kyber-1024':
        return 'Orbit';
      case 'dilithium-2': case'dilithium-3': case'dilithium-5':
        return 'Zap';
      default:
        return 'Lock';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'expired':
        return 'bg-error/10 text-error border-error/20';
      case 'revoked':
        return 'bg-error/10 text-error border-error/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getRelationshipIcon = (relationship) => {
    switch (relationship?.toLowerCase()) {
      case 'predecessor':
        return 'ArrowLeft';
      case 'successor':
        return 'ArrowRight';
      case 'backup':
        return 'Copy';
      case 'derived':
        return 'GitBranch';
      default:
        return 'Link';
    }
  };

  const getRelationshipColor = (relationship) => {
    switch (relationship?.toLowerCase()) {
      case 'predecessor':
        return 'text-muted-foreground';
      case 'successor':
        return 'text-primary';
      case 'backup':
        return 'text-secondary';
      case 'derived':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="GitBranch" size={20} className="text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Related Keys</h3>
      </div>
      <div className="space-y-4">
        {relatedKeys?.map((key) => (
          <div key={key?.id} className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon 
                    name={getKeyTypeIcon(key?.algorithm)} 
                    size={20} 
                    className="text-muted-foreground" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">{key?.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={getRelationshipIcon(key?.relationship)} 
                        size={14} 
                        className={getRelationshipColor(key?.relationship)} 
                      />
                      <span className={`text-xs font-medium ${getRelationshipColor(key?.relationship)}`}>
                        {key?.relationship}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground font-mono mb-2">{key?.keyId}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{key?.algorithm}</span>
                    <span>•</span>
                    <span>{key?.createdAt}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(key?.status)}`}>
                  {key?.status}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ExternalLink"
                  iconPosition="right"
                  onClick={() => onViewKey(key?.id)}
                >
                  View
                </Button>
              </div>
            </div>
            
            {/* Connection Visualization */}
            {key?.relationship !== 'backup' && (
              <div className="mt-3 flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="GitCommit" size={12} />
                <span>Created during {key?.relationship === 'successor' ? 'key rotation' : 'key derivation'}</span>
                {key?.rotationDate && (
                  <>
                    <span>•</span>
                    <span>{key?.rotationDate}</span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        
        {relatedKeys?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="GitBranch" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No related keys found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Related keys will appear here when key rotation or derivation occurs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedKeysPanel;