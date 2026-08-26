import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []

  return (
    <footer className="bg-black border-t border-white/10 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/" className="font-black text-lg text-white">
            My<span className="text-indigo-400">Site</span>
          </Link>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {navItems.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            {navItems.map(({ link }, i) => (
              <CMSLink className="text-gray-400 hover:text-white transition-colors" key={i} {...link} />
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}
