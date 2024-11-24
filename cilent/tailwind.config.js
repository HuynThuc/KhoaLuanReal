// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)', // Màu chính
        'primary-light': 'var(--primary-color-light)', // Màu chính nhạt
        'primary-extra-light': 'var(--primary-color-extra-light)', // Màu chính rất nhạt
        secondary: 'var(--secondary-color)', // Màu phụ
        'secondary-dark': 'var(--secondary-color-dark)', // Màu phụ tối
        'text-light': 'var(--text-light)', // Màu chữ nhạt
        white: 'var(--white)', // Màu trắng
        custom: '#141414', // Màu tùy chỉnh
      },
      maxWidth: {
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        '1200': 'var(--max-width)', // Thêm max-width từ biến CSS
      },
    },
  },
  plugins: [],
}
