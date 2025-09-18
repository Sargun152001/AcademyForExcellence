import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
 
const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
 
  const navigationItems = [
    {
      category: 'Learning',
      items: [
        { name: 'Dashboard', path: '/learning-dashboard-homepage', icon: 'LayoutDashboard' },
        { name: 'Course Catalog', path: '/course-catalog-discovery', icon: 'BookOpen' },
        { name: 'My Progress', path: '/personal-learning-path-progress', icon: 'TrendingUp' },
      ]
    },
    {
      category: 'Management',
      items: [
        { name: 'Schedule', path: '/schedule-management-booking', icon: 'Calendar' },
        { name: 'Assessments', path: '/assessment-feedback-center', icon: 'ClipboardCheck' },
      ]
    },
    {
      category: 'Community',
      items: [
        { name: 'Learning Hub', path: '/community-learning-hub', icon: 'Users' },
      ]
    }
  ];
 
  const isActivePath = (path) => location?.pathname === path;
  const shouldShowText = !isCollapsed || isHovered;
 
  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border construction-shadow z-40 construction-transition ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {shouldShowText && (
            <h2 className="text-lg font-heading font-semibold text-authority-charcoal">
              Navigation
            </h2>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="ml-auto"
            >
              <Icon
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
                size={20}
              />
            </Button>
          )}
        </div>
 
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {navigationItems?.map((category) => (
              <div key={category?.category}>
                {shouldShowText && (
                  <div className="px-4 mb-2">
                    <h3 className="text-xs font-semibold text-professional-gray uppercase tracking-wider">
                      {category?.category}
                    </h3>
                  </div>
                )}
               
                <div className="space-y-1 px-2">
                  {category?.items?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium construction-transition group ${
                        isActivePath(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:text-primary hover:bg-muted'
                      }`}
                      title={isCollapsed && !isHovered ? item?.name : ''}
                    >
                      <Icon
                        name={item?.icon}
                        size={20}
                        className="flex-shrink-0"
                      />
                      {shouldShowText && (
                        <span className="truncate">{item?.name}</span>
                      )}
                     
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && !isHovered && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-authority-charcoal text-white text-xs rounded opacity-0 group-hover:opacity-100 construction-transition pointer-events-none whitespace-nowrap z-50">
                          {item?.name}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
 
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          {/* Quick Actions */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${!shouldShowText ? 'px-3' : ''}`}
              title={isCollapsed && !isHovered ? 'Settings' : ''}
            >
              <Icon name="Settings" size={20} className="flex-shrink-0" />
              {shouldShowText && <span className="ml-3">Settings</span>}
            </Button>
           
            <Button
              variant="ghost"
              className={`w-full justify-start ${!shouldShowText ? 'px-3' : ''}`}
              title={isCollapsed && !isHovered ? 'Help & Support' : ''}
            >
              <Icon name="HelpCircle" size={20} className="flex-shrink-0" />
              {shouldShowText && <span className="ml-3">Help & Support</span>}
            </Button>
          </div>
 
          {/* User Progress Summary */}
          {shouldShowText && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Award" size={16} className="text-accent" />
                <span className="text-xs font-medium text-authority-charcoal">
                  Current Progress
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-professional-gray">Courses Completed</span>
                  <span className="font-medium text-authority-charcoal">12/20</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-success h-1.5 rounded-full construction-transition"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
 
export default Sidebar;