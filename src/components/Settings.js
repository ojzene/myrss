// import React, { useState, useContext } from "react";
import React from "react";

import { useQuery, gql, useMutation } from "@apollo/client";

const SETTINGS_QUERY = gql`
{
    settings{
        _id,
        blockFontSize,
        headlineFontSize,
        headlineColor,
        blockColor,
        blockBgColor,
        blockWidth,
        blockHeight
    }
}
`;

const UPDATE_SETTING = gql`
    mutation updateSetting(
        $id: String!, 
        $blockFontSize: String!,
        $headlineFontSize: String!,
        $headlineColor: String!,
        $blockColor: String!,
        $blockBgColor: String!,
        $blockWidth: String!,
        $blockHeight: String!
    ) {
    updateSetting(
        id: $id, 
        blockFontSize: $blockFontSize,
        headlineFontSize: $headlineFontSize,
        headlineColor: $headlineColor,
        blockColor: $blockColor,
        blockBgColor: $blockBgColor,
        blockWidth: $blockWidth,
        blockHeight: $blockHeight
    ) {
        _id,
        updatedDate
    }
  }
`;

var successMessage = false;

export default function Settings() {
    // const { data, loading, error } = useQuery(SETTINGS_QUERY);
    const { data } = useQuery(SETTINGS_QUERY);
    var feedSetting = [];
    if(data) {
        feedSetting = data.settings[0]
    }
    const [updateSetting] = useMutation(UPDATE_SETTING);

    var responseData = [];
    successMessage = false;

    const submitEdits = (event, idToEdit) => {
        event.preventDefault();
        updateSetting({ 
            variables: { 
                id: idToEdit,
                blockFontSize: event.target.blockFontSize.value,
                headlineFontSize: event.target.headlineFontSize.value,
                headlineColor: event.target.headlineColor.value,
                blockColor: event.target.blockColor.value,
                blockBgColor: event.target.blockBgColor.value,
                blockWidth: event.target.blockWidth.value,
                blockHeight: event.target.blockHeight.value 
            }
        }).then(resp => { 
            responseData = resp.data.updateSetting
            console.log("respon data::::::", resp.data.updateSetting);
            if (responseData) { 
                successMessage = true; 
                alert("Settings successfully updated")
            } 
            else {
                successMessage = false;
            }
        }).catch((error) => {
            successMessage = false;
            console.log(error);
        });

         setTimeout(() => {
            console.log("respon message::::::", successMessage);
         }, 1000);

    };

    return (
    <div>
        <h5> Change Settings</h5>
        <br />
        {  
           successMessage
        ? (
          <div>Settings successfully updated </div>  
        ) : "" }

        <form onSubmit={(e) => submitEdits(e, feedSetting._id)}>
            <div className="input-field">
                <input
                    placeholder="Headline Font Size"
                    id="headlineFontSize"
                    type="number"
                    name="headlineFontSize"
                    defaultValue={feedSetting.headlineFontSize}
                />
                <label className="active" htmlFor="firstadd_source_name">Headline Font Size</label>
            </div>

            <div className="input-field">
                <input
                placeholder="Headline Font Color"
                id="headlineColor"
                type="text"
                defaultValue={feedSetting.headlineColor}
                />
                <label className="active" htmlFor="firstadd_source_name">Headline Font Color</label>
            </div>

            <div className="input-field">
                <input
                placeholder="Block Font Size"
                id="blockFontSize"
                type="number"
                defaultValue={feedSetting.blockFontSize}
                />
                <label className="active" htmlFor="firstadd_source_name">Block Font Size</label>
            </div>

            <div className="input-field">
                <input
                placeholder="Block Color"
                id="blockColor"
                type="text"
                defaultValue={feedSetting.blockColor}
                />
                <label className="active" htmlFor="firstadd_source_name">Block Color</label>
            </div>

            <div className="input-field">
                <input
                placeholder="Block Background Color"
                id="blockBgColor"
                type="text"
                defaultValue={feedSetting.blockBgColor}
                />
                <label className="active" htmlFor="firstadd_source_name">Block Background Color</label>
            </div>

            <div className="input-field">
                <input
                placeholder="Block Width"
                id="blockWidth"
                type="number"
                defaultValue={feedSetting.blockWidth}
                />
                <label className="active" htmlFor="firstadd_source_name">Block Width</label>
            </div>

            <div className="input-field">
                <input
                id="blockHeight"
                type="number"
                defaultValue={feedSetting.blockHeight}
                />
                <label className="active" htmlFor="firstadd_source_name">Block Height</label>
                <button type="Submit" className="btn">Save Changes</button>
            </div>
        </form>
        
    </div>
  );


}
