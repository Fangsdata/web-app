import React, { useState, useEffect } from 'react';
import ResultTable from '../ResultTable';
import { OFFLOADAPI } from '../../Constants';

const Search = ({term}) => {
    const [foundBoats, setFoundBoats] = useState([]);

    useEffect(() => {
        fetch(`${OFFLOADAPI}/search/boats/${term}/100/1`)
        .then((res) => res.json())
        .then((res) => {
            let filteredRes = res.map(({
                name, 
                registration_id, 
                state, 
                fishingGear, 
                id}) => ({ rows: {name, registration_id, state, fishingGear,}, link:`/boats/${id}`}));
            setFoundBoats(filteredRes);
        });
    }, [term]);

    return (
        <div>
            <ResultTable
                title={`Søkeresultater for "${term}"`}
                headers={["Navn","Registreringsmerke", "Fylke", "Redskap"]}
                items={foundBoats}
            />
        </div>
    );
}
export default Search;
