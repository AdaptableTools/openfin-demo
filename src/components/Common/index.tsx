import * as React from 'react';
import { useEffect, useState } from 'react';

type CommonProps = {
  name: string;
};

const IDENTITY = fin.Window.me;

export default function Common(props: CommonProps) {
  const [value, setValue] = useState('');

  return (
    <div>
      Identity - {JSON.stringify(IDENTITY)}
      <br />
      Common cmp - name {props.name}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}
