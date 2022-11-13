const {ipcRenderer} = require('electron');

var lastSelectedClip = 0;

function loadCilpSection(type, data, index){
    var clipClass = "clipItem";
    if (index == 0){
        clipClass = "clipItem selectedClip";
    }
    var html = `
    <li class="${clipClass}" id="${'clip'+index}";">
        <table>
            <tr>
                <td onclick="setSelected('${index}')">
                    <div class="clipData">
                        ${data}
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
    }
}

function setSelected(id){
    document.getElementById('clip'+lastSelectedClip).setAttribute("class", "clipItem");
    document.getElementById('clip'+id).setAttribute("class", "clipItem selectedClip");
    lastSelectedClip = id;
    ipcRenderer.send("windowVsisbility", 0);
}

function fixMargin(id){
    var element = document.getElementById('clip'+id);
    element.style.marginTop = "0px";
}