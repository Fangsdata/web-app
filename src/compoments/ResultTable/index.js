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
            <Link to={`/boats/${row['registration_id']}`}>
                <div className="offload-row">
                <p className="offload-index">{i+1}</p>
                {Object.keys(row).map((col, i)=>(i === 0
                ?<p className="offload-name">{row[col]}</p>
                :<p className="offload-group">{row[col]}</p>))}
                </div>
            </Link>
        ))
        :<p>ingen resultater</p>
    }
  </div>)
  });

  export default ResultTable;