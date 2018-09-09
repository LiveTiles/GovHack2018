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

var botContainerHeader = document.createElement("DIV");
botContainerHeader.className = 'psa-bot-container-header';
var cover = document.createElement("DIV");
cover.className = 'psa-bot-cover';
botContainer.appendChild(botContainerHeader);

var botRoot = document.createElement("DIV");
botRoot.id = 'root';
botContainer.appendChild(botRoot);

var isBotOpen = false;
function openbotContainer() {
    isBotOpen = true;
    botContainer.style.display = 'block';
    cover.style.display = 'block';
}
function closebotContainer() {
    isBotOpen = false;
    botContainer.style.display = 'none';
    cover.style.display = 'none';
}

document.body.appendChild(btn);
document.body.appendChild(botContainer);
document.body.appendChild(cover);

Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
});
var appWindow = window;
btn.onclick = () => {
    openbotContainer();
}
cover.onclick = () => {
    closebotContainer();
}


psaLoad();

window.addEventListener('load', function(){
    var street = getStreetAddress();
    console.log('Street: ', street);
    if (street) {
        fetch(`http://govhack-realtastate.azurewebsites.net/api/query?address=${street}`).then((response) => {
            response.json().then((result) => {
                informClient(street, result);
            });
        })
    }
});

function informClient(street, warnings) {
    console.log(warnings);
    if (!isBotOpen && warnings.length) {
        var options = {
            body: `${street}`,
            icon: chrome.extension.getURL("geoffrey-house.png")
        };
        var notification = new Notification("We found something!", options);
        notification.onclick = () => {
            openbotContainer();
        }
    }
    if (warnings.length) {
        warnings.forEach((warning) => createMessageInWebChat(street, warning));
    }
}

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

var appWindow = window;
function createMessageInWebChat(streetname, data) {
    const store =  appWindow.superchat.store.getState();
    console.log('state1', appWindow.superchat.store.getState());
    const messages = store.history.activities;
    const welcomeMessage = messages[0];
    var date = new Date();

    const message = {
        attachments: [generateAdaptiveCard(data)],
        channelId: "directline",
        conversation: { id: welcomeMessage.conversation.id },
        entities: [],
        from: {id: "livebot_dev", name: "LiveBot Dev"},
        id: `${welcomeMessage.conversation.id}|${(messages.length+2).pad(7)}`,
        text: `Here's what I found for ${streetname}`,
        timestamp: date.toISOString(),
        type: "message"
    }
     
    appWindow.superchat.store.dispatch({
        type: 'Receive_Message',
        activity: message
    })
}

function generateAdaptiveCard(data) {
    let imgUrl = '';
    let lowerData = data.name.toLowerCase();
    if (lowerData.includes('flood') || lowerData.includes('sea')) {
        imgUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAB4AJMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigBqBggDHLd6dWTrevQaNZTTbfPliC5iVgCNxwM+g4NeeX3iHVdVJa4uGiiPSCElVx79z+NJy1O/B5dVxCutEurPQZvFWh2+tto82oxR36x+a0bAgBf8Aextz7ZzU6a/o8jbV1O0z6GZR/M14vJK3nFlONvAq0hSeMEgH1HpUKd9j1VkUEvem/uPbUkSVA8bq6noVORTq8Pjmu9Nl86yuJYT3KMR+frXX6F8QW3rb6woKngXKLjH+8B/MflTU1ezOTEZLVpx5qT5l+J6Ax2oSBnApRyM0yORJollidXjcZVlOQRTmYLjPc4qzxno9RaKKKAGuSAMDOSBTqKKACik3Ddt74zS0AICGUEdDS0gAUYAwBS0AvMKKKKACsLxT4gXQdO3JhruXKwqe3qx9hW7XjHifVW1fXbicNmFD5cQ7bR/jyfxqJysj0srwaxNb3vhWr/yKUc9xc3ErSzSP5p3y5Y/Oe2fWrJOFJ9qrWY4c/hVkjII9aiOx9c0k7IrNLanSkhEbfaxOWMnbYQBj8xTLR8SbezVXp0Z2yKfQ1Cepagkml1NMjIwe9V9VNu2oyNaxmOAhdqkdPlGf1zViq14uUVvQ4rSWxnFe+pf1/Wh0Hg7xO+l3SWN3JmxlbAJP+qY9/p6/n9fU8A9R0rxZfDeqmw+3PbiG3xkNNIqbvoCc11GmeN54dHgtfshmuol2NI74XA6H1PFVS5nofLZ/UwlG9dTV18ST/G34HoNI2dpx1xxXnz+LtXkOd8EfskfT8806PxfqqH5mik/3o/8ADFdHspHxj4hwd7a/d/wTvxnaM9cc0tcnZ+NY2IW9tin+3Ecj8jXTWt3b3sIltpllQ91PT6+lRKLW56OFx+HxK/dSu+3X7iXA3bsc4xS0UVJ2BRRRQAUUUUAUdauDaaJfTqcMkDlT744/WvF7bTr68Qva2dxOoOCYomYD8hXtuoWSajYy2kpIjlADY64zzUsEEVtAkMEaxxIMKqjAAqJR5mepgcwWEptRjeTf4Hi+m2dzPcm0jhc3BbHlkYOff0rqv+EF1LyN/nW/mYzs3H+eK7sWtsbz7WIk+0BfL8wDnGelT01GysbV86qzadNW/E8y0PwPLfXlw2peZbwQvt2D7znrwfTkc1tXvgDT5rZlsd8EwGVdnLAn0Pt9K7OmLw7CocUpI5quaYmpPnUrW6LYzdF0O20m0RVjVrgjMkpHJPsewqn4mTR7WGO/vrdHmjcNGqjBkYc4PqPrXQMwRSzEBQMkntXmF5qMeveITNdOVsU3LGOeBg4/EnBreEOZniZlmlTDr2il78tn/XQqX1/ea1c/aLyQlf4Ixwqj2FRgADAGKo6jrWn6SY1vLhY2kOFXBJPOM8dqv11JJaI/OsROtUftKl9fxCip2aA2MaKp88SMWbHVcDFQUzCSt1HRhDKgkOELDcR2Herkd9Jp2pSTafKVQOdvoy54BFUayfEv20aBdNp7SC5UKy+X97AYE4/DNJ7G2HcnUjGLs21r2PYtG1iHV7Xeo2SpxJHnp7/StKvFPAmsanb2Ntf3xczl2DBlCl0z3HFezJMJ7ZJoTuV1DKfUGuaUbarqfeZbjnXjKnUd5w0duvmiWiiioPUCiiigAoopCQOpA+tAAqhc47nNLTd6f3l/Ojen95fzp6iukOpnST6il3p/eX86jkmjT5y4woLNjkgVnUWlxqS7mR4wvDZ+HJ9pw0xEIP16/oDXnUKbIgO55Ndj44mWfTdP8tg0cku8Edxt4/nXJV10lofEcQ1ubEKK2SRz/iPwsniCW2lM5haH5WIXO5T29j1rfACqAOgGBVhLgJZy2/lgmRlbfnpjP+NQVokr3PGqVpzpwpuV1G9vK7Cimz6vYaPZXMl+6IsibEZjznIPA6np2rlT4l1bVGxoWkM0R6XFz8qn6cgfqfpQ5JGlLB1KseeO3VvRL5s6yiuftNJ8cXcUk6alo4MfJgkbaT9Plx+taOj3GoXFkW1O0W2uVcqVVshgP4hycd+/akpJuxVfAzo01VcotPsy/XfeD7oz6QYWOWgcqPoeR/WuBrrfA7Hfer2IQ/zpVV7p2ZDUcMbFLrdfhf8AQ7GiiiuU++CiiigBGO1S3oM1iSSNI5Zjkmtw8jBrIubfyHwGBU9PWt6LVzjxak0mtiFhhsZzSUUq4B56V0HAJWJd6deXOuxtCJPKfaGZXxgDr/jW3To3Mbhh2qZpuLtuY1aEK1ozeiaehyeq3S3VtFalNk9tLs2joQARx+lUr2xn0+48i4UB9obg54NdtcWOl3V0lzLGfOB3YH8WPX1rlbzUFudca5u4GEYyvlY5AwQP15rGE5Se1kePmWDVNc1WabbSVu3Vv8DKqnqWsRaTaS5tZbi6uI2jtUSMsPN4xu9BVyitmeNRqRpzUpK6XQ5bTfC8txcrqXiCX7Xd5ysJ5jj9sdD9On1rrp7iW4ZWlYHaoVQAAFA6AAcAVFU80USW9u6SBndSXUH7pycfpSUUjWria1dPmloumy+SBYFNi8/mAOsgQJ6gg8/yqCiimczadrIK6nRWjmM08UZRdsceD6qvNcuqs7bVUsT0AFdlpdubSySFhh8bm+p/zimkerlEJSrX6L+v1LwOAR60qO0bbkYg+1Np8aGWRUBAJ9aHbqfTq99DYhk82FXI5I5opY0EcaoOgFFcTtfQ9mN7K46s3UFImVuxXArSprIrrtZQR6GnCXK7mdWn7SPKYdFXLuKKOM+WmCGwTk+lVAcZ47V1xlzK6PLnBwlZiUrApazXG1mWJSSqjJb2FJWpaEfZwojbGOcjrU1J8q0NcPSU5a7FGC1+124mjLxOCyskg7g4/Ljiq9xZyA4ubeJ0/hOQc/gelbyjAwq7VFVdQ3eUOPlByazhVk3Zm1fDU+RuxzkmkWEnJtSp9VJH8jVdtAsW6NcL9P8A9VbNFdGh5EsHQlvBfcYTeHrbHyzy59x/9amjw/BjmSYn6f8A1q6BjlicYpKNDN5dh7/CYqaBa5580/7zY/8AZasx6LZpyIUP+9k/zNaQOARjrSUGkcFQjtFfcRR28cQwihR6KAv8qkChRgACnZ+UjHWkoudCilsKB8pOelOhBaZAvXcKu29pFJArsDk+9WYreKHlF59TWMqqV0dlPDSdm9iWiiiuY9EKKKKAGSxLLGUYcGqJ0588OuPetGirjOUdjKdGE9ZIxri2aHALde60sN5PAAvEiDseDWjc2/npgHDDpVH7BP6L+dbRnGS94450qlOf7u9iQ6occW7Z/wB4VVluJrgjeQqjoq1N9hn9B+dAsZ8jKjH1FUvZrVEy9vPSVytRVk2M+eFH50fYZ/7o/MVXPHuZeyqdmVqKsfYpzn5Rx15FKLK4BztH5ijnj3D2U+zK1FWfsVwT90fmKPsM/wDdH5ijnj3D2VTsytU9tCJptjEgAZOKd9iuM/dH5irlrbGEl3ILt6dqmdRJaM1pUJOS5loTZEYRQOM7RT6KK5D0kFFFFAwooooAahJUFhg+lOoooYlsFNcsF+UZORRRQD2HUUUUDCiiigBAoBJHfrS0UUAFIzBVLHsKKKa3FJ2TYvUZooopDE3Dft74zS0UU2Sne4UUUUij/9k="
    } else if (lowerData.includes('erosion') || lowerData.includes('slip')) {
        imgUrl = "data:image/jpeg;base64,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"
    } else {
        imgUrl = "data:image/jpeg;base64,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"
    }


    return {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            version: "1.0",
            body: [
                {
                    type: "ColumnSet",
                    columns: [
                        {
                            type: "Column",
                            width: "1",
                            items: [
                                {
                                    type: "Image",
                                    url: imgUrl,
                                    size: "stretch",
                                    horizontalAlignment: "center"
                                }
                            ]
                        },
                        {
                            type: "Column",
                            width: "2",
                            items: [
                                {
                                    type: "TextBlock",
                                    text: `***${data.name}*** \n \n ${data.detail}`,
                                    isSubtle: false,
                                    wrap: true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }    
}



function getStreetAddress() {
    if(window.location.hostname === "www.domain.com.au") {
        return getStreetAddressForDomainDotCom();
    } else {
        return getStreetAddressForRealEstateDotCom();
    }
}

function getStreetAddressForRealEstateDotCom() {
    var address = '';    
    var street = document.querySelector('.property-info-address__street');
    if(street) {
        var suburb = document.querySelector('.property-info-address__suburb').innerText.split(',')[0];
        address = `${street.innerText} ${suburb}`;
    } else {
        street =  document.querySelector('.street-address').innerText;
        var suburb = document.querySelector('.detail-address').innerText;
        address = `${street} ${suburb}`;
    }
    return address;
}

function getStreetAddressForDomainDotCom() {
    var breadcrumbChildren = document.querySelector('.breadcrumbs__inner').children;
    if(breadcrumbChildren) {
        return breadcrumbChildren[breadcrumbChildren.length -1].innerText.split(',')[0];
    }
}
