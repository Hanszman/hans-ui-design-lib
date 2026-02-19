import type { Meta, StoryObj } from '@storybook/react';
import { HansChart } from './Chart';
import DocsPage from './Chart.mdx';

const baseCategories = ['Jan', 'Feb', 'Mar', 'Apr'];

const meta: Meta<typeof HansChart> = {
  title: 'Components/Chart',
  component: HansChart,
  args: {
    title: 'Revenue Trend',
    chartType: 'line',
    categories: baseCategories,
    series: [
      {
        name: 'Revenue',
        type: 'line',
        data: [10, 20, 15, 30],
        smooth: true,
        label: { position: 'none' },
      },
    ],
    colors: ['primary', 'secondary', 'success'],
    showLegend: true,
    height: 360,
  },
  argTypes: {
    chartType: {
      control: 'select',
      options: ['line', 'bar', 'pie', 'doughnut', 'mixed'],
    },
    showLegend: { control: 'boolean' },
    height: { control: 'number' },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansChart>;

export const Primary: Story = {};

export const LineWithLabels: Story = {
  args: {
    title: 'Line With Labels',
    chartType: 'line',
    series: [
      {
        name: 'Revenue',
        type: 'line',
        data: [22, 19, 24, 28],
        smooth: true,
        label: { position: 'horizontal', formatter: '{c}' },
      },
    ],
    colors: ['primary'],
  },
};

export const BarNoLabels: Story = {
  args: {
    title: 'Bar Without Labels',
    chartType: 'bar',
    series: [
      {
        name: '2025',
        type: 'bar',
        data: [5, 8, 6, 10],
        label: { position: 'none' },
      },
      {
        name: '2026',
        type: 'bar',
        data: [7, 9, 8, 12],
        label: { position: 'none' },
      },
    ],
    colors: ['secondary', 'success'],
  },
};

export const BarInsideLabels: Story = {
  args: {
    title: 'Bar With Inside Labels',
    chartType: 'bar',
    series: [
      {
        name: 'Orders',
        type: 'bar',
        data: [32, 41, 37, 48],
        label: { position: 'inside', formatter: '{c}' },
      },
    ],
    colors: ['danger'],
  },
};

export const MixedBarLine: Story = {
  args: {
    title: 'Mixed Bar + Line',
    chartType: 'mixed',
    series: [
      {
        name: 'Orders',
        type: 'bar',
        data: [8, 12, 10, 14],
        label: { position: 'horizontal', formatter: '{c}' },
      },
      {
        name: 'Conversion',
        type: 'line',
        data: [3, 5, 4, 7],
        smooth: true,
        label: { position: 'diagonal', formatter: '{c}' },
      },
    ],
    colors: ['warning', 'primary'],
  },
};

export const Pie: Story = {
  args: {
    chartType: 'pie',
    title: 'Traffic By Channel',
    categories: ['Organic', 'Paid', 'Social'],
    series: [
      {
        name: 'Traffic',
        type: 'pie',
        data: [45, 35, 20],
        label: { position: 'horizontal' },
      },
    ],
    colors: ['primary', 'secondary', 'warning'],
  },
};

export const Doughnut: Story = {
  args: {
    chartType: 'doughnut',
    title: 'Users By Plan',
    categories: ['Basic', 'Pro', 'Enterprise'],
    series: [
      {
        name: 'Users',
        type: 'doughnut',
        data: [55, 30, 15],
        label: { position: 'inside', formatter: '{d}%' },
      },
    ],
    colors: ['success', 'info', 'danger'],
  },
};

export const ColorModes: Story = {
  args: {
    title: 'Color Modes',
    chartType: 'bar',
    categories: ['Team A', 'Team B', 'Team C'],
    series: [{ name: 'Score', type: 'bar', data: [78, 84, 90] }],
    colors: ['primary', 'rgb(255, 140, 66)', 'rgb(4, 211, 97)'],
  },
};

export const RandomPalette: Story = {
  args: {
    title: 'Randomized Combination Palette',
    chartType: 'line',
    categories: ['W1', 'W2', 'W3', 'W4'],
    series: [{ name: 'Sessions', type: 'line', data: [120, 132, 125, 146] }],
    colors: [],
  },
};

export const Empty: Story = {
  args: {
    title: 'Empty',
    series: [],
    emptyText: 'No chart data yet',
  },
};
