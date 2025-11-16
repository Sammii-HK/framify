import React, { useState, useEffect } from 'react';
import { fetchComponents, type Component } from '../utils/api';
import { ItemCard } from './ItemCard';

interface ComponentListProps {
  onSelectComponent: (componentId: string) => void;
  searchQuery?: string;
}

export function ComponentList({ onSelectComponent, searchQuery = '' }: ComponentListProps) {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingComponentId, setLoadingComponentId] = useState<string | null>(null);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComponents({ limit: 50 });
      setComponents(data.components);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load components');
    } finally {
      setLoading(false);
    }
  };

  const handleComponentClick = (componentId: string) => {
    setLoadingComponentId(componentId);
    onSelectComponent(componentId);
  };

  const filteredComponents = searchQuery
    ? components.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : components;

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Loading components...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#d32f2f' }}>
        <p>Error: {error}</p>
        <button
          onClick={loadComponents}
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

  if (filteredComponents.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        {searchQuery ? 'No components found matching your search.' : 'No components available.'}
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
      {filteredComponents.map((component) => (
        <ItemCard
          key={component.id}
          id={component.id}
          title={component.name}
          description={component.description}
          thumbnailUrl={component.thumbnailUrl}
          componentType={component.componentType}
          tags={component.tags}
          onClick={() => handleComponentClick(component.id)}
          isLoading={loadingComponentId === component.id}
        />
      ))}
    </div>
  );
}

