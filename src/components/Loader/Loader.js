import React from 'react'
import "./loader.css"

function Loader(props) {


  return (
    <div className={props.isFullPage ? "fullpageloader" : ""}>
        <div className="lds-ripple">
            <div />
            <div />
        </div>
    </div>
  )
}

export default Loader