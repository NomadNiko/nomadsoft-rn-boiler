import { View, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeStyles, layout, components } from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenScroll,
  ProfileCard,
  Card,
  H2,
  H4,
  BodyText,
  LabelText,
  Row,
  ListItem,
  Badge,
  Divider,
  ErrorText,
} from '../components/styled';

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const theme = getThemeStyles(isDark);

  const profileStats = [
    { label: 'Projects', value: '12', icon: 'folder-outline' },
    { label: 'Clients', value: '8', icon: 'people-outline' },
    { label: 'Hours', value: '1.2k', icon: 'time-outline' },
  ];

  const profileItems = [
    { title: 'Edit Profile', icon: 'person-outline' },
    { title: 'Settings', icon: 'settings-outline' },
    { title: 'Notifications', icon: 'notifications-outline' },
    { title: 'Privacy', icon: 'lock-closed-outline' },
    { title: 'Help & Support', icon: 'help-circle-outline' },
    { title: 'Sign Out', icon: 'log-out-outline', isError: true },
  ];

  return (
    <ScreenScroll>
      <View className={layout.container.padded}>
        {/* Profile Header Card */}
        <ProfileCard>
          <View
            className={`${theme.colors.background.tertiary} ${components.image.profileWrapper} ${components.utils.p1}`}>
            <Image
              source={require('../assets/nomadsoft-black-centered.png')}
              className={components.image.profile}
              resizeMode="contain"
            />
          </View>
          <H2 className={components.spacing.mb1}>John Nomad</H2>
          <BodyText className={components.spacing.mb6}>john@nomadsoft.us</BodyText>

          {/* Stats */}
          <View className={`${components.utils.wFull} ${layout.flex.row} ${layout.flex.around}`}>
            {profileStats.map((stat, index) => (
              <View key={index} className={components.utils.itemsCenter}>
                <Ionicons name={stat.icon as any} size={24} color={theme.iconColors.primary} />
                <H4 className={components.spacing.mt2}>{stat.value}</H4>
                <LabelText>{stat.label}</LabelText>
              </View>
            ))}
          </View>
        </ProfileCard>

        {/* Profile Options */}
        <Card>
          {profileItems.map((item, index) => (
            <View key={index}>
              <ListItem>
                <Row className={components.utils.itemsCenter}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.isError ? theme.iconColors.error : theme.iconColors.primary}
                  />
                  {item.isError ? (
                    <ErrorText className={components.spacing.ml3}>{item.title}</ErrorText>
                  ) : (
                    <BodyText className={`${components.spacing.ml3} ${theme.colors.text.primary}`}>
                      {item.title}
                    </BodyText>
                  )}
                </Row>
                <Ionicons name="chevron-forward" size={20} color={theme.iconColors.secondary} />
              </ListItem>
              {index < profileItems.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        {/* Badge Examples */}
        <Card>
          <BodyText
            className={`text-lg font-medium ${theme.colors.text.primary} ${components.spacing.mb3}`}>
            Status Badges
          </BodyText>
          <Row className={`${components.utils.flexWrap} ${components.spacing.gap2}`}>
            <Badge variant="indigo">Pro Member</Badge>
            <Badge variant="purple">Verified</Badge>
            <Badge variant="green">Active</Badge>
            <Badge variant="yellow">2 Pending</Badge>
          </Row>
        </Card>
      </View>
    </ScreenScroll>
  );
}
