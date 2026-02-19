import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansChart } from './Chart';

const echartsMocks = vi.hoisted(() => {
  const mockSetOption = vi.fn();
  const mockResize = vi.fn();
  const mockDispose = vi.fn();
  const mockOn = vi.fn();
  const mockOff = vi.fn();
  const mockInit = vi.fn(() => ({
    setOption: mockSetOption,
    resize: mockResize,
    dispose: mockDispose,
    on: mockOn,
    off: mockOff,
  }));

  return {
    mockSetOption,
    mockResize,
    mockDispose,
    mockOn,
    mockOff,
    mockInit,
  };
});

vi.mock('echarts', () => ({
  init: echartsMocks.mockInit,
}));

describe('HansChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render empty state when no series is provided', () => {
    render(<HansChart title="Empty" series={[]} emptyText="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(echartsMocks.mockInit).not.toHaveBeenCalled();
  });

  it('Should initialize chart and set line option', () => {
    render(
      <HansChart
        chartType="line"
        categories={['Jan', 'Feb']}
        series={[
          {
            name: 'Revenue',
            type: 'line',
            data: [10, 20],
            smooth: true,
            label: { position: 'horizontal', formatter: '{c}' },
          },
        ]}
        colors={['primary']}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(echartsMocks.mockInit).toHaveBeenCalledTimes(1);
    expect(option.color).toEqual(['#8257e5']);
    expect(option.xAxis.data).toEqual(['Jan', 'Feb']);
    expect(option.series[0]).toMatchObject({
      name: 'Revenue',
      type: 'line',
      data: [10, 20],
      smooth: true,
      label: { show: true, position: 'top', rotate: 0, formatter: '{c}' },
    });
  });

  it('Should create bar option with overrides and keep bar visible on hover', () => {
    render(
      <HansChart
        title="Orders"
        chartType="bar"
        categories={['Q1']}
        series={[{ name: 'Orders', type: 'bar', data: [4], label: { position: 'inside' } }]}
        colors={['rgb(10, 20, 30)']}
        showLegend={false}
        optionOverrides={{ grid: { left: 16 } }}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.legend).toBeUndefined();
    expect(option.grid).toEqual({ left: 16 });
    expect(option.series[0]).toMatchObject({
      type: 'bar',
      label: { show: true, position: 'inside' },
      emphasis: { focus: 'none', scale: false, itemStyle: { opacity: 1 } },
      select: { disabled: true },
    });
  });

  it('Should normalize object datapoints in cartesian charts', () => {
    render(
      <HansChart
        chartType="bar"
        categories={['Q1', 'Q2']}
        series={[{ name: 'Orders', type: 'bar', data: [{ name: 'Q1', value: 12 }, 18] }]}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.series[0].data).toEqual([12, 18]);
  });

  it('Should create mixed bar and line series with different label modes', () => {
    render(
      <HansChart
        chartType="mixed"
        categories={['Jan', 'Feb']}
        series={[
          { name: 'Orders', type: 'bar', data: [8, 11], label: { position: 'inside' } },
          { name: 'Revenue', type: 'line', data: [14, 20], label: { position: 'diagonal' } },
        ]}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.tooltip.trigger).toBe('axis');
    expect(option.series[0]).toMatchObject({
      type: 'bar',
      label: { show: true, position: 'inside' },
    });
    expect(option.series[1]).toMatchObject({
      type: 'line',
      label: { show: true, position: 'top', rotate: 45 },
    });
  });

  it('Should create pie and doughnut series correctly', () => {
    const { rerender } = render(
      <HansChart
        chartType="pie"
        categories={['Organic', 'Paid']}
        series={[{ name: 'Traffic', type: 'pie', data: [30, 70], label: { position: 'vertical' } }]}
      />,
    );

    let option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.tooltip.trigger).toBe('item');
    expect(option.series[0]).toMatchObject({
      type: 'pie',
      radius: '70%',
      label: { show: true, position: 'outside', rotate: 90 },
    });

    rerender(
      <HansChart
        chartType="doughnut"
        categories={['A', 'B']}
        series={[{ name: 'Users', type: 'doughnut', data: [{ name: 'A', value: 10 }, 20] }]}
      />,
    );

    option = echartsMocks.mockSetOption.mock.calls[1][0];
    expect(option.series[0].radius).toEqual(['45%', '70%']);
    expect(option.series[0].data).toEqual([
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
    ]);
  });

  it('Should support inside label for pie series', () => {
    render(
      <HansChart
        chartType="pie"
        categories={['A', 'B']}
        series={[{ name: 'Share', type: 'pie', data: [40, 60], label: { position: 'inside' } }]}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.series[0].label).toEqual({ show: true, position: 'inside', formatter: undefined });
  });

  it('Should fallback pie item label when category is missing', () => {
    render(
      <HansChart
        chartType="pie"
        categories={['Known']}
        series={[{ name: 'Traffic', type: 'pie', data: [20, 80] }]}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.series[0].data).toEqual([
      { name: 'Known', value: 20 },
      { name: 'Item 2', value: 80 },
    ]);
  });

  it('Should hide labels when label position is none', () => {
    render(
      <HansChart
        chartType="line"
        categories={['Jan']}
        series={[{ name: 'Revenue', data: [10], label: { position: 'none' } }]}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.series[0].label).toEqual({ show: false });
  });

  it('Should use randomized combination palette when colors is empty', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.25);
    render(
      <HansChart
        chartType="line"
        categories={['Jan']}
        series={[{ name: 'Revenue', data: [10] }]}
        colors={[]}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.color).toHaveLength(7);
    randomSpy.mockRestore();
  });

  it('Should use randomized combination palette when colors is undefined', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.2);
    render(
      <HansChart
        chartType="bar"
        categories={['Jan']}
        series={[{ name: 'Orders', data: [7] }]}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.color).toHaveLength(7);
    randomSpy.mockRestore();
  });

  it('Should resolve css var string colors', () => {
    render(
      <HansChart
        chartType="line"
        categories={['Jan']}
        series={[{ name: 'Revenue', data: [10] }]}
        colors={['var(--primary-default-color)']}
      />,
    );

    const option = echartsMocks.mockSetOption.mock.calls[0][0];
    expect(option.color).toEqual(['#3d8bff']);
  });

  it('Should bind click event and dispatch point callback', () => {
    const handlePointClick = vi.fn();
    render(
      <HansChart
        chartType="line"
        categories={['Jan']}
        series={[{ name: 'Revenue', data: [10] }]}
        onPointClick={handlePointClick}
      />,
    );

    expect(echartsMocks.mockOff).toHaveBeenCalledWith('click');
    expect(echartsMocks.mockOn).toHaveBeenCalledWith('click', expect.any(Function));

    const clickHandler = echartsMocks.mockOn.mock.calls[0][1] as (event: unknown) => void;
    clickHandler({ name: 'Jan', value: 10, seriesName: 'Revenue' });

    expect(handlePointClick).toHaveBeenCalledWith({
      name: 'Jan',
      value: 10,
      seriesName: 'Revenue',
    });
  });

  it('Should handle click event safely when onPointClick is not provided', () => {
    render(
      <HansChart
        chartType="line"
        categories={['Jan']}
        series={[{ name: 'Revenue', data: [10] }]}
      />,
    );

    const clickHandler = echartsMocks.mockOn.mock.calls[0][1] as (event: unknown) => void;
    expect(() => clickHandler({ name: 'Jan' })).not.toThrow();
  });

  it('Should resize on window resize and dispose on unmount', () => {
    const { unmount } = render(
      <HansChart
        chartType="line"
        categories={['Jan']}
        series={[{ name: 'Revenue', data: [10] }]}
      />,
    );

    fireEvent(window, new Event('resize'));
    expect(echartsMocks.mockResize).toHaveBeenCalledTimes(1);

    unmount();
    expect(echartsMocks.mockDispose).toHaveBeenCalledTimes(1);
  });
});
