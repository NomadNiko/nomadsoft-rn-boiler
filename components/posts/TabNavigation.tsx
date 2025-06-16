import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BodyText } from '../styled';
import { components } from '../../styles/globalStyles';
import { PostTabType } from '../../types';

interface TabNavigationProps {
  activeTab: PostTabType;
  onTabChange: (tab: PostTabType) => void;
  themeStyles: any;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  themeStyles,
}) => {
  const tabs: { key: PostTabType; label: string }[] = [
    { key: 'all', label: 'All Users' },
    { key: 'friends', label: 'Friends' },
    { key: 'mine', label: 'My Posts' },
  ];

  return (
    <View className={`${components.responsive.feedContainer} border-b border-gray-200`}>
      <View className="flex-row">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            className={`flex-1 items-center border-b-2 py-3 ${
              activeTab === tab.key ? 'border-blue-500' : 'border-transparent'
            }`}>
            <BodyText
              className={`font-medium ${
                activeTab === tab.key ? 'text-blue-500' : themeStyles.colors.text.secondary
              }`}>
              {tab.label}
            </BodyText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
