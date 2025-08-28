"use client";

import { MantineProvider } from "@mantine/core";
import QueryProvider from "@/components/core/QueryProvider";
import "@mantine/core/styles.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <QueryProvider>{children}</QueryProvider>
    </MantineProvider>
  );
}
