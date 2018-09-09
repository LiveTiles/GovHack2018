import * as classnames from 'classnames';
import * as React from 'react';
import ScrollArea from 'react-scrollbar';

import * as styles from './styles.css';

interface ScrollAreaContext {
    scrollBottom(): void;
    scrollLeft(): void;
    scrollRight(): void;
    scrollTop(): void;
    scrollXTo(position: number): void;
    scrollYTo(position: number): void;
}

export interface ScrollbarProps {
    className?: string;
    contentClassName?: string;
    horizontal?: boolean;
    stopScrollPropagation?: boolean;
}

export class Scrollbar extends React.Component<ScrollbarProps, {}> {
    static defaultProps: Partial<ScrollbarProps> = {
        horizontal: true
    };

    private scrollArea: ScrollAreaContext;

    render(): JSX.Element {
        const {
            className,
            contentClassName,
            horizontal,
            children,
            stopScrollPropagation
        } = this.props;

        return (
            <ScrollArea
                ref={(elem: ScrollArea & { scrollArea: ScrollAreaContext }) => {
                    if (elem) {
                        this.scrollArea = elem.scrollArea;
                    }
                }}
                className={classnames(
                    styles.scrollArea,
                    className
                )}
                contentClassName={classnames(
                    styles.scrollContent,
                    contentClassName
                )}
                horizontal={horizontal}
                speed={0.8}
                smoothScrolling={true}
                stopScrollPropagation={stopScrollPropagation}
            >{children}
            </ScrollArea>
        );
    }

    scrollBottom(): void {
        this.scrollArea.scrollBottom();
    }

    scrollLeft(): void {
        this.scrollArea.scrollLeft();
    }

    scrollRight(): void {
        this.scrollArea.scrollRight();
    }

    scrollTop(): void {
        this.scrollArea.scrollTop();
    }

    scrollXTo(position: number): void {
        this.scrollArea.scrollXTo(position);
    }

    scrollYTo(position: number): void {
        this.scrollArea.scrollYTo(position);
    }
}

export default Scrollbar;