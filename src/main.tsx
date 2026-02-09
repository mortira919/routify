import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import { I18nProvider } from './i18n/I18nContext.tsx'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#76B900',
            borderRadius: 8,
            colorBgBase: '#000000',
            colorBgContainer: '#0a0a0a',
          },
        }}
      >
        <App />
      </ConfigProvider>
    </I18nProvider>
  </StrictMode>,
)
