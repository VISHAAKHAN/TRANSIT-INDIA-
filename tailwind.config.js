/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ti-navy': 'var(--color-bg-navy)',
                'ti-saffron': 'var(--color-primary)',
                'ti-saffron-light': 'var(--color-primary-light)',
                'ti-emerald': 'var(--color-emerald)',
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'sans-serif'],
            },
            backgroundImage: {
                'saffron-gradient': 'linear-gradient(to right, var(--color-primary), var(--color-primary-light))',
            }
        },
    },
    plugins: [],
}
