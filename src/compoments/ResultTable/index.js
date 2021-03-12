import { string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const ResultTable = (({title,headers, footer, items,tag,TableContainerClassName })=>{
    return( <div className={TableContainerClassName} >
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
        ))} { footer.length !== 0
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
    {tag !== ""?<p className="offload-updated-time" style={{textAlign:'center'}}>{tag}</p>:<></>}
  </div>)
  });

ResultTable.defaultProps = {
    footer:[],
    headers:[],
    items:[],
    tag: "",
    TableContainerClassName :"offload-table"
};


export default ResultTable;