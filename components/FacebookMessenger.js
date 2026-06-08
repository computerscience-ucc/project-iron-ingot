import { useEffect, useRef, useState } from "react";
import styles from "./FacebookMessenger.module.css";

const FB_SDK_URL = "https://connect.facebook.net/en_US/sdk.js";
const FB_SDK_VERSION = "v21.0";

function loadFBSdk(appId) {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.FB) {
      resolve(window.FB);
      return;
    }

    if (typeof window !== "undefined" && document.getElementById("facebook-jssdk")) {
      const checkFB = setInterval(() => {
        if (window.FB) {
          clearInterval(checkFB);
          resolve(window.FB);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(checkFB);
        reject(new Error("FB SDK load timeout"));
      }, 10000);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: false,
        version: FB_SDK_VERSION,
      });
      resolve(window.FB);
    };

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = `${FB_SDK_URL}#sdkasync`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load FB SDK"));
    document.head.appendChild(script);
  });
}

export default function FacebookMessenger({
  pageId,
  appId,
  greetingText = "Hi! How can we help you?",
  color: themeColor = "#0084FF",
  loggedInGreeting = "Welcome back! Send us a message.",
  fontSize = 16,
  className = "",
}) {
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!pageId || !appId) return;
    if (pageId === "YOUR_FB_PAGE_ID" || appId === "YOUR_FB_APP_ID") return;

    let mounted = true;

    loadFBSdk(appId)
      .then((FB) => {
        if (!mounted) return;
        setSdkReady(true);

        const renderChat = () => {
          if (!containerRef.current) return;
          containerRef.current.innerHTML = "";
          const chatDiv = document.createElement("div");
          chatDiv.className = "fb-customerchat";
          chatDiv.setAttribute("page_id", pageId);
          chatDiv.setAttribute("theme_color", themeColor);
          chatDiv.setAttribute("logged_in_greeting", loggedInGreeting);
          chatDiv.setAttribute("logged_out_greeting", greetingText);
          chatDiv.setAttribute("greeting_dialog_display", "show");
          chatDiv.setAttribute("greeting_dialog_delay", "0");
          chatDiv.setAttribute("minimized", "false");
          containerRef.current.appendChild(chatDiv);

          try {
            FB.XFBML.parse(containerRef.current);
          } catch (e) {
            console.warn("FB Messenger parse error:", e);
          }
        };

        if (document.readyState === "complete") {
          renderChat();
        } else {
          window.addEventListener("load", renderChat);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn("Facebook Messenger SDK failed to load:", err.message);
        setError(true);
      });

    return () => {
      mounted = false;
    };
  }, [pageId, appId, greetingText, themeColor, loggedInGreeting]);

  if (!pageId || !appId) return null;
  if (pageId === "YOUR_FB_PAGE_ID" || appId === "YOUR_FB_APP_ID") return null;
  if (error) return null;

  return (
    <div
      ref={containerRef}
      className={`${styles.messengerWidget} ${className}`}
    />
  );
}
