import React,{useState,useEffect} from 'react';
import PropTypes, {
    string, arrayOf, shape,  number,
  } from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { normalizeDate } from '../../services/TextTools';


const LandingsOverView = (({data})=>{
    
    const [barDataset,setBarData] = useState(
        /*
        {
            labels: ['January', 'February', 'March',
                     'April', 'May'],
            datasets: [
              {
                label: 'Rainfall',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [65, 59, 80, 81, 56]
              },
              {
                label: 'sunFall',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [65, 59, 80, 81, 56]
              }, 
            ]
          }*/
    )
    useEffect(()=>{

        



        const barData = {
            label: 'Total Vekt',
            backgroundColor: '#2B59C3',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: data.map((i)=>{ return i.totalWeight }) 
        }
        
        const barLabels = data.map((i)=>{ return normalizeDate(i.landingDate)});

        setBarData(
            {
                labels:barLabels,
                datasets:[barData],
            }
            );
    },[data]);

    return(<Bar
                data={barDataset}                      
                redraw
                width={800}
                height={300} // ef ég er á síma þá þarf þetta að vera stærra 
                options={{
                    scales: {
                        xAxes: [{
                            stacked: true
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    }
                }}
                />);
});

LandingsOverView.propTypes = {
    landings: arrayOf(shape({
        id: number.isRequired,
        landingDate: PropTypes.instanceOf(Date).isRequired,
        town: string.isRequired,
        state: string.isRequired,
        totalWeight: number.isRequired,
      }).isRequired).isRequired,
}

export default LandingsOverView;