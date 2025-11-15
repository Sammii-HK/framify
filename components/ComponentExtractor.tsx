"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ComponentExtractorProps {
  template: {
    id: string;
    title: string;
    code: string;
    style: string;
    category?: string;
  };
  detectedComponents: Array<{
    name: string;
    startLine: number;
    endLine: number;
  }>;
  onExtract: (component: any) => void;
}

export default function ComponentExtractor({
  template,
  detectedComponents,
  onExtract,
}: ComponentExtractorProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (
    componentName: string,
    startLine: number,
    endLine: number
  ) => {
    setExtracting(true);
    setError(null);
    setExtracted(null);

    try {
      const response = await fetch("/api/components/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: template.id,
          componentName,
          code: template.code,
          startLine,
          endLine,
          style: template.style,
          category: template.category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract component");
      }

      setExtracted(data.component);
      onExtract(data.component);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to extract component"
      );
    } finally {
      setExtracting(false);
    }
  };

  const getComponentCode = (startLine: number, endLine: number) => {
    const lines = template.code.split("\n");
    return lines.slice(startLine - 1, endLine).join("\n");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Component List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Detected Components</h2>
          {detectedComponents.length === 0 ? (
            <p className="text-gray-600 text-sm">
              No components detected. You can manually select code to extract.
            </p>
          ) : (
            <div className="space-y-2">
              {detectedComponents.map((comp, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedComponent(comp.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    selectedComponent === comp.name
                      ? "border-sky-400 bg-sky-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">{comp.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Lines {comp.startLine}-{comp.endLine}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code Viewer and Extraction */}
      <div className="lg:col-span-2 space-y-6">
        {/* Code Preview */}
        {selectedComponent && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {selectedComponent}
              </h3>
            </div>
            <div className="overflow-auto" style={{ maxHeight: "400px" }}>
              <SyntaxHighlighter
                language="tsx"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                }}
                showLineNumbers
              >
                {(() => {
                  const comp = detectedComponents.find(
                    (c) => c.name === selectedComponent
                  );
                  return comp
                    ? getComponentCode(comp.startLine, comp.endLine)
                    : "";
                })()}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {/* Extract Button */}
        {selectedComponent && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Extract Component
            </h3>
            {extracted ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium mb-2">
                    ✓ Component extracted successfully!
                  </p>
                  <p className="text-sm text-green-700 mb-4">
                    {extracted.name} has been saved with auto-generated
                    metadata.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {extracted.componentType}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> $
                      {extracted.price}
                    </div>
                    <div>
                      <span className="font-medium">Tags:</span>{" "}
                      {extracted.tags?.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/components/${extracted.id}`}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all text-center"
                  >
                    View Component
                  </a>
                  <button
                    onClick={() => {
                      setSelectedComponent(null);
                      setExtracted(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    Extract Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Extract this component with auto-generated description, tags,
                  and pricing.
                </p>
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
                <button
                  onClick={() => {
                    const comp = detectedComponents.find(
                      (c) => c.name === selectedComponent
                    );
                    if (comp) {
                      handleExtract(comp.name, comp.startLine, comp.endLine);
                    }
                  }}
                  disabled={extracting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {extracting ? "Extracting..." : "Extract Component"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!selectedComponent && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              How to Extract Components
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Select a detected component from the list, or</li>
              <li>Manually select code in the template viewer</li>
              <li>
                Click &quot;Extract Component&quot; to create a standalone
                component
              </li>
              <li>Component will be saved with auto-generated metadata</li>
              <li>You can then publish it to the component marketplace</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
