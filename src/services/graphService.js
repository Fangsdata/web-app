import { normalizeDate } from "./TextTools";

export const generateColors = (size) => {

    const colorExample = [

        '#03045E', 
        '#023E8A', 
        '#0077B6', 
        '#0096C7', 
        '#00B4D8', 
        '#48CAE4', 
        '#90E0EF', 
        '#ADE8F4', 
        '#CAF0F8', 
    
    ];
    const retData = [];
    for (let i = 0; i < size; i++) {
        retData.push(colorExample[i % colorExample.length]);
    }
    return retData;
  };

export class GenerateGraphData {

    constructor(data){
        this.data = data;

        console.log(data)
        this.barLabels = this.generateBarLabels();
        this.colors = []; 
        this.barRows = this.generateBarRows();
    };

    reduceData(cutOffPoint = 0.05, cutOffName = 'Resten'){
        this.data = this.data.map(i => {
            if (typeof(i.Fish) === 'object'){
              i.Fish = i.Fish.map((j)=> {
                if( j.Weight / i.TotalWeight < cutOffPoint ){
                  j.Type = cutOffName;
                  return j;
                }
                else {
                  return j;
                }
              })
            }
            return i;
          })
        return this;
    }
    setLabels(newLabels){
        this.barLabels = newLabels;
    }
    combineMonths() {
        return this;
    }
    combineYeras() {
        return this;
    }    

    generateBarDataShcema () {
        return this.barRows.map( (i, len) => {
            return {  label: i,
                      backgroundColor: this.colors[len] + 'ee',
                      borderColor: '#000000cc',
                      hoverBackgroundColor: this.colors[len] + 'bb',
                      borderWidth: .5,
                      data: this.data.map((j) => {
                        if (typeof(j.Fish) === 'object'){
                          return j.Fish.reduce((acc, curr ) => {
                            if (curr.Type === i){
                              return curr.Weight + acc;
                            }
                            else{
                              return acc;
                            }
                          }, 0)
                        }
                        else{
                          return [];
                        }
                      }).reverse()
                    }});
    }
    generateBarRows () {
        let tempBarRows = [];
        this.data.forEach(i => {
            if (typeof(i.Fish) === 'object'){
              i.Fish.forEach( j => {
                if(!tempBarRows.some( k => k === j.Type )){
                    tempBarRows.push(j.Type); 
                }
              })
            }
          });


        return tempBarRows;
    }

    generateBarLabels(){
        let barLabels = this.data.map((i)=>{ return normalizeDate(i.LandingDate)});
        return barLabels.reverse();
    }

    generateBarData(){
        this.barRows = this.generateBarRows();
        this.colors = generateColors(this.barRows.length); 

        return {
            labels: this.barLabels,
            datasets: this.generateBarDataShcema(),
        }
    }
}