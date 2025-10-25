import React from 'react';

export type SchemaType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'node'
  | 'json'
  | { type: 'custom'; ref: unknown };

export function createComponentSchema<T extends Record<string, SchemaType>>(
  schema: T,
) {
  type Props = {
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
  };

  const propsList = Object.keys(schema) as (keyof Props)[];
  return { schema, propsList };
}
