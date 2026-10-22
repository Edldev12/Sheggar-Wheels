
import "./globals.css";

export const metadata = {
  title: "Sheggar Wheels | Car Rental Marketplace",
  description:
    "Discover and book cars for rent in Addis Ababa with Sheggar Wheels.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
