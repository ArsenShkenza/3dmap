import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata = {
  title: "PRO X | Visionary Investments",
  description:
    "Investor-facing 3D map concept for premium real estate opportunities across Albania and Kosovo."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
