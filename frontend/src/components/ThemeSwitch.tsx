import { type MouseEvent } from 'react'
import { SunIcon, MoonIcon } from '@phosphor-icons/react'
import styles from './ThemeSwitch.module.css'

type ThemeSwitchProps = {
  theme: 'light' | 'dark'
  toggleTheme: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function ThemeSwitch({
  theme,
  toggleTheme
}: ThemeSwitchProps) {
  return (
    <button
      onClick={toggleTheme}
      className={styles.themeSwitch}
      aria-label="Toggle theme"
    >
      {theme === 'light'
        ? <MoonIcon />
        : <SunIcon />}
    </button>
  )
}