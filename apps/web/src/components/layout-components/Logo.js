import React from 'react'
import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH, NAV_TYPE_TOP } from 'constants/ThemeConstant';
import { APP_NAME } from 'configs/AppConfig';
import { useSelector } from 'react-redux';
import utils from 'utils';
import { Grid } from 'antd';
import styled from '@emotion/styled';
import { TEMPLATE, BLUE_BASE } from 'constants/ThemeConstant';

const LogoWrapper = styled.div(() => ({
	height: TEMPLATE.HEADER_HEIGHT,
	display: 'flex',
	alignItems: 'center',
	padding: '0 1rem',
	backgroundColor: 'transparent',
	transition: 'all .2s ease',
	gap: '10px',
	overflow: 'hidden',
}));

const LogoBadge = styled.div(({ light }) => ({
	width: 36,
	height: 36,
	minWidth: 36,
	borderRadius: 10,
	background: `linear-gradient(135deg, ${BLUE_BASE} 0%, #6c5ce7 100%)`,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: '#fff',
	fontWeight: 800,
	fontSize: 16,
	letterSpacing: '-1px',
	boxShadow: '0 4px 12px rgba(62,121,247,0.35)',
}));

const LogoText = styled.span(({ light }) => ({
	fontWeight: 700,
	fontSize: 17,
	letterSpacing: '-0.3px',
	color: light ? '#fff' : '#1a3353',
	whiteSpace: 'nowrap',
}));

const { useBreakpoint } = Grid;

export const Logo = ({ mobileLogo, logoType }) => {

	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
	const navCollapsed = useSelector(state => state.theme.navCollapsed);
	const navType = useSelector(state => state.theme.navType);

	const isLight = logoType === 'light';

	const getLogoWidthGutter = () => {
		const isNavTop = navType === NAV_TYPE_TOP;
		if (isMobile && !mobileLogo) return 0;
		if (isNavTop) return 'auto';
		if (navCollapsed) return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
		return `${SIDE_NAV_WIDTH}px`;
	};

	return (
		<LogoWrapper className={isMobile && !mobileLogo ? 'd-none' : 'logo'} style={{ width: getLogoWidthGutter() }}>
			<LogoBadge light={isLight}>DE</LogoBadge>
			{!navCollapsed && <LogoText light={isLight}>{APP_NAME}</LogoText>}
		</LogoWrapper>
	);
};

export default Logo;
