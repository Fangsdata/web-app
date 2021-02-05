import { createContext } from 'react';

const selectionsContext = createContext(
    {isMonth:null,
    setIsMonth: ()=>{}});

export default selectionsContext;