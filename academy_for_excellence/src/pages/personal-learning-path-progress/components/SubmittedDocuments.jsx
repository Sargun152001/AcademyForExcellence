import React, { useState, useEffect } from 'react';
import { getDocumentSubCategories, getSubmittalLines } from "../../../services/businessCentralApi";

// Get user GUID from localStorage
const userProfile = JSON.parse(localStorage.getItem('userData') || '{}');
const userGuid = userProfile.guid;

const SubmittedDocuments = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);

  // Load categories & subcategories
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await getDocumentSubCategories();

        const catMap = new Map();
        data.forEach((item) => {
          if (!catMap.has(item.category)) {
            catMap.set(item.category, {
              category: item.category,
              categoryName: item.categoryName,
            });
          }
        });

        const uniqueCategories = Array.from(catMap.values());
        setCategories(uniqueCategories);
        setSubCategories(data);
      } catch (err) {
        console.error('Error loading documentSubCategories', err);
        setError(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Filter subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSelectedSubCategory('');
      setSubCategories([]);
      return;
    }

    const filtered = categories.length > 0
      ? subCategories.filter((sc) => sc.category === selectedCategory)
      : [];

    setSubCategories(filtered);
    setSelectedSubCategory('');
  }, [selectedCategory]);

  // Fetch submittal lines
  useEffect(() => {
    const fetchResults = async () => {
      if (!selectedCategory || !selectedSubCategory) {
        setResults([]);
        return;
      }

      setLoadingResults(true);
      try {
        const res = await getSubmittalLines({
          category: selectedCategory,
          subCategory: selectedSubCategory,
        });

        const userOnlyResults = res.filter(item => item.createdByGUID === userGuid);
        setResults(userOnlyResults);
      } catch (err) {
        console.error('Error loading submittalLines', err);
        setError(err);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [selectedCategory, selectedSubCategory]);

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            className="border rounded mt-1 px-2 py-1"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.categoryName || cat.category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Subcategory</label>
          <select
            className="border rounded mt-1 px-2 py-1"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">-- Select Subcategory --</option>
            {subCategories
              .filter((sc) => sc.category === selectedCategory)
              .map((sc) => (
                <option key={sc.subCategory} value={sc.subCategory}>
                  {sc.subCategoryName || sc.subCategory}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div>
        {loadingResults ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error.message || 'Something went wrong'}</p>
        ) : (
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-gradient-to-r from-primary to-secondary text-white">
      <th className="text-left px-4 py-3 border-r">Submittal No.</th>
      <th className="text-left px-4 py-3 border-r">Description</th>
      <th className="text-center px-4 py-3">Document Link</th>
    </tr>
  </thead>
  <tbody>
    {results.length === 0 ? (
      <tr>
        <td colSpan={3} className="text-center py-4 text-gray-500">
          No records found
        </td>
      </tr>
    ) : (
      results.map((item, idx) => (
        <tr
          key={idx}
          className={`border-t border-b border-gray-300 ${
            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
          } hover:bg-gray-100 transition duration-150`}
        >
          <td className="px-4 py-3 border-r">{item.submittalNo}</td>
          <td className="px-4 py-3 border-r">{item.description}</td>
          <td className="px-4 py-3 text-center">
            <a
              href={item.documentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View
            </a>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
        )}
      </div>
    </div>
  );
};

export default SubmittedDocuments;
