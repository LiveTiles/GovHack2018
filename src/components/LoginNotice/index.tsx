import * as React from 'react';

import { Notice, NoticeProps } from '../Notice';

import * as styles from './styles.css';
import * as fingerprintIcon from './fingerprint.svg';

export interface LoginNoticeProps extends NoticeProps {
    color?: string;

    onLoginClick(): void;
}

export class LoginNotice extends React.Component<LoginNoticeProps> {
    render(): JSX.Element {
        const { color, onLoginClick } = this.props;

        return (
            <Notice {...this.props}>
                <button
                    className={styles.loginButton}
                    type="button"
                    style={{
                        backgroundColor: color,
                        color: color,
                        stroke: color
                    }}
                    onClick={onLoginClick}
                >
                    <div className={styles.loginMask} />
                    <span
                        className={styles.loginIcon}
                        dangerouslySetInnerHTML={{ __html: fingerprintIcon }}
                    />
                    <span className={styles.loginText}>Log In</span>
                </button>
            </Notice>
        );
    }
}