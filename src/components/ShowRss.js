import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import Modal from 'react-modal';
import M from "materialize-css/dist/js/materialize.min.js";

const MAX_CONTENT_LENGTH = 150

const customStyles = {
    content: {
      top: '48%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      borderRadius:10,
      width:'50%',
      height:'90%',
      transform: 'translate(-50%, -50%)',
    },
  };

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
        updatedDate,
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

var successMessage = false;
 

export default function ShowRss() {
    var responseData = [];
    successMessage = false;
    // Initialize sidebar
    useEffect(() => {
        var elem = document.querySelector(".sidenav");
        M.Sidenav.init(elem, {
            edge: "left",
            inDuration: 250,
        });
    }, []);
   
    const [rssUrl, setRssUrl] = useState("");
    const [setHeader, setHeaderStyle] = useState({});
    const [setBlock, setBlockStyle] = useState({});
    
    const [items, setItems] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);

    var feedSetting = []
    const { data } = useQuery(SETTINGS_QUERY);
    if(data) {
        feedSetting = data.settings[0]
    }
    
    const [updateSetting] = useMutation(UPDATE_SETTING);
    
    var gridColNum = Math.round(Number(feedSetting.blockWidth) / 100);
    gridColNum = (gridColNum > 12) ? 12 : gridColNum;
    gridColNum = "col s12 m"+gridColNum
    
    const headlineStyle = {
        fontSize: feedSetting.headlineFontSize+"px",  // Font size of the block
        backgroundColor: feedSetting.blockBgColor,
        color: feedSetting.headlineColor, // The color of the headline of the RSS blocks
        wordWrap: "break-word",
        textAlign: "center",
    };
    const blockStyle = {
        fontSize: feedSetting.blockFontSize+"px",  // Font size of the block
        backgroundColor: feedSetting.blockBgColor, // The color of the background of the blocks
        color: feedSetting.blockColor, // The color of the text in the RSS block
        height: feedSetting.blockHeight+"px",
        borderRadius: "10px",
        border: "solid 5px white",
        wordWrap: "break-word",
        overflow: "hidden"
    }
    
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
            if (responseData) {
                successMessage = true; 
                
                gridColNum = Math.round(Number(responseData.blockWidth) / 100);
                gridColNum = (gridColNum > 12) ? 12 : gridColNum;
                gridColNum = "col s12 m"+gridColNum

                setHeaderStyle({
                    fontSize: responseData.headlineFontSize+"px", // feedSetting.headlineFontSize+"px",  // Font size of the block
                    backgroundColor: responseData.blockBgColor, //feedSetting.blockBgColor,
                    color: responseData.headlineColor, // The color of the headline of the RSS blocks
                    wordWrap: "break-word",
                    textAlign: "center" 
                })
                setBlockStyle({
                    fontSize: responseData.blockFontSize+"px",  // Font size of the block
                    backgroundColor: responseData.blockBgColor, // The color of the background of the blocks
                    color: responseData.blockColor, // The color of the text in the RSS block
                    height: responseData.blockHeight+"px",
                    borderRadius: "10px",
                    border: "solid 5px white",
                    wordWrap: "break-word",
                    overflow: "hidden"
                })
                alert("Settings successfully updated")
                setIsOpen(false);
            } 
            else {
                successMessage = false;
            }
        }).catch((error) => {
            successMessage = false;
        });
         setTimeout(() => {
            console.log("response message::::::", successMessage);
         }, 1000);
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
            link: el.querySelector("link") ? el.querySelector("link").innerHTML : "",
            title: el.querySelector("title") ? el.querySelector("title").innerHTML : "",
            image: el.querySelector("enclosure") ? el.querySelector("enclosure").getAttribute('url') : "",
            description: el.querySelector("description") ? el.querySelector("description").innerHTML : ""
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
            <div className="row">
                {items.length > 0 ? (
                    items.map((item) => {
                        return (
                            <>
                            <div style={setBlock.length === undefined ? blockStyle : setBlock } className={gridColNum} key="{item}">  
                                <img src={item.image} alt={item.title} width="100%" height="200" style={{ display: item.image === "" ? "none" : "block" }} /> 
                                <div style={setHeader.length === undefined ? headlineStyle :  setHeader }>{stripCTags(item.title)}</div>
                                <p style={{ padding: "10px" }}>{decodeEntities(stripCTags(trimContent(item.description)))}</p>   
                                <p style={{ padding: "10px" }}><a href={item.link}>{item.link}</a></p>   
                            </div>
                            </>
                        );  
                    })
                    ) : (
                        <h5>No Items found...</h5>
                    )
                }
            </div>

        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="RSS Feed Modal">
              
            <a onClick={() => closeModal()} style={{
                cursor:'pointer'
            }}><i className="material-icons">clear</i></a>
                
            {/*START*/}
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
                style={{width: "100%"}}
                placeholder="Headline Font Color"
                id="headlineColor"
                type="color"
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
                style={{width: "100%"}}
                placeholder="Block Color"
                id="blockColor"
                type="color"
                defaultValue={feedSetting.blockColor}
                />
                <label className="active" htmlFor="firstadd_source_name">Block Color</label>
            </div>

            <div className="input-field">
                <input
                style={{width: "100%"}}
                placeholder="Block Background Color"
                id="blockBgColor"
                type="color"
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
        {/*END*/} 
        </Modal>
        <div className="fixed-action-btn">
        <a className="btn-floating btn-large waves-effect waves-green green"
            onClick={() => openModal()}><i className="material-icons">settings</i></a>
        </div>
     </div>
    );

    function stripCTags(str) {
        // making sure the allow arg is a string containing only tags in lowercase (<a><b><c>)
        return str.replace("<![CDATA[", "").replace("]]>", "");
    }
 
    function openModal() {
        setIsOpen(true);
    }
    
    function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //  subtitle.style.color = '#f00';
    }
    
    function closeModal() {
        setIsOpen(false);
    }


    function trimContent(snippet) {
        if (snippet.length > MAX_CONTENT_LENGTH) {
          snippet = snippet.substring(0, MAX_CONTENT_LENGTH);
          snippet += " [...]";
        }
        return snippet;
    }

    function decodeEntities(s){
        var str, temp= document.createElement('p');
        temp.innerHTML= s;
        str= temp.textContent || temp.innerText;
        temp=null;
        return str;
    }
}
