# Gemini Flash API

API dan Chatbox sederhana untuk mengakses Google Gemini 1.5 Flash melalui berbagai mode input: teks, gambar, dokumen, dan audio.

## Fitur

- **/generate-text**: Menghasilkan teks dari prompt.
- **/generate-from-file**: Menghasilkan deskripsi atau analisis dari gambar.
- **/generate-from-document**: Analisis dokumen (PDF, DOC, TXT, dll).
- **/generate-from-audio**: Transkripsi atau analisis file audio.
- Frontend chatbox berbasis HTML + TailwindCSS.

## Instalasi

1. **Clone repository**
    ```sh
    git clone https://github.com/username/gemini-flash-api.git
    cd gemini-flash-api
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Buat file `.env`**
    - Salin `example.env` menjadi `.env`
    - Masukkan API key Gemini Anda:
      ```
      API_KEY=your_google_gemini_api_key
      ```

4. **Jalankan server**
    ```sh
    node index.js
    ```

5. **Buka Frontend**
    - Buka file `index.html (testing..)` di browser.

## Struktur Folder

- `index.js` — Source code backend Express API.
- `index.html (testing..)` — Frontend chatbox.
- `uploads/` — Folder sementara untuk upload file (otomatis dihapus).
- `.env` — File environment (jangan commit ke git).
- `package.json` — Daftar dependensi.

## Contoh Penggunaan API

### Generate Text
```http
POST /generate-text
Content-Type: application/json

{
  "prompt": "Jelaskan teori relativitas"
}
```

### Generate from Image
```http
POST /generate-from-file
Form-Data: file (image), prompt (opsional)
```

### Generate from Document
```http
POST /generate-from-document
Form-Data: document (pdf/doc/txt), prompt (opsional)
```

### Generate from Audio
```http
POST /generate-from-audio
Form-Data: audio (audio file), prompt (opsional)
```

## Catatan

- Pastikan API key Google Gemini Anda aktif dan memiliki akses ke model `gemini-1.5-flash`.
- File yang diupload akan dihapus otomatis setelah diproses.
- Untuk testing frontend, buka file `index.html (testing..)` secara langsung di browser.

## Lisensi

ISC