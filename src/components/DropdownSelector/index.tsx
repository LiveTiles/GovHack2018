import * as classnames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { SVGIcon } from '../Icon';
import { Scrollbar } from '../Scrollbar';

import * as styles from './styles.css';
import * as downArrow from './arrow-down.svg';
import * as xIcon from './x-icon.svg';

import { timeout } from '../../util';

export interface DropdownSelectorOption<ValueType> {
    id: string;
    name: string;
    value: ValueType;
}

export interface DrowndownSelectorStyle {
    backgroundColor?: string;
    color?: string;
}

export interface DropdownSelectorProps<ValueType> {
    selectedOption?: DropdownSelectorOption<ValueType>;
    options: DropdownSelectorOption<ValueType>[];

    noSelectionChangeMemory?: boolean;

    className?: string;
    dropdownHeaderClassName?: string;
    dropdownListClassName?: string;
    style?: DrowndownSelectorStyle;

    onOptionSelect?(option: ValueType): void;

    getDropdownListItemElem?(option: ValueType): JSX.Element;
}

export interface DropdownSelectorState<ValueType> {
    selectedOption: DropdownSelectorOption<ValueType> | null;

    dropdownOpen: boolean;
    dropdownClosing: boolean;
}

export class DropdownSelector<ValueType> extends
    React.Component<DropdownSelectorProps<ValueType>,
    DropdownSelectorState<ValueType>>
{
    constructor(props: DropdownSelectorProps<ValueType>, context?: {}) {
        super(props, context);

        let { selectedOption, options } = this.props;
        if (selectedOption) {
            if (!options.some(option => selectedOption!.value === option.value)) {
                throw new Error('Passed in a selected option which wasn\'t part of the options list');
            }
        } else {
            selectedOption = options[0];
        }

        this.state = {
            selectedOption: selectedOption || null,
            dropdownOpen: false,
            dropdownClosing: false
        };

        this.onDropdownOpen = this.onDropdownOpen.bind(this);
        this.onDropdownCancel = this.onDropdownCancel.bind(this);
        this.onOutsideClick = this.onOutsideClick.bind(this);
    }

    componentDidUpdate(prevProps: DropdownSelectorProps<ValueType>): void {
        if (this.props.selectedOption!.value !== prevProps.selectedOption!.value) {
            this.setState({ selectedOption: this.props.selectedOption! });
        }
    }

    render(): JSX.Element {
        const {
            options,
            className,
            dropdownHeaderClassName,
            dropdownListClassName,
            style,
            getDropdownListItemElem
        } = this.props;
        const { selectedOption, dropdownOpen, dropdownClosing } = this.state;

        return (
            <div
                className={classnames(
                    styles.dropdownSelector,
                    className
                )}
            >
            {dropdownOpen
            ? [
                <div
                    key="defaultTitle"
                    className={classnames(
                        styles.selectedOptionDisplay,
                        styles.selectedOptionDisplayExpanded,
                        dropdownHeaderClassName
                    )}
                    style={style}
                >
                    My Bots
                    <div
                        className={styles.dropdownXButton}
                        onClick={this.onDropdownCancel}
                    >
                        <SVGIcon icon={xIcon} />
                    </div>
                </div>,
                <Scrollbar
                    key="dropdownList"
                    className={classnames(
                        styles.dropdownList,
                        dropdownClosing && styles.dropdownListClosing,
                        dropdownListClassName
                    )}
                    stopScrollPropagation={false}
                >
                    <ul
                        className={styles.dropdownListContent}
                        style={style}
                    >
                    {options.map(option =>
                        <li
                            key={option.id}
                            className={classnames(
                                styles.dropdownListItem,
                                option.id === selectedOption!.id && styles.dropdownListItemSelected
                            )}
                            onClick={() => this.onOptionSelect(option)}
                        >
                            <div className={styles.dropdownListItemBackground} />
                            <div className={styles.dropdownListItemContent}>
                            {getDropdownListItemElem
                            ?   getDropdownListItemElem(option.value)
                            :   option.name
                            }
                            </div>
                        </li>
                    )}
                    </ul>
                </Scrollbar>
            ] : selectedOption
            ? (
                <div className={styles.selectedOptionDisplay}>
                    <div 
                        className={styles.selectedOptionDisplayText}
                        onClick={this.onDropdownOpen}
                    >
                        {selectedOption.name}
                        <SVGIcon className={styles.dropdownArrow} icon={downArrow} />
                    </div>
                </div>
            ) : (
                <div
                    className={classnames(
                        styles.selectedOptionDisplay,
                        dropdownHeaderClassName
                    )}
                >
                    My Bots
                </div>
            )}
            </div>
        );
    }

    private onDropdownOpen(): void {
        this.setState({ dropdownOpen: true });

        document.addEventListener('click', this.onOutsideClick);
    }

    private async onDropdownCancel(): Promise<void> {
        this.setState({ dropdownClosing: true });

        await timeout(styles.varDropdownAnimationDuration);

        this.setState({ dropdownOpen: false, dropdownClosing: false });

        document.removeEventListener('click', this.onOutsideClick);
    }

    private onOptionSelect(option: DropdownSelectorOption<ValueType>): void {
        const { noSelectionChangeMemory } = this.props;

        const { selectedOption: previousOption } = this.state;
        const newState = { dropdownOpen: false } as DropdownSelectorState<ValueType>;
        if (!noSelectionChangeMemory) {
            newState.selectedOption = option;
        }
        this.setState(newState);

        document.removeEventListener('click', this.onOutsideClick);

        if (option === previousOption) {
            return;
        }

        const { onOptionSelect } = this.props;
        if (onOptionSelect) {
            onOptionSelect(option.value);
        }
    }

    private onOutsideClick(event: MouseEvent): void {
        const thisElem = ReactDOM.findDOMNode(this);
        if (!thisElem.contains(event.target as HTMLElement)) {
            this.onDropdownCancel();
        }
    }
}

export default DropdownSelector;