# Range component

A custom `<Range />` component built with Next.js (App Router) and TypeScript. It is not an `<input type="range">`: the bar, the handles and the dragging are all done by hand.

It has two modes:

- **Normal range**: any number between a min and a max. The min and max labels can be edited.
- **Fixed values**: the user can only pick values from a given list. The labels are read-only and shown in euros.

## Running it

```bash
npm install
npm run dev
```

Then open:

- http://localhost:8080/exercise1 (normal range)
- http://localhost:8080/exercise2 (fixed values)

You need Node 20.9 or newer.

## Tests

```bash
npm test
```

## How it is organised

- `components/Range/Range.tsx`: the component.
- `lib/scale.ts`: converts between values and positions on the bar. There are two versions, one for min/max and one for a fixed list.
- `app/api/range` and `app/api/fixed-range`: the mocked services, as Next route handlers. They return `{ min, max }` and `{ rangeValues }`.
- `lib/api.ts`: the fetch calls to those services.
- `app/exercise1` and `app/exercise2`: the two pages. They fetch the data and pass it to `Range`.
- `__tests__`: unit tests for the scales and the mocks, and integration tests for the component and the pages.