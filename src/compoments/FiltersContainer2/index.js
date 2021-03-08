import React, { useState } from 'react'
import filterIcon from './filter_list-24px.svg';
import FilterCheckBox from '../FilterCheckBox';
import PropTypes from 'prop-types'

function FiltersContainer2({children}) {
    return (
        <div className="filter-all-filters">
            <div className="f-header">
                <p className="f-header-title">
                    <img className="filter-icon" src={filterIcon} alt="filter icon" />
                    Filtre:
                </p>
            </div>
            <div className="dropdowns-container">{children}

            </div>
        </div>
    )
}

FiltersContainer2.propTypes = {

}



export default FiltersContainer2

