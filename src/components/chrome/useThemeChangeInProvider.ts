import { useEffect, useState } from "react"
type ThemeValues = 'dark' | 'light'

export const useThemeChangeInProvider = (callback?: (theme: ThemeValues) => void): ThemeValues => {
    const [theme, setTheme] = useState<ThemeValues>('dark')
    useEffect(() => {
        fin.InterApplicationBus.subscribe({ uuid: "*" }, 'default-window-context-changed', (context) => {
            const theme = context.theme as ThemeValues
            setTheme(theme)
            callback?.(theme)
        })
    }, [])

    return theme;
}