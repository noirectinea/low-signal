export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  gender: ProductGender;
  price: number;
  image: string;
  color?: string;
  size?: string;
  sizes?: ProductSize[];
  stock?: number;
  images?: ProductImage[];
  objectPosition?: string;
  description: string;
  materials: string;
  keywords?: string[];
};

export type ProductGender = "men" | "women";

export type ProductImage = {
  alt: string;
  id?: string;
  src: string;
  sortOrder?: number;
};

export type ProductSize = {
  id?: string;
  label: string;
  stock: number;
  variantId?: string;
};

export type CartItem = Product & {
  productId?: string;
  quantity: number;
  size?: string;
  variantId?: string;
};

export const cartStorageKey = "low-signal-cart";

export const products: Product[] = [
  {
    id: "field-jacket",
    slug: "field-jacket",
    name: "Field Jacket",
    category: "Outerwear",
    gender: "men",
    price: 180,
    image: "/images/low-signal/products/product-01.jpg",
    color: "Washed Black",
    size: "M",
    objectPosition: "object-[50%_42%]",
    description:
      "A washed outer layer with quiet structure, designed for daily weather and repeat wear.",
    materials: "Garment dyed cotton canvas, matte hardware, reinforced pocketing.",
  },
  {
    id: "washed-longsleeve",
    slug: "washed-longsleeve",
    name: "Washed Longsleeve",
    category: "Shirts",
    gender: "men",
    price: 90,
    image: "/images/low-signal/selected-collection/shirts.jpg",
    color: "Black",
    size: "L",
    objectPosition: "object-[50%_48%]",
    description:
      "A soft black layer cut with room through the body and a dry, worn-in hand.",
    materials: "Washed cotton poplin, horn-effect buttons, clean internal seams.",
  },
  {
    id: "wide-trouser",
    slug: "wide-trouser",
    name: "Wide Trouser",
    category: "Trousers",
    gender: "men",
    price: 140,
    image: "/images/low-signal/selected-collection/trousers.jpg",
    color: "Black",
    size: "L",
    objectPosition: "object-[50%_54%]",
    description:
      "A wide trouser with soft volume, low contrast finish, and a steady everyday fall.",
    materials: "Cotton twill blend, pressed front structure, internal waist tape.",
  },
  {
    id: "cotton-crewneck",
    slug: "cotton-crewneck",
    name: "Cotton Crewneck",
    category: "Knitwear",
    gender: "men",
    price: 160,
    image: "/images/low-signal/collections/product-04.jpg",
    color: "Washed Black",
    size: "M",
    objectPosition: "object-[50%_50%]",
    description:
      "A dense black knit with a compact collar and enough weight to sit cleanly on the body.",
    materials: "Chunky cotton-wool rib knit, linked seams, washed finish.",
  },
  {
    id: "work-jacket",
    slug: "work-jacket",
    name: "Work Jacket",
    category: "Outerwear",
    gender: "men",
    price: 220,
    image: "/images/low-signal/products/product-10.jpg",
    color: "Washed Black",
    size: "M",
    objectPosition: "object-[50%_43%]",
    description:
      "A long washed layer with soft structure, low contrast hardware, and room for winter weight beneath.",
    materials: "Washed cotton canvas, matte buttons, cotton lining, reinforced internal seams.",
  },
  {
    id: "volume-pant",
    slug: "volume-pant",
    name: "Volume Pant",
    category: "Trousers",
    gender: "men",
    price: 150,
    image: "/images/low-signal/collections/product-03.jpg",
    color: "Washed Black",
    size: "M",
    objectPosition: "object-[50%_54%]",
    description:
      "A wide trouser with an easy rise, quiet fall, and enough volume to hold its own shape.",
    materials: "Washed cotton twill, soft waistband structure, tonal stitching.",
  },
  {
    id: "knit-sweater",
    slug: "knit-sweater",
    name: "Knit Sweater",
    category: "Knitwear",
    gender: "men",
    price: 170,
    image: "/images/low-signal/selected-collection/material-detail.png",
    color: "Black",
    size: "M",
    objectPosition: "object-[50%_50%]",
    description:
      "A compact black knit with soft weight, close texture, and a quiet shape through the shoulder.",
    materials: "Cotton wool rib knit, linked seams, matte buttons, washed finish.",
  },
  {
    id: "cotton-shirt",
    slug: "cotton-shirt",
    name: "Cotton Shirt",
    category: "Shirts",
    gender: "men",
    price: 120,
    image: "/images/low-signal/collections/product-11.png",
    color: "Concrete",
    size: "M",
    objectPosition: "object-[50%_42%]",
    description:
      "A pale cotton shirt with a dry surface, relaxed body, and a softened workwear pocket.",
    materials: "Washed cotton poplin, tonal buttons, reinforced pocket and sleeve seams.",
  },
  {
    id: "storm-parka",
    slug: "storm-parka",
    name: "Storm Parka",
    category: "Outerwear",
    gender: "women",
    price: 240,
    image: "/images/low-signal/collections/women-storm-parka-full-body.png",
    color: "Washed Black",
    size: "L",
    objectPosition: "object-[50%_50%]",
    description:
      "A hooded washed parka with quiet volume, matte hardware, and enough room for cold daily layers.",
    materials: "Washed cotton nylon shell, matte zipper, cotton drawcord, reinforced hood seams.",
  },
  {
    id: "double-face-coat",
    slug: "double-face-coat",
    name: "Double Face Coat",
    category: "Outerwear",
    gender: "women",
    price: 260,
    image: "/images/low-signal/collections/women-double-face-coat-seated.png",
    color: "Charcoal",
    size: "M",
    objectPosition: "object-[50%_48%]",
    description:
      "A long charcoal coat with soft structure, dropped shoulder, and a steady oversized fall.",
    materials: "Double-face wool blend, clean internal seams, matte pocketing, unlined finish.",
  },
  {
    id: "concrete-overshirt",
    slug: "concrete-overshirt",
    name: "Concrete Overshirt",
    category: "Shirts",
    gender: "women",
    price: 130,
    image: "/images/low-signal/collections/women-concrete-overshirt-hanging.png",
    color: "Concrete",
    size: "M",
    objectPosition: "object-[50%_48%]",
    description:
      "A pale cotton overshirt with a dry hand, relaxed body, and a softened utility pocket.",
    materials: "Washed cotton twill, tonal buttons, reinforced cuff and pocket stitching.",
  },
  {
    id: "collarless-shirt",
    slug: "collarless-shirt",
    name: "Collarless Shirt",
    category: "Shirts",
    gender: "women",
    price: 125,
    image: "/images/low-signal/collections/women-collarless-shirt-crop.png",
    color: "Washed Black",
    size: "M",
    objectPosition: "object-[50%_45%]",
    description:
      "A washed black collarless shirt cut with room through the body and a quiet front placket.",
    materials: "Garment washed cotton, tonal buttons, softened collar stand, clean side seams.",
  },
  {
    id: "rib-cardigan",
    slug: "rib-cardigan",
    name: "Rib Cardigan",
    category: "Knitwear",
    gender: "women",
    price: 185,
    image: "/images/low-signal/collections/women-rib-cardigan-detail.png",
    color: "Black",
    size: "M",
    objectPosition: "object-[50%_50%]",
    description:
      "A black rib cardigan with weight through the sleeve, low sheen buttons, and compact texture.",
    materials: "Cotton wool rib knit, linked seams, matte buttons, washed finish.",
  },
  {
    id: "soft-wool-pullover",
    slug: "soft-wool-pullover",
    name: "Soft Wool Pullover",
    category: "Knitwear",
    gender: "women",
    price: 175,
    image: "/images/low-signal/collections/women-soft-wool-pullover-sleeve.png",
    color: "Charcoal",
    size: "S",
    objectPosition: "object-[50%_46%]",
    description:
      "A charcoal wool pullover with quiet volume, soft surface, and a relaxed shoulder line.",
    materials: "Brushed wool cotton blend, rib collar, linked cuffs, washed surface.",
  },
  {
    id: "pleated-pant",
    slug: "pleated-pant",
    name: "Double Pleat Trouser",
    category: "Trousers",
    gender: "women",
    price: 160,
    image: "/images/low-signal/collections/women-pleated-pant-walking.png",
    color: "Black",
    size: "L",
    objectPosition: "object-[50%_50%]",
    description:
      "A black pleated trouser with relaxed volume, low break, and a clean fall through the leg.",
    materials: "Matte wool blend, pressed front pleat, internal waist tape, tonal stitching.",
  },
  {
    id: "drawstring-trouser",
    slug: "drawstring-trouser",
    name: "Drawstring Trouser",
    category: "Trousers",
    gender: "women",
    price: 145,
    image: "/images/low-signal/collections/women-drawstring-trouser-detail.png",
    color: "Washed Black",
    size: "M",
    objectPosition: "object-[50%_50%]",
    description:
      "A washed drawstring trouser with soft width, elastic waist, and an easy everyday drape.",
    materials: "Washed cotton twill, internal drawcord, elastic waist, reinforced pocketing.",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByGender(gender: ProductGender) {
  return products.filter((product) => product.gender === gender);
}
