import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Vox Flow',
  description: 'A website built with TypeScript, JavaScript, Next.js, and Tailwind CSS offers text-to-speech and speech-to-text features. It uses three APIs for accurate and swift conversions, prioritizing accessibility and user convenience.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
