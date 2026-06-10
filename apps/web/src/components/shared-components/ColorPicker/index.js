import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ColorPicker = ({ colorChange, color = '#ffffff' }) => {
  const [value, setValue] = useState(color);

  const onChange = (e) => {
    setValue(e.target.value);
    colorChange && colorChange({ hex: e.target.value });
  };

  return (
    <div className="color-picker" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <input type="color" value={value} onChange={onChange} style={{ width: 32, height: 32, cursor: 'pointer', border: 'none', padding: 0 }} />
    </div>
  );
};

ColorPicker.propTypes = {
  color: PropTypes.string,
  colorChange: PropTypes.func,
};

export default ColorPicker;
