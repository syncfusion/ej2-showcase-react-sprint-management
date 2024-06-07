import * as React from 'react';
import { getBoolean, getKanbanResorurceImage, getResourceName, getTags } from './helper';

export const CardTemplate = (props: any) => {
    return (
        <div className='card-template'>
            <div className='e-card-header'>
                <div className='e-card-header-caption'>
                    {getResourceName(props)}
                </div>
            </div>
            <div className='e-card-content e-tooltip-text'>
                <div className='e-text'>{props.Subject}</div>
            </div>
            {getBoolean(props)}
            <div className='e-card-custom-footer'>
                {getTags(props.Tags)}
                {getKanbanResorurceImage(props)}
            </div>
        </div>
    );
};
export const KanbanTemplate = (props: any) => {
    const { keyField, headerText } = props;
    return (
        <div className="header-template-wrap">
            <div className={`header-icon e-icons ${keyField}`}></div>
            <div className="header-text">{headerText}</div>
        </div>
    );
}