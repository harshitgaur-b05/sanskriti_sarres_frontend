"use client";

import React, { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface Blog {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  image?: string;
  createdAt?: string;
}

interface Props {
  blogs: Blog[];
  onRefresh: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function BlogTab({ blogs, onRefresh, showToast }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", image: "" });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      showToast("Title and Content are required for blog", "error");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast("Blog post published!");
        setForm({ title: "", content: "", image: "" });
        onRefresh();
      } else {
        showToast("Failed to create blog", "error");
      }
    } catch {
      showToast("Failed to create blog", "error");
    }
  };

  const handleDelete = async (blog: Blog) => {
    const id = blog._id || blog.id;
    if (!confirm(`Delete blog "${blog.title}"?`)) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/blogs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Blog deleted");
        onRefresh();
      }
    } catch {
      showToast("Failed to delete blog", "error");
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-amber-100">Publish Saree Blog Post</h2>
        <p className="text-sm text-neutral-400">
          Share weaving stories, saree draping guides, and heritage history.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6 mb-12">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Article Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. The Art of Handwoven Pure Kanjivaram Zari"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Cover Image (URL or Cloudinary Upload)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
            />
            <label
              htmlFor="blog-image-upload"
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/20 text-xs rounded-xl font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-base">cloud_upload</span>
              {isUploading ? "Uploading..." : "Upload to Cloudinary"}
            </label>
            <input
              id="blog-image-upload"
              type="file"
              accept="image/*"
              disabled={isUploading}
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsUploading(true);
                showToast("Uploading blog cover to Cloudinary...", "success");
                try {
                  const base64Data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  });
                  const res = await fetch(`${BACKEND_URL}/api/upload`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64Data, folder: "sanskriti_blogs" }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    if (data.url) {
                      set("image", data.url);
                      showToast("Uploaded to Cloudinary successfully!");
                    }
                  } else {
                    showToast("Failed to upload image to Cloudinary", "error");
                  }
                } catch (err) {
                  console.error(err);
                  showToast("Cloudinary upload failed", "error");
                } finally {
                  setIsUploading(false);
                  e.target.value = "";
                }
              }}
            />
          </div>
          {form.image && (
            <div className="mt-3 flex items-center gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
              <img src={form.image} alt="Blog Preview" className="w-12 h-12 object-cover rounded-lg border border-neutral-800" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">Cover Attached</span>
                <p className="text-xs text-neutral-400 truncate">{form.image}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Blog Content *
          </label>
          <textarea
            rows={6}
            required
            placeholder="Write your blog article here..."
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-semibold text-sm shadow-lg transition-all"
        >
          Publish Blog Article
        </button>
      </form>

      <h3 className="text-xl font-serif font-bold text-neutral-200 mb-4">Published Articles</h3>
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <p className="text-neutral-500 text-sm">No blogs published yet.</p>
        ) : (
          blogs.map((b) => (
            <div
              key={b._id || b.id}
              className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-amber-200 truncate">{b.title}</h4>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{b.content}</p>
              </div>
              <button
                onClick={() => handleDelete(b)}
                className="text-xs text-rose-400 hover:text-rose-300 shrink-0"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
