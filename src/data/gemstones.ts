export interface Gemstone {
  id: string;
  slug: string;
  name: string;
  category: 'SAPPHIRE' | 'EMERALD' | 'RUBY' | 'TOURMALINE' | 'AMETHYST' | 'SPINEL';
  origin: string;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  description: string;
  image: string;
  galleryImages: string[];
  featured: boolean;
  specifications: {
    dimensions: string;
    treatment: string;
    certification: string;
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
    image: "/Images/Gemstone catalogue 0.jpeg",
    galleryImages: [
      "/Images/Gallery 0.jpeg",
      "/Images/Gemstone collection visual.jpeg"
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
    image: "/Images/Gemstone catalogue 1.jpeg",
    galleryImages: [
      "/Images/Gallery 1.jpeg",
      "/Images/Gemstone collection visual.jpeg"
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
    image: "/Images/Gemstone catalogue 3.jpeg",
    galleryImages: [
      "/Images/Gemstone collection visual.jpeg"
    ],
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
    image: "/Images/Gemstone catalogue 4.jpeg",
    galleryImages: [
      "/Images/Gemstone collection visual.jpeg"
    ],
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
    image: "/Images/Gemstone catalogue 5.jpeg",
    galleryImages: [
      "/Images/Gemstone collection visual.jpeg"
    ],
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
    image: "/Images/Gemstone catalogue 6.jpeg",
    galleryImages: [
      "/Images/Gallery-02.jpeg"
    ],
    featured: false,
    specifications: {
      dimensions: "10.4 x 8.9 x 6.2 mm",
      treatment: "No Indications of Heating",
      certification: "GRS Certified"
    }
  },
  {
    id: "g-007",
    slug: "selected-tourmaline",
    name: "Selected Tourmaline",
    category: "TOURMALINE",
    origin: "Available on Enquiry",
    carat: 5.40,
    cut: "Faceted Emerald Cut",
    color: "Bi-color Pink and Green",
    clarity: "Eye Clean",
    description: "A stunning natural bi-color tourmaline specimen displaying a smooth color transition from soft pink to vibrant green.",
    image: "/Images/Tourmaline.jpeg",
    galleryImages: [
      "/Images/Tourmaline.jpeg"
    ],
    featured: false,
    specifications: {
      dimensions: "Available on Enquiry",
      treatment: "No Indications of Treatment",
      certification: "Available on Sourcing"
    }
  },
  {
    id: "g-008",
    slug: "signature-amethyst",
    name: "Signature Amethyst",
    category: "AMETHYST",
    origin: "Available on Enquiry",
    carat: 8.20,
    cut: "Faceted Round Brilliant",
    color: "Deep Royal Purple",
    clarity: "Internally Flawless",
    description: "An exceptional deep royal purple natural amethyst showing intense saturation and expert brilliant faceting.",
    image: "/Images/Amethyst.jpeg",
    galleryImages: [
      "/Images/Amethyst.jpeg"
    ],
    featured: false,
    specifications: {
      dimensions: "Available on Enquiry",
      treatment: "No Indications of Treatment",
      certification: "Available on Sourcing"
    }
  }
];
