import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, ArrowRight, Sparkles, Compass, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { fetchExploreItemsAPI } from '../services/api';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

export default function ExplorePage({ onSelectProjectToMake }) {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [inspectModalItem, setInspectModalItem] = useState(null);

  const categories = [
    { id: 'all', label: 'All Materials' },
    { id: 'plastic', label: 'Plastic' },
    { id: 'fabric', label: 'Fabric' },
    { id: 'cardboard', label: 'Cardboard' },
    { id: 'metal', label: 'Metal' },
    { id: 'glass', label: 'Glass' },
    { id: 'wood', label: 'Wood' },
  ];

  useEffect(() => {
    loadExploreItems();
  }, [selectedCategory, searchQuery]);

  const loadExploreItems = async () => {
    setIsLoading(true);
    try {
      const data = await fetchExploreItemsAPI(selectedCategory, searchQuery);
      setItems(data);
    } catch (err) {
      console.error('Error fetching explore catalog:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (difficultyFilter === 'all') return true;
    return item.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background-warm border border-charcoal-border text-charcoal text-xs font-medium">
          <Compass className="w-3.5 h-3.5 text-accent" />
          <span>Inspiration Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
          Explore Transformations
        </h1>
        <p className="text-sm text-charcoal-muted max-w-2xl">
          Browse verified creative reuse blueprints across everyday household materials. 
          Pick any concept to inspect the transformation or start building right away.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-background-surface border border-charcoal-border rounded-xl p-4 shadow-subtle space-y-4">
        
        {/* Search & Difficulty Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by object, product, or material (e.g., T-shirt, planter, bottle)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-md border border-charcoal-border bg-background-warm/50 text-charcoal placeholder:text-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-charcoal-muted whitespace-nowrap">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-md border border-charcoal-border bg-white text-charcoal focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy (&lt; 20m)</option>
              <option value="medium">Medium (30-45m)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-charcoal-borderLight">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-charcoal text-white'
                  : 'bg-background-warm text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Inspiration Cards */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-charcoal-muted">Loading transformations...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-background-surface border border-charcoal-border rounded-xl p-12 text-center space-y-3">
          <p className="text-sm font-medium text-charcoal">
            No transformations found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setDifficultyFilter('all');
            }}
            className="text-xs font-semibold text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-background-surface border border-charcoal-border rounded-xl overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Before/After Header Preview */}
                <div className="relative aspect-[16/10] bg-charcoal overflow-hidden">
                  <img
                    src={item.imageAfter}
                    alt={item.newProduct}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Subtle Inset Before Thumbnail */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-charcoal/80 backdrop-blur-sm p-1 pr-2 rounded text-[10px] text-white shadow-subtle">
                    <img
                      src={item.imageBefore}
                      alt={item.originalObject}
                      className="w-5 h-5 rounded object-cover"
                    />
                    <span className="truncate max-w-[120px] font-medium">
                      From: {item.originalObject}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-accent text-white">
                      {item.difficulty}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] text-charcoal-subtle font-mono">
                      <span>{item.material}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent" />
                        {item.estimatedTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-charcoal tracking-tight pt-1">
                      {item.originalObject} → {item.newProduct}
                    </h3>
                  </div>

                  <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tools preview */}
                  {item.tools && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tools.slice(0, 3).map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-1.5 py-0.5 rounded bg-background-warm text-[10px] text-charcoal border border-charcoal-borderLight"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 flex items-center gap-2 border-t border-charcoal-borderLight mt-2 pt-3">
                <button
                  type="button"
                  onClick={() => setInspectModalItem(item)}
                  className="flex-1 py-1.5 px-3 rounded border border-charcoal-border bg-white hover:bg-background-warm text-charcoal text-xs font-medium flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-charcoal-muted" />
                  <span>Inspect</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectProjectToMake(item)}
                  className="flex-1 py-1.5 px-3 rounded bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-subtle"
                >
                  <span>Build This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* INSPECT TRANSFORMATION MODAL */}
      {inspectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-deep/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-background-surface w-full max-w-2xl rounded-xl shadow-modal border border-charcoal-border overflow-hidden space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="p-5 border-b border-charcoal-border flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-accent font-semibold uppercase">
                  Transformation Details
                </span>
                <h3 className="font-bold text-lg text-charcoal">
                  {inspectModalItem.originalObject} → {inspectModalItem.newProduct}
                </h3>
              </div>
              <button
                onClick={() => setInspectModalItem(null)}
                className="text-xs px-2.5 py-1 rounded border border-charcoal-border hover:bg-background-warm text-charcoal font-medium"
              >
                Close
              </button>
            </div>

            <div className="px-5 space-y-4">
              {/* Interactive Slider */}
              <BeforeAfterSlider
                beforeImage={inspectModalItem.imageBefore}
                afterImage={inspectModalItem.imageAfter}
                beforeLabel={`Original: ${inspectModalItem.originalObject}`}
                afterLabel={`Identity: ${inspectModalItem.newProduct}`}
                beforeSub="Everyday Unwanted Object"
                afterSub="Creative Reuse Design"
                aspectRatio="aspect-[16/10]"
              />

              <div className="p-4 rounded-lg bg-background-warm border border-charcoal-border space-y-2 text-xs">
                <h4 className="font-bold text-charcoal">How it works:</h4>
                <p className="text-charcoal-muted leading-relaxed">
                  {inspectModalItem.description}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-charcoal-borderLight text-[11px]">
                  <div>
                    <span className="text-charcoal-subtle">Estimated Time: </span>
                    <strong className="text-charcoal">{inspectModalItem.estimatedTime}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-subtle">Difficulty: </span>
                    <strong className="text-accent">{inspectModalItem.difficulty}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-charcoal-border bg-background-warm flex items-center justify-between">
              <span className="text-xs text-charcoal-muted">
                Have this object at home?
              </span>
              <button
                onClick={() => {
                  const item = inspectModalItem;
                  setInspectModalItem(null);
                  onSelectProjectToMake(item);
                }}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-subtle flex items-center gap-1.5"
              >
                <span>Make with My Object</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
