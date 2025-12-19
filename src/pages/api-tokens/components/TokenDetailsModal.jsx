import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatDateTimeIST, formatShortDateTimeIST, formatRelativeTime, manualUTCtoIST } from '../../../utils/dateUtils';

const TokenDetailsModal = ({ isOpen, onClose, token }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !token) return null;

  const handleCopy = (text, field) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'expired':
        return 'text-error bg-error/10';
      case 'revoked':
        return 'text-muted-foreground bg-muted/50';
      default:
        return 'text-warning bg-warning/10';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'permissions', label: 'Permissions', icon: 'Shield' },
    { id: 'security', label: 'Security', icon: 'Lock' }
  ];

  const sdkExamples = {
    python: `import requests

# KeyOrbit KMS Python SDK
headers = {
    'Authorization': 'Bearer ${token?.tokenPreview}...',
    'Content-Type': 'application/json'
}

# Generate a new key
response = requests.post(
    'https://api.keyorbit.com/v1/keys',
    headers=headers,
    json={
        'name': 'my-encryption-key',
        'algorithm': 'AES-256',
        'usage': ['encrypt', 'decrypt']
    }
)

key = response.json()
print(f"Key ID: {key['id']}")`,
    
    nodejs: `const axios = require('axios');

// KeyOrbit KMS Node.js SDK
const client = axios.create({
  baseURL: 'https://api.keyorbit.com/v1',
  headers: {
    'Authorization': 'Bearer ${token?.tokenPreview}...',
    'Content-Type': 'application/json'
  }
});

// Generate a new key
async function generateKey() {
  try {
    const response = await client.post('/keys', {
      name: 'my-encryption-key',
      algorithm: 'AES-256',
      usage: ['encrypt', 'decrypt']
    });
    
    console.log('Key ID:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}`,
    
    go: `package main

import (
    "bytes" "encoding/json" "fmt" "net/http"
)

// KeyOrbit KMS Go SDK
func generateKey() error {
    url := "https://api.keyorbit.com/v1/keys"
    
    payload := map[string]interface{}{
        "name":      "my-encryption-key",
        "algorithm": "AES-256",
        "usage":     []string{"encrypt", "decrypt"},
    }
    
    jsonPayload, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
    req.Header.Set("Authorization", "Bearer ${token?.tokenPreview}...")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Printf("Key ID: %s\\n", result["id"])
    
    return nil
}`,
    
    java: `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

// KeyOrbit KMS Java SDK
public class KeyOrbitClient {
    private static final String BASE_URL = "https://api.keyorbit.com/v1";
    private static final String TOKEN = "${token?.tokenPreview}...";
    
    public void generateKey() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        String json = """
            {
                "name": "my-encryption-key","algorithm": "AES-256","usage": ["encrypt", "decrypt"]
            }
            """;
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/keys"))
            .header("Authorization", "Bearer " + TOKEN)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        System.out.println("Response: " + response.body());
    }
}`
  };

  // Manual UTC to IST conversion for debugging
  const formatDateManualIST = (dateString) => {
    if (!dateString) return 'Never';
    
    try {
      const istDate = manualUTCtoIST(dateString);
      if (!istDate) return 'Invalid date';
      
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(istDate);
    } catch (error) {
      console.error('Error in manual format:', error);
      return formatDateTimeIST(dateString);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="glass-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Key" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{token?.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(token?.status)}`}>
                  {token?.status}
                </span>
                <span className="text-sm text-muted-foreground">
                   {formatDateManualIST(token?.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Token Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Token Preview</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <code className="flex-1 p-3 bg-muted/30 rounded-lg text-sm font-mono text-foreground">
                        {token?.tokenPreview}...
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(token?.tokenPreview + '...', 'token')}
                      >
                        <Icon name={copiedField === 'token' ? "Check" : "Copy"} size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="mt-1 text-sm text-foreground">
                      {token?.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At (IST)</label>
                    <p className="mt-1 text-sm text-foreground">
                      {formatDateManualIST(token?.createdAt)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Used</label>
                    <p className="mt-1 text-sm text-foreground">
                      {token?.lastUsed ? formatShortDateTimeIST(token?.lastUsed) : 'Never used'}
                    </p>
                    {token?.lastUsed && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        ({formatRelativeTime(token?.lastUsed)})
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expires At (IST)</label>
                    <p className="mt-1 text-sm text-foreground">
                      {token?.expiresAt ? formatDateManualIST(token?.expiresAt) : 'Never expires'}
                    </p>
                    {token?.expiresAt && token?.status === 'active' && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {token?.expiresIn || 'No expiry information'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SDK Examples */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">SDK Integration Examples</h3>
                <div className="space-y-4">
                  {Object.entries(sdkExamples)?.map(([language, code]) => (
                    <div key={language} className="border border-border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
                        <span className="text-sm font-medium text-foreground capitalize">
                          {language === 'nodejs' ? 'Node.js' : language}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(code, language)}
                          iconName={copiedField === language ? "Check" : "Copy"}
                          iconPosition="left"
                          iconSize={14}
                        >
                          {copiedField === language ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto bg-muted/10">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Granted Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {token?.permissions?.map((permission) => (
                  <div
                    key={permission}
                    className="p-4 border border-border rounded-lg bg-success/5"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="Check" size={16} className="text-success" />
                      <div>
                        <div className="font-medium text-foreground">{permission}</div>
                        <div className="text-sm text-muted-foreground">
                          {permission === 'key:read' && 'View key metadata and public keys'}
                          {permission === 'key:write' && 'Create and update keys'}
                          {permission === 'key:delete' && 'Remove keys from the system'}
                          {permission === 'key:rotate' && 'Perform key rotation operations'}
                          {permission === 'audit:read' && 'Access audit trail information'}
                          {permission === 'admin:all' && 'Complete system administration'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Security Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Rate Limiting</h4>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-lg font-semibold text-foreground">
                      {token?.rateLimit || 1000} requests/hour
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current usage: {Math.min(token?.hourlyUsage || 0, token?.rateLimit || 1000)} requests this hour
                    </div>
                    <div className="mt-2 w-full bg-muted/30 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ 
                          width: `${Math.min(((token?.hourlyUsage || 0) / (token?.rateLimit || 1000)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">IP Restrictions</h4>
                  <div className="space-y-2">
                    {token?.ipRestrictions && token?.ipRestrictions?.length > 0 ? (
                      token?.ipRestrictions?.map((ip, index) => (
                        <div
                          key={index}
                          className="p-3 border border-border rounded-lg bg-primary/5"
                        >
                          <code className="text-sm font-mono text-foreground">{ip}</code>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 border border-border rounded-lg text-center">
                        <Icon name="Globe" size={24} className="text-muted-foreground mx-auto mb-2" />
                        <div className="text-sm text-muted-foreground">
                          No IP restrictions configured
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Recommendations */}
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="Shield" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Security Recommendations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Rotate tokens regularly (every 90 days recommended)</li>
                      <li>• Use IP restrictions for production tokens</li>
                      <li>• Monitor usage patterns for anomalies</li>
                      <li>• Set appropriate expiration dates</li>
                      {!token?.expiresAt && (
                        <li className="text-warning">• This token does not have an expiration date</li>
                      )}
                      {token?.ipRestrictions?.length === 0 && (
                        <li className="text-warning">• Consider adding IP restrictions for better security</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailsModal;