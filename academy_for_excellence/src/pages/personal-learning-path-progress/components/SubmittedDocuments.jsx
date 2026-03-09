import React, { useState, useEffect } from "react";
import {
  getDocumentSubCategories,
  getSubmittalLines
} from "../../../services/businessCentralApi";

const userProfile = JSON.parse(localStorage.getItem("userData") || "{}");
const userGuid = userProfile.guid;

const SubmittedDocuments = () => {

  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [allResults, setAllResults] = useState([]);
  const [results, setResults] = useState([]);

  const [loadingResults, setLoadingResults] = useState(false);

  // =============================
  // Load Categories + Subcategories
  // =============================
  useEffect(() => {

    const loadCategories = async () => {

      try {

        const data = await getDocumentSubCategories();
        const subCats = data.value || data || [];

        setAllSubCategories(subCats);

        const catMap = new Map();

        subCats.forEach(item => {

          const categoryCode =
            item.category ||
            item.documentCategory ||
            item.documentCategoryCode;

          const categoryName =
            item.categoryName ||
            item.documentCategoryDesc ||
            item.documentCategoryDescription ||
            categoryCode;

          if (!catMap.has(categoryCode)) {

            catMap.set(categoryCode, {
              category: categoryCode,
              categoryName: categoryName
            });

          }

        });

        setCategories(Array.from(catMap.values()));

      } catch (err) {

        console.error("Error loading categories", err);

      }

    };

    loadCategories();

  }, []);

  // =============================
  // Load Submittal Lines
  // =============================
  useEffect(() => {

    const loadSubmittals = async () => {

      setLoadingResults(true);

      try {

        const res = await getSubmittalLines();
        const data = res.value || res || [];

        setAllResults(data);

      } catch (err) {

        console.error("Error loading submittals", err);

      } finally {

        setLoadingResults(false);

      }

    };

    loadSubmittals();

  }, []);

  // =============================
  // Filter Subcategories
  // =============================
  useEffect(() => {

    if (!selectedCategory) {

      setSubCategories([]);
      setSelectedSubCategory("");
      return;

    }

    const filtered = allSubCategories.filter(sc => {

      const cat =
        sc.category ||
        sc.documentCategory ||
        sc.documentCategoryCode;

      return cat === selectedCategory;

    });

    setSubCategories(filtered);
    setSelectedSubCategory("");

  }, [selectedCategory, allSubCategories]);

  // =============================
  // Filter Table Results
  // =============================
  useEffect(() => {

    if (!selectedCategory) {

      setResults([]);
      return;

    }

    const filtered = allResults.filter(item => {

      if (!item) return false;

      const createdBy =
        item.createdByGUID ||
        item.createdByGuid ||
        item.createdBy;

      const category =
        item.documentCategory ||
        item.category;

      const lineSubCategory =
        item.subCategory?.trim().toLowerCase() || "";

      const selectedSubCat =
        selectedSubCategory?.trim().toLowerCase();

      const categoryMatch =
        category?.trim() === selectedCategory?.trim();

      const subCategoryMatch =
        !selectedSubCategory ||
        lineSubCategory === selectedSubCat;

      const userMatch =
        !userGuid ||
        createdBy?.toLowerCase() === userGuid?.toLowerCase();

      return categoryMatch && subCategoryMatch && userMatch;

    });

    setResults(filtered);

  }, [selectedCategory, selectedSubCategory, allResults]);

  return (

    <div className="p-4">

      {/* FILTERS */}
      <div className="mb-4 flex space-x-4">

        {/* CATEGORY */}
        <div>

          <label className="block text-sm font-medium">
            Category
          </label>

          <select
            className="border rounded mt-1 px-2 py-1"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >

            <option value="">
              -- Select Category --
            </option>

            {categories.map(cat => (

              <option
                key={cat.category}
                value={cat.category}
              >
                {cat.categoryName}
              </option>

            ))}

          </select>

        </div>

        {/* SUBCATEGORY */}
        <div>

          <label className="block text-sm font-medium">
            Subcategory
          </label>

          <select
            className="border rounded mt-1 px-2 py-1"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            disabled={!selectedCategory}
          >

            <option value="">
              -- Select Subcategory --
            </option>

            {subCategories.map(sc => {

              const subCat =
                sc.subCategory ||
                sc.documentSubCategory ||
                sc.code;

              const subCatDesc =
                sc.subCategoryName ||
                sc.documentSubCategoryDesc ||
                sc.documentSubCategoryDescription ||
                sc.subCategoryDescription ||
                sc.description ||
                "";

              return (

                <option
                  key={subCat}
                  value={subCat}
                >
                  {subCatDesc
                    ? `${subCat} - ${subCatDesc}`
                    : subCat}
                </option>

              );

            })}

          </select>

        </div>

      </div>

      {/* TABLE */}
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">

        <thead>

          <tr className="bg-blue-600 text-white">

            <th className="text-left px-4 py-3 border-r">
              Submittal No.
            </th>

            <th className="text-left px-4 py-3 border-r">
              Description
            </th>

            <th className="text-center px-4 py-3">
              Document
            </th>

          </tr>

        </thead>

        <tbody>

          {loadingResults ? (

            <tr>
              <td colSpan={3} className="text-center py-4">
                Loading...
              </td>
            </tr>

          ) : results.length === 0 ? (

            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No records found
              </td>
            </tr>

          ) : (

            results.map((item, idx) => (

              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >

                <td className="px-4 py-3 border-r">
                  {item.submittalNo}
                </td>

                <td className="px-4 py-3 border-r">
                  {item.description}
                </td>

                <td className="px-4 py-3 text-center">

                  {item.documentLink ? (

                    <a
                      href={item.documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>

                  ) : "-"}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

};

export default SubmittedDocuments;