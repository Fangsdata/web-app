import React, { useEffect, useState } from 'react';
import boaticon from './boat.png';
import { 
    normalizeCase, normalizeLength,
  } from '../../services/TextTools';
import { getOwnerBoats, getOwnerDetails,getBoatLocation } from '../../services/OffloadService';
import { getOrginizationInfo } from '../../services/NorgeOrginizationService';

import VesselMap from '../../compoments/Map';
import ResultTable from '../../compoments/ResultTable';
import LoadingAnimation from '../../compoments/LoadingAnimation';

function OwnerDetails({ownerId}) {

    const [ownerDetails, setOwnerDetails] = useState({});
    const [boatsLocations, setBoatLocations] = useState([]);
    const [ boatHistory, setBoatHistory ] = useState([]);
    const jsonConcat = (o1, o2) =>{
        for (var key in o2) {
            o1[key] = o2[key];
           }
           return o1;
    }
    useEffect(()=>{
        Promise.all([
            getOwnerDetails(ownerId),
            getOwnerBoats(ownerId, 'current'),
            getOwnerBoats(ownerId),
            getOrginizationInfo(ownerId),
        ]).then((resp)=>{
            let allOwners = jsonConcat(resp[0], resp[3]);
            setOwnerDetails(allOwners );
            let currentBoatsRadioSignals = resp[1].map(({Radiokallesignal})=>Radiokallesignal);
            currentBoatsRadioSignals.forEach( radioSignal => {
                getBoatLocation(radioSignal)
                    .then((map)=>{
                        if( map ){
                            let newBoat = [map[0]['latitude'], map[0]['longitude']];
                            let tempBoatLocations = boatsLocations;
                            tempBoatLocations.push(newBoat);
                            setBoatLocations([...boatsLocations]);

                        }

                });
            });

            let boatHistory = resp[2].map(({FartøyID, Fartøynavn,FraAr,ToAr,StørsteLengde,Redskap}) => ({
                rows: {
                    name : normalizeCase(Fartøynavn),
                    FraAr,
                    ToAr : ToAr === 2019 ? 'Ikke Solgt' : ToAr,
                    Redskap,
                    length : normalizeLength(StørsteLengde) 
                },
                link: `/boats/${FartøyID}`
            }));
            boatHistory.reverse();
            setBoatHistory(boatHistory);


        });
    },[ownerId]);

    return (
        <div className="boat-container">
            {ownerDetails && Object.keys(ownerDetails).length !== 0
            ? (
                <>
                    <img src={boaticon} className="boat-img" alt="boat" />
                    <div className="boat-info">
                    <p className="boat-header">{ normalizeCase(ownerDetails.Fartøyeier) }</p>
                    <br/>
                    <p className="boat-details">
                        { `Organisasjonsnummer : ${ownerDetails.EierID} ` }
                    </p>
                    <p className="boat-details">
                        { `År Etablert : ${ownerDetails.registreringsdatoEnhetsregisteret}` }
                    </p>
                    <p className="boat-details">
                        { ` Postadresse : ${normalizeCase(ownerDetails.Postadresse)}` }
                    </p>
                    <p className="boat-details">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;
                        { `${ownerDetails.Postnummer}  ${normalizeCase(ownerDetails.Poststed)}` }
                    </p>
                    {ownerDetails.hjemmeside
                    ?   <p className="boat-details">Hjemmeside : 
                            <a href={`https://${ownerDetails.hjemmeside}`}> 
                            {` ${ownerDetails.hjemmeside}` }
                            </a> 
                        </p>
                    :<></>
                    }
                    <br />
                    </div>
                </>
                )

            :( <div className="loader-container">
                    <div className="placeholder-item" />
                    <div className="placeholder-info-container">
                    <div className="placeholder-item header" />
                    <div className="placeholder-item info" />
                    <div className="placeholder-item info" />
                    <div className="placeholder-item info" />
                    <div className="placeholder-item info" />
                </div>
            </div>)
            }
            {boatsLocations.length !== 0
                ? (
                <div className="map-container">
                    <VesselMap mapData={boatsLocations}/>
                </div>
                )
                : <></>} 

                { boatHistory.length !== 0
                ? <ResultTable
                    title={"Båteierens historie"}
                    headers={["Navn", "Kjøpt år", "Solgt år", "Redskap", "Lengde"]}
                    items={boatHistory}
                    tag={`Oppdatert 31-12-2019`}
                    TableContainerClassName="offload-table landing-table"
                />
                : <LoadingAnimation rowCount={4} 
                containerClass='top-offload-loading-container landing-table'/>
                }
        </div>
    )
}

OwnerDetails.propTypes = {

}

export default OwnerDetails;
