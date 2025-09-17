import type { Preview } from '@storybook/react';
import { ConfigProvider } from 'antd';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#0ea5e9', // Azure blue
            borderRadius: 6,
          },
        }}
      >
        <div style={{ padding: '1rem' }}>
          <Story />
        </div>
      </ConfigProvider>
    ),
  ],
};

export default preview;