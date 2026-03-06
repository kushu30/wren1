"use client";

import { useEffect, useState } from "react";

type Log = {
  timestamp: string;
  module: string;
  risk: string;
  action: string;
  reason: string;
};

export default function Dashboard() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:8000/events");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs =
    filter === "all"
      ? logs
      : logs.filter((log) => log.module === filter);

  const countByModule = (module: string) =>
    logs.filter((l) => l.module === module).length;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 p-8">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">
        Wren Security Console
      </h1>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {["input", "output", "tool", "rag"].map((module) => (
          <div
            key={module}
            className="bg-gray-900 p-4 rounded-lg border border-gray-800"
          >
            <div className="text-sm text-gray-400 uppercase">{module}</div>
            <div className="text-2xl font-semibold">
              {countByModule(module)}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {["all", "input", "output", "tool", "rag"].map((m) => (
          <button
            key={m}
            onClick={() => setFilter(m)}
            className={`px-4 py-2 rounded ${
              filter === m
                ? "bg-teal-500 text-black"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-left text-gray-400">
              <th className="py-2">Timestamp</th>
              <th className="py-2">Module</th>
              <th className="py-2">Risk</th>
              <th className="py-2">Action</th>
              <th className="py-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs
              .slice()
              .reverse()
              .map((log, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-gray-900"
                >
                  <td className="py-2 text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 uppercase">{log.module}</td>
                  <td
                    className={`py-2 font-semibold ${
                      log.risk === "high"
                        ? "text-red-400"
                        : log.risk === "medium"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {log.risk}
                  </td>
                  <td className="py-2">{log.action}</td>
                  <td className="py-2 text-gray-300">{log.reason}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}