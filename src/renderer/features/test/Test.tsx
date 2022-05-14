import { useState } from 'react';

export default function Test() {
  const value = '린투 짱짱맨';
  const [state1234, setState1234] = useState(2);

  return (
    <div>
      <div>
        {value} {state1234}
      </div>
      <button
        onClick={() => {
          setState1234(state1234 * state1234);
        }}
        type="button"
      >
        나를 눌러봐
      </button>
      <Child name={'시로모리'} />
      <ChildToKill toKillList={'ly2'} /> {value}
    </div>
  );
}

function Child(props: { name: string }) {
  return <div>{props.name}: 응애 난 아기</div>;
}

function ChildToKill(props: { toKillList: string }) {
  return <>{props.toKillList}</>;
}

function ChildOnly() {
  return <div>{lynthe2()}</div>;
}

function lynthe2(): string {
  return 'lynthe ytoo';
}
