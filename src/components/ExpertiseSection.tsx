import { useState } from 'react';
import './AboutExpertise.css';

interface ExpertiseItem {
  id: string;
  number: string;
  title: string;
  description: string;
  imageClass: string;
}

export default function ExpertiseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(0);

  const expertiseItems: ExpertiseItem[] = [
    {
      id: "color",
      number: "01",
      title: "COLOR",
      description: "Color is the visual soul of the sapphire. We analyze the hue (the core blue shade), tone (the depth of light or darkness), and saturation (the color's purity and richness) to select stones with a uniform and captivating blue presence.",
      imageClass: "highlight-color"
    },
    {
      id: "cut",
      number: "02",
      title: "CUT",
      description: "The cutter's precision shapes how light behaves. Excellent geometry transforms raw crystal surfaces into facets that reflect, bend, and disperse illumination, generating maximum brilliance, table fire, and visual scintillation.",
      imageClass: "highlight-cut"
    },
    {
      id: "clarity",
      number: "03",
      title: "CLARITY",
      description: "Clarity describes the natural internal footprint of a gemstone. From microscopic silk patterns to minor inclusions, these growth markers act as geological DNA, confirming natural origin and unheated status.",
      imageClass: "highlight-clarity"
    },
    {
      id: "character",
      number: "04",
      title: "CHARACTER",
      description: "Character is the holistic personality of the stone. A premium sapphire cannot be judged by numbers alone; its rarity is evaluated by how color, cut, clarity, and origin harmonize to create a singular, memorable specimen.",
      imageClass: "highlight-character"
    }
  ];

  const handleAccordionToggle = (index: number) => {
    setAccordionOpen(accordionOpen === index ? null : index);
  };

  // Reusable Vector Gemstone Study SVG
  const renderVectorGemstone = (modeClass: string) => (
    <div className={`visual-canvas-mockup ${modeClass}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none" stroke="rgba(250, 248, 245, 0.25)" strokeWidth="0.75">
        {/* Core Gemstone Facets */}
        <polygon points="50,15 75,30 75,70 50,85 25,70 25,30" className="gem-outline-bold" />
        
        {/* Internal Facet Structure */}
        <polygon points="50,30 65,40 65,60 50,70 35,60 35,40" className="gem-inner-facet" fill="none" />
        
        {/* Facet lines */}
        <line x1="50" y1="15" x2="50" y2="30" className="gem-facet-accent" />
        <line x1="75" y1="30" x2="65" y2="40" className="gem-facet-accent" />
        <line x1="75" y1="70" x2="65" y2="60" className="gem-facet-accent" />
        <line x1="50" y1="85" x2="50" y2="70" className="gem-facet-accent" />
        <line x1="25" y1="70" x2="35" y2="60" className="gem-facet-accent" />
        <line x1="25" y1="30" x2="35" y2="40" className="gem-facet-accent" />
        
        {/* Inner core divider lines */}
        <line x1="50" y1="30" x2="50" y2="70" className="gem-inner-facet" />
        <line x1="35" y1="40" x2="65" y2="60" className="gem-inner-facet" />
        <line x1="35" y1="60" x2="65" y2="40" className="gem-inner-facet" />

        {/* Dynamic Shader Fills based on mode */}
        <polygon 
          points="50,30 65,40 65,60 50,70 35,60 35,40" 
          className="gem-fill" 
          style={{ 
            fill: modeClass === 'highlight-color' ? 'rgba(30, 58, 138, 0.45)' : 'transparent',
            transition: 'fill var(--transition-slow)' 
          }} 
        />
        <polygon 
          points="50,15 75,30 75,70 50,85 25,70 25,30" 
          style={{ 
            fill: modeClass === 'highlight-color' ? 'rgba(15, 32, 67, 0.25)' : 'transparent',
            transition: 'fill var(--transition-slow)' 
          }} 
        />
      </svg>
    </div>
  );

  return (
    <section id="expertise" className="expertise-section" aria-labelledby="expertise-heading">
      <div className="container">
        
        {/* Section Header */}
        <div className="expertise-intro">
          <span className="text-overline">Expertise</span>
          <h2 id="expertise-heading">Understanding What Makes a Stone Exceptional.</h2>
        </div>

        {/* 1. Desktop Interactive Layout */}
        <div className="expertise-interactive-grid">
          
          {/* Left panel Menu List */}
          <div className="expertise-menu-list" role="tablist" aria-label="Gemstone Characteristics Panels">
            {expertiseItems.map((item, index) => (
              <div
                key={item.id}
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls={`panel-${item.id}`}
                id={`tab-${item.id}`}
                tabIndex={0}
                className={`expertise-menu-item ${activeIndex === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveIndex(index);
                  }
                }}
              >
                <span className="expertise-number">{item.number}</span>
                <div className="expertise-item-content">
                  <h3>{item.title}</h3>
                  <p 
                    id={`panel-${item.id}`} 
                    role="tabpanel" 
                    aria-labelledby={`tab-${item.id}`}
                    className="expertise-item-desc"
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right panel Visual Spotlight */}
          <div className="expertise-spotlight-visual">
            {renderVectorGemstone(expertiseItems[activeIndex].imageClass)}
          </div>

        </div>

        {/* 2. Mobile Accordion Layout */}
        <div className="expertise-accordion-list" role="presentation">
          {expertiseItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`accordion-item ${accordionOpen === index ? 'active' : ''}`}
            >
              <button
                type="button"
                className="accordion-header"
                onClick={() => handleAccordionToggle(index)}
                aria-expanded={accordionOpen === index}
                aria-controls={`accordion-panel-${item.id}`}
                id={`accordion-tab-${item.id}`}
              >
                <h3>
                  <span className="accordion-num">{item.number}</span>
                  {item.title}
                </h3>
                <span className="accordion-icon" aria-hidden="true">+</span>
              </button>

              <div 
                id={`accordion-panel-${item.id}`}
                role="region"
                aria-labelledby={`accordion-tab-${item.id}`}
                className="accordion-panel"
              >
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  {item.description}
                </p>
                <div className="accordion-visual-mockup">
                  {renderVectorGemstone(item.imageClass)}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
