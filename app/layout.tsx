import type React from "react"
import type { Metadata, Viewport } from "next"
import { Bangers, Open_Sans } from "next/font/google"
import "./globals.css"
import "../styles/leaflet.css"

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
})

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "History Game",
  description: "Educational history game",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${bangers.variable} ${openSans.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  )
}
