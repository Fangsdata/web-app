import React from 'react';
import {
  string, func, arrayOf, shape, bool,
} from 'prop-types';
import FilterCheckBoxItem from '../FilterCheckBoxItem';

const FilterCheckBox = ({
  inputEvent, items, group, checkBoxType,
}) => (
  <>
    <div className="filter-container">
      { items.map((item) => (
        <FilterCheckBoxItem
          key={item}
          group={group}
          item={item.title}
          value={item.value}
          checkState={item.checkState}
          inputEvent={inputEvent}
          checkBoxType={checkBoxType}
        />
      ))}
    </div>

    {/* {show
    ?
    <div className="filter-container">
    { items.map((item) => (
      <FilterCheckBoxItem
        key={item}
        group={group}
        item={item.title}
        value={item.value}
        checkState={item.checkState}
        inputEvent={inputEvent}
        checkBoxType={checkBoxType}
      />
    ))}
  </div>
    : <>
      </>
    } */}
  </>
);

FilterCheckBox.propTypes = {
  items: arrayOf(shape({
    title: string,
    value: string,
    checkState: bool,
  })),
  group: string,
  inputEvent: func,
  checkBoxType: string,
};

FilterCheckBox.defaultProps = {
  items: [],
  group: '',
  inputEvent: () => { console.log('missing inputEvent'); },
  checkBoxType: 'checkbox',
};


export default FilterCheckBox;
