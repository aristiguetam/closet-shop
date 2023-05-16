import { UiContext } from "@/context";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export const useSearchMenu = () => {
    
    const { asPath, push } = useRouter();

    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        navigateTo(`/search/${searchTerm}`);
    }

    const onSearchTermNavbar = () => {
        if (searchTerm.trim().length === 0) return;
        push(`/search/${searchTerm}`);
    }

    const navigateTo = (url: string) => {
        push(url);
        toggleSideMenu();
    }

    return {
        asPath,
        isSearchVisible,
        isMenuOpen,
        searchTerm,
        onSearchTerm,
        navigateTo,
        setSearchTerm,
        onSearchTermNavbar,
        toggleSideMenu,
        setIsSearchVisible,
    }

}
