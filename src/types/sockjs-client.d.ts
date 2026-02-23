declare module 'sockjs-client' {
  interface SockJSOptions {
    transports?: string[];
    timeout?: number;
    [key: string]: unknown;
  }

  interface SockJSInstance {
    close: (code?: number, reason?: string) => void;
    send: (data: string) => void;
    onopen?: () => void;
    onclose?: (e: CloseEvent) => void;
    onmessage?: (e: MessageEvent) => void;
  }

  interface SockJSConstructor {
    new (url: string, options?: SockJSOptions): SockJSInstance;
  }

  const SockJS: SockJSConstructor;
  export = SockJS;
}
