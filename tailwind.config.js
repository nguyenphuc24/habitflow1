/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { outfit: ['Outfit', 'sans-serif'] },
      colors: {
        bg:'#0a0a0f', s1:'#111118', s2:'#18181f', s3:'#222230',
        bdr:'#2a2a3a', t1:'#f4f4ff', t2:'#9090b0', t3:'#55556a',
        acc:'#7c5cfc', acc2:'#c084fc', grn:'#22d3a0',
        org:'#ff8c42', danger:'#ff5566', yel:'#ffd166',
      },
    },
  },
  plugins: [],
}
