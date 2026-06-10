import { theme } from 'antd';
import { BLUE_BASE } from 'constants/ThemeConstant';

export const rgba = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const baseTheme = {
  colorPrimary: BLUE_BASE,
};

export const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: BLUE_BASE,
  },
};

export const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: BLUE_BASE,
  },
};
