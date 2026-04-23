import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Toaster, toast } from 'sonner'
import { usePage } from '@inertiajs/react'
import { ReactElement, useEffect } from 'react'

export default function Layout({ children }: { children: ReactElement<any> }) {
  const { url, props } = usePage<any>()

  useEffect(() => {
    toast.dismiss()
  }, [url])

  if (props.flash?.error) {
    toast.error(props.flash.error)
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-background-off">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  )
}
