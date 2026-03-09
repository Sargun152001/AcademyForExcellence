import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'project-management', label: 'Project Management' },
    { value: 'safety-compliance', label: 'Safety & Compliance' },
    { value: 'technical-skills', label: 'Technical Skills' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'digital-tools', label: 'Digital Tools' },
    { value: 'quality-control', label: 'Quality Control' }
  ];

  const levelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const durationOptions = [
    { value: '', label: 'Any Duration' },
    { value: '0.5-2', label: '30min - 2 hours' },
    { value: '2-4', label: '2 - 4 hours' },
    { value: '4-8', label: '4 - 8 hours' },
    { value: '8+', label: '8+ hours' }
  ];

  const timeSlotOptions = [
    { value: '', label: 'Any Time' },
    { value: 'morning', label: 'Morning (8AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
    { value: 'evening', label: 'Evening (5PM - 8PM)' },
    { value: 'weekend', label: 'Weekend' }
  ];

  const instructorOptions = [
    { value: '', label: 'Any Instructor' },
    { value: 'dr-hassan-al-mahmoud', label: 'Dr. Hassan Al-Mahmoud' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'ahmed-al-rashid', label: 'Ahmed Al-Rashid' },
    { value: 'maria-gonzalez', label: 'Maria Gonzalez' },
    { value: 'khalid-bin-salem', label: 'Khalid Bin Salem' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleCheckboxChange = (key, checked) => {
    onFiltersChange({
      ...filters,
      [key]: checked
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(filters)?.forEach(([key, value]) => {
      if (key === 'availableOnly' || key === 'newCoursesOnly') {
        if (value) count++;
      } else if (value && value !== '') {
        count++;
      }
    });
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-card rounded-xl construction-shadow-premium">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-authority-charcoal">
            Filters
          </h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>
      </div>
      {/* Filter Content */}
      <div className={`p-4 space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Quick Filters */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-authority-charcoal">Quick Filters</h4>
          <div className="space-y-2">
            <Checkbox
              label="Available slots only"
              description="Show only courses with open slots"
              checked={filters?.availableOnly || false}
              onChange={(e) => handleCheckboxChange('availableOnly', e?.target?.checked)}
            />
            <Checkbox
              label="New courses only"
              description="Recently added courses"
              checked={filters?.newCoursesOnly || false}
              onChange={(e) => handleCheckboxChange('newCoursesOnly', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <Select
          label="Category"
          options={categoryOptions}
          value={filters?.category || ''}
          onChange={(value) => handleFilterChange('category', value)}
        />

        {/* Level Filter */}
        <Select
          label="Difficulty Level"
          options={levelOptions}
          value={filters?.level || ''}
          onChange={(value) => handleFilterChange('level', value)}
        />

        {/* Duration Filter */}
        <Select
          label="Course Duration"
          options={durationOptions}
          value={filters?.duration || ''}
          onChange={(value) => handleFilterChange('duration', value)}
        />

        {/* Time Slot Filter */}
        <Select
          label="Preferred Time"
          options={timeSlotOptions}
          value={filters?.timeSlot || ''}
          onChange={(value) => handleFilterChange('timeSlot', value)}
        />

        {/* Instructor Filter */}
        <Select
          label="Instructor"
          options={instructorOptions}
          value={filters?.instructor || ''}
          onChange={(value) => handleFilterChange('instructor', value)}
          searchable
        />

        {/* Date Range */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-authority-charcoal">Date Range</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-professional-gray mb-1">From</label>
              <input
                type="date"
                value={filters?.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                min={new Date()?.toISOString()?.split('T')?.[0]}
              />
            </div>
            <div>
              <label className="block text-xs text-professional-gray mb-1">To</label>
              <input
                type="date"
                value={filters?.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                min={filters?.dateFrom || new Date()?.toISOString()?.split('T')?.[0]}
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-authority-charcoal">Minimum Rating</h4>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5]?.map((rating) => (
              <button
                key={rating}
                onClick={() => handleFilterChange('minRating', rating)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs construction-transition ${
                  (filters?.minRating || 0) >= rating
                    ? 'text-warning' :'text-professional-gray hover:text-warning'
                }`}
              >
                <Icon name="Star" size={14} className="fill-current" />
                <span>{rating}+</span>
              </button>
            ))}
          </div>
        </div>

        {/* Apply Filters Button (Mobile) */}
        <div className="lg:hidden pt-4">
          <Button
            fullWidth
            onClick={() => setIsExpanded(false)}
            iconName="Filter"
            iconPosition="left"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;