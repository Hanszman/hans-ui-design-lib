import React from 'react';

type SemanticColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'base';

type CombinationRow = {
  token: SemanticColor;
  strong: string;
  default: string;
  neutral: string;
};

type CombinationData = {
  background: string;
  text: string;
  rows: CombinationRow[];
};

const COLOR_FAMILIES = [
  'red',
  'green',
  'blue',
  'yellow',
  'orange',
  'pink',
  'wine',
  'purple',
  'lilac',
  'indigo',
  'cyan',
  'aqua',
  'lime',
  'beige',
  'brown',
] as const;

const FAMILY_LEVELS = ['900', '500', '300'] as const;
const GRAY_LEVELS = ['900', '700', '500', '300', '100'] as const;
const THEMES = [
  'combination1',
  'combination2',
  'combination3',
  'combination4',
  'combination5',
] as const;
const SEMANTIC_KEYS: SemanticColor[] = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'base',
];

const SWATCH_STYLE: React.CSSProperties = {
  display: 'inline-block',
  width: 40,
  height: 40,
  border: '1px solid #ccc',
};

const CELL_WRAP_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
};

const normalize = (value: string): string => value.trim();

const readVar = (styles: CSSStyleDeclaration, token: string): string =>
  normalize(styles.getPropertyValue(token));

const colorCell = (value: string) => (
  <div style={CELL_WRAP_STYLE}>
    <span style={{ ...SWATCH_STYLE, background: value }} />
    <code>{value}</code>
  </div>
);

export const ColorSystemDocs = (): React.JSX.Element => {
  const [ready, setReady] = React.useState(false);
  const [families, setFamilies] = React.useState<Record<string, string[]>>({});
  const [grays, setGrays] = React.useState<Record<string, string>>({});
  const [combos, setCombos] = React.useState<Record<string, CombinationData>>(
    {},
  );

  React.useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const nextFamilies: Record<string, string[]> = {};
    COLOR_FAMILIES.forEach((family) => {
      nextFamilies[family] = FAMILY_LEVELS.map((level) =>
        readVar(root, `--${family}-${level}`),
      );
    });

    const nextGrays: Record<string, string> = {};
    GRAY_LEVELS.forEach((level) => {
      nextGrays[level] = readVar(root, `--gray-${level}`);
    });

    const body = document.body;
    const originalTheme = body.getAttribute('data-theme');
    const nextCombos: Record<string, CombinationData> = {};

    THEMES.forEach((theme) => {
      body.setAttribute('data-theme', theme);
      const styles = getComputedStyle(body);

      nextCombos[theme] = {
        background: readVar(styles, '--background-color'),
        text: readVar(styles, '--text-color'),
        rows: SEMANTIC_KEYS.map((token) => ({
          token,
          strong: readVar(styles, `--${token}-strong-color`),
          default: readVar(styles, `--${token}-default-color`),
          neutral: readVar(styles, `--${token}-neutral-color`),
        })),
      };
    });

    if (originalTheme) {
      body.setAttribute('data-theme', originalTheme);
    } else {
      body.removeAttribute('data-theme');
    }

    setFamilies(nextFamilies);
    setGrays(nextGrays);
    setCombos(nextCombos);
    setReady(true);
  }, []);

  if (!ready) {
    return <p>Loading color tokens...</p>;
  }

  return (
    <>
      <p>
        This page documents <code>src/styles/colors.scss</code> with visual
        swatches and live values.
      </p>

      <h2>Base Palettes</h2>
      <p>
        These are all reusable palette families available in the design system.
      </p>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Family</th>
            <th style={{ textAlign: 'center' }}>900</th>
            <th style={{ textAlign: 'center' }}>500</th>
            <th style={{ textAlign: 'center' }}>300</th>
          </tr>
        </thead>
        <tbody>
          {COLOR_FAMILIES.map((family) => (
            <tr key={family}>
              <td style={{ textAlign: 'center' }}>{family}</td>
              {families[family].map((value, index) => (
                <td
                  key={`${family}-${FAMILY_LEVELS[index]}`}
                  style={{ textAlign: 'center' }}
                >
                  {colorCell(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Gray Scale</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {GRAY_LEVELS.map((level) => (
          <div key={level} style={CELL_WRAP_STYLE}>
            <span style={{ ...SWATCH_STYLE, background: grays[level] }} />
            <code>{grays[level]}</code>
            <small>{`gray-${level}`}</small>
          </div>
        ))}
      </div>

      <h3>Base (Binary)</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={CELL_WRAP_STYLE}>
          <span style={{ ...SWATCH_STYLE, background: '#000000' }} />
          <code>#000000</code>
          <small>black</small>
        </div>
        <div style={CELL_WRAP_STYLE}>
          <span style={{ ...SWATCH_STYLE, background: '#ffffff' }} />
          <code>#ffffff</code>
          <small>white</small>
        </div>
      </div>

      <h2>Theme Combinations</h2>
      <p>
        Semantic tokens are mapped by theme (e.g. <code>primary</code>,{' '}
        <code>danger</code>, <code>base</code>). The values below are read
        directly from CSS variables.
      </p>
      <p>
        Use:
        <br />
        <code>{'<body data-theme="combination3"></body>'}</code>
      </p>

      {THEMES.map((theme) => (
        <div key={theme}>
          <h3>{theme}</h3>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Token</th>
                <th style={{ textAlign: 'center' }}>Strong</th>
                <th style={{ textAlign: 'center' }}>Default</th>
                <th style={{ textAlign: 'center' }}>Neutral</th>
              </tr>
            </thead>
            <tbody>
              {combos[theme].rows.map((row) => (
                <tr key={`${theme}-${row.token}`}>
                  <td style={{ textAlign: 'center' }}>
                    <strong>{row.token}</strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {colorCell(row.strong)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {colorCell(row.default)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {colorCell(row.neutral)}
                  </td>
                </tr>
              ))}
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <strong>background</strong>
                </td>
                <td colSpan={3} style={{ textAlign: 'center' }}>
                  {colorCell(combos[theme].background)}
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <strong>text</strong>
                </td>
                <td colSpan={3} style={{ textAlign: 'center' }}>
                  {colorCell(combos[theme].text)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};
