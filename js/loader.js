const { ipcRenderer, ipcMain } = require('electron');

var lastSelectedClip = 0;
var index0Element = null;
var clipboardData = Object();


function loadCilpSection(type, data, index) {
    clipboardData[index] = {type: type, data: data};
    var clipClass = "clipItem";
    if (index == 0) {
        clipClass = "clipItem selectedClip";
    }

    if (type == "text") {
        clipData = data;
    }
    else if (type == "image") {
        clipData = `<img src="${data}">`;
    }
    var html = `
    <li class="${clipClass}" id="${'clip' + index}";">
        <table>
            <tr>
                <td onclick="paste('${index}')">
                    <div class="clipData">
                        ${clipData}
                    </div>
                </td>
                <td class="clipButton" onclick="removeClip(${index})">
                    <button><span>&times;</span></button>
                    
                </td>
            </tr>
        </table>
    </li>
    
    `;
    console.log(navigator.clipboard.getText);
    // document.write(html);
    if (index == 0) {
        fixMargin(0);
        index0Element = document.getElementById('clip0');
    }
    return html;
}

function toggleMenu(index) {
    console.log(index);
    let elm = document.getElementById("dropdown" + index)
    
    if (elm != null){
        elm.classList.toggle("show");
    }
    // hideDropDown(index);
}

// function hideDropDown(ignoreIndex = null) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     for (var i = 0; i < dropdowns.length; i++) {
//         var openDropdown = dropdowns[i];
//         if (openDropdown.classList.contains('show') && i != ignoreIndex) {
//             openDropdown.classList.remove('show');
//         }
//     }
// }

function paste(id){
    setSelected(id);
    ipcRenderer.send("paste", 0, clipboardData[id].type, clipboardData[id].data);
}



function setSelected(id) {
    if (lastSelectedClip == id) {
        return;
    }
    try {
        document.getElementById('clip' + lastSelectedClip).setAttribute("class", "clipItem");
    }
    catch (err) {
        console.log(err);
    }
    document.getElementById('clip' + id).setAttribute("class", "clipItem selectedClip");
    lastSelectedClip = id;

}


function removeClip(index) {
    // toggleMenu(index);
    console.log("removeClip");
    target = document.getElementById('clip' + index);
    target.classList.add("removed");
    target.addEventListener("transitionend", () => 
    {

    if (target){
        target.remove();
    }

    // Animatine move up on delete
    })
}


function fixMargin(id) {
    var element = document.getElementById('clip' + id);
    element.style.marginTop = "0px";
}

function addLiAtIndex0() {
    var newElement = element.cloneNode(true);
    newElement.setAttribute("id", "clipjhszxgx");
    index0Element.parentNode.insertBefore(newElement, index0Element);
    fixMargin(0);
}


ipcRenderer.on('addClip', (event, type, data, index) => {
    console.log("addClip");
    var ul = document.getElementById("clipData");
    var html = loadCilpSection(type, data, index);
    ul.innerHTML = html + ul.innerHTML;
    setSelected(index);
});