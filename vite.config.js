export default {
  root: '.',
  // GitHub Pages serves this repo at https://rubenreut.github.io/rythm-site/
  base: '/rythm-site/',
  // Real 404s in dev/preview instead of SPA fallback (matches Pages behaviour)
  appType: 'mpa',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: 'index.html',
        play: 'play/index.html',
        privacy: 'privacy.html',
        terms: 'terms.html',
        support: 'support.html',
        notfound: '404.html',
      },
    },
  },
};
