    import React from 'react';

    function Text({ children, variant = 'p', className, index }) {
        const Tag = variant;
        return <Tag key={index} className={className}>{children}</Tag>;
    }

    export default Text;