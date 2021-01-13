import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Icon, Menu } from 'semantic-ui-react'
import _ from 'lodash'
import { useTranslation } from "react-i18next";
import "../../i18n";
import Select from '../Select';
import config from '../../configs/config';

const NavBar = (props) => {
    //   state = { activeItem: 'gamepad' }
    const [langState, setLangState] = useState(config.defaultLanguage);
    const [activeItemState, setActiveItemState] = useState('home');
    const { t, i18n } = useTranslation();

    let history = useHistory();

    const handleItemClick = (e, { name, menulink }) => {

        setActiveItemState(name);
        history.push(menulink);

    }
    const changeLanguage = (e, setValue) => {

        let lng = e ? e.currentTarget.value : setValue;
        i18n.changeLanguage(lng);
        setLangState(lng);
    };

    // const { activeItem } = activeItemState

    let routersData = props.routersData;
    let menuItem = [];
    _.each(routersData, (v, k) => {
        let name = '';
        let iconName = '';
        switch (v) {
            case '/Home':
                name = t('Home');
                iconName = 'home';
                break;
            case '/Charts':
                name = t('charts');
                iconName = 'chart line';
                break;

            case '/Details':
                name = t('details')
                iconName = 'file alternate outline';

                break;

            case '/Installment':
                name = t('installment');
                iconName = 'file alternate outline';
                break;
            case '/BackUp':
                name = t('backUp');
                iconName = 'exchange';
                break;
            case '/Stocks':
                name = t('stocks');
                iconName = 'money bill alternate';
                break;
            case '/Currency':
                name = t('currency');
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
            <Select label='選擇語言:' value={langState} name='select-lang' options={{
                items: [{
                    "label": "英文",
                    "value": "en-US",
                    "groupKey": "_none"
                }, {
                    "label": "中文",
                    "value": "zh-TW",
                    "groupKey": "_none"
                }]
            }} onChange={changeLanguage} />

        </Menu>
    )
}

export default NavBar;