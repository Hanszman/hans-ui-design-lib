import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

const echartsMocks = vi.hoisted(() => {
  const mockSetOption = vi.fn();
  const mockInit = vi.fn(() => ({
    setOption: mockSetOption,
    resize: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }));

  return {
    mockSetOption,
    mockInit,
  };
});

vi.mock('echarts', () => ({
  init: echartsMocks.mockInit,
}));

vi.mock('./helpers/Chart.helper', async () => {
  const actual = await vi.importActual<typeof import('./helpers/Chart.helper')>(
    './helpers/Chart.helper',
  );

  return {
    ...actual,
    isPieLikeType: vi.fn(() => true),
    hasPieSeries: vi.fn(() => true),
    buildPieSeries: vi.fn(() => [
      {
        type: 'pie',
        name: 'Primary',
        radius: '70%',
        avoidLabelOverlap: true,
        data: [{ name: 'A', value: 10 }],
        label: { show: true, position: 'outside' },
        emphasis: { focus: 'none', scale: false, itemStyle: { opacity: 1 } },
        select: { disabled: true },
        blur: { itemStyle: { opacity: 1 } },
      },
      {
        type: 'line',
        name: 'Fallback',
        data: [2],
        smooth: false,
        emphasis: { focus: 'none', scale: false, itemStyle: { opacity: 1 } },
        select: { disabled: true },
        blur: { itemStyle: { opacity: 1 } },
      },
    ]),
  };
});

import { HansChart } from './Chart';

describe('HansChart pie-like fallback branch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should keep non-pie series untouched when pie-like charts are normalized', () => {
    render(
      <HansChart
        chartType="mixed"
        categories={['A']}
        series={[{ name: 'Primary', type: 'pie', data: [10] }]}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];

    expect(option.tooltip.trigger).toBe('item');
    expect(option.series).toHaveLength(2);
    expect(option.series[0]).toMatchObject({ type: 'pie', center: ['50%', '42%'] });
    expect(option.series[1]).toMatchObject({ type: 'line', name: 'Fallback' });
  });
});
