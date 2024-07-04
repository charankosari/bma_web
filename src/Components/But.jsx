import React, { useState } from 'react';
import '../../App.css';

function Main() {
  const [hovered, setHovered] = useState(null);

  return (
    <>
    <div className=" bg-white flexv text-black justify-start p-8 items-center">
      <div className="max-w-lg w-full p-8">
        <h1 className="sm:text-4xl  text-2xl font-bold">Book Your Appointments</h1>
        <br />
        <h1 className="text-2xl">at the comfort of your Home.</h1>
      </div>
    </div>
    <div className="container">
      <button
        className={button button-1 ${hovered === 'button1' ? 'expanded' : hovered === 'button2' ? 'contracted' : ''}}
        onMouseEnter={() => setHovered('button1')}
        onMouseLeave={() => setHovered(null)}
      >
        HOSPITALS
      </button>
      <button
        className={button button-2 ${hovered === 'button2' ? 'expanded' : hovered === 'button1' ? 'contracted' : ''}}
        onMouseEnter={() => setHovered('button2')}
        onMouseLeave={() => setHovered(null)}
      >
        LABS
      </button>
    </div>
    </>

  );
}

export default Main;