import { NextResponse } from "next/server";
import { addItem, saveSettings } from "@/lib/firebase-service";

const SAMPLE_OUTFITS = [
  {
    title: "Elegant Office Ensemble",
    cat: "Office Wear",
    img: "https://i.pinimg.com/564x/a1/b2/c3/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.jpg",
    desc: "A polished office look that transitions effortlessly from boardroom to after-hours. Pair with minimal accessories for a refined finish.",
    link: "https://amazon.in/dp/example1?tag=opalrouge-21",
    featured: "yes",
  },
  {
    title: "Festive Glamour Look",
    cat: "Festive & Eid",
    img: "https://i.pinimg.com/564x/b2/c3/d4/b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7.jpg",
    desc: "Shine bright this festive season with this stunning ensemble. Rich fabrics and elegant draping create a look that's both traditional and contemporary.",
    link: "https://amazon.in/dp/example2?tag=opalrouge-21",
    featured: "yes",
  },
  {
    title: "Weekend Casual Chic",
    cat: "Casual",
    img: "https://i.pinimg.com/564x/c3/d4/e5/c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8.jpg",
    desc: "Effortless weekend style that doesn't compromise on elegance. Comfortable yet put-together — perfect for brunches and casual outings.",
    link: "https://amazon.in/dp/example3?tag=opalrouge-21",
    featured: "yes",
  },
  {
    title: "Street Style Statement",
    cat: "Street Style",
    img: "https://i.pinimg.com/564x/d4/e5/f6/d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9.jpg",
    desc: "Bold, edgy, and unapologetically cool. This street style look combines urban attitude with feminine flair.",
    link: "https://amazon.in/dp/example4?tag=opalrouge-21",
    featured: "yes",
  },
  {
    title: "Spring Bloom Outfit",
    cat: "Spring Style",
    img: "https://i.pinimg.com/564x/e5/f6/a7/e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0.jpg",
    desc: "Welcome the season with fresh florals and breezy silhouettes. This spring look is all about light layers and soft pastels.",
    link: "https://amazon.in/dp/example5?tag=opalrouge-21",
    featured: "yes",
  },
  {
    title: "Cultural Heritage Look",
    cat: "Cultural Fashion",
    img: "https://i.pinimg.com/564x/f6/a7/b8/f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg",
    desc: "Celebrate cultural roots with this beautifully crafted ensemble. Traditional weaves meet modern silhouettes in this stunning look.",
    link: "https://amazon.in/dp/example6?tag=opalrouge-21",
    featured: "no",
  },
];

const SAMPLE_ACCESSORIES = [
  {
    title: "Gold Layered Necklace Set",
    cat: "Necklaces",
    img: "https://i.pinimg.com/564x/11/22/33/11223344556677889900112233445566.jpg",
    link: "https://amazon.in/dp/acc1?tag=opalrouge-21",
    price: "₹899",
    badge: "Bestseller",
    desc: "Elegant gold-plated layered necklace perfect for both ethnic and western outfits.",
    featured: "yes",
  },
  {
    title: "Rose Gold Statement Ring",
    cat: "Rings",
    img: "https://i.pinimg.com/564x/22/33/44/22334455667788990011223344556677.jpg",
    link: "https://amazon.in/dp/acc2?tag=opalrouge-21",
    price: "₹499",
    badge: "New",
    desc: "A delicate rose gold statement ring that adds instant elegance to any look.",
    featured: "yes",
  },
  {
    title: "Pearl Drop Earrings",
    cat: "Earrings",
    img: "https://i.pinimg.com/564x/33/44/55/33445566778899001122334455667788.jpg",
    link: "https://amazon.in/dp/acc3?tag=opalrouge-21",
    price: "₹599",
    badge: "",
    desc: "Classic pearl drop earrings that never go out of style. Perfect for formal occasions.",
    featured: "yes",
  },
  {
    title: "Woven Waist Chain",
    cat: "Waist Chains",
    img: "https://i.pinimg.com/564x/44/55/66/44556677889900112233445566778899.jpg",
    link: "https://amazon.in/dp/acc4?tag=opalrouge-21",
    price: "₹349",
    badge: "Sale",
    desc: "Beautiful woven waist chain that adds a touch of glamour to sarees and lehengas.",
    featured: "yes",
  },
  {
    title: "Structured Mini Handbag",
    cat: "Bags",
    img: "https://i.pinimg.com/564x/55/66/77/55667788990011223344556677889900.jpg",
    link: "https://amazon.in/dp/acc5?tag=opalrouge-21",
    price: "₹1299",
    badge: "",
    desc: "A structured mini handbag in blush pink — perfect for evening outings.",
    featured: "yes",
  },
  {
    title: "Classic Leather Watch",
    cat: "Watches",
    img: "https://i.pinimg.com/564x/66/77/88/66778899001122334455667788990011.jpg",
    link: "https://amazon.in/dp/acc6?tag=opalrouge-21",
    price: "₹2499",
    badge: "Bestseller",
    desc: "Minimalist leather-strap watch with rose gold dial. Timeless elegance.",
    featured: "yes",
  },
  {
    title: "Oversized Cat-Eye Sunglasses",
    cat: "Sunglasses",
    img: "https://i.pinimg.com/564x/77/88/99/77889900112233445566778899001122.jpg",
    link: "https://amazon.in/dp/acc7?tag=opalrouge-21",
    price: "₹699",
    badge: "New",
    desc: "Retro-inspired oversized cat-eye sunglasses with UV protection.",
    featured: "yes",
  },
  {
    title: "Crystal Bracelet Set",
    cat: "Bracelets",
    img: "https://i.pinimg.com/564x/88/99/00/88990011223344556677889900112233.jpg",
    link: "https://amazon.in/dp/acc8?tag=opalrouge-21",
    price: "₹449",
    badge: "",
    desc: "Set of 3 crystal bracelets that stack beautifully together.",
    featured: "no",
  },
];

const SAMPLE_SHOP = [
  {
    title: "Complete Office Look",
    cat: "Office Wear",
    img: "https://i.pinimg.com/564x/99/00/11/99001122334455667788990011223344.jpg",
    products:
      "Tailored Blazer | https://amazon.in/dp/shop1a?tag=opalrouge-21\nSilk Blouse | https://amazon.in/dp/shop1b?tag=opalrouge-21\nWide-Leg Trousers | https://amazon.in/dp/shop1c?tag=opalrouge-21\nPointed Heels | https://amazon.in/dp/shop1d?tag=opalrouge-21",
  },
  {
    title: "Festive Evening Ensemble",
    cat: "Festive",
    img: "https://i.pinimg.com/564x/00/11/22/00112233445566778899001122334455.jpg",
    products:
      "Embroidered Anarkali | https://amazon.in/dp/shop2a?tag=opalrouge-21\nGold Jhumkas | https://amazon.in/dp/shop2b?tag=opalrouge-21\nEmbellished Clutch | https://amazon.in/dp/shop2c?tag=opalrouge-21",
  },
  {
    title: "Casual Weekend Outfit",
    cat: "Casual",
    img: "https://i.pinimg.com/564x/11/22/33/11223344556677889900112233445566aa.jpg",
    products:
      "Cotton Kurti | https://amazon.in/dp/shop3a?tag=opalrouge-21\nPalazzo Pants | https://amazon.in/dp/shop3b?tag=opalrouge-21\nJutti Flats | https://amazon.in/dp/shop3c?tag=opalrouge-21",
  },
];

const SAMPLE_TRENDS = [
  {
    title: "The New Power Dressing: Office Style Reimagined",
    cat: "Office Style",
    img: "https://i.pinimg.com/564x/22/33/44/22334455667788990011223344556677bb.jpg",
    desc: "Power dressing is evolving. Forget stiff suits — today's office style is all about fluid silhouettes, soft tailoring, and quiet luxury. Discover how to build a wardrobe that commands respect without sacrificing comfort.",
    link: "",
  },
  {
    title: "Accessory Stacking: The Art of Layered Jewelry",
    cat: "Accessories",
    img: "https://i.pinimg.com/564x/33/44/55/33445566778899001122334455667788cc.jpg",
    desc: "From layered necklaces to stacked bracelets, the art of accessory stacking is all about balance. Learn the rules (and when to break them) for a look that's effortlessly curated.",
    link: "",
  },
  {
    title: "Festive Season Style Guide 2026",
    cat: "Festive",
    img: "https://i.pinimg.com/564x/44/55/66/44556677889900112233445566778899dd.jpg",
    desc: "Your complete guide to festive dressing this season. From Diwali dazzle to Christmas elegance, we've curated the trends, tips, and shopping picks you need to shine.",
    link: "",
  },
  {
    title: "Minimalism: Less is Always More",
    cat: "Minimalism",
    img: "https://i.pinimg.com/564x/55/66/77/55667788990011223344556677889900ee.jpg",
    desc: "The minimalist wardrobe isn't about owning less — it's about owning better. Discover the pieces worth investing in and how to style them a hundred ways.",
    link: "",
  },
];

export async function POST() {
  try {
    // Seed outfits
    for (const outfit of SAMPLE_OUTFITS) {
      await addItem("outfits", outfit);
    }

    // Seed accessories
    for (const accessory of SAMPLE_ACCESSORIES) {
      await addItem("accessories", accessory);
    }

    // Seed shop looks
    for (const shop of SAMPLE_SHOP) {
      await addItem("shop", shop);
    }

    // Seed trends
    for (const trend of SAMPLE_TRENDS) {
      await addItem("trends", trend);
    }

    // Save default settings
    await saveSettings({ ofLim: "6", acLim: "8", disc: "" });

    return NextResponse.json({
      success: true,
      message: "Sample data seeded successfully!",
      counts: {
        outfits: SAMPLE_OUTFITS.length,
        accessories: SAMPLE_ACCESSORIES.length,
        shop: SAMPLE_SHOP.length,
        trends: SAMPLE_TRENDS.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
