export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";

export const lightThemeClassName = `${LIGHT_THEME}-theme`;

export const syncTheme = (theme: string, root = document.documentElement) => {
    localStorage.setItem('theme', theme)

    if (theme === LIGHT_THEME) {
        root.classList.add(lightThemeClassName);
    } else {
        root.classList.remove(lightThemeClassName);
    }
};
