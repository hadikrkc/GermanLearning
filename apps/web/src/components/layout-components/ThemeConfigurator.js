import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Radio, Switch } from 'antd';
import {
  toggleCollapsedNav,
  onNavTypeChange,
  onNavStyleChange,
  onSwitchTheme,
  onDirectionChange,
} from 'store/slices/themeSlice';
import NavLanguage from './NavLanguage';
import {
  SIDE_NAV_LIGHT,
  NAV_TYPE_SIDE,
  NAV_TYPE_TOP,
  SIDE_NAV_DARK,
  DIR_RTL,
  DIR_LTR,
} from 'constants/ThemeConstant';

const ListOption = ({ name, selector, disabled, vertical }) => (
  <div className={`my-4 ${vertical ? '' : 'd-flex align-items-center justify-content-between'}`}>
    <div className={`${disabled ? 'opacity-0-3' : ''} ${vertical ? 'mb-3' : ''}`}>{name}</div>
    <div>{selector}</div>
  </div>
);

export const ThemeConfigurator = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { navType, sideNavTheme, navCollapsed, currentTheme, direction } = useSelector(
    (state) => state.theme,
  );
  const isNavTop = navType === NAV_TYPE_TOP;

  return (
    <>
      <div className="mb-5">
        <h4 className="mb-3 font-weight-bold">{t('theme.navigation')}</h4>
        <ListOption
          name={t('theme.navigationType')}
          selector={
            <Radio.Group
              size="small"
              onChange={(e) => dispatch(onNavTypeChange(e.target.value))}
              value={navType}
            >
              <Radio.Button value={NAV_TYPE_SIDE}>{t('theme.side')}</Radio.Button>
              <Radio.Button value={NAV_TYPE_TOP}>{t('theme.top')}</Radio.Button>
            </Radio.Group>
          }
        />
        <ListOption
          name={t('theme.sideNavColor')}
          selector={
            <Radio.Group
              disabled={isNavTop}
              size="small"
              onChange={(e) => dispatch(onNavStyleChange(e.target.value))}
              value={sideNavTheme}
            >
              <Radio.Button value={SIDE_NAV_LIGHT}>{t('theme.light')}</Radio.Button>
              <Radio.Button value={SIDE_NAV_DARK}>{t('theme.dark')}</Radio.Button>
            </Radio.Group>
          }
          disabled={isNavTop}
        />
        <ListOption
          name={t('theme.sideNavCollapse')}
          selector={
            <Switch
              disabled={isNavTop}
              checked={navCollapsed}
              onChange={() => dispatch(toggleCollapsedNav(!navCollapsed))}
            />
          }
          disabled={isNavTop}
        />
        <ListOption
          name={t('theme.darkTheme')}
          selector={
            <Switch
              checked={currentTheme === 'dark'}
              onChange={(v) => dispatch(onSwitchTheme(v ? 'dark' : 'light'))}
            />
          }
        />
        <ListOption
          name={t('theme.direction')}
          selector={
            <Radio.Group
              size="small"
              onChange={(e) => dispatch(onDirectionChange(e.target.value))}
              value={direction}
            >
              <Radio.Button value={DIR_LTR}>LTR</Radio.Button>
              <Radio.Button value={DIR_RTL}>RTL</Radio.Button>
            </Radio.Group>
          }
        />
      </div>
      <div className="mb-5">
        <h4 className="mb-3 font-weight-bold">{t('theme.locale')}</h4>
        <ListOption name={t('theme.language')} selector={<NavLanguage configDisplay />} />
      </div>
    </>
  );
};

export default ThemeConfigurator;
