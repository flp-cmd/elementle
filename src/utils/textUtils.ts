// Function to normalize text (remove accents, convert to lowercase, remove spaces)
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, ""); // Remove all whitespace
};

// Options filter for Mantine Autocomplete with smart prioritization
export const createOptionsFilter = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ options, search }: any): any => {
    const normalizedSearch = normalizeText(search);

    // Filter options that contain the search term
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredOptions = options.filter((option: any) => {
      if (option.label) {
        const normalizedOption = normalizeText(option.label);
        return normalizedOption.includes(normalizedSearch);
      }
      return false;
    });

    // Sort options to prioritize those that start with the search term
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortedOptions = filteredOptions.sort((a: any, b: any) => {
      if (a.label && b.label) {
        const normalizedA = normalizeText(a.label);
        const normalizedB = normalizeText(b.label);

        const aStartsWith = normalizedA.startsWith(normalizedSearch);
        const bStartsWith = normalizedB.startsWith(normalizedSearch);

        // If one starts with search term and the other doesn't, prioritize the one that starts
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // If both start with search term or both don't, sort alphabetically
        return normalizedA.localeCompare(normalizedB);
      }
      return 0;
    });

    // Return only the top 5 most relevant results
    return sortedOptions.slice(0, 5);
  };
};
