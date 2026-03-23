import './globals.css'
 
export const metadata = {
  title: 'Compliance Tracker',
  description: 'Track compliance tasks for clients',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
