import React from 'react';
import ProfileFilterSection from './profileFiltersSection';

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
    profileData: {
        genders: number[];
        interests: number[];
        religions: number[];
        disabilities: number[];
        home_statuses: number[];
        personalities: number[];
        relationship_goals: number[];
    };
};

const ProfileFilters: React.FC<ProfileFiltersProps> = ({ filterData, profileData }) => {
    const filterSections = [
        { title: 'Mijn gender', data: filterData.genders, keyField: 'gender_id', labelField: 'gender', selectedIds: profileData.genders },
        { title: 'Mijn interesses', data: filterData.interests, keyField: 'id', labelField: 'interest', selectedIds: profileData.interests },
        { title: 'Mijn religie', data: filterData.religions, keyField: 'religion_id', labelField: 'religion', selectedIds: profileData.religions },
        { title: 'Mijn handicap', data: filterData.disabilities, keyField: 'disability_id', labelField: 'disability', selectedIds: profileData.disabilities },
        { title: 'Mijn thuisstatus', data: filterData.home_statuses, keyField: 'home_status_id', labelField: 'home_status', selectedIds: profileData.home_statuses },
        { title: 'Mijn persoonlijkheid', data: filterData.personalities, keyField: 'personality_id', labelField: 'personality', selectedIds: profileData.personalities },
        { title: 'Mijn relatie doelen', data: filterData.relationship_goals, keyField: 'relationship_goals_id', labelField: 'relationship_goals', selectedIds: profileData.relationship_goals }
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
                    selectedIds={filter.selectedIds}
                />
            ))}
        </div>
    );
};

export default ProfileFilters;
