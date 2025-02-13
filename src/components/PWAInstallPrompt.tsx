"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { isPWA } from "@/lib/isPWA";
import { ChevronDown, Plus, Home, Share } from "lucide-react";

export function PWAInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [appTitle, setAppTitle] = useState("Wisp AI");
  const [iconUrl, setIconUrl] = useState("/ios-icon.png");

  useEffect(() => {
    if (!isPWA()) {
      setIsVisible(true);
      setShouldRender(true);
    }

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const titleParam = params.get("title");
    const iconParam = params.get("iconUrl");

    if (titleParam && titleParam.trim() !== "") setAppTitle(titleParam);
    if (iconParam && iconParam.trim() !== "") setIconUrl(iconParam);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSkip = () => {
    setIsVisible(false);
    // Remove from DOM after animation completes
    setTimeout(() => setShouldRender(false), 300);
  };

  if (isPWA() || !shouldRender) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            backgroundImage: "url(/background.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="fixed inset-0 min-h-[100dvh] bg-background text-foreground"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="flex flex-col h-full max-w-md mx-auto px-6 relative">
            {/* Skip Button */}
            <div className="absolute top-4 right-4">
              <Button
                onClick={handleSkip}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Skip
              </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-start pt-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <img
                  src={iconUrl}
                  alt={`${appTitle} Icon`}
                  width={80}
                  height={80}
                  className="rounded-2xl shadow-lg"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mt-4 mb-6"
              >
                {appTitle}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full"
              >
                <Card className="border-none">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Install this Wisp app on your device
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Share className="w-8 h-8 text-primary shrink-0" />
                      <p className="text-base">
                        Tap the share button in your browser
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <Plus className="w-8 h-8 text-primary shrink-0" />
                      <p className="text-base">Select "Add to Home Screen"</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <Home className="w-8 h-8 text-primary shrink-0" />
                      <p className="text-base">
                        Find and open {appTitle} from your home screen
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Bottom Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center mb-18"
            >
              <Button
                onClick={handleRefresh}
                size="lg"
                className="rounded-full px-8 py-6 font-semibold mb-2"
              >
                I've installed the app
              </Button>

              <p className="text-sm text-muted-foreground mb-4">
                App made by Wisp AI
              </p>
              <motion.div
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="mb-1"
              >
                <ChevronDown className="w-6 h-6 text-muted-foreground" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
