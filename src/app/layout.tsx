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
      <head>
        <head>
          <title>Anywhere - find your next onchain meetup</title>
          <meta
            name="description"
            content="Crowdsource your next in-person meetup. Get paid to host IRL meetups and let your guests earn by bringing a friend."
          />
          <meta
            property="og:title"
            content="Anywhere - find your next onchain meetup"
          />
          <meta
            property="og:description"
            content="Crowdsource your next in-person meetup. Get paid to host IRL meetups and let your guests earn by bringing a friend."
          />
          <meta property="og:image" content="/main-bg.png" />
          <link
            href="/favicon.ico"
            rel="shortcut icon"
            type="image/x-icon"
          ></link>
        </head>
      </head>
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
