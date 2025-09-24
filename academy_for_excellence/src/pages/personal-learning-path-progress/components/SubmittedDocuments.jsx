import React, { useState, useEffect } from 'react';
import { getDocumentSubCategories, getSubmittalLines }  from "../../../services/businessCentralApi";
const userProfile = JSON.parse(localStorage.getItem('userData') || '{}');
const userGuid = userProfile.guid;
const SubmittedDocuments = () => {
  const [categories, setCategories] = useState([]);        // list of unique categories
  const [subCategories, setSubCategories] = useState([]);  // filtered list of subcategories for selected category

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const [results, setResults] = useState([]);              // holds data fetched from submittalLines

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);

  // 1. Load categories + all subcategories initially
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await getDocumentSubCategories();  // call your first API
        // data is expected array of objects with { category, categoryName, subCategory, subCategoryName }

        // Deduplicate categories
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

        // Also keep the full list of docSubCats for filtering subcategories
        setSubCategories(data);  // initially all, but you’ll filter them when category is chosen

      } catch (err) {
        console.error('Error loading documentSubCategories', err);
        setError(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // 2. When user selects a category, filter subcategories
  useEffect(() => {
    if (!selectedCategory) {
      // reset or clear
      setSelectedSubCategory('');
      // Show all subcategories or none
      setSubCategories([]);
      return;
    }

    // Fetch again? Or if you already have all subcategories from first API, filter them:
    const filtered = categories.length > 0
      ? subCategories.filter((sc) => sc.category === selectedCategory)
      : [];

    setSubCategories(filtered);
    setSelectedSubCategory('');  // reset the subcategory selection
  }, [selectedCategory]);

  // 3. When both category and subCategory are selected, fetch results
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

    // ✅ FILTER HERE
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
      <h2 className="text-xl font-semibold mb-4">Submitted Documents</h2>

      <div className="mb-4 flex space-x-4">
        {/* Category Dropdown */}
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

        {/* Subcategory Dropdown */}
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

      {/* Results */}
      <div>
        {loadingResults ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error.message || 'Something went wrong'}</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Submittal No.</th>
                <th className="px-2 py-1 border">Category</th>
                <th className="px-2 py-1 border">Subcategory</th>
                <th className="px-2 py-1 border">Description</th>
                <th className="px-2 py-1 border">Document Link</th>
                <th className="px-2 py-1 border">Created By</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && (
                <tr>
                  <td className="px-2 py-1 border" colSpan={6}>
                    No records found
                  </td>
                </tr>
              )}
              {results.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1 border">{item.submittalNo}</td>
                  <td className="px-2 py-1 border">{item.category}</td>
                  <td className="px-2 py-1 border">{item.subCategory}</td>
                  <td className="px-2 py-1 border">{item.description}</td>
                  <td className="px-2 py-1 border">
                    <a
                      href={item.documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-2 py-1 border">{item.createdByGUID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubmittedDocuments;
