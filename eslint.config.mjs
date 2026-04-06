import nextVitals from 'eslint-config-next/core-web-vitals'
import tseslint from 'typescript-eslint'

const config = [
  ...nextVitals,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
]

export default config
