import { FlexCenter, FlexRow } from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { World, WorldEditInput } from '@src/types';
import { Button, Image, Modal, Tag, Typography } from 'antd';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { format } from 'date-fns';
import useSearchPage from '../features/search/hooks/useSearchPage';

interface Props {
  onOk?: (e: WorldEditInput) => void;
  onCancel?: () => void;
  visible: boolean;
  world?: World;
}

function WorldInfoModal(props: Props) {
  return (
    <Modal
      title={props.world?.name}
      onOk={() => {
        props.onCancel?.();
      }}
      destroyOnClose
      onCancel={props.onCancel}
      visible={props.visible}
      width="60%"
      footer={[]}
    >
      {props.world && (
        <>
          <FlexCenter>
            <Image src={props.world.imageUrl} width="70%"></Image>
          </FlexCenter>
          <br />
          <FlexRow>
            <div css={{ flex: 1 }}>
              <Typography.Title level={5}>
                <div>제작자: {props.world.author}</div>
                <div>
                  별점: <StarScore score={props.world.score} />
                </div>
                타입: {props.world.type}
                <div>
                  {props.world.tags.map((tag) => {
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
                  Recorded Date:{' '}
                  {format(props.world.date, 'yyyy-MM-dd HH:mm:ss')} GMT{' '}
                  {props.world.date.getTimezoneOffset() / 60}
                  <br />
                  ID: {props.world.key}
                </Typography.Text>
              </div>
            </div>

            <div css={{ flex: 1 }}>
              <WorldLink worldKey={props.world.key} url={props.world.url} />
              <br />
              <Typography.Paragraph css={{ marginTop: 20 }}>
                {props.world.description}
              </Typography.Paragraph>
            </div>
          </FlexRow>
        </>
      )}
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

function WorldLink(props: { worldKey: string; url: string }) {
  if (props.worldKey.charAt(0) === 'n' && props.worldKey.charAt(1) === 'o') {
    return <Button disabled>World Link</Button>;
  }
  return (
    <Typography.Link target="_blank" href={props.url}>
      <Button>World Link</Button>
    </Typography.Link>
  );
}
