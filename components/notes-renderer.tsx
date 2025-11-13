"use client";

import ReactMarkdown from "react-markdown";

interface NotesRendererProps {
  content: string;
}

export function NotesRenderer({ content }: NotesRendererProps) {
  if (!content) return null;

  return (
    <div className="text-sm text-gray-700 prose prose-sm max-w-none">
      <ReactMarkdown
        components={{
          // Links
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            />
          ),
          // Inline code
          code: ({ node, className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            // Code block
            return (
              <code
                className={`${className} block bg-gray-900 text-gray-100 rounded-md p-3 overflow-x-auto my-2 text-sm font-mono`}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Pre (code block wrapper)
          pre: ({ node, ...props }) => (
            <pre className="bg-gray-900 rounded-md my-2" {...props} />
          ),
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mt-3 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-bold mt-2 mb-1" {...props} />
          ),
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside my-2 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside my-2 space-y-1" {...props} />
          ),
          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="my-1 leading-relaxed" {...props} />
          ),
          // Bold
          strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          // Italic
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

