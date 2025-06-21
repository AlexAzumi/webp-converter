![GitHub release](https://img.shields.io/github/v/release/alexazumi/webp-converter)
[![CodeFactor](https://www.codefactor.io/repository/github/alexazumi/webp-converter/badge)](https://www.codefactor.io/repository/github/alexazumi/webp-converter)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/alexazumi/webp-converter/main.yml)

# WebP Converter

Multi-platform desktop app that lets you convert `.webp` images to `.jpg` or `.png`, and viceversa!

![WebP Converter](https://github.com/user-attachments/assets/115f8945-baf0-4b1d-bf22-f368d0a1fe58)

## Installation

You can find the binaries [here](https://github.com/AlexAzumi/webp-converter/releases). Available for Windows, MacOS and Linux.

## Building the app

### Requirements

* Node.js v22.14.0 or higher
* Rust compiler or rustc v1.87.0 or higher
* Git 2.47.1 (only for cloning the project, downloading from here works just fine)

### 1. Clone the project

```bash
git clone https://github.com/AlexAzumi/webp-converter.git
cd webp-converter
```

### 2. Install the project dependencies

```bash
npm install
```

### 3. Build the project

```bash
npm run tauri build
```

The compiling time will depend on your computer specs since it needs to download and compile all Rust dependencies, including the app itself.

By default, the program will take the host computer as the target os, more information can be found on the [Tauri building guide](https://v2.tauri.app/distribute/#building).

Once it's finished, the artifacts can be found on `/src-tauri/target/release`.

It also generates the bundle or installation program, that can be found on `/src-tauri/release/bundle`.
