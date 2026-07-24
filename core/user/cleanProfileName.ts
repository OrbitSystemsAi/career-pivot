export function cleanProfileName(value: string) {
  const cleaned = value
    .replace(
      /\s+(?:mobile|cell|phone|telephone|tel)\s*:?\s*.*$/i,
      "",
    )
    .trim();

  return cleaned || value.trim();
}
