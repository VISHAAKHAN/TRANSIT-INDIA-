/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ti-navy': '#0B1F3A',
                'ti-saffron': '#FF9933',
                'ti-saffron-light': '#FFB347',
                'ti-emerald': '#138808'
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'sans-serif'],
            },
            backgroundImage: {
                'saffron-gradient': 'linear-gradient(to right, #FF9933, #FFB347)',
            }
        },
    },
    plugins: [],
}
