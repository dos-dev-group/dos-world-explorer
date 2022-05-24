import { FlexCenter, FlexRow } from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { WorldEditInput } from '@src/types';
import { Button, Image, Modal, Tag, Typography } from 'antd';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { useEffect, useState } from 'react';
import useSearchPage from './hooks/useSearchPage';
import { format } from 'date-fns';

interface Props {
  onOk?: (e: WorldEditInput) => void;
  onCancel?: () => void;
  visible: boolean;
  types: string[];
  worldKey: string;
}

function WorldInfoModal(props: Props) {
  const hookMember = useSearchPage();

  const [worldKey, setWorldKey] = useState<string>();
  const [worldName, setWorldName] = useState<string>();
  const [worldAuthor, setWorldAuthor] = useState<string>();
  const [worldType, setWorldType] = useState<string>();
  const [worldUrl, setWorldUrl] = useState<string>('');
  const [worldImageUrl, setWorldImageUrl] = useState<string>();
  const [worldDate, setWorldDate] = useState<Date>(new Date());
  const [worldDesc, setWorldDesc] = useState<string>();
  const [worldTags, setWorldTags] = useState<string[]>([]);
  const [worldScore, setWorldScore] = useState<number>(0);

  useEffect(() => {
    if (props.visible === true) {
      setWorldKey(props.worldKey);
      const world = hookMember.currentTableData.find((world) => {
        return world.key === props.worldKey;
      });
      //const world = hookMember.worldrentTableData.find( world => {return world.key.toString() === worldKey?.toString()}); // 왜 안됨?
      if (world !== undefined && world !== null) {
        setWorldName(world?.name);
        setWorldAuthor(world?.author);
        setWorldType(world?.type);
        if (world.url !== undefined) {
          setWorldUrl(world.url);
        }
        setWorldImageUrl(world?.imageUrl);
        setWorldDate(world?.date);
        setWorldDesc(world?.description);
        setWorldTags(world?.tags);
        if (world?.score !== undefined) {
          setWorldScore(world.score);
        }
      } else {
      }
    }
  }, [props.visible]);

  return (
    <Modal
      title={worldName}
      onOk={() => {
        props.onCancel?.();
      }}
      destroyOnClose
      onCancel={props.onCancel}
      visible={props.visible}
      width="80%"
      footer={[]}
    >
      <FlexCenter>
        <Image src={worldImageUrl} width="60%"></Image>
      </FlexCenter>
      <br />
      <FlexRow>
        <div css={{ flex: 1 }}>
          <Typography.Title level={5}>
            <div>제작자: {worldAuthor}</div>
            <div>
              별점: <StarScore score={worldScore} />
            </div>
            타입: {worldType}
            <div>
              {worldTags.map((tag) => {
                const colorIndex =
                  simpleStringHash(tag) % PresetColorTypes.length;
                const color = PresetColorTypes[colorIndex];
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </div>
          </Typography.Title>
          <div css={{ marginTop: 20 }}>
            <Typography.Text>
              Recorded Date: {format(worldDate, 'yyyy-MM-dd HH:mm:ss')} GMT{' '}
              {worldDate.getTimezoneOffset() / 60}
              <br />
              ID: {worldKey}
            </Typography.Text>
          </div>
        </div>

        <div css={{ flex: 1 }}>
          <Button
            type="default"
            onClick={() => hookMember.onClickUrl(worldUrl.toString())}
          >
            World Link
          </Button>
          <br />
          <Typography.Paragraph css={{ marginTop: 20 }}>
            {worldDesc}
          </Typography.Paragraph>
        </div>
      </FlexRow>
    </Modal>
  );
}

export default WorldInfoModal;

function StarScore(props: { score: number }) {
  let stars = '';
  for (let i = 0; i < props.score; i++) {
    stars += '⭐';
  }

  return <>{stars}</>;
}
