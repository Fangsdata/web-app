import React, { useState, useEffect } from 'react';
import ResultTable from '../ResultTable';
import { OFFLOADAPI } from '../../Constants';
import { searchFor } from '../../services/OffloadService';
const Search = ({term}) => {
    const [foundBoats, setFoundBoats] = useState([]);
    const [foundOwner, setFoundOwners] = useState([]);

    useEffect(() => {

        Promise.all([
            searchFor('boats',term, 100),
            searchFor('owners',term, 100),
        ]).then(res => {
            if(res[0] === null){
                setFoundBoats([]); 
            }
            else {
                let filteredRes = res[0].map(({
                    Name, 
                    RegistrationID , 
                    State, 
                    FishingGear, 
                    ID}) => ({ rows: {Name, RegistrationID , State, FishingGear}, link:`/boats/${ID}`}));
                setFoundBoats(filteredRes);
            }

            if(res[1] === null){
                setFoundOwners([]); 
            }
            else {
                let filteredRes = res[1].map(({
                    Fartøyeier, 
                    Poststed,
                    EierID}) => ({ rows: { Fartøyeier , Poststed }, link:`/owner/${EierID}`}));
                    setFoundOwners(filteredRes);
            }

        });
    }, [term]);

    return (
        <div>
            <ResultTable
                title={`Båter søkeresultater for "${term}"`}
                headers={["Navn","Registreringsmerke", "Fylke", "Redskap"]}
                items={foundBoats}
            />
            <ResultTable
                title={`Fiskefirma søkeresultater for "${term}"`}
                headers={["Navn","Kommune"]}
                items={foundOwner}
            />
        </div>
    );
}
export default Search;
