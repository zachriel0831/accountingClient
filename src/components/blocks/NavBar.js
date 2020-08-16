import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Icon, Menu } from 'semantic-ui-react'
import _ from 'lodash'

const NavBar = (props) => {
    //   state = { activeItem: 'gamepad' }

    const [activeItemState, setActiveItemState] = useState('home');
    let history = useHistory();

    const handleItemClick = (e, { name, menulink }) => {

        setActiveItemState(name);
        history.push(menulink);

    }

    // const { activeItem } = activeItemState

    let routersData = props.routersData;
    let menuItem = [];
    _.each(routersData, (v, k) => {
        let name = '';
        let iconName = '';
        switch (v) {
            case '/Home':
                name = 'home';
                iconName = 'home';
                break;
            case '/Charts':
                name = 'charts';
                iconName = 'chart line';
                break;

            case '/Details':
                name = 'details'
                iconName = 'file alternate outline';

                break;

            case '/Installment':
                name = 'installment';
                iconName = 'file alternate outline';
                break;
            case '/BackUp':
                name = 'BackUp';
                iconName = 'exchange';
                break;
            case '/Stocks':
                name = 'Stocks';
                iconName = 'money bill alternate';
            break;
            case '/Currency':
                name = 'Currency';
                iconName = 'money bill alternate';
                break;
            default:
                break;
        }

        menuItem.push(
            <Menu.Item
                key={k}
                name={name}
                menulink={v}
                active={activeItemState === name}
                onClick={handleItemClick}
            >
                <Icon name={iconName} />
                {name}
            </Menu.Item>
        )
    })

    return (
        <Menu icon='labeled'>
            {menuItem}
        </Menu>
    )
}

export default NavBar;