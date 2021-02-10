import React,{useState,useEffect} from 'react';
import PropTypes, {
    string, arrayOf, shape,  number,
  } from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { normalizeDate } from '../../services/TextTools';
import { generateColors } from '../../services/graphService';

const LandingsOverView = (({data, type})=> {
    
    const [barDataset,setBarData] = useState(
    )

    useEffect(()=>{
      if (type === 'simple'){


        let posibleFishTypes = [];

        // Reduces colums by taking out fish that are less
        // that 5% of the total weitht
        data = data.map(i => {
          if (typeof(i.fish) === 'object'){
            i.fish = i.fish.map((j)=> {
              if( j.weight / i.totalWeight < 0.05 ){
                j.type = 'resten';
                return j;
              }
              else {
                return j;
              }
            })
          }
          return i;
        })

        // Generetes array of all the color names 
        data.forEach(i => {
          if (typeof(i.fish) === 'object'){
            i.fish.forEach( j => {
              if(!posibleFishTypes.some( k => k === j.type )){
                posibleFishTypes.push(j.type); 
              }
            })
          }
        });
        const colors = generateColors(posibleFishTypes.length);
        // Maps all the data to fir the chartjs schema
        let barData = posibleFishTypes.map( (i, len) => {
          return {  label: i,
                    backgroundColor: colors[len],
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: data.map((j) => {
                      if (typeof(j.fish) === 'object'){
                        
                        return j.fish.reduce((acc, curr ) => {
                          if (curr.type === i){
                            return curr.weight + acc;
                          }
                          else{
                            return acc;
                          }
                        }, 0)
                      }
                    }).reverse()
                  }});
          
        
        const barLabels = data.map((i)=>{ return normalizeDate(i.landingDate)});
        console.log(barData)
        setBarData({
              labels:barLabels.reverse(),
              datasets:barData,}
          );
      } 
      else if ( type === 'by-month') {

      } 
      else if ( type === 'by-year') {
        
      }

    },[data]);

    return(<><Bar
                data={barDataset}                      
                redraw
                width={800}
                height={400}
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
                />
                <p>Controls</p>
                </>);

});

LandingsOverView.propTypes = {
    landings: arrayOf(shape({
        id: number.isRequired,
        landingDate: PropTypes.instanceOf(Date).isRequired,
        town: string.isRequired,
        state: string.isRequired,
        totalWeight: number.isRequired,
      }).isRequired).isRequired,
      type: string
};

LandingsOverView.defaultProps = {
  type: 'simple' // by-month, by-year
}

export default LandingsOverView;