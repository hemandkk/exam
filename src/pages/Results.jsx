import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResults } from "../services/api";

export default function Results() {
  const { studentId } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    getResults(studentId).then((res) => setResults(res.data));
  }, [studentId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Results</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="min-w-full border bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Score</th>
              <th className="py-2 px-4">Download</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res, i) => (
              <tr key={i} className="border-t text-center">
                <td className="py-2 px-4">{res.category}</td>
                <td className="py-2 px-4">{res.score}</td>
                <td className="py-2 px-4">
                  <a
                    href={`http://localhost:8000/marksheet/${studentId}/${res.category}`}
                    className="text-blue-600 underline"
                    target="_blank" rel="noreferrer"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
