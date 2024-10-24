# File Management System

A web-based file management system built using Vue 3, Vite, Node.js, Express, PostgreSQL, and Google Cloud Storage. This application allows users to manage files and folders, including uploading, renaming, deleting, and downloading files and folders, all through a clean and intuitive user interface.

- Demo: https://file-management-system-self.vercel.app/
- Backend repo: https://github.com/yunawinaya/fms-backend

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Recommended IDE Setup](#recommended-ide-setup)
- [Environment Variables](#environment-variables)
- [Project Setup](#project-setup)

## Features

- **File Management**: Upload, download, rename, and delete files.
- **Folder Management**: Create, rename, delete, and download folders (folders are zipped for download).
- **File Storage**: Integrates with Google Cloud Storage for secure file storage.
- **Responsive UI**: Built with Vue 3 and Tailwind CSS for a modern and responsive design.
- **Backend**: Powered by Node.js, Express, and PostgreSQL for a robust and scalable backend.

## Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, PostgreSQL
- **Cloud Storage**: Google Cloud Storage

## Recommended IDE Setup

Use [VSCode](https://code.visualstudio.com/) with the [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension (and disable Vetur) for an optimal Vue 3 development experience.

## Environment Variables

Create a `.env` file in the root directory to set up environment variables for the project. Below are the required variables:

```bash
DATABASE_URL=your_database_url
GCLOUD_KEY_BASE64=your_google_cloud_base64_key
GCLOUD_PROJECT_ID=your_google_cloud_project_id
GCLOUD_STORAGE_BUCKET=your_google_cloud_bucket_name
```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
