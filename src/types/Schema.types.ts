import React from 'react';

export type SchemaType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'node'
  | 'json'
  | { type: 'custom'; ref: unknown; webComponentType?: WebComponentPropType };

export type WebComponentPropType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'json'
  | 'function'
  | 'method'
  | 'property';

export type WebComponentPropsDefinition<
  T extends Record<string, SchemaType>,
> = Partial<Record<keyof T, Exclude<WebComponentPropType, 'property'> | undefined>>;

export type InferPropsFromSchema<T extends Record<string, SchemaType>> =
  Partial<{
    [K in keyof T]: T[K] extends 'string'
      ? string
      : T[K] extends 'boolean'
        ? boolean
        : T[K] extends 'number'
          ? number
          : T[K] extends 'node'
            ? React.ReactNode
            : T[K] extends 'json'
              ? Record<string, unknown>
              : T[K] extends { type: 'custom'; ref: infer U }
                ? U
                : never;
  }>;

export function createPropsList<T extends Record<string, SchemaType>>(
  schema: T,
) {
  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [
      key,
      getWebComponentPropType(value),
    ]),
  ) as WebComponentPropsDefinition<T>;
}

const getWebComponentPropType = (
  schemaType: SchemaType,
): Exclude<WebComponentPropType, 'property'> | undefined => {
  if (schemaType === 'node') return 'string';
  if (typeof schemaType === 'string') return schemaType;
  if (schemaType.webComponentType === 'property') return undefined;
  return schemaType.webComponentType ?? 'string';
};
