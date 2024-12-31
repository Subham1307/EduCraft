'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/#about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Contact', path: '/#contact' },
  { name: 'Login', path: '/login' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-slate-900/75">
      <div className="max-w-8xl mx-auto">
        <div className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-2xl text-primary">EduPro</Link>
            <ul className="ml-12 flex space-x-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`${
                      pathname === item.path ? 'text-primary' : 'text-muted-foreground'
                    } hover:text-primary transition-colors`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

