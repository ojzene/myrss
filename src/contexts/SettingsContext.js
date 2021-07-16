import React, { useState, createContext } from "react";

import { useQuery, gql, useMutation } from "@apollo/client";

export const SettingsContext = createContext();

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

export function SettingsProvider(props) {
    const { data, loading, error } = useQuery(SETTINGS_QUERY);
    var feedSetting = []; var myFeed = {}
    if(data) {
        feedSetting = data.settings[0]
    }
    const [settings, setSettings] = useState(feedSetting, true);
    return (
        <SettingsContext.Provider value={[settings, setSettings]}>
            {props.children}
        </SettingsContext.Provider>
    );
}
