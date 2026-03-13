import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Architects_Daughter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['300', '400'],
})

const architectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  variable: '--font-architects-daughter',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Concurso Docente 2026',
  description: 'Simulacro no oficial basado en la normativa pública del Ministerio de Educación',
}

import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${architectsDaughter.variable} font-sans antialiased relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="relative z-10">
            {children}
          </div>
          <Toaster richColors position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
