/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#CEFF7D',
                    hover: '#89DC00',
                },
                background: {
                    DEFAULT: '#F6FFE7',
                    dark: '#262520',
                },
                'black-100': '#f3f4f6',
            },
        },
    },
    plugins: [],
};
