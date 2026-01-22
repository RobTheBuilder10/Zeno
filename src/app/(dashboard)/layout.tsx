import { Sidebar, MobileNav } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main content */}
      <main className="lg:pl-64">
        {/* Mobile top spacing */}
        <div className="h-14 lg:h-0" />

        {/* Content area */}
        <div className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
          {children}
        </div>

        {/* Mobile bottom spacing for tab bar */}
        <div className="h-16 lg:h-0" />
      </main>
    </div>
  )
}
