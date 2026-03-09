import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryTabs = ({ activeCategory, onCategoryChange, categories }) => {
  return (
    <div className="bg-white border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-authority-charcoal">
            Browse by Category
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategoryChange('all')}
            className={activeCategory === 'all' ? 'text-primary' : ''}
          >
            View All
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={activeCategory === category?.id ? 'default' : 'ghost'}
              onClick={() => onCategoryChange(category?.id)}
              className="flex items-center space-x-2 whitespace-nowrap px-4 py-2"
            >
              <Icon name={category?.icon} size={18} />
              <span>{category?.name}</span>
              <span className="text-xs opacity-75">({category?.count})</span>
            </Button>
          ))}
        </div>

        {/* Category Description */}
        {activeCategory !== 'all' && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            {(() => {
              const category = categories?.find(cat => cat?.id === activeCategory);
              return category ? (
                <div>
                  <h3 className="font-medium text-authority-charcoal mb-2">
                    {category?.name} Courses
                  </h3>
                  <p className="text-sm text-professional-gray">
                    {category?.description}
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTabs;