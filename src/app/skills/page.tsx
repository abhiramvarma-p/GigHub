'use client';

import React from 'react';
import SkillTree from '../../components/SkillTree';

const SkillsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Skill Tree Visualization</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="w-full h-[800px]">
            <SkillTree width={928} height={680} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage; 