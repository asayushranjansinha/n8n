"use client";
import { useEffect } from "react";
/**
 * A custom React hook that listens for a specific keyboard shortcut involving the Command (⌘) or Control (⌃) key.
 * When the specified key combination is pressed, it executes a provided callback function.
 *
 * @param {string} key The key to listen for (e.g., "s" for Cmd/Ctrl + S).
 * @param {() => void} callback The function to execute when the key combination is pressed.
 */

export function useCmdCtrlKey(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const pressed = e.key.toLowerCase();
      const target = key.toLowerCase();

      if ((e.metaKey || e.ctrlKey) && pressed === target) {
        console.log("🔥 Hotkey detected:", { pressed, target, meta: e.metaKey, ctrl: e.ctrlKey });
        e.preventDefault();
        callback();
        console.log("✅ Callback executed for key:", key);
      } else {
        console.log("⌨ Keydown ignored:", { pressed, meta: e.metaKey, ctrl: e.ctrlKey });
      }
    };

    console.log("👀 Listening for Cmd/Ctrl +", key);
    window.addEventListener("keydown", handler);
    return () => {
      console.log("🛑 Stopped listening for key:", key);
      window.removeEventListener("keydown", handler);
    };
  }, [key, callback]);
}
