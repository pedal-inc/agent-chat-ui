import { AIMessage, ToolMessage } from "@langchain/langgraph-sdk";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MarkdownText } from "../markdown-text";

function isComplexValue(value: any): boolean {
  return Array.isArray(value) || (typeof value === "object" && value !== null);
}

export function ToolCalls({
  toolCalls,
}: {
  toolCalls: AIMessage["tool_calls"];
}) {
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2">
      {toolCalls.map((tc, idx) => {
        const args = tc.args as Record<string, any>;
        const hasArgs = Object.keys(args).length > 0;
        return (
          <div
            key={idx}
            className="overflow-hidden rounded-lg border border-gray-200"
          >
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
              <h3 className="font-medium text-gray-900">
                {tc.name}
                {tc.id && (
                  <code className="ml-2 rounded bg-gray-100 px-2 py-1 text-sm">
                    {tc.id}
                  </code>
                )}
              </h3>
            </div>
            {hasArgs ? (
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(args).map(([key, value], argIdx) => (
                    <tr key={argIdx}>
                      <td className="px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900">
                        {key}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {isComplexValue(value) ? (
                          <code className="rounded bg-gray-50 px-2 py-1 font-mono text-sm break-all">
                            {JSON.stringify(value, null, 2)}
                          </code>
                        ) : (
                          String(value)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <code className="block p-3 text-sm">{"{}"}</code>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ToolResult({ message }: { message: ToolMessage }) {
  // Check if this is a visualize_molecule tool result with artifact data
  const isVisualizeMolecule = message?.name === "visualize_molecule";
  const hasArtifact =
    (message as any)?.artifact &&
    Array.isArray((message as any).artifact) &&
    (message as any).artifact.length > 0;

  if (isVisualizeMolecule && hasArtifact) {
    const artifacts = (message as any).artifact;

    return (
      <div className="mt-2 rounded border bg-gray-50 p-3">
        <div className="mb-2 text-sm font-medium text-gray-700">
          🧬 Molecule Visualization
        </div>
        <div className="space-y-2">
          {artifacts.map((artifact: any, idx: number) => {
            if (artifact.type === "image" && artifact.data) {
              // Check if it's base64 PNG data
              const isBase64Png = artifact.data.startsWith("iVBORw0KGg");
              const imageSrc = isBase64Png
                ? `data:image/png;base64,${artifact.data}`
                : artifact.data;

              return (
                <div
                  key={idx}
                  className="rounded border bg-white p-4 shadow-sm"
                >
                  <img
                    src={imageSrc}
                    alt="Molecule Visualization"
                    className="mx-auto h-auto max-w-full rounded"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  // Default display for other tool results
  const resultString =
    typeof message.content === "string"
      ? message.content
      : JSON.stringify(message.content);
  return (
    <div className="mt-2 rounded border bg-gray-50 p-3">
      <div className="mb-2 text-sm font-medium text-gray-700">
        Result from {message.name}
      </div>
      <div className="text-sm text-gray-700">
        <MarkdownText>{resultString}</MarkdownText>
      </div>
    </div>
  );
}
