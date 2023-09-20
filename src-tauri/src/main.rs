// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{ Serialize, Deserialize };
use std::{ path::Path, fs };
use webp::*;

#[derive(Serialize, Deserialize)]
struct Image {
  name: String,
  src: String,
  quality: i8,
}

#[tauri::command]
fn convert_images(files: Vec<Image>, folder_to_save: &str) -> i8 {
  let mut converted_files = 0;

  for file in files {
    let img = image::open(file.src).unwrap();

    let encoder = Encoder::from_image(&img).unwrap();
    let webp: WebPMemory = encoder.encode(file.quality as f32);
    let output_path = Path::new(folder_to_save).join(file.name).with_extension("webp");
    fs::write(&output_path, &*webp).unwrap();

    converted_files += 1;
  }

  return converted_files;
}

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(tauri::generate_handler![convert_images])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
