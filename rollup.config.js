import pkg from './package.json'

const external = ['crypto']

export default [
  { input: 'code/index.js',
    output: [
      { file: pkg.main, format: 'cjs', exports:'named' },
      { file: pkg.browser, format: 'amd', exports:'named' },
      { file: pkg.module, format: 'es' }],
    external },
]
