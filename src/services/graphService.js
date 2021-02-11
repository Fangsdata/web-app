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

        this.barLabels = this.generateBarLabels();
        this.colors = []; 
        this.barRows = this.generateBarRows();
    };

    reduceData(cutOffPoint = 0.05, cutOffName = 'resten'){
        this.data = this.data.map(i => {
            if (typeof(i.fish) === 'object'){
              i.fish = i.fish.map((j)=> {
                if( j.weight / i.totalWeight < cutOffPoint ){
                  j.type = cutOffName;
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
                        else{
                          return [];
                        }
                      }).reverse()
                    }});
    }
    generateBarRows () {
        let tempBarRows = [];
        this.data.forEach(i => {
            if (typeof(i.fish) === 'object'){
              i.fish.forEach( j => {
                if(!tempBarRows.some( k => k === j.type )){
                    tempBarRows.push(j.type); 
                }
              })
            }
          });


        return tempBarRows;
    }

    generateBarLabels(){
        let barLabels = this.data.map((i)=>{ return normalizeDate(i.landingDate)});
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