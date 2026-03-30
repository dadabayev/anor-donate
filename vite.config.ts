import react from '@vitejs/plugin-react'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
import path from 'path'
import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
import preload from 'vite-plugin-preload'
import tsconfigPaths from 'vite-tsconfig-paths'
import {
  coverageConfigDefaults,
  defineConfig as defineVitestConfig,
} from 'vitest/config'

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    css: true,
    bail: 1,
    environment: 'jsdom',
    setupFiles: ['./src/app/config/setup-tests.ts'],
    passWithNoTests: true,
    silent: true,
    reporters: ['json', 'verbose', 'vitest-sonar-reporter'],
    outputFile: {
      'vitest-sonar-reporter': 'sonar-report.xml',
    },
    coverage: {
      exclude: [
        '**/src/app/**',
        '**/public/**',
        ...coverageConfigDefaults.exclude,
      ],
      provider: 'istanbul',
      enabled: false,
      reporter: ['html', 'text', 'lcov'],
    },
  },
})

const viteConfig = defineViteConfig({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [fixReactVirtualized],
    },
  },
  plugins: [react(), preload(), tsconfigPaths()],
  resolve: {
    alias: {
      '@entities': path.resolve(__dirname, './src/entities'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
    },
  },
})

// eslint-disable-next-line import/no-default-export
export default mergeConfig(viteConfig, vitestConfig)
