'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  Target,
  Sparkles,
  Globe,
  Settings,
  Menu,
  X,
  CreditCard,
  Receipt,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Accounts',
    href: '/accounts',
    icon: Wallet,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: ArrowRightLeft,
  },
  {
    title: 'Bills',
    href: '/bills',
    icon: Receipt,
  },
  {
    title: 'Debts',
    href: '/debts',
    icon: CreditCard,
  },
  {
    title: 'Goals',
    href: '/goals',
    icon: Target,
  },
]

const secondaryNavItems: NavItem[] = [
  {
    title: 'Insights',
    href: '/insights',
    icon: Sparkles,
    badge: 'AI',
  },
  {
    title: 'World',
    href: '/world',
    icon: Globe,
  },
]

const bottomNavItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          Z
        </div>
        <span className="text-xl font-semibold tracking-tight">Zeno</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} isActive={pathname === item.href} />
          ))}
        </div>

        <div className="mt-6 px-3">
          <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Intelligence
          </p>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <NavLink key={item.href} item={item} isActive={pathname === item.href} />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-3 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} isActive={pathname === item.href} />
        ))}

        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Account</p>
            <p className="text-xs text-muted-foreground truncate">Manage profile</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
    >
      <item.icon className="h-5 w-5" />
      <span className="flex-1">{item.title}</span>
      {item.badge && (
        <span className="text-2xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            Z
          </div>
          <span className="text-lg font-semibold tracking-tight">Zeno</span>
        </div>

        <div className="ml-auto">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
              },
            }}
          />
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <nav
        className={cn(
          'lg:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="py-4 overflow-y-auto h-full">
          <div className="px-3 space-y-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} isActive={pathname === item.href} />
            ))}
          </div>

          <div className="mt-6 px-3">
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Intelligence
            </p>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavLink key={item.href} item={item} isActive={pathname === item.href} />
              ))}
            </div>
          </div>

          <div className="mt-6 px-3 space-y-1">
            {bottomNavItems.map((item) => (
              <NavLink key={item.href} item={item} isActive={pathname === item.href} />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom tab bar for mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 safe-bottom">
        {[mainNavItems[0], mainNavItems[2], secondaryNavItems[0], mainNavItems[5]].map(
          (item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-2xs font-medium">{item.title}</span>
            </Link>
          )
        )}
      </nav>
    </>
  )
}
