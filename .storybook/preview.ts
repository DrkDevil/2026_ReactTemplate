import type { Preview } from '@storybook/react-vite'
import '../src/theme/globals.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Documentation', ['Getting Started', 'App Architecture', 'Workflow', '*'], 'Application', ['App Components', '*'], 'Design System', ['Component Library', 'Sass Methodology', 'WCAG Color Palettes', 'Color Theory', '*'], '*'],
      },
    },
  },
};

export default preview;