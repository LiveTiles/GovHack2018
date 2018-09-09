import * as React from 'react';
import * as classnames from 'classnames';
import * as style from './styles.css';

export interface StatusCircleProps {
    className?: string;
    color: string;
    size?: string;
}

export const StatusCircle = (props: StatusCircleProps) => {
    const { color, className, size } = props;
    return (
        <div 
            className={classnames(style.circle, className)}
            style={{ backgroundColor: color, height: size, width: size }} 
        />
    );
};

export default StatusCircle;