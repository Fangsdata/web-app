import React,{useState,useEffect} from 'react'
import { getBoatById, getBoatOffladsTimeframe } from '../../services/OffloadService';
import { normalizeDateForWeb,normalizeDate, normalizeCase,normalizeWeight } from '../../services/TextTools';
import BoatDetails from '../BoatDetails';
import ResultTable from '../ResultTable'

export default function OffloadBoatDetails({boatId}) {
    const [tableHeaders, setTableHeaders] = useState(['Dato','Kommune','Fylke','Total vekt'])
    const [tableRows, setTableRows] = useState([]);
    const [title, setTitle] = useState('');
    const [footer, setFooter] = useState('')

    useEffect(() => {
        getBoatById(boatId).then(boatDetails => {
            setTitle(  `${boatDetails.name} - ${boatDetails.registrationId}` )
        });
       getBoatOffladsTimeframe(
           boatId, 
           normalizeDateForWeb(new Date(2000,0,0)), 
           normalizeDateForWeb(new Date())).then( offlads => {

                const totalTotalWeight = offlads.reduce((acc,{totalWeight})=> acc+totalWeight,0)
                console.log( Object.keys(offlads).length)
                setFooter([
                    '',
                    'Gjennomsnitt : ',
                    normalizeWeight( totalTotalWeight / offlads.length ),
                    'Total :',
                    normalizeWeight(totalTotalWeight) 
                ]);

                setTableRows(offlads.map(({landingDate,town,state,totalWeight})=>({
                    rows:{
                        dato: normalizeDate(landingDate),
                        kommune: normalizeCase(town),
                        Fylke: state,
                        'Total vekt': normalizeWeight(totalWeight)
                    }, link:`/offload/${landingDate}/${boatId}`
                }))
                );
           });
    }, [boatId])

    return (
        <div>
            <ResultTable 
                title={title} 
                headers={tableHeaders}
                items={tableRows}
                footer={footer}

            />
        </div>
    )
}
