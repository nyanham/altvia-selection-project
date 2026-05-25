export const defaultAppLocale = 'en-US';

export function normalizeLocale(language: string | null | undefined): string {
  const trimmedLanguage = language?.trim();

  if (!trimmedLanguage) {
    return defaultAppLocale;
  }

  if (trimmedLanguage === 'en') {
    return defaultAppLocale;
  }

  return trimmedLanguage;
}

export function getInterfaceLocale(): string {
  if (typeof document === 'undefined') {
    return defaultAppLocale;
  }

  return normalizeLocale(document.documentElement.lang);
}