# Anor Donate

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Testing

```bash
npm run test
npm run test:watch
npm run test:ui
npm run test:coverage
```

## Quality

```bash
npm run lint
npm run lint:fix
npm run type-check
npm run steiger
```

## Latest updates

- Added dedicated widget create/edit pages at `/widgets/create` and `/widgets/:widgetId/edit`
- Removed modal-based widget create/update flow from the widgets feature
- App routes use English paths only (`/donations`, `/widgets`, `/profile`, etc.); sidebar links match those paths
- Notification panel and widgets audio previews now use real waveform bars decoded from WAV audio data
- Widget editor audio upload now supports real play/pause preview with live elapsed/duration timing
- Added full memes feature flow: `/memes`, `/memes/create`, `/memes/:memeId/edit`, ready memes tab, and selection modal
