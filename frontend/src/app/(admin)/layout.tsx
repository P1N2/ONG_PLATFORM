"use client"

import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-gray-600 text-xl font-bold mb-8">Admin Panel</h2>
        
        <nav className="space-y-4">
          <Link href="/dashboard" className="text-gray-600 block hover:text-blue-600 transition">
            Dashboard
          </Link>
          <Link href="/activities" className="text-gray-600 block hover:text-blue-600 transition">
            Activités
          </Link>
          <Link href="/services" className="text-gray-600 block hover:text-blue-600 transition">
            Services
          </Link>
        </nav>
      </aside>

    
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}