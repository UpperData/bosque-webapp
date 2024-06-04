import React from 'react'

function ProfileImgUploader() {
  return (
    <div>
        <div className="content-imput-file profile"> 
            <label htmlFor="input-photo">
                <div className="file-selector">
                    <i className="mdi mdi-camera-plus-outline" />
                </div>
            </label>
            <input type="file" id="input-photo" className="d-none" />
        </div>
    </div>
  )
}

export default ProfileImgUploader