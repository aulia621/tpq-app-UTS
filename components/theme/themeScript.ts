export const THEME_KEY = "theme";

/**
 * Dijalankan di <head> SEBELUM halaman tampil, supaya tidak ada kedipan terang->gelap.
 * Urutan prioritas: pilihan pengguna (localStorage) -> pengaturan sistem (prefers-color-scheme).
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;