import React, { useState } from 'react';
import { func, string, array, number, arrayOf } from 'prop-types';

const LandingsTableControlls = ({
  nextPage, prevPage, resultNo, page, defaultPageSize, pageSizeOptions
}) => {
  const [ammountInput, setAmmountInput] = useState(defaultPageSize);
  return (
    <div className="controls-container">
      <button onClick={() => { prevPage(); }}>{'<'}</button>
      <p>{page}</p>
      <button onClick={() => { nextPage(); }}>{'>'}</button>
      <div className="show-more">
        <p>mer resultat:</p>

        <select
          value={ammountInput}

          onChange={(e) => {
            if (e.target.value <= 500) {
              setAmmountInput(e.target.value);
            } else {
              setAmmountInput(500);
            }
            resultNo(e.target.value);
          }}
        >
          {pageSizeOptions.map((item)=>(
            <option value={item}>{item}</option>
          ))}
        </select>
      </div>

    </div>
  );
};

LandingsTableControlls.propTypes = {
  nextPage: func.isRequired,
  prevPage: func.isRequired,
  resultNo: func.isRequired,
  page: string,
  defaultPageSize: number,
  pageSizeOptions: arrayOf(number)
};

LandingsTableControlls.defaultProps = {
  page: '',
  defaultPageSize: 5,
  pageSizeOptions: [5,10,25]
};

export default LandingsTableControlls;
