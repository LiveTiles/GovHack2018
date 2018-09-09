import * as classnames from 'classnames';
import * as React from 'react';

import * as styles from './styles.css';

export interface LoadingSpinnerProps {
    loading?: boolean;

    className?: string;
}

export class LoadingSpinner extends React.Component<LoadingSpinnerProps> {

    render(): JSX.Element {
        const { loading, className } = this.props;

        return (
            <div
                className={classnames(
                    styles.loadingSpinner,
                    className
                )}
            >
                <div
                    className={classnames(
                        styles.spinner,
                        loading && styles.loading
                    )}
                />
            </div>
        );
    }
}

export default LoadingSpinner;