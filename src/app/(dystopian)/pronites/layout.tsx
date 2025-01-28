import React from "react";
import PronitesHeader from "@/components/(dystopian)/pronites/pronites-header";

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-screen w-screen grid-rows-[64px_auto] bg-neutral-900 md:grid-cols-[64px_auto] md:grid-rows-1">
      <div className="h-full w-full bg-neutral-900">
        <PronitesHeader />
      </div>
      <div className="relative h-full w-full bg-neutral-900">{children}</div>
    </div>
  );
}
