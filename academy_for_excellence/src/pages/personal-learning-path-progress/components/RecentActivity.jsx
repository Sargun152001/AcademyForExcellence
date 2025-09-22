import React, { useEffect, useState } from "react";
import { getJobTargets } from "../../../services/businessCentralApi";
import Icon from "../../../components/AppIcon";

const JobTargetsTree = ({ resourceCode }) => {
  const [jobTargets, setJobTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getJobTargets(resourceCode);
        setJobTargets(data || []);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (resourceCode) fetchData();
  }, [resourceCode]);

  if (loading) return <div>Loading Job Targets...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!jobTargets.length) return <div>No job targets found for resource {resourceCode}</div>;

  const headings = jobTargets.filter(jt => jt.type === "Heading");
  const postings = jobTargets.filter(jt => jt.type === "Posting");

  const getPostingsForHeading = (heading) =>
    postings.filter(p => p.jobTitleHeaderLineNo === heading.jobTitleLineNo);

  return (
    <div className="space-y-4">
      {headings.map(heading => (
        <div
          key={heading.jobTitleLineNo}
          className="bg-card rounded-lg border border-border construction-shadow"
        >
          {/* Main row with heading details + icon */}
         <div
  className="flex justify-between items-center p-4 cursor-pointer 
             rounded-t-lg bg-gradient-to-r from-primary to-secondary text-white"
  onClick={() =>
    setExpanded((prev) => ({
      ...prev,
      [heading.jobTitleLineNo]: !prev[heading.jobTitleLineNo],
    }))
  }
>
  <div>
    <div className="text-sm font-medium">
      {heading.description || "N/A"}
    </div>
    <div className="text-xs opacity-90">
      Period:{heading.period || "N/A"} | Capacity: {heading.capacity || "N/A"} | Unit of Measure: {heading.unitofMeasure || "N/A"}
    </div>
  </div>
  <Icon
    name={expanded[heading.jobTitleLineNo] ? "ChevronDown" : "ChevronRight"}
    size={18}
    className="text-white"
  />
</div>


          {/* Child postings */}
          {expanded[heading.jobTitleLineNo] && (
            <ul className="pl-6 pb-4 space-y-2">
              {getPostingsForHeading(heading).map(posting => (
                <li
                  key={posting.jobTitleLineNo}
                  className="p-2 bg-muted rounded-md border border-border"
                >
                  <div className="text-sm font-medium">
                     {posting.description || "N/A"}
                  </div>
                  <div className="text-xs text-professional-gray">
                    Period:{posting.period || "N/A"} | Capacity: {posting.capacity || "N/A"} | Unit of Measure: {posting.unitofMeasure || "N/A"} 
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default JobTargetsTree;
