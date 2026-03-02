import "./globals.css"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"


export const metadata = {
  title: "ONG Platform",
  description: "Site officiel de notre ONG",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}