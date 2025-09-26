import React, { useState } from "react";
import Header from "@/components/common/Header";
import { Tabs } from "@/components/common/Tabs";
import { Search } from "lucide-react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState("");

  const search = (q) => {
    if (!q.trim()) {
      setMsg("Please enter a search term.");
      return;
    }
    setMsg("");
    // TODO: implement actual API search
    console.log("Searching for:", q);
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto py-4 sm:px-6 pb-20">
        {/* Search Section */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Search Files
          </h2>
          <div className="flex flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name or tag"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={() => search(query)}
              className="rounded-xl bg-primary px-4 md:px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
            >
              <p className="hidden md:block">Search</p>
              <Search color="#ffffff" className="md:hidden " />
            </button> 
          </div>
          {msg && <p className="mt-2 text-sm text-red-500">{msg}</p>}
        </section>

        {/* Files List */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Recent Files
          </h2>
          { files && files.length === 0 ? (
            <p className="text-center text-gray-500">No files available.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="mb-2">
                    <p className="font-semibold text-gray-900 truncate">
                      {f.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded by {f.User?.name || "user"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Tags: {f.tags || "—"}
                  </p>
                  <a
                    href={f.s3Url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white shadow transition hover:bg-blue-700"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default SearchPage;
