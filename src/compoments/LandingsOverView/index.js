import React,{useState,useEffect} from 'react';
import PropTypes, {
    string, arrayOf, shape,  number,
  } from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { normalizeDate } from '../../services/TextTools';
import { GenerateGraphData } from '../../services/graphService';

const LandingsOverView = (({data, type, graphHeight, graphWidth, mixCutoffPoint, mixCutoffName})=> {
    
    const [barDataset,setBarData] = useState(
    )

    useEffect(()=>{

      let graphData = new GenerateGraphData(data);

      if (type === 'simple'){
        graphData.reduceData(mixCutoffPoint, mixCutoffName);
        setBarData(graphData.generateBarData());
      } 
      else if ( type === 'by-month') {

        graphData
        .reduceData(mixCutoffPoint, mixCutoffName)
        .combineMonths();
        // graphData.setLabels ??
        setBarData(graphData.generateBarData());

      } 
      else if ( type === 'by-year') {
        
        graphData
        .reduceData(mixCutoffPoint, mixCutoffName)
        .combineYeras();
        // graphData.setLabels ??
        setBarData(graphData.generateBarData());

      }

    },[data]);

    return(<><Bar
                data={barDataset}                      
                redraw
                width={graphWidth}
                height={graphHeight}
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
      type: string,
      graphHeight: number,
      graphWidth: number,
      mixCutoffPoint: number, 
      mixCutoffName: string,
};

LandingsOverView.defaultProps = {
  type: 'simple', // by-month, by-year
  graphHeight: 400,
  graphWidth: 800,
  mixCutoffPoint: 0.05,
  mixCutoffName: 'resten'
}

export default LandingsOverView;