module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        "pro-bg": "var(--bg)",
        "pro-bg-deep": "var(--bg-deep)",
        "pro-panel": "var(--panel)",
        "pro-panel-strong": "var(--panel-strong)",
        "pro-line": "var(--line)",
        "pro-line-strong": "var(--line-strong)",
        "pro-text": "var(--text)",
        "pro-text-soft": "var(--text-soft)",
        "pro-text-faint": "var(--text-faint)",
        "pro-gold": "var(--gold)",
        "pro-gold-bright": "var(--gold-bright)",
        "pro-blue": "var(--blue)",
        "pro-green": "var(--green)"
      },
      borderRadius: {
        "pro-xl": "var(--radius-xl)",
        "pro-lg": "var(--radius-lg)",
        "pro-md": "var(--radius-md)"
      },
      boxShadow: {
        "pro-panel": "var(--shadow)"
      },
      fontFamily: {
        sans: ['"Avenir Next"', "Avenir", '"Segoe UI"', "sans-serif"],
        serif: [
          '"Iowan Old Style"',
          '"Palatino Linotype"',
          '"Book Antiqua"',
          "serif"
        ]
      },
      zIndex: {
        2: "2",
        3: "3",
        4: "4",
        60: "60"
      }
    }
  }
};
