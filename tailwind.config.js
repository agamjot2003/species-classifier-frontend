export default {
  // Tailwind scans these files to find which CSS classes
  // you actually used. It only ships CSS for those classes.
  // If you forget to list a file here, its Tailwind classes
  // won't work — they'll just be invisible/unstyled.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}