/** @jsxImportSource @emotion/react */
import { CheckOutlined, GlobalOutlined, DownOutlined  } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import NavItem from './NavItem'
import lang from 'assets/data/language.data.json';
import { useSelector, useDispatch } from 'react-redux';
import { onLocaleChange } from 'store/slices/themeSlice';
import i18n from 'i18next'
import { SPACER } from 'constants/ThemeConstant';
import { baseTheme } from 'configs/ThemeConfig';
import Flex from "components/shared-components/Flex";
import { css } from '@emotion/react';

function getLanguageDetail (locale) {
	const data = lang.filter(elm => (elm.langId === locale))
	return data[0]
}

const FlagEmoji = ({ emoji }) => (
	<span style={{ fontSize: '18px', lineHeight: 1 }}>{emoji}</span>
);

const SelectedLanguage = () => {

	const locale = useSelector(state => state.theme.locale)

	const language = getLanguageDetail(locale);
	const {langName, icon} = language;

	return (
		<Flex alignItems="center">
			<FlagEmoji emoji={icon} />
			<span className="font-weight-semibold ml-2">{langName} <DownOutlined className="font-size-xs"/></span>
		</Flex>
	)
}


const MenuItem = (props) => {
	const locale = useSelector(state => state.theme.locale);

	const dispatch = useDispatch();

	const handleLocaleChange = (langId) => {
		dispatch(onLocaleChange(langId))
		i18n.changeLanguage(langId)
	}

	return (
		<span>
			<Flex
				alignItems="center"
				justifyContent="space-between"
				gap={SPACER[4]}
				onClick={() => handleLocaleChange(props.langId)}
			>
				<Flex alignItems="center" gap={SPACER[2]}>
					<FlagEmoji emoji={props.icon} />
					<span className="font-weight-normal ml-2">{props.langName}</span>
				</Flex>
				{locale === props.langId ? <CheckOutlined css={css`color: ${baseTheme.colorSuccess}`} /> : null}
			</Flex>
		</span>
	)
}

const items = lang.map(l => ({
	key: l.lang,
	label: <MenuItem icon={l.icon} langName={l.langName} langId={l.langId} />
}));


export const NavLanguage = ({ configDisplay, mode }) => {

	return (
		<Dropdown placement="bottomRight" menu={{items}} trigger={["click"]}>
			{
				configDisplay ?
				(
					<a href="#/" className="text-gray" onClick={e => e.preventDefault()}>
						<SelectedLanguage />
					</a>
				)
				:
				(
					<NavItem mode={mode}>
						<GlobalOutlined className="nav-icon mr-0" />
					</NavItem>
				)
			}
		</Dropdown>
	)
}

export default NavLanguage;
