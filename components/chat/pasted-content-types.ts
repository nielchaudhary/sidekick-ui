export interface PasteEntry {
  id: string;
  text: string;
  label: string;
  wordCount: number;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function createPasteEntry(
  text: string,
  index: number
): PasteEntry {
  return {
    id: crypto.randomUUID(),
    text,
    label: `Paste ${index + 1}`,
    wordCount: countWords(text),
  };
}
