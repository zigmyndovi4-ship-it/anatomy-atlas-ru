import type {Language} from './i18n';

export type AnatomyTranslation = {
  en:string;
  ru:string;
  system:string;
  aliases?:string[];
};

export type AnatomyTranslations = Record<string,AnatomyTranslation>;

export function normalizeSearchQuery(value:string) {
  return value.normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase().replaceAll('ё','е');
}

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
  const entry=translations?.[conceptId];
  const ru=entry?.ru?.trim() ?? '';
  const aliases=entry?.aliases?.join(' ') ?? '';

  return normalizeSearchQuery(`${englishName} ${ru} ${aliases}`);
}
