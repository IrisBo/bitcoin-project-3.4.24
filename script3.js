
function createButton(objData, divDisplayData){

    const moreInfoButtonData = document.createElement("button");
    moreInfoButtonData.classList.add("more-info-btn", "btn", "btn-primary");
    let index = objData.id;
    // console.log(index);
    moreInfoButtonData.classList.add(index);
    moreInfoButtonData.setAttribute("type", "button");
    moreInfoButtonData.innerHTML = "Show more";
    divDisplayData.appendChild(moreInfoButtonData);
    return (moreInfoButtonData)
}

function createSelectButton(objData, divDisplayData){
    const selectButtonDiv = document.createElement("div");
    selectButtonDiv.classList.add("form-check", "form-switch");

    const selectButton = document.createElement("input");
    selectButton.type = "checkbox";
    selectButton.classList.add("form-check-input");
    selectButton.classList.add(objData);
    selectButton.setAttribute("role", "switch");
    selectButton.setAttribute("id", "flexSwitchCheckDefault");
    selectButtonDiv.appendChild(selectButton);
    divDisplayData.appendChild(selectButtonDiv);

   return (selectButtonDiv)


}







