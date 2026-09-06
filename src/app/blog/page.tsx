import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "The Anatomy of a Kanjivaram: Understanding Korvai",
      date: "October 12, 2025",
      category: "Craft",
      excerpt: "Delve into the complex interlocking weave technique that defines authentic Kanchipuram silk sarees.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdHHXPw7F2IlnycI2_FP80QxD6zYtbCddeTXgwmC3ozsmgGtKKm0ML4xMCNMrif4mqZIwdfBNJYlJ2N8XL4p_NzZiNGyy8nWV-qNIizej9_Dr_xOqFQdNenaP2-LvPcPomcSzNbDgylSuO1U22_qkdvxVGHJB_wKsYtk-QC9mglFa25PSMu1MlIaP9vooUW2UH5cQw7Q2xHzpZwpdsjwYxOQ9CQt9sbd3oXOJkbmUZXZRoouWmKFNA6g"
    },
    {
      id: 2,
      title: "Reviving the Kadhuwa Brocade",
      date: "September 28, 2025",
      category: "Heritage",
      excerpt: "How our master weavers are bringing back the three-dimensional, hand-engraved motifs of ancient Varanasi.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDaL_0GgZFp29-boefuPRBqwvh6s0pXNRYhhnNWZfsYFuBVf3lpew35xYXKkwEK534TaIo7AeifcLJ8IabCx7zjkcO-15_qMoBFwxm0KGlst7PVZLD6DXtKmlFZASxccTbjTXoEZwO2BpFqraz-yhh7ApscSYwBtyQAy838LM4gDZKOhpUkMRgbsWfSQXSmpBO9ea9O_ik6bNcugUnlxYNEo94w_PVbusHimdMwssxv1WEW6ajTVBS6g"
    },
    {
      id: 3,
      title: "Styling Pastels for Winter Weddings",
      date: "September 15, 2025",
      category: "Editorial",
      excerpt: "A guide to draping sheer organzas and light silks for the modern bridal trousseau.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnwUbwoG9KMw8ildIM_I9OMtS-V97ZZCF9cxBR_eneH6Hay4GE--JnIgocHgS9K7Hm09OdHuQjoAfIj1ItzjXm1onmQyKfscXP5IgBMo-1thHPtebDENPk8tYNFCjk6_m6j8Q2W90EB4A581s0ZvuSEtqBsofQcNX6W7Y0HkfBihDeKLrgAiFPBQ2dJKfMMJ4nAjbVdJjiZB8QDia8-Xy-PCWtYYhnE1zkTTcmA5n9qtBTqqrJcW6uKw"
    }
  ];

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="font-label-md text-[10px] md:text-xs uppercase tracking-[0.25em] text-on-surface-variant block mb-4">Editorial & Stories</span>
        <h1 className="font-headline-lg lg:font-display-md text-headline-lg-mobile md:text-headline-lg lg:text-display-md text-on-surface mb-6">The Weaver's Journal</h1>
        <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
          Chronicles of heritage, craftsmanship, and the art of draping. Explore the stories behind the loom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {posts.map((post) => (
          <article key={post.id} className="group flex flex-col cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden rounded-md mb-6 bg-surface-container relative">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface px-3 py-1 text-[9px] font-label-md uppercase tracking-widest rounded-sm">
                  {post.category}
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <span className="font-caption text-[11px] text-on-surface-variant uppercase tracking-widest mb-3">{post.date}</span>
              <h2 className="font-title-lg text-xl md:text-2xl text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-auto">
                 <Link href="#" className="inline-flex items-center gap-2 font-label-md text-[10px] uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors">
                  <span>Read Story</span>
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
       
       <div className="mt-16 md:mt-24 text-center">
          <button className="bg-transparent border border-outline-variant text-on-surface font-label-md text-xs uppercase tracking-widest px-8 py-3 rounded-sm hover:border-primary hover:text-primary transition-colors">
            Load More Articles
          </button>
       </div>
    </div>
  );
}
