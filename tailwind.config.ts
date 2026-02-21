import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/context/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
    './src/interfaces/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        text: {
          DEFAULT: '#000000', // 기본 텍스트 색상을 검정으로 설정
        },
      },
    },
  },
  plugins: [],
  mode: 'jit'

};
export default config;
