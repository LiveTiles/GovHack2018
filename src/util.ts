export function getUrlParameterByName(name: string): string | null {
    const regex = RegExp(`[?#&]${name}=([^&?]*)`, 'i');
    const match = regex.exec(window.location.search)
        || regex.exec(window.location.hash);

    return match
        ? decodeURIComponent(match[1])
        : null;
}

export function setHashParameters(keyValueMap: { [key: string]: string; }): void {
    const keys = Object.getOwnPropertyNames(keyValueMap);
    const keyValueList = new Array<string>(keys.length);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        keyValueList[i] = `${key}=${keyValueMap[key]}`;
    }

    location.hash = keyValueList.join('&');
}

export function timeout(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), duration));
}