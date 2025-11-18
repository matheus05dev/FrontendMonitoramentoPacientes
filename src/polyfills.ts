// Polyfill para global (necessário para sockjs-client)
// Este arquivo é carregado como polyfill pelo Angular ANTES de qualquer outro código
// CRÍTICO: Deve definir global antes de qualquer import dinâmico

// Verificar e definir global no window (mais comum no navegador)
if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win.global) {
    win.global = window;
    // Tentar criar como propriedade não configurável para garantir persistência
    try {
      Object.defineProperty(window, 'global', {
        value: window,
        writable: true,
        enumerable: false,
        configurable: true
      });
    } catch (e) {
      // Se falhar, pelo menos temos a propriedade definida
    }
  }
}

// Definir global no globalThis (padrão ES2020)
if (typeof globalThis !== 'undefined') {
  const gThis = globalThis as any;
  if (!gThis.global) {
    gThis.global = typeof window !== 'undefined' ? window : globalThis;
  }
}

// Definir global no self (para web workers)
if (typeof self !== 'undefined') {
  const s = self as any;
  if (!s.global) {
    s.global = self;
  }
}

// Criar uma referência global usando Function constructor
// Isso cria uma variável no escopo global que módulos CommonJS podem acessar
try {
  const getGlobal = new Function('return this')();
  if (getGlobal && !getGlobal.global) {
    getGlobal.global = typeof window !== 'undefined' ? window : getGlobal;
  }
} catch (e) {
  // Ignorar se falhar
}

// Declaração de tipo para TypeScript
declare global {
  var global: typeof window;
}

export {};
