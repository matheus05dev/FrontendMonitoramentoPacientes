// Wrapper para SockJS que garante que global esteja definido
// Este módulo garante que global esteja definido antes de carregar sockjs-client

// Função para garantir que global esteja definido de forma robusta
function ensureGlobal(): void {
  // Definir no window
  if (typeof window !== 'undefined') {
    if (!(window as any).global) {
      (window as any).global = window;
      try {
        Object.defineProperty(window, 'global', {
          value: window,
          writable: true,
          configurable: true,
          enumerable: false
        });
      } catch (e) {
        // Ignorar se falhar
      }
    }
  }
  
  // Definir no globalThis
  if (typeof globalThis !== 'undefined') {
    if (!(globalThis as any).global) {
      (globalThis as any).global = typeof window !== 'undefined' ? window : globalThis;
    }
  }
  
  // Tentar criar usando Function constructor
  try {
    const getGlobal = new Function('return this')();
    if (getGlobal && !getGlobal.global) {
      getGlobal.global = typeof window !== 'undefined' ? window : getGlobal;
    }
  } catch (e) {
    // Ignorar
  }
}

// Garantir que global esteja definido ANTES de qualquer import
ensureGlobal();

// Exportar função para obter SockJS de forma segura
export async function getSockJS(): Promise<any> {
  // Garantir novamente antes de importar
  ensureGlobal();
  
  // Importar SockJS dinamicamente
  const SockJSModule = await import('sockjs-client');
  return SockJSModule.default || SockJSModule;
}
