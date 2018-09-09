import * as React from 'react';
import * as classnames from 'classnames';
import * as styles from './styles.css';

export module IconSizes {
    /** 150px width */
    export const ExtraLarge = 'extraLarge';
    /** 100px width */
    export const Large = 'large';
    /** 50px width */
    export const Medium = 'medium';
    /** 25px width */
    export const Small = 'small';
    /** 100% width */
    export const Full = 'full';
}

export interface IconProps {
    /**
     *  `5 character minimum length`
     */
    path: string;
    /**
     *  `ExtraLarge | Large | Medium | Small | Full`
     */
    size: string;
    /**
     * `Defaults ''`
     */
    alt?: string;
    className?: string;
}

/**
 * Returns an icon at a set size
 * Includes ability to output nothing if path given is too short
 */
export const Icon = (props: IconProps): JSX.Element | null => {

    if (typeof props.path !== 'string' || props.path.length < 5) {
        return null;
    }

    const classes = classnames(
        styles.icon,
        styles[props.size],
        props.className
    );

    const alt = (typeof props.alt === 'string' ? props.alt : '');

    return (
        <img className={classes} src={props.path} alt={alt}/>
    );

};

export interface SVGIconProps {
    icon: string;
    size?: string;

    className?: string;
}

export class SVGIcon extends React.Component<SVGIconProps> {
    static defaultProps: Partial<SVGIconProps> = {
        icon: IconSizes.Full
    };

    render(): JSX.Element {
        const { size, icon, className } = this.props;

        return (
            <div
                className={classnames(
                    styles.icon,
                    styles[size!],
                    className
                )}
                dangerouslySetInnerHTML={{ __html: icon }}
            />
        );
    }
}

export default Icon;