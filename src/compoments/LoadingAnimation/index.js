import React from 'react';


export const LoadingAnimation = (({rowCount, containerClass})=>{

    const loadingRows = (()=>{
        let rows = [];
        for (let i = 0; i < rowCount; i++) {
          rows.push(<div className="placeholder-item" />);
        } 
    
        return rows;
    })

    return (
    <div className={containerClass}>
        <div className="offload-header" />
            {loadingRows()}
        <div className="placeholder-item more" />
    </div>)
});

LoadingAnimation.defaultProps = {
    rowCount : 5,
    containerClass: 'front-loading-container' 
}

export default LoadingAnimation;
