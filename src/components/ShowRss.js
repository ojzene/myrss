// import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import React, { useState } from "react";

import { useQuery, gql } from "@apollo/client";

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

export default function ShowRss() {

    const [rssUrl, setRssUrl] = useState("");
    const [items, setItems] = useState([]);

    const { data , error} = useQuery(SETTINGS_QUERY);
    var feedSetting = []
    if(data) {
        feedSetting = data.settings[0]  
    }
    // if (loading) return "Loading...";
    // if (error) return <pre>{error.message}</pre>
    const blockStyle = {
        fontSize: feedSetting.blockFontSize+"px",  // Font size of the block
        backgroundColor: feedSetting.blockBgColor, // The color of the background of the blocks
        color: feedSetting.blockColor // The color of the text in the RSS block
    }
    const headlineStyle = {
        fontSize: feedSetting.headlineFontSize+"px",  // Font size of the block
        backgroundColor: feedSetting.blockBgColor,
        color: feedSetting.headlineColor, // The color of the headline of the RSS blocks
        padding: "10px"
    };

    const getRss = async (e) => {
        e.preventDefault();
        const urlRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/;
        if (!urlRegex.test(rssUrl)) {
            return;
        }
        const res = await fetch(`https://api.allorigins.win/get?url=${rssUrl}`);
        const { contents } = await res.json();
        const feed = new window.DOMParser().parseFromString(contents, "text/xml");
        const items = feed.querySelectorAll("item");
        const feedItems = [...items].map((el) => ({
            link: el.querySelector("link").innerHTML,
            title: el.querySelector("title").innerHTML,
            description: el.querySelector("description").innerHTML
        }));
        setItems(feedItems);
    };

    return (
        <div>
            <form onSubmit={getRss} className="margin20">
                <div className="row">
                    <label> Enter RSS URL below to view content</label>
                    <br />
                    <input placeholder="Please type url here..." onChange={(e) => setRssUrl(e.target.value)} value={rssUrl} />
                </div>
                <div className="row">
                    <div className="col s9">
                        <input type="submit" className="btn" />
                    </div>
                </div>
            </form>
            {items.length > 0 ? (
                    items.map((item) => {
                        
                            return (
                                <div key="{item}" style={blockStyle}>
                                    <div style={headlineStyle}>{item.title}</div>
                                    <p style={{ padding: "10px" }}>{item.description}</p>
                                    {/* <a href={item.link}>{item.link}</a> */}
                                </div>
                            );
                        
                    })
                ) : (
                    <h5>No Items found...</h5>
                )
            }
        </div>
    );

}
