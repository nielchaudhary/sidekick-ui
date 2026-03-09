/**
 * Pre-parser sanitizer for incomplete Markdown during streaming.
 * Appends synthetic closing tokens for unclosed syntax to prevent
 * broken rendering while the LLM is still generating tokens.
 */
export function sanitizeStreamingMarkdown(content: string): string {
  let sanitized = content;

  // Fix unclosed fenced code blocks (odd number of ``` fences)
  const fenceMatches = sanitized.match(/^```/gm);
  if (fenceMatches && fenceMatches.length % 2 !== 0) {
    sanitized += "\n```";
  }

  // Fix unclosed bold markers
  const boldMatches = sanitized.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 !== 0) {
    sanitized += "**";
  }

  // Fix unclosed italic markers (single *)
  // Exclude ** pairs and * inside words
  const stripped = sanitized.replace(/\*\*/g, "");
  const italicMatches = stripped.match(/(?<!\w)\*(?!\*)/g);
  if (italicMatches && italicMatches.length % 2 !== 0) {
    sanitized += "*";
  }

  // Fix unclosed inline code
  const backtickMatches = sanitized.match(/(?<!`)`(?!`)/g);
  if (backtickMatches && backtickMatches.length % 2 !== 0) {
    sanitized += "`";
  }

  // Fix unclosed inline math (single $, not $$)
  const strippedBlock = sanitized.replace(/\$\$/g, "");
  const mathMatches = strippedBlock.match(/(?<!\$)\$(?!\$)/g);
  if (mathMatches && mathMatches.length % 2 !== 0) {
    sanitized += "$";
  }

  // Fix unclosed block math ($$)
  const blockMathMatches = sanitized.match(/\$\$/g);
  if (blockMathMatches && blockMathMatches.length % 2 !== 0) {
    sanitized += "$$";
  }

  return sanitized;
}
