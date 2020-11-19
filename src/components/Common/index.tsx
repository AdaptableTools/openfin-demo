import * as React from 'react';
import { useEffect, useState } from 'react';

import { useChannelClient } from 'openfin-react-hooks';

type CommonProps = {
  name: string;
};

const IDENTITY = fin.Window.me;

export default function Common(props: CommonProps) {
  const [value, setValue] = useState('');
  const { client } = useChannelClient('counter');

  useEffect(() => {
    if (client) {
      client.register('get', (payload: any) => setValue(payload));
    }
  }, [client]);

  return (
    <div>
      Identity - {JSON.stringify(IDENTITY)}
      <br />
      Common cmp - name {props.name}
      <button onClick={() => client.dispatch('set', value)}>send</button>{' '}
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
