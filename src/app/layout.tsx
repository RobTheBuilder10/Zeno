import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'Zeno - Your Personal Finance Command Center',
    template: '%s | Zeno',
  },
  description:
    'Zeno turns financial chaos into clarity. Get organized, see what matters, and take confident next steps with AI-powered guidance.',
  keywords: [
    'personal finance',
    'budgeting',
    'money management',
    'financial planning',
    'AI finance',
    'debt payoff',
    'savings goals',
  ],
  authors: [{ name: 'Zeno' }],
  creator: 'Zeno',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zeno.finance',
    title: 'Zeno - Your Personal Finance Command Center',
    description:
      'Turn financial chaos into clarity with AI-powered guidance.',
    siteName: 'Zeno',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno - Your Personal Finance Command Center',
    description:
      'Turn financial chaos into clarity with AI-powered guidance.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: 'hsl(220, 90%, 56%)',
          colorBackground: 'hsl(0, 0%, 100%)',
          colorInputBackground: 'hsl(0, 0%, 100%)',
          colorInputText: 'hsl(220, 20%, 10%)',
          borderRadius: '0.625rem',
        },
        elements: {
          formButtonPrimary:
            'bg-primary hover:bg-primary/90 text-primary-foreground',
          card: 'shadow-md',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton:
            'border-border hover:bg-secondary text-foreground',
          formFieldLabel: 'text-foreground',
          formFieldInput:
            'border-input bg-background text-foreground focus:ring-primary',
          footerActionLink: 'text-primary hover:text-primary/90',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
