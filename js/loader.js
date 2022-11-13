const {ipcRenderer} = require('electron');

var lastSelectedClip = 0;
var index0Element = null;

function loadCilpSection(type, data, index){
    var clipClass = "clipItem";
    if (index == 0){
        clipClass = "clipItem selectedClip";
    }

    if (type == "text"){
        clipData = data;
    }
    else if (type == "image"){
        clipData = `<img src="${data}">`;
    }
    var html = `
    <li class="${clipClass}" id="${'clip'+index}";">
        <table>
            <tr>
                <td onclick="setSelected('${index}')">
                    <div class="clipData">
                        ${clipData}
                    </div>
                </td>
                <td class="clipButton">
                    <button><span>&#8942;</span></button>
                </td>
            </tr>
        </table>
    </li>
    
    `;
    console.log(navigator.clipboard.getText);
    document.write(html);
    if (index == 0){
        fixMargin(0);
        index0Element = document.getElementById('clip0');
    }
}

function setSelected(id){
    document.getElementById('clip'+lastSelectedClip).setAttribute("class", "clipItem");
    document.getElementById('clip'+id).setAttribute("class", "clipItem selectedClip");
    lastSelectedClip = id;
    ipcRenderer.send("windowVsisbility", 0, "text", "demo/sample1.jpeg");
}

function fixMargin(id){
    var element = document.getElementById('clip'+id);
    element.style.marginTop = "0px";
}

function addLiAtIndex0(){
    var newElement = element.cloneNode(true);
    newElement.setAttribute("id", "clipjhszxgx");
    index0Element.parentNode.insertBefore(newElement, index0Element);
    fixMargin(0);
}