import React, { CSSProperties, ReactNode, useMemo } from 'react';

export default function WidthHeightMatcher(props: {
  children: ReactNode;
  className?: string;
  heightPercentRatio?: number;
  containerStyle?: CSSProperties;
}) {
  const paddingTop = useMemo(
    () => (props.heightPercentRatio ? props.heightPercentRatio + '%' : '100%'),
    [props.heightPercentRatio],
  );

  return (
    <div css={{ position: 'relative' }} style={props.containerStyle}>
      <div
        css={{
          width: '100%',
          paddingTop: paddingTop,
        }}
      ></div>
      ``
      <div
        className={props.className}
        css={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
