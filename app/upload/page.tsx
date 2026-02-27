"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "1"); // example user

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    alert(`File uploaded: ${data.url}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <button type="submit">Upload</button>
    </form>
  );
}