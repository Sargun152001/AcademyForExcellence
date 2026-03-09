import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const filterSections = [
    {
      title: 'Skill Level',
      key: 'skillLevel',
      options: [
        { value: 'Foundation', label: 'Foundation', count: 24 },
        { value: 'Intermediate', label: 'Intermediate', count: 18 },
        { value: 'Advanced', label: 'Advanced', count: 12 },
        { value: 'Expert', label: 'Expert', count: 8 }
      ]
    },
    {
      title: 'Project Type',
      key: 'projectType',
      options: [
        { value: 'Infrastructure', label: 'Infrastructure', count: 15 },
        { value: 'Commercial', label: 'Commercial', count: 22 },
        { value: 'Residential', label: 'Residential', count: 18 },
        { value: 'Industrial', label: 'Industrial', count: 10 },
        { value: 'Mixed-Use', label: 'Mixed-Use', count: 8 }
      ]
    },
    {
      title: 'Regional Focus',
      key: 'region',
      options: [
        { value: 'GCC', label: 'GCC Countries', count: 28 },
        { value: 'Levant', label: 'Levant Region', count: 12 },
        { value: 'North Africa', label: 'North Africa', count: 15 },
        { value: 'Global', label: 'Global Standards', count: 20 }
      ]
    },
    {
      title: 'Certification',
      key: 'certification',
      options: [
        { value: 'PMI', label: 'PMI Certified', count: 16 },
        { value: 'PRINCE2', label: 'PRINCE2', count: 12 },
        { value: 'Regional', label: 'Regional Standards', count: 8 },
        { value: 'ISO', label: 'ISO Standards', count: 6 }
      ]
    },
    {
      title: 'Duration',
      key: 'duration',
      options: [
        { value: '1-5', label: '1-5 hours', count: 20 },
        { value: '6-15', label: '6-15 hours', count: 18 },
        { value: '16-30', label: '16-30 hours', count: 12 },
        { value: '30+', label: '30+ hours', count: 8 }
      ]
    },
    {
      title: 'Price Range',
      key: 'priceRange',
      options: [
        { value: 'free', label: 'Free', count: 8 },
        { value: '1-100', label: '$1 - $100', count: 15 },
        { value: '101-300', label: '$101 - $300', count: 20 },
        { value: '301-500', label: '$301 - $500', count: 12 },
        { value: '500+', label: '$500+', count: 7 }
      ]
    }
  ];

  const handleFilterChange = (section, value, checked) => {
    const currentValues = filters?.[section] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues?.filter(v => v !== value);
    
    onFilterChange(section, newValues);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters)?.reduce((count, values) => {
      return count + (Array.isArray(values) ? values?.length : 0);
    }, 0);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-border construction-shadow h-full">
        <div className="p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-full"
          >
            <Icon name="SlidersHorizontal" size={20} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-border construction-shadow h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-authority-charcoal">
            Filters
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        {/* Active Filters Count */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-professional-gray">
              {getActiveFiltersCount()} filters active
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-primary hover:text-primary"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
      {/* Price Range Slider */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-medium text-authority-charcoal mb-4">
          Custom Price Range
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Input
              type="number"
              placeholder="Min"
              className="flex-1"
              value={filters?.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e?.target?.value)}
            />
            <span className="text-professional-gray">to</span>
            <Input
              type="number"
              placeholder="Max"
              className="flex-1"
              value={filters?.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e?.target?.value)}
            />
          </div>
        </div>
      </div>
      {/* Filter Sections */}
      <div className="space-y-6 p-6">
        {filterSections?.map((section) => (
          <div key={section?.key}>
            <h3 className="text-sm font-medium text-authority-charcoal mb-3">
              {section?.title}
            </h3>
            <div className="space-y-2">
              {section?.options?.map((option) => (
                <div key={option?.value} className="flex items-center justify-between">
                  <Checkbox
                    label={option?.label}
                    checked={(filters?.[section?.key] || [])?.includes(option?.value)}
                    onChange={(e) => handleFilterChange(section?.key, option?.value, e?.target?.checked)}
                    className="flex-1"
                  />
                  <span className="text-xs text-professional-gray ml-2">
                    {option?.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Special Filters */}
      <div className="p-6 border-t border-border">
        <h3 className="text-sm font-medium text-authority-charcoal mb-3">
          Special Features
        </h3>
        <div className="space-y-2">
          <Checkbox
            label="New Courses"
            checked={filters?.isNew || false}
            onChange={(e) => onFilterChange('isNew', e?.target?.checked)}
          />
          <Checkbox
            label="Highly Rated (4.5+)"
            checked={filters?.highlyRated || false}
            onChange={(e) => onFilterChange('highlyRated', e?.target?.checked)}
          />
          <Checkbox
            label="Includes Certificate"
            checked={filters?.hasCertificate || false}
            onChange={(e) => onFilterChange('hasCertificate', e?.target?.checked)}
          />
          <Checkbox
            label="Hands-on Projects"
            checked={filters?.hasProjects || false}
            onChange={(e) => onFilterChange('hasProjects', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;