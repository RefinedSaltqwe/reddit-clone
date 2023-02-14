import React from 'react';
import Navbar from '../Navbar';

type layoutProps = {
    children: React.ReactNode;
};

const Layout:React.FC<layoutProps> = ({ children }) => {
    
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}
export default Layout;
