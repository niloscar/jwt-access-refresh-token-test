import { useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'

const ANIMATION_DURATION = 400

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => document.documentElement.dataset.theme as Theme
  )

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    const root = document.documentElement

    const updateTheme = () => {
      flushSync(() => {
        setTheme(nextTheme)
        root.dataset.theme = nextTheme
      })

      localStorage.setItem('theme', nextTheme)
    }

    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      updateTheme()
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()

    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const expanded = `circle(${radius}px at ${x}px ${y}px)`
    const collapsed = `circle(0px at ${x}px ${y}px)`

    root.dataset.themeTransition =
      nextTheme === 'light' ? 'to-light' : 'to-dark'

    const transition = document.startViewTransition(updateTheme)

    transition.ready.then(() => {
      const options = {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        fill: 'forwards' as const
      }

      if (nextTheme === 'light') {
        root.animate(
          { clipPath: [collapsed, expanded] },
          {
            ...options,
            pseudoElement: '::view-transition-new(root)'
          }
        )

        root.animate(
          { clipPath: [expanded, expanded] },
          {
            ...options,
            pseudoElement: '::view-transition-old(root)'
          }
        )
      } else {
        root.animate(
          { clipPath: [expanded, collapsed] },
          {
            ...options,
            pseudoElement: '::view-transition-old(root)'
          }
        )

        root.animate(
          { clipPath: [expanded, expanded] },
          {
            ...options,
            pseudoElement: '::view-transition-new(root)'
          }
        )
      }
    }).catch(console.error)

    transition.finished.finally(() => {
      delete root.dataset.themeTransition
    })
  }

  return { theme, toggleTheme }
}