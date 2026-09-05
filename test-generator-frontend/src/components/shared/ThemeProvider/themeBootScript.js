/** localStorage key for the public theme preference. */
export const THEME_STORAGE_KEY = "theme";

export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";

/**
 * Runs before paint so a saved dark preference does not flash light.
 * Missing or invalid values stay light (product default).
 */
export const THEME_BOOT_SCRIPT = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;
