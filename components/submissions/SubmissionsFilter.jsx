// components/submissions/SubmissionsFilter.js
import React from 'react';
import { Filter } from 'lucide-react';

const SubmissionsFilter = ({ filter, onFilterChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Filter className="w-4 h-4 text-[#A49595]" />
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
      >
        <option value="all">All Types</option>
        <option value="startup">Startups</option>
        <option value="talent">Talents</option>
      </select>
    </div>
  );
};

export default SubmissionsFilter;