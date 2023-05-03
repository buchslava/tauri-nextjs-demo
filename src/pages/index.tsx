import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

interface ProgressEventPayload {
  progress: number;
}

interface ProgressEventProps {
  payload: ProgressEventPayload;
}

export default function Home() {
  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    const unListen = listen("PROGRESS", (e: ProgressEventProps) => {
      console.log(e.payload.progress);
    });

    return () => {
      unListen.then((f) => f());
    };
  }, []);

  return (
    <div>
      {!busy && (
        <button
          onClick={() => {
            setBusy(true);
            setTimeout(async () => {
              const { appWindow } = await import("@tauri-apps/api/window");
              await invoke("progress_tracker", {
                window: appWindow,
              });
              setBusy(false);
            }, 1000);
          }}
        >
          Start Progress
        </button>
      )}
    </div>
  );
}
