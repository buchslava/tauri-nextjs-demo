import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { Button, Progress } from "antd";

interface ProgressEventPayload {
  progress: number;
}

interface ProgressEventProps {
  payload: ProgressEventPayload;
}

export default function Home() {
  const [busy, setBusy] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [timeLabel, setTimeLabel] = useState<string>();

  useEffect(() => {
    const timeIntervalId = setInterval(() => {
      setTimeLabel(new Date().toLocaleTimeString());
    }, 1000);
    const unListen = listen("PROGRESS", (e: ProgressEventProps) => {
      setProgress(e.payload.progress);
    });

    return () => {
      clearInterval(timeIntervalId);
      unListen.then((f) => f());
    };
  }, []);

  return (
    <div>
      <div style={{ position: "fixed", top: 20, left: 20 }}>{timeLabel}</div>
      <div style={{ width: "70vw" }}>
        <Progress percent={progress} />
      </div>
      <Button
        type="primary"
        disabled={busy}
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
      </Button>
    </div>
  );
}
