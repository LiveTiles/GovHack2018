declare module '*.css';
declare module '*.png';
declare module '*.svg';

interface Env {
    DIRECTLINE_SECRET: string;
    BOT_FRAMEWORK_ID: string;
}

interface Process {
    env: Env;
}

declare var process: Process;