import React from 'react';
import { Dropdown, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import NavItem from './NavItem';
import Flex from 'components/shared-components/Flex';
import { signOut } from 'store/slices/authSlice';
import styled from '@emotion/styled';
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER, FONT_SIZES } from 'constants/ThemeConstant';
import { useTranslation } from 'react-i18next';

const Icon = styled.div(() => ({ fontSize: FONT_SIZES.LG }));

const Profile = styled.div(() => ({ display: 'flex', alignItems: 'center' }));

const UserInfo = styled('div')`
  padding-left: ${SPACER[2]};
  @media ${MEDIA_QUERIES.MOBILE} { display: none }
`;

const Name = styled.div(() => ({ fontWeight: FONT_WEIGHT.SEMIBOLD }));

const Title = styled.span(() => ({ opacity: 0.8 }));

const MenuItem = (props) => (
  <Flex as="a" href={props.path} alignItems="center" gap={SPACER[2]}>
    <Icon>{props.icon}</Icon>
    <span>{props.label}</span>
  </Flex>
);

const MenuItemSignOut = (props) => {
  const dispatch = useDispatch();
  return (
    <div onClick={() => dispatch(signOut())}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon><LogoutOutlined /></Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  );
};

export const NavProfile = ({ mode }) => {
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const roleLabel = {
    STUDENT: t('nav.profile.role.student'),
    TEACHER: t('nav.profile.role.teacher'),
    ADMIN: t('nav.profile.role.admin'),
  }[user?.role] ?? '';

  const menuItems = [
    {
      key: 'profile',
      label: <MenuItem path="/app/profile" label={t('nav.profile.editProfile')} icon={<UserOutlined />} />,
    },
    {
      key: 'settings',
      label: <MenuItem path="/app/settings" label={t('nav.profile.settings')} icon={<SettingOutlined />} />,
    },
    { type: 'divider' },
    {
      key: 'sign-out',
      label: <MenuItemSignOut label={t('nav.profile.signOut')} />,
    },
  ];

  return (
    <Dropdown placement="bottomRight" menu={{ items: menuItems }} trigger={['click']}>
      <NavItem mode={mode}>
        <Profile>
          <Avatar icon={<UserOutlined />} />
          <UserInfo className="profile-text">
            <Name>{user?.displayName ?? user?.email ?? 'User'}</Name>
            <Title>{roleLabel}</Title>
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  );
};

export default NavProfile;
