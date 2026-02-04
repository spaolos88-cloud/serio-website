/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#050505',
                surface: '#0A0A0A',
                surfaceHighlight: '#1A1A1A',
                custom: {
                    DEFAULT: '#10b981',
                    gold: '#FFD700',
                    goldDim: 'rgba(255, 215, 0, 0.2)',
                    copper: '#B87333',
                    copperDim: 'rgba(184, 115, 51, 0.2)',
                },
                cyan: '#00F0FF',
                cyanDim: '#00F0FF80',
                purple: '#7000FF',
                text: '#E0E0E0',
                textDim: '#A0A0A0',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
                display: ['Orbitron', 'sans-serif'], // Best for headers
            },
            boxShadow: {
                'neon-cyan': '0 0 10px #00F0FF, 0 0 20px #00F0FF40',
                'neon-purple': '0 0 10px #7000FF, 0 0 20px #7000FF40',
            },
            container: {
                center: true,
                padding: '2rem',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
