import "@/app/globals.css"
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "Sky-It",
  description: "Social App for your images and posts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased `}
      >
        {children}
        <Toaster 
          position="bottom-center" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
            },
          }} 
        />
      </body>
    </html>
  );
}
