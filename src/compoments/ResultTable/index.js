import { string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const ResultTable = (({title,headers, items })=>{
    return( <div className="offload-table">
    <div className="offload-header">{title}</div>
    <div className="offload-row">
    <p className="offload-index">#</p>
    { headers.map((head, i)=>(i === 0
    ? <p className="offload-name">{head}</p>
    : <p className="offload-group">{head}</p>
    ))}
    </div>
    { items.length !== 0
        ?items.map((row, i) => (
            <Link to={row['link']}>
            {console.log(row)}
                <div className="offload-row">
                    <p className="offload-index">{i+1}</p>
                    {Object.keys(row.rows).map((col, j)=>(j === 0 
                    ?<p className="offload-name">{row.rows[col]}</p>
                    :<p className="offload-group">{row.rows[col]}</p>))}
                </div>
            </Link>
        ))
        :<p>ingen resultater</p>
    }
  </div>)
  });

  export default ResultTable;