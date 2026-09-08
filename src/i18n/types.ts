export type LanguageCode = 'es' | 'qu';

type Primitive = string;

export type MessagePaths<T> = T extends Primitive
  ? never
  : {
      [K in keyof T & string]: T[K] extends Primitive
        ? K
        : T[K] extends Record<string, unknown>
          ? `${K}.${MessagePaths<T[K]>}`
          : K;
    }[keyof T & string];

export interface QuechuaMeta {
  variant: string;
  variantNote: string;
  validatedBy: string | null;
  validatedAt: string | null;
  status: 'pending_validation' | 'validated';
}

export type InterpolationVars = Record<string, string | number>;
