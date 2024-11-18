import React from 'react';
import ProfileFilterSection from './profileFiltersSection'; // Assuming you have this component

type ProfileFiltersProps = {
    filterData: {
        genders: any[];
        interests: any[];
        religions: any[];
        disabilities: any[];
        home_statuses: any[];
        personalities: any[];
        relationship_goals: any[];
    };
    profileData: any;   // User's selected filters
};

const ProfileFilters: React.FC<ProfileFiltersProps> = ({ filterData, profileData }) => {
    const filterSections = [
        { title: 'Mijn gender', data: filterData.genders, keyField: 'gender_id', labelField: 'gender' },
        { title: 'Mijn interesses', data: filterData.interests, keyField: 'id', labelField: 'interest' },
        { title: 'Mijn religie', data: filterData.religions, keyField: 'religion_id', labelField: 'religion' },
        { title: 'Mijn handicap', data: filterData.disabilities, keyField: 'disability_id', labelField: 'disability' },
        { title: 'Mijn thuisstatus', data: filterData.home_statuses, keyField: 'home_status_id', labelField: 'home_status' },
        { title: 'Mijn persoonlijkheid', data: filterData.personalities, keyField: 'personality_id', labelField: 'personality' },
        { title: 'Mijn relatie doelen', data: filterData.relationship_goals, keyField: 'relationship_goals_id', labelField: 'relationship_goals' }
    ];

    return (
        <div>
            {filterSections.map((filter) => (
                <ProfileFilterSection
                    key={filter.title}
                    title={filter.title}
                    data={filter.data}
                    keyField={filter.keyField}
                    labelField={filter.labelField}
                    profileData={profileData}
                />
            ))}
        </div>
    );
};

export default ProfileFilters;
