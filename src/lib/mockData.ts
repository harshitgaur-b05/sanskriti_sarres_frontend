export interface SareeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  blouseFabric: string;
  tags: string[];
}

export const mockCategories = [
  { name: "Saree", count: 4776 },
  { name: "Kurta", count: 38 },
  { name: "Kurti", count: 13 },
  { name: "Kids Pavadai", count: 12 },
  { name: "Scarf", count: 1 },
];

export const mockBlouseFabrics = [
  { name: "Matching", count: 2378 },
  { name: "Contrast", count: 1915 },
  { name: "Attached - Contrast", count: 63 },
];

// Reusing some high quality images from the code.html and the design request context
export const mockProducts: SareeProduct[] = [
  {
    id: "p1",
    name: "Mustard Soft Silk Saree",
    description: "Elegant mustard soft silk saree with traditional borders.",
    price: 16186.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAxQ-c_tOVdvR9rfGDpaQnyLKBAZn8qgTa5HIpfVMH16ZYVZRr1h4D3lwSbfC5yluoMIE_3S6Gpo4BvEdEbEsuZQtkPlNBDc1CTJ3syv0YanpobuTWUYiWvIWoRRKC9uizwSdlDPRs2gWlNIG-72H5PuRUbCcFoRYRMSRTnQkGbxI8K0zt2vnmO4fQ7aoW9ypEDgf_232XXnTjznFsn-XVWwY-dnMttOWB7nUYkD19Jrz-A0unjngsqw",
    category: "Saree",
    blouseFabric: "Matching",
    tags: ["New Arrival"]
  },
  {
    id: "p2",
    name: "Grey Rajkot Patola Silk Saree",
    description: "Authentic Rajkot Patola silk saree with intricate weaves.",
    price: 18743.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH26DRvJ6XIhgyrt-k4I9lEw-gnKYA869kH-ZgwDQDukpI8viYqS2SpwxvdeVI5cVuivUknmT5dvWowf4NPULqhjl_S8rwrl021S-28UXk8m_4TTZQSAYIKm6iZVH7QCSagA8QZLnyCR1dS-l_oP-jbw3u7ydiross0CtH9jI0DU4r28KJgnt5UnhsPzyN9c8f_MTq3Optju-5QAmtPyqJ9ZrXcYV5SL-lwI8J244c7XiRCRdcsrBChA",
    category: "Saree",
    blouseFabric: "Contrast",
    tags: ["Featured"]
  },
  {
    id: "p3",
    name: "Rose Pink Kanchipuram Silk Saree",
    description: "Classic Kanchipuram silk saree in soft rose pink hue.",
    price: 34296.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ4RZvoobkbyKsHF_y6KKgRXZCqNffSngDlrgRtI-OsRkpL4s5tdIrQ09QBs_V1NPe6u7eWhsgrKqsue0siHYPnHyMNBdisSpyj5zbzd5TXUcXFYSz2hZUM8daVJtZKO4nQ70zzJJsmCCg_s2ebLcLKyjsBPfk7RudKBAOLgoIrXXjWJ-MeDULPtnhnHcltppdaZoWDS7PpJVsDosqwPHCzsLNG0xB4UqqBdUzJWw7cWMXf1x06btyIg",
    category: "Saree",
    blouseFabric: "Matching",
    tags: ["Bestseller"]
  },
  {
    id: "p4",
    name: "Sitara Violet Organza Silk Saree",
    description: "Lightweight sheer pastel organza saree with delicate resham floral hand-embroidery.",
    price: 8900.00,
    originalPrice: 11500.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdHHXPw7F2IlnycI2_FP80QxD6zYtbCddeTXgwmC3ozsmgGtKKm0ML4xMCNMrif4mqZIwdfBNJYlJ2N8XL4p_NzZiNGyy8nWV-qNIizej9_Dr_xOqFQdNenaP2-LvPcPomcSzNbDgylSuO1U22_qkdvxVGHJB_wKsYtk-QC9mglFa25PSMu1MlIaP9vooUW2UH5cQw7Q2xHzpZwpdsjwYxOQ9CQt9sbd3oXOJkbmUZXZRoouWmKFNA6g",
    category: "Saree",
    blouseFabric: "Attached - Contrast",
    tags: ["Bridal"]
  },
  {
    id: "p5",
    name: "Brick Orange Dual Tone Tussar Silk",
    description: "Hand-painted organzas and mulberry silk blends.",
    price: 14500.00,
    originalPrice: 18000.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAe5pwO7FvqRjVLlAjX7UfuTMRBXrK0mF_LS6Z9J1j5ek-S71K2c1dl0sqE1-7ea24equOV6vbhWweQA2WiqccnbuEQINNka8MrTJKbe7_9YagMfUCKDpa8xV-Pqgk85TLZfNnJv3kVY61IQDY0TQpzP1JscyAkCOjeeS_oEsNZG6h3M_XoG5OJZiBOFjlc0XGDvzxVx7fU9NGnSc_HfYuTBQ2XAE_8ZadzQRDoqyYw8ZZ-eT1kD5bEiA",
    category: "Saree",
    blouseFabric: "Matching",
    tags: ["New Arrival"]
  },
  {
    id: "p6",
    name: "Royal Blue Kanjivaram Silk Saree",
    description: "Interlocking Korvai borders, satin Banarasi Tanchoi.",
    price: 28500.00,
    originalPrice: 35000.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDaL_0GgZFp29-boefuPRBqwvh6s0pXNRYhhnNWZfsYFuBVf3lpew35xYXKkwEK534TaIo7AeifcLJ8IabCx7zjkcO-15_qMoBFwxm0KGlst7PVZLD6DXtKmlFZASxccTbjTXoEZwO2BpFqraz-yhh7ApscSYwBtyQAy838LM4gDZKOhpUkMRgbsWfSQXSmpBO9ea9O_ik6bNcugUnlxYNEo94w_PVbusHimdMwssxv1WEW6ajTVBS6g",
    category: "Saree",
    blouseFabric: "Contrast",
    tags: ["Featured"]
  }
];

export const priceCategories = [
  {
    id: "cat-1",
    label: "Under ₹5k",
    sublabel: "Light Cottons & Kota",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgT1uzDC_a0YbS_m9XQ8MvTBHoyC3HXUh-Kj6rmclDpCVYEb5vaGXTD3P3FPhLc_ac2o0b7rW9AYrIYZpUWubUS4CKteKggiGQvxPMV9GYb-skrpT6J7vZ5XdWKq5f6iHX9H6DmQzMtK0J4R_EWj22KEUHTOA5l-d-OxughdKeh03uqFSxO7TUmRJtT5oftfYTvfCgs0ORXt1ac6q9pCGgSmfwgP59SGMU0Z7x3hKogy6meiiRtQka3g"
  },
  {
    id: "cat-2",
    label: "₹5k - ₹10k",
    sublabel: "Chanderi & Organza",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnwUbwoG9KMw8ildIM_I9OMtS-V97ZZCF9cxBR_eneH6Hay4GE--JnIgocHgS9K7Hm09OdHuQjoAfIj1ItzjXm1onmQyKfscXP5IgBMo-1thHPtebDENPk8tYNFCjk6_m6j8Q2W90EB4A581s0ZvuSEtqBsofQcNX6W7Y0HkfBihDeKLrgAiFPBQ2dJKfMMJ4nAjbVdJjiZB8QDia8-Xy-PCWtYYhnE1zkTTcmA5n9qtBTqqrJcW6uKw"
  },
  {
    id: "cat-3",
    label: "₹10k - ₹20k",
    sublabel: "Tussar & Festive Silks",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAxQ-c_tOVdvR9rfGDpaQnyLKBAZn8qgTa5HIpfVMH16ZYVZRr1h4D3lwSbfC5yluoMIE_3S6Gpo4BvEdEbEsuZQtkPlNBDc1CTJ3syv0YanpobuTWUYiWvIWoRRKC9uizwSdlDPRs2gWlNIG-72H5PuRUbCcFoRYRMSRTnQkGbxI8K0zt2vnmO4fQ7aoW9ypEDgf_232XXnTjznFsn-XVWwY-dnMttOWB7nUYkD19Jrz-A0unjngsqw"
  },
  {
    id: "cat-4",
    label: "₹20k - ₹30k",
    sublabel: "Classic Handloom Silk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdHHXPw7F2IlnycI2_FP80QxD6zYtbCddeTXgwmC3ozsmgGtKKm0ML4xMCNMrif4mqZIwdfBNJYlJ2N8XL4p_NzZiNGyy8nWV-qNIizej9_Dr_xOqFQdNenaP2-LvPcPomcSzNbDgylSuO1U22_qkdvxVGHJB_wKsYtk-QC9mglFa25PSMu1MlIaP9vooUW2UH5cQw7Q2xHzpZwpdsjwYxOQ9CQt9sbd3oXOJkbmUZXZRoouWmKFNA6g"
  },
  {
    id: "cat-5",
    label: "₹30k - ₹50k",
    sublabel: "Bridal Kadhuwa Weaves",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDaL_0GgZFp29-boefuPRBqwvh6s0pXNRYhhnNWZfsYFuBVf3lpew35xYXKkwEK534TaIo7AeifcLJ8IabCx7zjkcO-15_qMoBFwxm0KGlst7PVZLD6DXtKmlFZASxccTbjTXoEZwO2BpFqraz-yhh7ApscSYwBtyQAy838LM4gDZKOhpUkMRgbsWfSQXSmpBO9ea9O_ik6bNcugUnlxYNEo94w_PVbusHimdMwssxv1WEW6ajTVBS6g"
  },
  {
    id: "cat-6",
    label: "₹50k - 1L+",
    sublabel: "Archival Gold Heirlooms",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZvM3E57CMnRpBkEYY66UAlZDc5G8bMzq6r5lPmyzR11lPTOI1Gl9gAQnmMgDs7CIpx2MUxOkMScfat01kyAjlWR7thajZrD1SX-2KPpSSIJ_3c-O-0Rw58Nmc3lqadYOnB7CjJC43cM22Nx5xAYzfEXrUqu0BAcGGjW3DyRDgwSt1NmEFLlbCNyRx92aQGwFnRxMYRIt6NuA1GwBAYBLIvsZFPU04zoMxjERv6sAH9CHHZgbunEsk4A"
  }
];
