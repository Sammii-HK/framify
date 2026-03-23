import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Build Your Website',
  description: 'Choose a template, add your business details, and publish your professional website in minutes. No coding required.',
  openGraph: {
    title: 'Build Your Website — CraftMyPage',
    description: 'Choose a template, add your business details, and publish your professional website in minutes. No coding required.',
    url: 'https://craftmypage.com/generate',
  },
  robots: { index: false },
}

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return children
}
