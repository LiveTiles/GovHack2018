import { IBotConnection, DirectLine } from 'botframework-directlinejs';
import * as classnames from 'classnames';
import * as React from 'react';

import { Chat, Bot, Logo } from '@lt/lt-bots-webchat/built/Chat';

import config from 'config';

import { ErrorNotice } from '../../components/ErrorNotice';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { LoginNotice } from '../../components/LoginNotice';
import { DropdownSelector } from '../../components/DropdownSelector';
import { DropdownSelectorBotOption } from '../../components/DropdownSelectorBotOption';

import { BotsService } from '../Bots';
import { AuthService, User, ValueStorageKeys } from '../Auth';

import '!style-loader!css-loader!@lt/lt-bots-webchat/botchat.css';
import * as styles from './styles.css';


export class SuperChat extends Chat {
    constructor(props: any) {
      super(props);
      console.log('do your thing', window);
      console.log('do your thing', (this as any).store);
      console.log('do your thing', (this as any).store.getState());
      (window as any).superchat = (this as any);
    }
}

interface BotChannel {
    bot: Bot;
    connection: IBotConnection | null;
}

export interface WebChatProps {
    botId: string;
    authToken?: string;

    noMultiBot?: boolean;
    embedded?: boolean;
    anonymous?: boolean;
    skipSplash?: boolean;
    largeLogo?: boolean;

    className?: string;
    style?: React.CSSProperties;
}

export interface WebChatState {
    activeChannel: BotChannel | null;
    channels: { [botId: string]: BotChannel };

    authToken: string | null;

    loading: boolean;
    intro: boolean;

    error: string | null;
}

export class WebChat extends React.Component<WebChatProps, WebChatState> {
    static defaultProps: Partial<WebChatProps> = {
        anonymous: false,
        skipSplash: false,
        largeLogo: false
    };

    private user: User;

    private get loginRequired(): boolean {
        return this.state && !this.state.authToken && this.state.authToken !== '' && !this.props.anonymous;
    }

    private get activeBot(): Bot {
        const activeChannel = this.state && this.state.activeChannel;

        return activeChannel && activeChannel.bot
            ? activeChannel.bot
            : {} as Bot;
    }

    private get channels(): BotChannel[] {
        const { activeChannel, channels } = this.state || {} as WebChatState;

        const activeBotId = activeChannel && activeChannel.bot.id;
        return channels
            ? Object.getOwnPropertyNames(channels)
                .sort((id1, id2) => id1 === activeBotId
                    ? -1
                    : id2 === activeBotId
                        ? 1
                        : id1.localeCompare(id2)
                )
                .map(botId => channels[botId])
            : [];
    }

    // Add empty setters to shut up webpack
    private set activeBot(value: Bot) { return; }
    private set loginRequired(value: boolean) { return; }
    private set channels(value: BotChannel[]) { return; }

    constructor(props: WebChatProps) {
        super(props);

        const { botId, authToken } = this.props;
        const state = {
            activeChannel: null,
            channels: {},
            authToken: authToken || null,
            loading: true,
            intro: true,
            error: null
        } as WebChatState;
        if (!botId) {
            state.loading = false;
            state.error = 'You must pass in a bot id';
        }
        this.state = state;

        if (authToken && AuthService.isValidAuthToken(authToken)) {
            this.user = AuthService.getUserFromAuthToken(authToken)!;
        } else {
            this.user = { id: 'default', name: 'Anonymous'};
        }

        this.turnOffIntro = this.turnOffIntro.bind(this);
        this.onBotSwitch = this.onBotSwitch.bind(this);
        this.login = this.login.bind(this);
    }

    async componentDidMount(): Promise<void> {
        const { botId, noMultiBot } = this.props;
        if (!botId) {
            return;
        }

        try {
            this.setState({ loading: true });
            const [sharedBotData] = await Promise.all([
                this.state.authToken && this.state.authToken !== '' && !noMultiBot
                    ? BotsService.getSharedBots(this.state.authToken)
                    : Promise.resolve(null),
                this.switchToBot(botId)
            ]);
            if (!sharedBotData) {
                return;
            }

            const channels = { ...this.state.channels };
            for (let bot of sharedBotData.bots) {
                /* Avoid overwriting the originally loaded bot if it's also shared */
                if (!channels[bot.id]) {
                    channels[bot.id] = {
                        bot: {
                            ...bot,
                            id: bot.id,
                            logo: bot.logo
                                ? { url: bot.logo }
                                : undefined
                        } as Bot,
                        connection: null
                    };
                }
            }

            this.setState({ channels });
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({ loading: false });
        }
    }

    render(): JSX.Element {
        const bot = this.activeBot;
        const { className, style } = this.props;
        const { loading, error } = this.state;

        return (
            <div
                className={classnames(
                    styles.webchat,
                    className
                )}
                style={style}
            >
                {loading &&
                    <LoadingSpinner
                        className={styles.loading}
                        loading={true}
                    />
                }
                {error
                    ? <ErrorNotice
                        color={bot.color}
                        logo={bot.logo
                            ? (bot.logo as Logo).url
                            : undefined
                        }
                    >
                        {error}
                    </ErrorNotice>
                    : this.loginRequired
                        ? <LoginNotice
                            color={bot.color}
                            logo={bot.logo
                                ? (bot.logo as Logo).url
                                : undefined
                            }
                            onLoginClick={this.login}
                        />
                        : this.renderBotChats()}
            </div>
        );
    }

    private renderBotChats(): JSX.Element[] {
        const channels = this.channels;
        const { intro, activeChannel } = this.state;

        const options = channels.map(channel => ({
            id: channel.bot.id,
            name: channel.bot.name,
            value: channel.bot
        }));
        options.sort((a, b) => { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
        const showSelector = options.length > 1;

        return channels
            .filter(channel => !!channel.connection)
            .map(channel => (
                <div
                    key={channel.bot.id}
                    className={classnames(
                        styles.webchatWindowContainer,
                        channel !== activeChannel && styles.hidden
                    )}
                >
                    {showSelector &&
                        <DropdownSelector
                            className={styles.dropdownSelector}
                            dropdownListClassName={styles.dropdownSelectorList}

                            selectedOption={options.find(option => option.id === activeChannel!.bot.id)}
                            options={options}
                            noSelectionChangeMemory={true}

                            style={{ backgroundColor: channel.bot.color }}

                            onOptionSelect={this.onBotSwitch}
                            getDropdownListItemElem={(option: Bot) => (
                                <DropdownSelectorBotOption {...option} key={option.id} />
                            )}
                        />
                    }
                    <SuperChat
                        largeLogo={this.props.largeLogo}
                        className={styles.webchatWindow}
                        intro={intro && !this.props.skipSplash
                            ? { onLeaveTrigger: this.turnOffIntro }
                            : undefined
                        }
                        hideHeader={showSelector}
                        user={this.user}
                        bot={{
                            ...channel.bot,
                            id: config.webChat.botFrameworkId
                        }}
                        botConnection={channel.connection!}
                        resize={'detect'}
                    />
                </div>
            ));
    }

    private async switchToBot(botId: string): Promise<void> {
        try {
            const { channels } = this.state;
            let newState: Partial<WebChatState>;
            let targetChannel = channels[botId];
            if (targetChannel) {
                newState = { activeChannel: targetChannel };
            } else {
                if (this.loginRequired) {
                    return;
                }
                const data = await BotsService.getBotSettings(botId, this.state.authToken || '');
                targetChannel = {
                    bot: {
                        published: true,
                        ...data,
                        id: botId,
                        logo: data.logo
                            ? { url: data.logo }
                            : undefined
                    },
                    connection: null
                } as BotChannel;

                newState = {
                    activeChannel: targetChannel,
                    channels: {
                        ...channels,
                        [botId]: targetChannel
                    }
                };
            }

            if (!targetChannel.connection) {
                targetChannel.connection = new DirectLine({ secret: config.webChat.directLineSecret });


                
                if (this.state.authToken || this.props.anonymous) {
                    this.initBotConnection(targetChannel, this.props.anonymous!);
                }
            }

            this.setState(newState as WebChatState);
        } catch (error) {
            this.setState({ error: `Something went wrong while switching to the bot with id ${botId}: ${error}` });
        }
    }

    private initBotConnection(channel: BotChannel, anonymous: boolean): void {
        const { authToken } = this.state;
        if (!authToken && !anonymous) {
            throw new Error('Trying to initialize a bot without an authentication token.');
        }

        const { bot, connection } = channel;
        if (!connection) {
            throw new Error('Trying to initialize a bot that hasn\'t set up a connection yet.');
        }

        connection.postActivity({
            type: 'event',
            from: this.user,
            name: 'Initialize',
            value: JSON.stringify({
                botId: bot.id,
                authToken: this.state.authToken || '',
                draft: false
            })
        }).subscribe(
            value => { return; },
            error => console.log(error)
        );
    }

    private turnOffIntro(): void {
        this.setState({ intro: false });
    }

    private async onBotSwitch(chatBot: Bot): Promise<void> {
        try {
            this.setState({ loading: true });
            await this.switchToBot(chatBot.id);
        } finally {
            this.setState({ loading: false });
        }
    }

    private async login(): Promise<void> {
        const authToken = await AuthService.login({
            [ValueStorageKeys.BotId]: this.props.botId
        }, this.props.embedded);

        this.user = AuthService.getUserFromAuthToken(authToken)!;
        this.setState({ authToken });

        if (this.props.embedded) {
            const { channels } = this.state;
            let targetChannel = channels[this.props.botId];
            if (targetChannel) {
                this.initBotConnection(targetChannel, this.props.anonymous!);
            }
        }
    }
}