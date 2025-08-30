import React, { useEffect, useState, useCallback } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createAnimation } from "./theme-animations" // skipper-ui animations

export default function ThemeToggleButton({
  variant = "circle-blur",
  start = "top-right",
  showLabel = false,
  url = ""
}) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  )

  const styleId = "theme-transition-styles"

  const updateStyles = useCallback((css, name) => {
    let styleElement = document.getElementById(styleId)
    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }
    styleElement.textContent = css
  }, [])

  const applyTheme = useCallback(
    (nextTheme) => {
      setTheme(nextTheme)
      localStorage.setItem("theme", nextTheme)
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    },
    []
  )

  const toggleTheme = useCallback(() => {
    const animation = createAnimation(variant, start, url)
    updateStyles(animation.css, animation.name)

    const switchTheme = () => {
      applyTheme(theme === "light" ? "dark" : "light")
    }

    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    document.startViewTransition(switchTheme)
  }, [theme, applyTheme, updateStyles, variant, start, url])

  // Apply theme on mount
  useEffect(() => {
    applyTheme(theme)
  }, [])

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="w-9 p-0 h-9 relative group"
      name="Theme Toggle Button">
      <SunIcon className="size-[1.2rem] hover:border-[#B48E57] hover:border-2 text-[#B48E57] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-[1.2rem] text-[#B48E57] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Theme Toggle</span>
      {showLabel && (
        <>
          <span className="hidden group-hover:block border rounded-full px-2 absolute -top-10">
            variant = {variant}
          </span>
          <span className="hidden group-hover:block border rounded-full px-2 absolute -bottom-10">
            start = {start}
          </span>
        </>
      )}
    </Button>
  )
}
