import { describe, expect, it } from 'vitest';
import { createPropsList } from './Schema.types';

describe('Schema.types', () => {
  it('Should map schema entries to web component prop definitions', () => {
    const props = createPropsList({
      label: 'string',
      checked: 'boolean',
      count: 'number',
      content: 'node',
      payload: 'json',
      color: { type: 'custom', ref: {} as 'primary' | 'secondary' },
      items: {
        type: 'custom',
        ref: [] as { label: string }[],
        webComponentType: 'property',
      },
    });

    expect(props).toEqual({
      label: 'string',
      checked: 'boolean',
      count: 'number',
      content: 'string',
      payload: 'json',
      color: 'string',
      items: undefined,
    });
  });
});
