"use client";

import React from "react";
import "./styles.css";
import ReactQueryProvider from "./ReactQueryProvider";
import AuthProvider from "./AuthContextProvider";
import SideNav from "@/components/SideNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuthProvider from "./OAuthProvider";

export interface ChildrenProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ChildrenProps) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <OAuthProvider>
          <html lang="en">
            <body className="h-screen w-screen overflow-hidden">
              <div className="h-full w-full font-custom">
                <div className="flex flex-wrap w-full h-full">
                  <SideNav />
                  {children}
                </div>
              </div>
              <ToastContainer />
            </body>
          </html>
        </OAuthProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
