"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const defaultPosts = [
  {
    id: "1",
    title: "The Anatomy of a Kanjivaram: Understanding Korvai",
    createdAt: "October 12, 2025",
    content: "Delve into the complex interlocking weave technique that defines authentic Kanchipuram silk sarees.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "2",
    title: "Reviving the Kadhuwa Brocade",
    createdAt: "September 28, 2025",
    content: "How our master weavers are bringing back the three-dimensional, hand-engraved motifs of ancient Varanasi.",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "3",
    title: "Styling Pastels for Winter Weddings",
    createdAt: "September 15, 2025",
    content: "A guide to draping sheer organzas and light silks for the modern bridal trousseau.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800"
  }
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/admin/blogs`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch((err) => console.log("Failed to fetch blogs", err));
  }, []);

  const displayBlogs = blogs.length > 0 ? blogs : defaultPosts;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 font-sans">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="font-label-md text-[10px] md:text-xs uppercase tracking-[0.25em] text-on-surface-variant block mb-4">Editorial & Stories</span>
        <h1 className="font-headline-lg lg:font-display-md text-headline-lg-mobile md:text-headline-lg lg:text-display-md text-on-surface mb-6">The Weaver's Journal</h1>
        <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
          Chronicles of heritage, craftsmanship, and the art of draping. Explore the stories behind the loom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {displayBlogs.map((post) => (
          <article key={post.id} className="group flex flex-col cursor-pointer border border-outline-variant/20 rounded-lg overflow-hidden p-4 bg-surface-container-lowest">
            <div className="aspect-[4/3] overflow-hidden rounded-md mb-6 bg-surface-container relative">
              <img
                src={post.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface px-3 py-1 text-[9px] font-label-md uppercase tracking-widest rounded-sm">
                  Handloom Story
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <span className="font-caption text-[11px] text-on-surface-variant uppercase tracking-widest mb-3">
                {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <h2 className="font-title-lg text-xl md:text-2xl text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="font-body-md text-xs md:text-sm text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
                {post.content}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
