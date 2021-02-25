import { string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const ResultTable = (({title,headers, footer, items })=>{
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
        ?<>
            {items.map((row, i) => (
            <Link to={row['link']}>
                <div className="offload-row">
                    <p className="offload-index">{i+1}</p>
                    {Object.keys(row.rows).map((col, j)=>(j === 0 
                    ?<p className="offload-name">{row.rows[col]}</p>
                    :<p className="offload-group">{row.rows[col]}</p>))}
                </div>
            </Link>
        ))} { footer !== []
            ?   <div className="offload-row">
                    {footer.map((foot, i)=>(i === 0
                    ? <p className="offload-name">{foot}</p>
                    : <p className="offload-group">{foot}</p>
                    ))}
                </div> 
            :<></>
        }

            
        </>
        :<div className="offload-row" style={{alignContent:'center', justifyContent:'center'}}>
            <p className="offload-group">Ingen resultater...</p>
         </div>
    }
  </div>)
  });

ResultTable.defaultProps = {
    footer:[],
    items:[] 
};


export default ResultTable;