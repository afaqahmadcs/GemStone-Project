import './Collection.css';

interface CollectionFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CollectionFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CollectionFilterProps) {
  return (
    <nav className="filter-bar" aria-label="Gemstone Category Filters">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
          aria-current={activeCategory === category ? 'true' : 'false'}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}
