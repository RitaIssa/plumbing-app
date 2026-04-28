"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

type Props = {
  defaultUrl?: string | null;
  name?: string;
};

export default function ImageUpload({ defaultUrl, name = "imageUrl" }: Props) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP)");
      return;
    }
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
      } else {
        setUrl(data.url);
      }
    } catch {
      setError("Upload failed — check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  return (
    <div>
      {/* Carries the stored URL into the server action */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Product preview"
            className="w-24 h-24 rounded-lg object-cover border border-slate-200 dark:border-slate-600 shrink-0"
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setUrl("")}
              className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
              Remove image
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              <Upload className="w-3 h-3" />
              Replace
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
              }}
            />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors select-none ${
            dragging
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
            }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Uploading…</p>
            </div>
          ) : (
            <>
              <ImageIcon className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Drag & drop or{" "}
                <span className="text-blue-500 font-medium">click to upload</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}
