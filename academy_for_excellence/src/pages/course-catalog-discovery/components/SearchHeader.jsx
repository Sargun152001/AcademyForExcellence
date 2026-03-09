import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange,
  totalResults,
  onToggleFilters 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'duration-short', label: 'Duration: Short to Long' },
    { value: 'duration-long', label: 'Duration: Long to Short' }
  ];

  const searchSuggestions = [
    "Managing multicultural teams in UAE construction",
    "Desert climate construction challenges",
    "PMI certification for Middle East projects",
    "Sustainable building practices MENA",
    "Risk management in mega projects",
    "Cultural intelligence for project managers",
    "PRINCE2 methodology for construction",
    "Quality control in hot weather concreting",
    "Leadership in construction projects",
    "Cost management for large infrastructure"
  ];

  const handleSearchFocus = () => {
    if (searchQuery?.length > 2) {
      const filtered = searchSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 5));
      setShowSuggestions(true);
    }
  };

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    
    if (value?.length > 2) {
      const filtered = searchSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white border-b border-border construction-shadow-premium">
      <div className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-professional-gray" 
            />
            <Input
              type="search"
              placeholder="Search courses, skills, or ask: 'courses for managing multicultural teams in UAE construction'"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-12 pr-12 h-12 text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Icon name="X" size={18} />
              </Button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg construction-shadow-modal z-50">
              <div className="py-2">
                {suggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-muted construction-transition flex items-center space-x-3"
                  >
                    <Icon name="Search" size={16} className="text-professional-gray" />
                    <span className="text-sm text-authority-charcoal">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left Side - Results & Filters */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onToggleFilters}
              iconName="SlidersHorizontal"
              iconPosition="left"
            >
              Filters
            </Button>
            
            <div className="text-sm text-professional-gray">
              <span className="font-medium text-authority-charcoal">{totalResults}</span> courses found
            </div>
          </div>

          {/* Right Side - Sort & View */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-professional-gray whitespace-nowrap">Sort by:</span>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                className="min-w-[160px]"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
              >
                <Icon name="Grid3X3" size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
              >
                <Icon name="List" size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            'Popular This Week',
            'Free Courses',
            'PMI Certified',
            'New Releases',
            'Highly Rated',
            'Quick Wins (< 5hrs)'
          ]?.map((filter) => (
            <Button
              key={filter}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;