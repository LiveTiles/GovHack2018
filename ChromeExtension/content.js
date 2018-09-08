var btn = document.createElement("DIV");
btn.className = 'psa-button';

var img = document.createElement("IMG");
img.setAttribute("src", chrome.extension.getURL("geoffrey-house.png"));
img.setAttribute("width", "50");
img.setAttribute("height", "50");
img.className = 'psa-button-image';
btn.appendChild(img);

var botContainer = document.createElement("DIV");
botContainer.className = 'psa-bot-container';

document.body.appendChild(btn);
document.body.appendChild(botContainer);

Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
});

btn.onclick = () => {
    console.log('Notification Permission: ', Notification.permission);
    if (Notification.permission === 'granted') {
        var options = {
            body: '... is cooked.',
            icon: chrome.extension.getURL("geoffrey-house.png")
        };
        var notification = new Notification("We found something!", options);

        notification.onclick = () => {
            botContainer.style.display = 'block';
        }
    }
};