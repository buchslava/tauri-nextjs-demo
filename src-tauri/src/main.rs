#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::Window;
use std::{thread, time};

#[derive(Clone, serde::Serialize)]
struct Payload {
    progress: i16,
}

#[tauri::command]
async fn progress_tracker(window: Window){
  let mut progress = 0;
  loop {
      window.emit("PROGRESS", Payload { progress }).unwrap();
      let delay = time::Duration::from_millis(100);
      thread::sleep(delay);
      progress += 1;
      if progress > 100 {
        break;
      }
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![progress_tracker])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
