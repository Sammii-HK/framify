import React, { useState, useEffect } from 'react';
import { fetchTemplates, type Template } from '../utils/api';
import { ItemCard } from './ItemCard';

interface TemplateListProps {
  onSelectTemplate: (templateId: string) => void;
  searchQuery?: string;
}

export function TemplateList({ onSelectTemplate, searchQuery = '' }: TemplateListProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTemplates({ limit: 50 });
      setTemplates(data.templates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (templateId: string) => {
    setLoadingTemplateId(templateId);
    onSelectTemplate(templateId);
  };

  const filteredTemplates = searchQuery
    ? templates.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : templates;

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Loading templates...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#d32f2f' }}>
        <p>Error: {error}</p>
        <button
          onClick={loadTemplates}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredTemplates.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        {searchQuery ? 'No templates found matching your search.' : 'No templates available.'}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        padding: '16px',
      }}
    >
      {filteredTemplates.map((template) => (
        <ItemCard
          key={template.id}
          id={template.id}
          title={template.title}
          description={template.description}
          thumbnailUrl={template.thumbnailUrl}
          style={template.style}
          tags={template.tags}
          onClick={() => handleTemplateClick(template.id)}
          isLoading={loadingTemplateId === template.id}
        />
      ))}
    </div>
  );
}

