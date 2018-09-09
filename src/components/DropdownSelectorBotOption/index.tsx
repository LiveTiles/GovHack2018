import * as React from 'react';

import { StatusCircle } from '../StatusCircle';

import * as styles from './styles.css';

export interface DropdownSelectorBotOptionProps {
    name?: string;
    avatar?: string;
    description?: string;
    color?: string;
}

export class DropdownSelectorBotOption extends React.Component<DropdownSelectorBotOptionProps> {
    render(): JSX.Element {
        const { name, avatar, description, color } = this.props;

        return (
            <div className={styles.dropdownSelectorBotOption}>
                <div className={styles.avatarColumn}>
                {avatar
                ? <img
                    className={styles.avatar}
                    src={avatar}
                />
                : <StatusCircle
                    className={styles.avatar}
                    color={color || styles.varDefaultAvatarColor}
                />
                }
                </div>
                <div className={styles.optionInfoColumn}>
                    <div className={styles.optionName}>
                        {name}
                    </div>
                    <div className={styles.optionDescription}>
                        {description}
                    </div>
                </div>
            </div>
        );
    }
}

export default DropdownSelectorBotOption;