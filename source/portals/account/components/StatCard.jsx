import React from 'react';

const StatCard = ({ title, mainValue, details, icon, onClick }) => {
    const isClickable = !!onClick;

    const cardClasses = `
        bg-white rounded-lg shadow-md p-5 flex items-start gap-4
        ${isClickable ? 'cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all duration-200' : ''}
    `;

    return (
        <div className={cardClasses} onClick={onClick}>
            {icon && (
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
                    {icon}
                </div>
            )}
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                
                <div className="mt-1">
                    {typeof mainValue === 'object' ? mainValue : <p className="text-2xl font-semibold text-gray-900">{mainValue}</p>}
                </div>

                {details && details.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {details.map(detail => (
                            <span key={detail.label}>
                                {detail.label}: <strong className="font-medium text-gray-700">{detail.value}</strong>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
