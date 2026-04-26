import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Onde procurar testes
    include: ['tests/**/*.test.js'],

    // Ambiente Node — não DOM
    environment: 'node',

    // Globals (describe/it/expect) sem precisar importar
    globals: true,

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      // O que medir
      include: [
        'lib/**/*.js',
        'middleware/**/*.js',
        'services/**/*.js',
        'routes/**/*.js',
      ],
      // O que ignorar (provider externo + bootstrap + config)
      exclude: [
        'services/tmdb.js',
        'services/jikan.js',
        'config/**',
        'prisma/**',
        '**/*.config.js',
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
})
