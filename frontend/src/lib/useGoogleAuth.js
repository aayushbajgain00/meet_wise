// /src/lib/useGoogleAuth.js
import { useCallback, useRef, useState } from "react";
import api from "./api";

const MESSAGE_TYPE = "google-auth";
const POPUP_NAME = "google-oauth";
const POPUP_FEATURES =
  "width=500,height=650,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";

export default function useGoogleAuth({ onSuccess, onError } = {}) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const listenerRef = useRef(null);
  const timerRef = useRef(null);
  const completedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (listenerRef.current) {
      window.removeEventListener("message", listenerRef.current);
      listenerRef.current = null;
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startGoogleAuth = useCallback(() => {

    const backendBaseUrl = (api.defaults.baseURL || "http://localhost:5000").replace(/\/$/, "");
    // Add the known query param to skip ngrok's browser warning page
    const authUrl = `${backendBaseUrl}/api/user/google?ngrok-skip-browser-warning=1`;

    const backendOrigin = new URL(backendBaseUrl).origin;

    completedRef.current = false;
    setGoogleLoading(true);

    const popup = window.open(authUrl, POPUP_NAME, POPUP_FEATURES);
    if (!popup) {
      setGoogleLoading(false);
      onError?.(
        "Unable to open Google sign-in window. Please disable your pop-up blocker and try again."
      );
      return;
    }

    listenerRef.current = (event) => {
      // Only trust messages from our backend origin (ngrok/localhost)
      if (event.origin !== backendOrigin) return;

      const { type, payload } = event.data || {};
      if (type !== MESSAGE_TYPE) return;

      completedRef.current = true;
      cleanup();
      setGoogleLoading(false);

      if (payload?.success) {
        onSuccess?.(payload);
      } else {
        onError?.(payload?.message || "Google authentication failed.");
      }

      try {
        popup.close();
      } catch {
        // Ignore errors if popup is already closed or cannot be closed
      }
    };

    window.addEventListener("message", listenerRef.current);

    // Watch for user closing the popup early
    timerRef.current = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        if (!completedRef.current) {
          setGoogleLoading(false);
          onError?.("Google sign-in was cancelled.");
        }
      }
    }, 500);

    popup.focus();
  }, [cleanup, onError, onSuccess]);

  return { startGoogleAuth, googleLoading };
}
