var btn = document.createElement("DIV");
btn.className = 'psa-button';

var img =  document.createElement("IMG");
img.setAttribute("src", chrome.extension.getURL("geoffrey-house.png"));
img.setAttribute("width", "50");
img.setAttribute("height", "50");
img.className = 'psa-button-image';
btn.appendChild(img);

document.body.appendChild(btn);
