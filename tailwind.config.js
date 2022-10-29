/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/views/**/*.pug',
    './src/app/partials/**/*.pug',
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
        
          "primary": "#af8ee2",
                  
          "secondary": "#3f7205",
                  
          "accent": "#e88e09",
                  
          "neutral": "#321E33",
                  
          "base-100": "#30355A",
                  
          "info": "#5690D2",
                  
          "success": "#2ACFAE",
                  
          "warning": "#D78914",
                  
          "error": "#EA626F",
        },
      },
      "dark",
      "cupcake",
    ],
  },

  plugins: [require("daisyui")],
}
