import React from 'react';

export type SchemaType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'node'
  | 'json'
  | { type: 'custom'; ref: unknown };

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
  return Object.keys(schema) as (keyof T)[];
}
