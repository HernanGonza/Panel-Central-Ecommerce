/**
 * Notificaciones locales (Notification API), sin backend. Sirven para avisos
 * que se disparan mientras la PWA está abierta o recién en segundo plano en
 * el mismo dispositivo — no para push real server→celular con la app
 * cerrada, eso necesita un backend que la dispare (ver SUPABASE.md).
 */

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  return isNotificationSupported() ? Notification.permission : "unsupported";
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (!isNotificationSupported()) return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  return Notification.requestPermission();
}

export async function showNotification(
  title: string,
  options?: NotificationOptions,
): Promise<void> {
  if (!isNotificationSupported() || Notification.permission !== "granted") return;

  const registration = await navigator.serviceWorker?.getRegistration();
  if (registration) {
    await registration.showNotification(title, { icon: "/pwa/icon-192.png", ...options });
  } else {
    new Notification(title, { icon: "/pwa/icon-192.png", ...options });
  }
}
