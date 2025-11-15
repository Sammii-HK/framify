"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export type Style =
  | "Minimal Corporate"
  | "Dark Tech / SaaS"
  | "E-commerce Product Showcase"
  | "Creative Portfolio / Designer"
  | "Agency / Studio Bold"
  | "Grid / Magazine Editorial"
  | "Luxury / Premium Brand"
  | "Retro / Y2K"
  | "Pastel / Playful"
  | "Single-Page App / Startup Landing";

interface PromptFormProps {
  onGenerate?: (data: {
    id: string;
    code: string;
    title: string;
    style: string;
  }) => void;
  initialPrompt?: string;
  initialStyle?: Style;
}

interface TemplateInput {
  prompt: string;
  style?: Style;
  title?: string;
}

export default function PromptForm({
  onGenerate,
  initialPrompt = "",
  initialStyle,
}: PromptFormProps) {
  const [inputMode, setInputMode] = useState<"text" | "json">("text");
  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState<Style>(
    initialStyle || "Minimal Corporate"
  );
  const [jsonInput, setJsonInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update form when initial values change (e.g., from URL params)
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
    if (initialStyle) {
      setStyle(initialStyle);
    }
  }, [initialPrompt, initialStyle]);

  const copyPromptTemplate = () => {
    const template = `You are helping create Framer website templates. Generate a JSON array of template prompts based on the following requirements:

Template Structure:
- Each template needs a "prompt" field (detailed description of the website/template)
- Optional "style" field: Choose from 10 styles (defaults to "Minimal Corporate" if not specified)
  Available styles: "Minimal Corporate", "Dark Tech / SaaS", "E-commerce Product Showcase", "Creative Portfolio / Designer", "Agency / Studio Bold", "Grid / Magazine Editorial", "Luxury / Premium Brand", "Retro / Y2K", "Pastel / Playful", "Single-Page App / Startup Landing"
- Optional "title" field: A short title for the template

Requirements for prompts:
- Be specific about the type of website (landing page, portfolio, SaaS, e-commerce, etc.)
- Include design elements (hero section, features, testimonials, CTAs, etc.)
- Mention the target audience or industry
- Describe the desired aesthetic and user experience

Example output format:
[
  {
    "prompt": "A corporate landing page for a B2B SaaS company with clean typography, professional color scheme, hero section with value proposition, features section, testimonials, and pricing CTA",
    "style": "Minimal Corporate",
    "title": "B2B SaaS Landing"
  },
  {
    "prompt": "Dark-themed tech product page for a developer tool with sleek UI, code examples, feature highlights, and sign-up CTA",
    "style": "Dark Tech / SaaS",
    "title": "Developer Tool Landing"
  },
  {
    "prompt": "E-commerce product page for a fashion brand with large product images, size selector, reviews section, related products, and add to cart functionality",
    "style": "E-commerce Product Showcase",
    "title": "Fashion Product Page"
  }
]

Now generate JSON templates for: [describe what types of templates you want to create]`;

    navigator.clipboard.writeText(template).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const parseJsonInput = (jsonStr: string): TemplateInput | TemplateInput[] => {
    try {
      const parsed = JSON.parse(jsonStr);

      // Check if it's an array
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          prompt: item.prompt || item.description || "",
          style: item.style || "Minimal Corporate",
          title: item.title || undefined,
        }));
      }

      // Single object
      return {
        prompt: parsed.prompt || parsed.description || "",
        style: parsed.style || "Minimal Corporate",
        title: parsed.title || undefined,
      };
    } catch (err) {
      throw new Error("Invalid JSON format");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);
    setError(null);

    try {
      let templatesToGenerate: TemplateInput[] = [];

      if (inputMode === "json") {
        if (!jsonInput.trim()) {
          setError("Please enter JSON");
          setIsGenerating(false);
          return;
        }

        const parsed = parseJsonInput(jsonInput);
        templatesToGenerate = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        if (!prompt.trim()) {
          setError("Please enter a prompt");
          setIsGenerating(false);
          return;
        }
        templatesToGenerate = [{ prompt, style: style || "Minimal Corporate" }];
      }

      // Generate templates sequentially
      for (const template of templatesToGenerate) {
        if (!template.prompt.trim()) {
          setError(`Template missing prompt`);
          continue;
        }

        const response = await fetch("/api/generate-template", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: template.prompt,
            style: template.style || "Minimal",
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          if (response.status === 401) {
            window.location.href = "/auth/login";
            return;
          }
          throw new Error(data.error || "Failed to generate template");
        }

        const data = await response.json();

        if (onGenerate) {
          onGenerate({
            id: data.id,
            code: data.code,
            title: data.title,
            style: data.style,
          });
        }

        // Show success message
        if (data.id) {
          setSuccessMessage(
            `✅ Template "${data.title}" created successfully! View it in your dashboard.`
          );
          setTimeout(() => setSuccessMessage(null), 5000);
        }
      }

      // Clear inputs after successful generation
      if (inputMode === "json") {
        setJsonInput("");
      } else {
        setPrompt("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border"
    >
      <h2 className="text-2xl font-semibold mb-6 text-framer-text">
        Describe Your Template
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setInputMode("text")}
            className={`flex-1 px-4 py-2 rounded-framer text-sm font-medium transition-all ${
              inputMode === "text"
                ? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Text Input
          </button>
          <button
            type="button"
            onClick={() => setInputMode("json")}
            className={`flex-1 px-4 py-2 rounded-framer text-sm font-medium transition-all ${
              inputMode === "json"
                ? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            JSON Input
          </button>
        </div>

        {inputMode === "text" ? (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-gray-700"
                >
                  What kind of template do you want?
                </label>
                <button
                  type="button"
                  onClick={copyPromptTemplate}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-sky-600 bg-sky-50 rounded-framer hover:bg-sky-100 transition-all"
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy Prompt for AI
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A minimalist landing page for an astrology coach with clean typography and subtle animations"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all resize-none"
                disabled={isGenerating}
              />
            </div>

            <div>
              <label
                htmlFor="style"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Design Style
              </label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value as Style)}
                className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all bg-white"
                disabled={isGenerating}
              >
                <option value="Minimal Corporate">Minimal Corporate</option>
                <option value="Dark Tech / SaaS">Dark Tech / SaaS</option>
                <option value="E-commerce Product Showcase">
                  E-commerce Product Showcase
                </option>
                <option value="Creative Portfolio / Designer">
                  Creative Portfolio / Designer
                </option>
                <option value="Agency / Studio Bold">
                  Agency / Studio Bold
                </option>
                <option value="Grid / Magazine Editorial">
                  Grid / Magazine Editorial
                </option>
                <option value="Luxury / Premium Brand">
                  Luxury / Premium Brand
                </option>
                <option value="Retro / Y2K">Retro / Y2K</option>
                <option value="Pastel / Playful">Pastel / Playful</option>
                <option value="Single-Page App / Startup Landing">
                  Single-Page App / Startup Landing
                </option>
              </select>
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="json-input"
                className="block text-sm font-medium text-gray-700"
              >
                JSON Template(s)
              </label>
              <button
                type="button"
                onClick={copyPromptTemplate}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-sky-600 bg-sky-50 rounded-framer hover:bg-sky-100 transition-all"
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Prompt for AI
                  </>
                )}
              </button>
            </div>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`Single template:
{
  "prompt": "A corporate landing page for a B2B SaaS company",
  "style": "Minimal Corporate"
}

Multiple templates:
[
  {
    "prompt": "Dark-themed tech product page",
    "style": "Dark Tech / SaaS"
  },
  {
    "prompt": "E-commerce product showcase page",
    "style": "E-commerce Product Showcase"
  }
]`}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
              disabled={isGenerating}
            />
            <p className="mt-2 text-xs text-gray-500">
              💡 Tip: Click &quot;Copy Prompt for AI&quot; to get a template you
              can paste into ChatGPT/Claude to help generate the JSON. You can
              paste a single template object or an array of templates. Each
              template needs a &quot;prompt&quot; field. &quot;style&quot; is
              optional (defaults to &quot;Minimal Corporate&quot;). Available
              styles: Minimal Corporate, Dark Tech / SaaS, E-commerce Product
              Showcase, Creative Portfolio / Designer, Agency / Studio Bold,
              Grid / Magazine Editorial, Luxury / Premium Brand, Retro / Y2K,
              Pastel / Playful, Single-Page App / Startup Landing.
            </p>
          </div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border border-green-200 rounded-framer"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-800">{successMessage}</p>
              <Link
                href="/dashboard"
                className="text-sm text-green-700 hover:text-green-900 underline font-medium ml-4"
              >
                View Dashboard →
              </Link>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-50 border border-red-200 rounded-framer text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={
            isGenerating ||
            (inputMode === "text" ? !prompt.trim() : !jsonInput.trim())
          }
          whileHover={{ scale: isGenerating ? 1 : 1.02 }}
          whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-medium rounded-framer-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Generating...</span>
            </>
          ) : inputMode === "json" ? (
            "Generate from JSON"
          ) : (
            "Generate Template"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
