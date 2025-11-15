"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ComponentExtractor from "@/components/ComponentExtractor";

export default function ExtractPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.id as string;
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [detectedComponents, setDetectedComponents] = useState<any[]>([]);

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
      detectComponents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    } finally {
      setLoading(false);
    }
  };

  const detectComponents = async () => {
    try {
      const response = await fetch(
        `/api/components/extract?templateId=${templateId}`
      );
      if (response.ok) {
        const data = await response.json();
        setDetectedComponents(data.components || []);
      }
    } catch (error) {
      console.error("Error detecting components:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Template not found</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/template/${templateId}`)}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Template
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Extract Components
          </h1>
          <p className="text-gray-600">
            Extract reusable components from &quot;{template.title}&quot; to
            sell separately
          </p>
        </div>

        <ComponentExtractor
          template={template}
          detectedComponents={detectedComponents}
          onExtract={async (component) => {
            // Component extracted, refresh
            detectComponents();
          }}
        />
      </div>
    </main>
  );
}
