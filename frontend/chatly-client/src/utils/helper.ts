export function getInitialsWithEllipsis(name: string, charCount: number): string {
  if (!name) return "";
  const trimmed = name.trim();
  
  if (charCount <= 0) return ""; // no chars requested

  if (trimmed.length <= charCount) {
    // If the name is shorter or equal to requested chars, return full name
    return trimmed;
  }

  // Take first charCount characters + "..."
  return trimmed.substring(0, charCount) + "...";
}
