import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BACKEND_URL = 'https://academyforexcellence-backend-ywc2.onrender.com';

const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  useEffect(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    if (stored !== null) setSidebarCollapsed(JSON.parse(stored));
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredResources(resources);
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
  };

  const displayedResources = useMemo(() => filteredResources, [filteredResources]);

  return (
    <div className="min-h-screen bg-background text-authority-charcoal">
      <Helmet>
        <title>Resource Directory - Academy for Excellence</title>
        <meta
          name="description"
          content="Explore and connect with team members and resources across the Academy for Excellence platform."
        />
      </Helmet>

      <Header />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => {
            const newState = !sidebarCollapsed;
            setSidebarCollapsed(newState);
            localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
          }}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          } p-8`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
              <h1 className="text-3xl font-bold tracking-tight mb-4 sm:mb-0">
                Resources
              </h1>

              {/* Search Bar */}
              <div className="relative w-full sm:w-[420px]">
                <div className="flex items-center border border-border rounded-xl bg-card px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                  <Icon name="Search" size={18} className="text-professional-gray mr-2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by name, email, or role..."
                    className="w-full outline-none bg-transparent text-authority-charcoal"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilteredResources(resources);
                      }}
                      className="text-professional-gray hover:text-authority-charcoal ml-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Loading & No Results */}
            {loading ? (
              <div className="text-center py-20 text-professional-gray">
                Loading resources...
              </div>
            ) : displayedResources.length === 0 ? (
              <div className="text-center py-20 text-professional-gray">
                No resources found.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedResources.map((res) => (
                  <div
                    key={res.id}
                    className="group bg-white border border-border rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition transform p-5 flex flex-col justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      {res.imageUrl ? (
                        <img
                          src={res.imageUrl}
                          alt={res.name}
                          className="w-14 h-14 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                          <Icon name="User" size={22} className="text-professional-gray" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h2 className="font-semibold text-lg text-authority-charcoal truncate">
                          {res.name}
                        </h2>
                        <p className="text-sm text-professional-gray truncate">
                          {res.role || '—'}
                        </p>
                        <p className="text-xs text-professional-gray break-words max-w-[220px]">
                          {res.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground italic">
                        ID: {res.id}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/resource-progress/${res.id}`, { state: res })}
                        className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition"
                      >
                        <Icon name="BarChart" size={16} />
                        <span>View Progress</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResourceListPage;
