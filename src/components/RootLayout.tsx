import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { Toaster } from "./ui/sonner";
import { isPWA } from "../lib/isPWA";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="relative">
      {/* Fixed position elements that should always be on top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {!isPWA() && <PWAInstallPrompt />}
      </div>

      {/* Toaster with high z-index */}
      <Toaster position="top-center" className="z-[100]" />

      {/* Main content */}
      <div className="relative">{children}</div>
    </div>
  );
}
