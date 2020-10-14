module.exports = {
  root: true, // Asegúrese de que eslint recoja la configuración en la raíz del directorio
  parserOptions: {
    ecmaVersion: 2020, // Utilice el último estándar de ecmascript
    sourceType: 'module' // Permite usar declaraciones de importación / exportación
  },
  env: {
    browser: true, // Habilita globales del navegador como ventana y documento
    amd: true, // Habilita require () y define () como variables globales según la especificación amd.
    node: true // Habilita las variables globales de Node.js y el alcance de Node.js.
  },
  extends: [
    'eslint:recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended' // Haga de este el último elemento para que una configuración Prettier anule otras reglas de formato
  ],
  rules: {
    'prettier/prettier': ['error', { usePrettierrc: true }, { endOfLine: 'auto' }] //Utilice nuestro archivo .prettierrc como fuente
  },
  plugins: ['simple-import-sort']
};
