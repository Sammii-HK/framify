import React from 'react';

interface ItemCardProps {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  style?: string;
  componentType?: string;
  tags?: string[];
  onClick: () => void;
  isLoading?: boolean;
}

export function ItemCard({
  id,
  title,
  description,
  thumbnailUrl,
  style,
  componentType,
  tags,
  onClick,
  isLoading = false,
}: ItemCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        backgroundColor: '#fff',
        transition: 'all 0.2s',
        opacity: isLoading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {thumbnailUrl && (
        <div
          style={{
            width: '100%',
            height: '120px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            marginBottom: '8px',
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <h3
        style={{
          margin: '0 0 4px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#333',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            margin: '0 0 8px 0',
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>
      )}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {style && (
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              color: '#666',
            }}
          >
            {style}
          </span>
        )}
        {componentType && (
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              backgroundColor: '#e3f2fd',
              borderRadius: '4px',
              color: '#1976d2',
            }}
          >
            {componentType}
          </span>
        )}
      </div>
      {isLoading && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#1976d2',
            textAlign: 'center',
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
}

