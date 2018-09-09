import config from 'config';

export interface BotSettingsData {
    name: string;
    avatar?: string;
    color?: string;
    logo?: string;
    anonymous?: boolean;
}

export interface SharedBot extends BotSettingsData {
    id: string;
    createdOn: string;
    description?: string;
    lastUpdated: string;
    published: boolean;
}

export interface SharedBotData {
    bots: SharedBot[];
}

export module BotsService {
    export function getBotSettings(botId: string, authToken: string): Promise<BotSettingsData> {
        const init = authToken === '' ? (
            {
                method: 'GET',
                cache: 'default',
            }
        ) :
        (
            {
                method: 'GET',
                cache: 'default',
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        ) as {};

        return requestData<BotSettingsData>(() => fetch(
            `${config.botApiUrl}bots/${botId}/config/published`,
            init
        ));
    }

    export function getSharedBots(authToken: string): Promise<SharedBotData> {
        const init = authToken === '' ? (
            {
                method: 'GET',
                cache: 'default'
            }
        ) :
        (
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                cache: 'default'
            }
        ) as {};
        return requestData(() => fetch(
            `${config.botApiUrl}me/bots/shared`,
            init
        ));
    }

    async function requestData<DataType>(initiateRequest: () => Promise<Response>): Promise<DataType> {
        const response = await initiateRequest();

        const data = await response.json() as DataType;

        if (response.status !== 200) {
            throw data;
        }

        return data;
    }
}

export default BotsService;