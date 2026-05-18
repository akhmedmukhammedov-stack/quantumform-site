/**
 * Minimal renderer for Payload's Lexical rich-text JSON.
 * Supports headings, paragraphs, lists, blockquotes, bold/italic, links.
 */
import React from "react";

type Node = {
  type?: string;
  tag?: string;
  format?: number | string;
  text?: string;
  url?: string;
  children?: Node[];
};

type Doc = { root?: Node };

function renderNode(node: Node, key: string | number): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return <p key={key}>{node.children?.map((c, i) => renderNode(c, i))}</p>;
    case "heading": {
      const level = (node.tag as string) || "h2";
      return React.createElement(
        level,
        { key },
        node.children?.map((c, i) => renderNode(c, i)),
      );
    }
    case "list": {
      const tag = node.tag === "ol" ? "ol" : "ul";
      return React.createElement(
        tag,
        { key },
        node.children?.map((c, i) => renderNode(c, i)),
      );
    }
    case "listitem":
      return <li key={key}>{node.children?.map((c, i) => renderNode(c, i))}</li>;
    case "quote":
      return (
        <blockquote key={key}>{node.children?.map((c, i) => renderNode(c, i))}</blockquote>
      );
    case "link":
      return (
        <a key={key} href={node.url} target="_blank" rel="noopener">
          {node.children?.map((c, i) => renderNode(c, i))}
        </a>
      );
    case "text": {
      const fmt = typeof node.format === "number" ? node.format : 0;
      let el: React.ReactNode = node.text ?? "";
      if (fmt & 1) el = <strong>{el}</strong>;
      if (fmt & 2) el = <em>{el}</em>;
      if (fmt & 8) el = <u>{el}</u>;
      return <React.Fragment key={key}>{el}</React.Fragment>;
    }
    default:
      return node.children?.map((c, i) => renderNode(c, `${key}-${i}`));
  }
}

export function LexicalRender({ doc }: { doc: Doc | unknown }) {
  if (!doc || typeof doc !== "object") return null;
  const root = (doc as Doc).root;
  if (!root) return null;
  return <>{root.children?.map((c, i) => renderNode(c, i))}</>;
}
