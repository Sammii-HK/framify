/**
 * Framer Plugin UI
 * This is the React UI that users interact with
 */

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TemplateList } from './components/TemplateList';
import { ComponentList } from './components/ComponentList';

function App() {
  const [activeTab, setActiveTab] = useState<'templates' | 'components'>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Listen for messages from plugin code
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.pluginMessage) {
        const msg = event.data.pluginMessage;
        if (msg.type === 'insert-success') {
          setMessage({ type: 'success', text: msg.message });
          setTimeout(() => setMessage(null), 3000);
        } else if (msg.type === 'insert-error') {
          setMessage({ type: 'error', text: msg.error });
          setTimeout(() => setMessage(null), 5000);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSelectTemplate = (templateId: string) => {
    // Send message to plugin code to insert template
    parent.postMessage(
      {
        pluginMessage: {
          type: 'insert-template',
          id: templateId,
        },
      },
      '*'
    );
  };

  const handleSelectComponent = (componentId: string) => {
    // Send message to plugin code to insert component
    parent.postMessage(
      {
        pluginMessage: {
          type: 'insert-component',
          id: componentId,
        },
      },
      '*'
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <h1
          style={{
            margin: '0 0 12px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          Framify
        </h1>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
        }}
      >
        <button
          onClick={() => setActiveTab('templates')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            backgroundColor: activeTab === 'templates' ? '#fff' : 'transparent',
            borderBottom: activeTab === 'templates' ? '2px solid #1976d2' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'templates' ? '600' : '400',
            color: activeTab === 'templates' ? '#1976d2' : '#666',
          }}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('components')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            backgroundColor: activeTab === 'components' ? '#fff' : 'transparent',
            borderBottom: activeTab === 'components' ? '2px solid #1976d2' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === 'components' ? '600' : '400',
            color: activeTab === 'components' ? '#1976d2' : '#666',
          }}
        >
          Components
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee',
            color: message.type === 'success' ? '#2e7d32' : '#c62828',
            fontSize: '14px',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'templates' ? (
          <TemplateList onSelectTemplate={handleSelectTemplate} searchQuery={searchQuery} />
        ) : (
          <ComponentList onSelectComponent={handleSelectComponent} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}

// Initialize React app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

