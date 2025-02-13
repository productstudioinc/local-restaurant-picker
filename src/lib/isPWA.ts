interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function isPWA() {
  if (typeof window === 'undefined') return false;

  // Check if the app is running in standalone mode (installed PWA)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as NavigatorWithStandalone).standalone
    || document.referrer.includes('android-app://');

  // Check if it's running on iOS in fullscreen mode
  const isIOSPWA = window.navigator.userAgent.includes('iPhone')
    && (window.navigator as NavigatorWithStandalone).standalone;

  if (isStandalone || isIOSPWA) {
    sessionStorage.setItem('isPWA', 'true');
  }

  return isStandalone || isIOSPWA || sessionStorage.getItem('isPWA') === 'true';
} 