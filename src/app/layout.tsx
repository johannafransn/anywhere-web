import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import Web3ModalProvider from "@/context";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Anywhere",
  description:
    "Crowdsource your next in-person meetup. Get paid to host IRL meetups and let your guests earn by bringing a friend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className="tracking-tight">
        <Web3ModalProvider initialState={initialState}>
          <main className="flex flex-col px-12 py-2">
            <Navbar />
            <div className="py-9">{children}</div>
          </main>
          {/*         <Footer></Footer> */}
          <ToastContainer />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
