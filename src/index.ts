import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AuthService } from './features/Auth';
import { WebChat } from './features/WebChat';

(window as any).psaLoad = async (): Promise<void> => {
    if (AuthService.handleCallback() && !window.top) {
        return;
    }

    let botId = '0bc9a4d4-831f-44f7-8032-339318255368';
    const noMultiBot = true;
    const embedded = false;
    const authToken = '';
    const anonymous = true;
    const skipSplash = true;
    const largeLogo = true;

    ReactDOM.render(
        React.createElement(WebChat, {
            botId,
            noMultiBot,
            authToken,
            embedded,
            anonymous,
            skipSplash,
            largeLogo,
            style: {
                bottom: '0',
                left: '0',
                position: 'absolute',
                right: '0',
                top: '0'
            }
        }),
        document.getElementById('root')
    );
}