import { Poppins } from "next/font/google";
import "./globals.css";

// Load Google Font
const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
	subsets: ["latin"],
});

export const metadata = {
	title: "Mood Music by AI",
	description: "Creater Shiva Pandey, this is a music app that uses AI to generate music based on your mood.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
