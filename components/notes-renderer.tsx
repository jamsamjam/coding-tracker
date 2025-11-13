"use client";

import React from "react";

interface NotesRendererProps {
  content: string;
}

export function NotesRenderer({ content }: NotesRendererProps) {
  const renderContent = () => {
    const lines = content.split("\n");
    const elements: React.ReactElement[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check for code block (```)
      if (line.trim().startsWith("```")) {
        const language = line.trim().slice(3).trim() || "plaintext";
        const codeLines: string[] = [];
        i++;

        // Collect code block lines
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }

        // Add code block element
        elements.push(
          <pre
            key={`code-${elements.length}`}
            className="bg-gray-900 text-gray-100 rounded-md p-3 overflow-x-auto my-2"
          >
            <code className="text-sm font-mono">{codeLines.join("\n")}</code>
          </pre>
        );
        i++; // Skip closing ```
        continue;
      }

      // Process inline code and text
      const processedLine = processInlineCode(line);
      elements.push(
        <div key={`line-${elements.length}`} className="leading-relaxed">
          {processedLine}
        </div>
      );
      i++;
    }

    return elements;
  };

  const processInlineCode = (text: string) => {
    const parts: (string | React.ReactElement)[] = [];
    let currentIndex = 0;
    let inCode = false;
    let codeStart = -1;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === "`") {
        if (!inCode) {
          // Start of code
          if (currentIndex < i) {
            parts.push(text.slice(currentIndex, i));
          }
          codeStart = i + 1;
          inCode = true;
        } else {
          // End of code
          const codeContent = text.slice(codeStart, i);
          parts.push(
            <code
              key={`inline-${parts.length}`}
              className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-sm font-mono"
            >
              {codeContent}
            </code>
          );
          currentIndex = i + 1;
          inCode = false;
        }
      }
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  if (!content) return null;

  return (
    <div className="text-sm text-gray-700 whitespace-pre-wrap">
      {renderContent()}
    </div>
  );
}

