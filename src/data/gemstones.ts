export interface Gemstone {
  id: string;
  slug: string;           // SEO-friendly URL slug
  name: string;
  category: string;
  origin: string;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  description: string;
  image: string;          // Primary card thumbnail
  galleryImages: string[]; // Alternate gallery views
  featured: boolean;
  specifications: {
    dimensions?: string;
    treatment?: string;
    certification?: string;
    [key: string]: string | undefined;
  };
}

export const GEMSTONES_DATA: Gemstone[] = [
  {
    id: "g-001",
    slug: "kashmir-heritage-sapphire",
    name: "The Kashmir Heritage Sapphire",
    category: "SAPPHIRE",
    origin: "Kashmir",
    carat: 4.82,
    cut: "Cushion Cut",
    color: "Deep Royal Velvet Blue",
    clarity: "Eye Clean (VS1)",
    description: "An exceptionally rare natural Kashmir sapphire displaying the classic velvety luster and intense blue saturation characteristic of historical deposits.",
    image: "/assets/gemstones/sapphire-kashmir.jpg",
    galleryImages: [
      "/assets/gemstones/sapphire-kashmir-detail-1.jpg"
    ],
    featured: true,
    specifications: {
      dimensions: "9.8 x 8.4 x 6.1 mm",
      treatment: "No Indications of Heating (Unheated)",
      certification: "GIA Certified"
    }
  },
  {
    id: "g-002",
    slug: "ceylon-royal-oval",
    name: "The Ceylon Royal Oval",
    category: "SAPPHIRE",
    origin: "Sri Lanka (Ceylon)",
    carat: 8.54,
    cut: "Oval Mixed Cut",
    color: "Vivid Cornflower Blue",
    clarity: "Internally Flawless (IF)",
    description: "A magnificent oval-cut Ceylon sapphire presenting excellent brilliance and transparency. Unheated with a rich, uniform cornflower hue.",
    image: "/assets/gemstones/sapphire-ceylon.jpg",
    galleryImages: [
      "/assets/gemstones/sapphire-ceylon-detail-1.jpg"
    ],
    featured: true,
    specifications: {
      dimensions: "12.4 x 10.1 x 7.3 mm",
      treatment: "No Indications of Heating (Unheated)",
      certification: "GRS Certified"
    }
  },
  {
    id: "g-003",
    slug: "star-of-peshawar",
    name: "The Star of Peshawar",
    category: "SAPPHIRE",
    origin: "Burma (Myanmar)",
    carat: 12.15,
    cut: "Cabochon",
    color: "Midnight Blue with Sharp Asterism",
    clarity: "Translucent",
    description: "A deep midnight blue cabochon sapphire displaying a highly defined, centered six-rayed star under direct lighting.",
    image: "/assets/gemstones/sapphire-star.jpg",
    galleryImages: [],
    featured: false,
    specifications: {
      dimensions: "14.2 x 12.0 x 9.1 mm",
      treatment: "No Indications of Heating",
      certification: "SSEF Certified"
    }
  },
  {
    id: "g-004",
    slug: "muzo-octagon-emerald",
    name: "The Muzo Octagon Emerald",
    category: "EMERALD",
    origin: "Colombia (Muzo)",
    carat: 3.42,
    cut: "Emerald Cut",
    color: "Vivid Bluish Green",
    clarity: "Moderately Included (VS2)",
    description: "A classic Muzo emerald displaying a highly saturated bluish green color. Contains signature organic inclusions characteristic of premium Colombian deposits.",
    image: "/assets/gemstones/emerald-muzo.jpg",
    galleryImages: [],
    featured: false,
    specifications: {
      dimensions: "8.9 x 7.8 x 5.9 mm",
      treatment: "Insignificant Clarity Enhancement (Minor Oil)",
      certification: "GIA Certified"
    }
  },
  {
    id: "g-005",
    slug: "mogok-pigeons-blood-ruby",
    name: "The Mogok Pigeon's Blood Ruby",
    category: "RUBY",
    origin: "Burma (Mogok)",
    carat: 2.14,
    cut: "Cushion Cut",
    color: "Vivid Red (Pigeon's Blood)",
    clarity: "Eye Clean (VS1)",
    description: "An exceptional natural ruby displaying the highly sought-after Mogok Pigeon's Blood red color. Unheated with strong red UV fluorescence.",
    image: "/assets/gemstones/ruby-mogok.jpg",
    galleryImages: [],
    featured: false,
    specifications: {
      dimensions: "7.4 x 6.5 x 4.8 mm",
      treatment: "No Indications of Heating (Unheated)",
      certification: "SSEF Certified"
    }
  },
  {
    id: "g-006",
    slug: "mahenge-pink-spinel",
    name: "The Mahenge Pink Spinel",
    category: "SPINEL",
    origin: "Tanzania (Mahenge)",
    carat: 5.22,
    cut: "Oval Cut",
    color: "Vivid Neon Pinkish Red",
    clarity: "Eye Clean",
    description: "A highly brilliant natural Mahenge spinel exhibiting a striking neon pinkish-red hue with exceptional brilliance and crystal clarity.",
    image: "/assets/gemstones/spinel-mahenge.jpg",
    galleryImages: [],
    featured: false,
    specifications: {
      dimensions: "10.4 x 8.9 x 6.2 mm",
      treatment: "No Indications of Heating",
      certification: "GRS Certified"
    }
  }
];
