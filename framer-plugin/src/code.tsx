/**
 * Framer Plugin Code
 * This file runs in the Framer editor context
 * 
 * Note: Framer plugin API may vary. This is a basic implementation.
 * You may need to adjust based on the actual Framer Plugin API.
 */

// API base URL - should match your deployed Framify instance
const API_BASE_URL = 'https://framify-nine.vercel.app';

async function fetchTemplateCode(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/plugin/templates/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch template: ${response.statusText}`);
  }
  return response.json();
}

async function fetchComponentCode(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/plugin/components/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch component: ${response.statusText}`);
  }
  return response.json();
}

// Message handler for communication with UI
// This will be called when the UI sends messages
if (typeof window !== 'undefined') {
  window.addEventListener('message', async (event) => {
    // Only process messages from our plugin
    if (event.data.pluginMessage) {
      const msg = event.data.pluginMessage;
      
      if (msg.type === 'insert-template') {
        try {
          const { id } = msg;
          
          // Fetch template code from API
          const template = await fetchTemplateCode(id);
          
          // Insert code component into Framer
          // Note: This API call may need to be adjusted based on actual Framer Plugin API
          // The method name and parameters may differ
          if (typeof framer !== 'undefined' && framer.addCodeComponent) {
            await framer.addCodeComponent({
              name: template.title,
              code: template.code,
            });
          } else {
            // Fallback: post message back to parent (Framer editor)
            window.parent.postMessage({
              type: 'framer-plugin',
              action: 'addCodeComponent',
              data: {
                name: template.title,
                code: template.code,
              },
            }, '*');
          }
          
          // Send success message back to UI
          window.postMessage({
            pluginMessage: {
              type: 'insert-success',
              message: `Template "${template.title}" inserted successfully!`,
            },
          }, '*');
        } catch (error) {
          window.postMessage({
            pluginMessage: {
              type: 'insert-error',
              error: error instanceof Error ? error.message : 'Failed to insert template',
            },
          }, '*');
        }
      }
      
      if (msg.type === 'insert-component') {
        try {
          const { id } = msg;
          
          // Fetch component code from API
          const component = await fetchComponentCode(id);
          
          // Insert code component into Framer
          if (typeof framer !== 'undefined' && framer.addCodeComponent) {
            await framer.addCodeComponent({
              name: component.name,
              code: component.code,
            });
          } else {
            // Fallback: post message back to parent (Framer editor)
            window.parent.postMessage({
              type: 'framer-plugin',
              action: 'addCodeComponent',
              data: {
                name: component.name,
                code: component.code,
              },
            }, '*');
          }
          
          // Send success message back to UI
          window.postMessage({
            pluginMessage: {
              type: 'insert-success',
              message: `Component "${component.name}" inserted successfully!`,
            },
          }, '*');
        } catch (error) {
          window.postMessage({
            pluginMessage: {
              type: 'insert-error',
              error: error instanceof Error ? error.message : 'Failed to insert component',
            },
          }, '*');
        }
      }
    }
  });
}

