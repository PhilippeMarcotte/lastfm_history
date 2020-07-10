import React, { useState, useEffect, useRef } from 'react';

function FullAlbum({match, location})
{
  return (
    <>
      <p>
        <strong>Match Props: </strong>
        <code>{JSON.stringify(match, null, 2)}</code>
      </p>
      <p>
        <strong>Location Props: </strong>
        <code>{JSON.stringify(location, null, 2)}</code>
      </p>
    </>
  );
}

export default FullAlbum;