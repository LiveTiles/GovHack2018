import * as React from 'react';

import * as styles from './styles.css';
import * as defaultLogo from './logo.png';

export interface NoticeProps {
    color?: string;
    logo?: string;
}

export class Notice extends React.Component<NoticeProps> {
    render(): JSX.Element {
        const { color, logo, children } = this.props;

        return (
            <div
                className={styles.webchatNotice}
                style={{ backgroundColor: color }}
            >
                <div className={styles.customLogo}>
                    <img
                        className={styles.customLogoImage}
                        src={logo || defaultLogo}
                        alt="Company Logo"
                    />
                </div>
                <div className={styles.webchatNoticeMessage}>
                    {children}
                </div>
            </div>
        );
    }
}