// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use image::{
    codecs::{bmp::BmpEncoder, jpeg::JpegEncoder, png::PngEncoder, tiff::TiffEncoder},
    DynamicImage, ImageEncoder,
};
use serde::{Deserialize, Serialize};
use std::{
    fs::{self, File},
    io::BufWriter,
    path::Path,
};
use webp::*;

#[derive(Serialize, Deserialize, Clone, Copy)]
enum ImageFormat {
    WEBP,
    JPG,
    PNG,
    TIFF,
    BMP,
}

#[derive(Serialize, Deserialize, Clone)]
struct Image {
    format: ImageFormat,
    name: String,
    quality: i8,
    src: String,
}

async fn process_images(files: Vec<Image>, folder_to_save: &str) -> i8 {
    let mut converted_files = 0;

    for file in files {
        let data = file.clone();
        let img = image::open(file.src);

        match img {
            Ok(_img) => match encode_image(data, &_img, folder_to_save) {
                Ok(_) => {
                    converted_files += 1;
                }
                Err(err) => {
                    println!("Error while processing the image {}: {}", file.name, err);
                }
            },
            Err(err) => {
                println!("Error while loading the image {}: {}", data.name, err);
            }
        }
    }

    return converted_files;
}

fn encode_image(data: Image, img: &DynamicImage, folder_to_save: &str) -> Result<(), String> {
    let file_extension = get_format_extension(data.format);
    let new_path = Path::new(folder_to_save)
        .join(data.name)
        .with_extension(file_extension);

    match data.format {
        ImageFormat::JPG => {
            let new_file: File = File::create(new_path.clone()).unwrap();
            let ref mut buff = BufWriter::new(new_file);
            let encoder = JpegEncoder::new(buff);
            // Encode to `jpg`
            match encoder.write_image(img.as_bytes(), img.width(), img.height(), img.color()) {
                Ok(_) => Ok(()),
                Err(err) => {
                    // Delete unprocessed image
                    fs::remove_file(new_path).unwrap();

                    Err(err.to_string())
                }
            }
        }
        ImageFormat::PNG => {
            let new_file: File = File::create(new_path.clone()).unwrap();
            let ref mut buff = BufWriter::new(new_file);
            let encoder = PngEncoder::new(buff);
            // Encode to `png`
            match encoder.write_image(img.as_bytes(), img.width(), img.height(), img.color()) {
                Ok(_) => Ok(()),
                Err(err) => {
                    // Delete unprocessed image
                    fs::remove_file(new_path).unwrap();

                    Err(err.to_string())
                }
            }
        }
        ImageFormat::TIFF => {
            let new_file: File = File::create(new_path.clone()).unwrap();
            let ref mut buff = BufWriter::new(new_file);
            let encoder = TiffEncoder::new(buff);
            // Encode to `tiff`
            match encoder.write_image(img.as_bytes(), img.width(), img.height(), img.color()) {
                Ok(_) => Ok(()),
                Err(err) => {
                    // Delete unprocessed image
                    fs::remove_file(new_path).unwrap();

                    Err(err.to_string())
                }
            }
        }
        ImageFormat::BMP => {
            let new_file: File = File::create(new_path.clone()).unwrap();
            let ref mut buff = BufWriter::new(new_file);
            let encoder = BmpEncoder::new(buff);
            // Encode to `tiff`
            match encoder.write_image(img.as_bytes(), img.width(), img.height(), img.color()) {
                Ok(_) => Ok(()),
                Err(err) => {
                    // Delete unprocessed image
                    fs::remove_file(new_path).unwrap();

                    Err(err.to_string())
                }
            }
        }
        ImageFormat::WEBP => {
            let encoder: Result<Encoder<'_>, &str> = Encoder::from_image(&img);

            match encoder {
                Ok(_encoder) => {
                    let webp: WebPMemory = _encoder.encode(data.quality as f32);

                    match fs::write(&new_path, &*webp) {
                        Ok(_) => Ok(()),
                        Err(err) => Err(err.to_string()),
                    }
                }
                Err(err) => Err(err.to_string()),
            }
        }
    }
}

fn get_format_extension(format: ImageFormat) -> String {
    match format {
        ImageFormat::JPG => String::from("jpg"),
        ImageFormat::PNG => String::from("png"),
        ImageFormat::WEBP => String::from("webp"),
        ImageFormat::TIFF => String::from("tiff"),
        ImageFormat::BMP => String::from("bmp"),
    }
}

#[tauri::command]
async fn convert_images(files: Vec<Image>, folder_to_save: String) -> i8 {
    let converted_images = process_images(files, folder_to_save.as_str()).await;

    return converted_images;
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![convert_images])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
