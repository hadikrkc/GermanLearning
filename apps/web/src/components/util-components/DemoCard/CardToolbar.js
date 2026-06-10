/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import {
  DownSquareOutlined,
  UpSquareOutlined,
  CheckOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { Tooltip, theme } from 'antd';
import { codeBoxActionCss, codeBoxIconCss } from './DemoCard.style';

const { useToken } = theme;

const CardToolbar = ({ code, expand, isExpand }) => {
  const [copied, setCopied] = useState(false);
  const { token } = useToken();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div css={codeBoxActionCss(token)}>
      <span css={codeBoxIconCss(token, copied)} onClick={handleCopy}>
        <Tooltip title={copied ? 'Copied' : 'Copy code'}>
          {copied ? <CheckOutlined /> : <SnippetsOutlined />}
        </Tooltip>
      </span>
      <span css={codeBoxIconCss(token)} onClick={expand}>
        <Tooltip title={isExpand ? 'Hide code' : 'Show code'}>
          {isExpand ? <UpSquareOutlined /> : <DownSquareOutlined />}
        </Tooltip>
      </span>
    </div>
  );
};

export default CardToolbar;
