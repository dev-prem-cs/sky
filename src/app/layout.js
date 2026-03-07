import "@/app/globals.css"

export const metadata = {
  title: "Sky-It",
  description: "Social App for your images and posts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
