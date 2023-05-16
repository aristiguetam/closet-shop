import { useReducer } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
    isMenuOpen: boolean;
}

export const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}

interface Props {
    children: JSX.Element;
}

export const UiProvider = ({ children }: Props) => {

    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' });
    }

    return (
        <UiContext.Provider value={{
            ...state,

            //Methods
            toggleSideMenu,
        }}>
            {children}
        </UiContext.Provider>
    )
}