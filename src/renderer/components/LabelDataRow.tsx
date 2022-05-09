/** @jsxImportSource @emotion/react */
import { ReactNode } from 'react';
import { FlexRow } from './styledComponents';

interface Props {
  label: ReactNode;
  content: ReactNode;
  className?: string;
}
export default function LabelDataRow(props: Props) {
  return (
    <FlexRow className={props.className} css={{ alignItems: 'center' }}>
      <div>{props.label}</div>
      <div css={{ marginLeft: 'auto' }}>{props.content}</div>
    </FlexRow>
  );
}
