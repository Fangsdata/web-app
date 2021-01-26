import React from 'react';
import { string, func, bool } from 'prop-types';


const FilterCheckBoxItem = ({
  item, value, group, inputEvent, checkState, checkBoxType,
}) => (
  <div className="check-item">
    <input
      className="checkbox"
      type={checkBoxType}
      name={group}
      id={item}
      value={value}
      onChange={inputEvent}
      checked={checkState}
    />
    <label className="filter-label" htmlFor={item}>{item}</label>
  </div>
);

FilterCheckBoxItem.propTypes = {
  item: string,
  value: string,
  group: string,
  inputEvent: func,
  checkState: bool,
  checkBoxType: string,
};

FilterCheckBoxItem.defaultProps = {
  item: '',
  value: '',
  group: '',
  inputEvent: () => { console.log('missing inputEvent'); },
  checkState: false,
  checkBoxType: 'checkbox',
};

export default FilterCheckBoxItem;
