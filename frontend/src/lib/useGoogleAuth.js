import { useCallback, useRef, useState } from "react";

import api from "./api";

const MESSAGE_TYPE = "google-auth";
const POPUP_NAME = "google-oauth";
const POPUP_FEATURES = "width=500,height=650,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";

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
    const authUrl = `${backendBaseUrl}/api/user/google`;
    const backendOrigin = new URL(backendBaseUrl).origin;

    completedRef.current = false;
    setGoogleLoading(true);

    const popup = window.open(authUrl, POPUP_NAME, POPUP_FEATURES);
    if (!popup) {
      setGoogleLoading(false);
      onError?.("Unable to open Google sign-in window. Please disable your pop-up blocker and try again.");
      return;
    }

    listenerRef.current = (event) => {
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

      popup.close();
    };

    window.addEventListener("message", listenerRef.current);

    timerRef.current = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        window.clearInterval(timerRef.current);
        timerRef.current = null;
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
