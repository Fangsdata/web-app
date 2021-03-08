


 const GenerateQueryParam = ()=> {

}


export const UpdateRadioButtonSelect = (event, filter, setFilter) => {
    const { target } = event;
    let selected = "";
    let updated = filter.map( (item)=>{
        if(item.value != target.value) {
            item.checkState = false;
        } else {
            item.checkState = true;
            selected = item;
        }
        return item
    });
    setFilter(updated);
    return { selected }
}

export const UpdateCheckBoxSelect = (event, filter, setFilter) => {
    const { target } = event;

    const index = filter.findIndex((i) => i.value == target.value);
    filter[index].checkState = !filter[index].checkState;

    let selected = filter.filter(i => i.checkState );
    let updated = filter;

    setFilter(updated);
    return { selected }
}
