import type {Language} from './i18n';

export type AnatomyTranslation = {
  en:string;
  ru:string;
  system:string;
};

export type AnatomyTranslations = Record<string,AnatomyTranslation>;

export function anatomyName(
  conceptId:string,
  englishName:string,
  language:Language,
  translations:AnatomyTranslations | null,
) {
  if (language === 'en') return englishName;

  const value=translations?.[conceptId]?.ru?.trim();
  return value || englishName;
}

export function anatomySearchText(
  conceptId:string,
  englishName:string,
  translations:AnatomyTranslations | null,
) {
  const ru=translations?.[conceptId]?.ru?.trim() ?? '';
  return `${englishName} ${ru}`.toLowerCase();
}
