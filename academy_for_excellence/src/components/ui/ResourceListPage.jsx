import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Sidebar from '../../components/ui/Sidebar'; 
const BACKEND_URL = 'https://academyforexcellence-backend-ywc2.onrender.com';

const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Only this controls sidebar
  const navigate = useNavigate();

  const fetchResources = async () => {
    try {
      const url = `${BACKEND_URL}/api/Resources?$filter=resType eq 'Person'`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      const mapped = data?.value?.map((r) => ({
        id: r.no,
        name: r.name,
        email: r.eMail,
        role: r.designation,
        imageUrl: r.image ? `data:image/jpeg;base64,${r.image.replace(/\s/g, '')}` : null,
      }));
      setResources(mapped || []);
      setFilteredResources(mapped || []);
    } catch (err) {
      console.error('[DEBUG] Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredResources(resources);
      setShowSuggestions(false);
      return;
    }
    const lowerValue = value.toLowerCase();
    const filtered = resources.filter(
      (res) =>
        res.name.toLowerCase().includes(lowerValue) ||
        res.email.toLowerCase().includes(lowerValue) ||
        res.role?.toLowerCase().includes(lowerValue)
    );
    setFilteredResources(filtered);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (res) => {
    setSearchTerm(res.name);
    setFilteredResources([res]);
    setShowSuggestions(false);
  };

  if (loading) return <div className="p-10 text-center">Loading resources...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => {
          const newState = !sidebarCollapsed;
          setSidebarCollapsed(newState);
          localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
        }} 
      />

      {/* Main content */}
      <main className={`flex-1 overflow-auto p-6 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <h1 className="text-3xl font-bold text-authority-charcoal mb-8">Resources</h1>

        {/* Search bar */}
        <div className="relative mb-8">
          <div className="flex items-center border border-border rounded-xl bg-card px-4 py-2 shadow-sm">
            <Icon name="Search" size={18} className="text-professional-gray mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search by name, email, or role..."
              className="w-full outline-none bg-transparent text-authority-charcoal"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilteredResources(resources);
                  setShowSuggestions(false);
                }}
                className="text-professional-gray hover:text-authority-charcoal ml-2"
              >
                ✕
              </button>
            )}
          </div>

          {showSuggestions && searchTerm && (
            <div className="absolute w-full bg-white border border-border rounded-xl mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredResources.length > 0 ? (
                filteredResources.slice(0, 8).map((res) => (
                  <div
                    key={res.id}
                    onClick={() => handleSelectSuggestion(res)}
                    className="flex items-center p-2 hover:bg-muted cursor-pointer transition"
                  >
                    {res.imageUrl ? (
                      <img
                        src={res.imageUrl}
                        alt={res.name}
                        className="w-8 h-8 rounded-full object-cover mr-3 border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                        <Icon name="User" size={16} className="text-professional-gray" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm text-authority-charcoal">{res.name}</p>
                      <p className="text-xs text-professional-gray">{res.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-professional-gray text-center">
                  No matches found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resource list */}
        {filteredResources.length === 0 ? (
          <div className="text-center text-professional-gray">No resources found.</div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center space-x-4">
                  {res.imageUrl ? (
                    <img
                      src={res.imageUrl}
                      alt={res.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="User" size={20} className="text-professional-gray" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-authority-charcoal">{res.name}</h2>
                    <p className="text-sm text-professional-gray">{res.role}</p>
                    <p className="text-xs text-professional-gray">{res.email}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                  onClick={() => navigate(`/resource-progress/${res.id}`, { state: res })}
                >
                  <Icon name="BarChart" size={16} />
                  <span>View Progress</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResourceListPage;
