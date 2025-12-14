import React from 'react';

const backgrounds = [
    '/backgrounds/bg1.jpg',
    '/backgrounds/bg2.jpg',
    '/backgrounds/bg3.jpg',
    '/backgrounds/bg4.jpg',
    '/backgrounds/bg5.jpg',
    '/backgrounds/bg6.jpg',
];

const BackgroundPicker = ({ currentBackground, onBackgroundChange }) => {
    return (

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {backgrounds.map(bg => {
                const isSelected = currentBackground === bg;

                return (
                    <div
                        key={bg}
                        onClick={() => onBackgroundChange(bg)}

                        className={`
                            relative rounded-lg overflow-hidden cursor-pointer 
                            transition-all duration-200 ease-in-out
                            ring-2 ring-offset-2 
                            ${isSelected ? 'ring-blue-500' : 'ring-transparent'}
                            hover:scale-105 hover:ring-blue-400
                        `}
                        title={`Selecionar fundo ${bg.split('/').pop().split('.')[0]}`}
                    >
                        <img 
                            src={bg} 
                            alt={`Fundo ${bg}`} 
                            className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        
                        {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-50">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                         )}
                    </div>
                );
            })}
        </div>
    );
};

export default BackgroundPicker;
