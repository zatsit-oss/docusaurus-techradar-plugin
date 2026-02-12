# Docusaurus Tech Radar Plugin

A Docusaurus plugin for displaying an interactive Tech Radar based on [Zalando's Tech Radar](https://github.com/zalando/tech-radar) visualization.

## Features

- 🎯 **Interactive visualization** - Based on Zalando's proven D3.js radar
- 🎨 **Docusaurus integration** - Seamless theming with Infima CSS variables
- 🌓 **Dark mode support** - Automatic dark mode compatibility
- 📱 **Responsive** - Works on desktop and mobile devices
- 🔗 **Documentation links** - Click entries to view detailed documentation
- 🎛️ **Flexible configuration** - Multiple radars per site with custom data sources
- ⚡ **Client-side only** - No SSR issues, D3.js loaded from CDN

## Installation

```bash
npm install docusaurus-techradar-plugin
# or
yarn add docusaurus-techradar-plugin
```

## Usage

### 1. Configure the Plugin

Add the plugin to your `docusaurus.config.js`:

```javascript
module.exports = {
  plugins: [
    [
      'docusaurus-techradar-plugin',
      {
        radarFile: './data/tech-radar.json', // Required
        width: 1450,                          // Optional, default: 1450
        height: 1000,                         // Optional, default: 1000
        colors: {                             // Optional
          background: '#fff',
          grid: '#bbb',
          inactive: '#ddd',
        },
      },
    ],
  ],
};
```

### 2. Create Your Radar Data

Create a JSON file (e.g., `data/tech-radar.json`) with your radar data:

```json
{
  "title": "Tech Radar 2026",
  "quadrants": [
    { "name": "Languages & Frameworks" },
    { "name": "Tools" },
    { "name": "Platforms" },
    { "name": "Techniques" }
  ],
  "rings": [
    { "name": "ADOPT", "color": "#5ba300" },
    { "name": "TRIAL", "color": "#009eb0" },
    { "name": "ASSESS", "color": "#c7ba00" },
    { "name": "HOLD", "color": "#e09b96" }
  ],
  "entries": [
    {
      "label": "React",
      "quadrant": 0,
      "ring": 0,
      "moved": 0,
      "link": "/docs/frontend/react"
    },
    {
      "label": "TypeScript",
      "quadrant": 0,
      "ring": 0,
      "moved": 1,
      "link": "/docs/languages/typescript"
    }
  ]
}
```

### 3. Use in Your Pages

Import and use the component in your MDX files:

```mdx
---
title: Our Tech Radar
---

import TechRadar from '@theme/TechRadar';

# Our Technology Choices

<TechRadar />
```

## Data Format

### Quadrants

Must have exactly 4 quadrants (top-right, top-left, bottom-left, bottom-right):

```json
{
  "quadrants": [
    { "name": "Languages & Frameworks" },
    { "name": "Tools" },
    { "name": "Platforms" },
    { "name": "Techniques" }
  ]
}
```

### Rings

1-4 rings representing maturity levels:

```json
{
  "rings": [
    { "name": "ADOPT", "color": "#5ba300" },
    { "name": "TRIAL", "color": "#009eb0" },
    { "name": "ASSESS", "color": "#c7ba00" },
    { "name": "HOLD", "color": "#e09b96" }
  ]
}
```

### Entries

Technologies/tools with their position:

```json
{
  "entries": [
    {
      "label": "Technology Name",
      "quadrant": 0,           // 0-3 (index in quadrants array)
      "ring": 0,               // 0-N (index in rings array)
      "moved": 0,              // -1 (out), 0 (no change), 1 (in), 2 (new)
      "link": "/docs/tech"     // Optional link to documentation
    }
  ]
}
```

## Advanced Usage

### Multiple Radars

You can display multiple radars with different data sources:

```mdx
import TechRadar from '@theme/TechRadar';

## Frontend Radar
<TechRadar source="/data/frontend-radar.json" />

## Backend Radar
<TechRadar source="/data/backend-radar.json" />
```

### Custom Dimensions

Override dimensions per component:

```mdx
<TechRadar width={1200} height={800} />
```

### Custom Colors

Override colors per component:

```mdx
<TechRadar
  colors={{
    background: '#f5f5f5',
    grid: '#333',
    inactive: '#999'
  }}
/>
```

## Configuration Options

| Option     | Type   | Default | Description |
|------------|--------|---------|-------------|
| `radarFile` | string | Required | Path to the radar JSON file |
| `width` | number | 1450 | Width of the radar visualization |
| `height` | number | 1000 | Height of the radar visualization |
| `colors.background` | string | '#fff' | Background color |
| `colors.grid` | string | '#bbb' | Grid lines color |
| `colors.inactive` | string | '#ddd' | Inactive elements color |

## Component Props

The `<TechRadar />` component accepts these props:

| Prop     | Type   | Description |
|----------|--------|-------------|
| `source` | string | Optional custom data source URL |
| `width` | number | Override radar width |
| `height` | number | Override radar height |
| `colors` | object | Override color scheme |

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Run tests
npm run test

# Type check
npm run typecheck

# Lint
npm run lint

# Format code
npm run format
```

## Credits

This plugin uses the [Zalando Tech Radar](https://github.com/zalando/tech-radar) visualization, licensed under MIT.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
