import * as React from 'react';

import { Notice, NoticeProps } from '../Notice';

import * as styles from './styles.css';
import * as errorIcon from './error.svg';

export interface ErrorNoticeProps extends NoticeProps {}

export class ErrorNotice extends React.Component<ErrorNoticeProps> {
    render(): JSX.Element {
        return (
            <Notice {...this.props}>
                <div className={styles.webchatError}>
                    <span
                        className={styles.webchatErrorIcon}
                        dangerouslySetInnerHTML={{__html: errorIcon}}
                    />
                    {this.props.children}
                </div>
            </Notice>
        );
    }
}