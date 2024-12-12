import React from 'react';

const renderProfileTags = ({ currentMatch }) => {
  // Helper function to render tags
  const renderTags = (title, data) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="mt-4">
        <strong>{title}</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {data.map((item, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start ">
      {/* Match Name and Age */}
      <h2 className="text-2xl font-bold">
        {currentMatch.first_name},{' '}
        {currentMatch.dob
          ? new Date().getFullYear() - new Date(currentMatch.dob).getFullYear()
          : ''}{' '}
        jaar
      </h2>

      {/* Dynamic Sections */}
      {renderTags('Gender', currentMatch?.profile_data?.genders)}
      {renderTags('Persoonlijkheid', currentMatch?.profile_data?.personalities)}
      {renderTags('Interesses', currentMatch?.profile_data?.interests)}
      {renderTags('Religie', currentMatch?.profile_data?.religions)}
      {renderTags('Thuis status', currentMatch?.profile_data?.home_status)}
      {renderTags('bijzonder kenmerk', currentMatch?.profile_data?.disabilities)}
      {renderTags('Relatie Doel', currentMatch?.profile_data?.relationship_goals)}
    </div>
  );
};

export default renderProfileTags;
