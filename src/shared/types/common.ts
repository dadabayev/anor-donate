export enum Locales {
  ru = 'ru',
  uz = 'uz',
  en = 'en',
}

export type TFunction = (key: string) => string

export type LocaleBasedData<T> = Record<Locales, T>
