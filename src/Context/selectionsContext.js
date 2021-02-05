import { createContext } from 'react';

const selectionsContext = createContext(
    {
        isMonth:null,
        setIsMonth: ()=>{},
        boatOffloadPageNo:null,
        setBoatOffloadPageNo: ()=>{},
        boatOffloadPageCount:null,
        setBoatOffloadPageCount: ()=>{},
        topLandingsPageNo:null, 
        setTopLandingPageNo: ()=>{}, 
        topLandingsPageCount:null,
        setTopLandingPageCount:()=>{},

    }
);

export default selectionsContext;