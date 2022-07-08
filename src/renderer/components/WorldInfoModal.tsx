import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { gold, red } from '@ant-design/colors';
import { FlexCenter, FlexRow } from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { World, WorldEditInput } from '@src/types';
import { Button, Image, Modal, Popconfirm, Tag, Typography } from 'antd';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { format } from 'date-fns';
import { useState } from 'react';
import { spacing } from '../utils/styling';
import WorldInstanceCreationModal from './WorldInstanceCreationModal';

interface Props {
  onCancel?: () => void;
  onEdit?: (world: World) => void;
  onRemove?: (world: World) => void;
  onClickBookmark: (world: World, isBookmarked: boolean) => void;

  visible: boolean;
  isBookmarked: boolean;
  world?: World;
}

function WorldInfoModal(props: Props) {
  const [visibleInstanceModal, setVisibleInstanceModal] = useState(false);

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
      footer={false}
    >
      <WorldInstanceCreationModal
        onCancel={() => {
          setVisibleInstanceModal(false);
        }}
        visible={visibleInstanceModal}
        world={props.world}
      />

      {props.world && (
        <>
          <FlexCenter>
            <Image src={props.world.imageUrl} width="70%"></Image>
          </FlexCenter>
          <br />
          <FlexRow>
            <div css={{ flex: 1 }}>
              <Typography.Title level={5}>
                <div>
                  북마크:{' '}
                  {props.isBookmarked ? (
                    <HeartFilled
                      css={{ color: red.primary, fontSize: 20 }}
                      onClick={() =>
                        props.world &&
                        props.onClickBookmark(props.world, props.isBookmarked)
                      }
                    />
                  ) : (
                    <HeartOutlined
                      css={{ color: red.primary, fontSize: 20 }}
                      onClick={() =>
                        props.world &&
                        props.onClickBookmark(props.world, props.isBookmarked)
                      }
                    />
                  )}
                </div>
                <div>제작자: {props.world.author}</div>
                <div>
                  별점: <StarScore score={props.world.score} />
                </div>
                <div>타입: {props.world.type}</div>
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
              <FlexRow css={{ gap: spacing(1) }}>
                <ButtonWorldLink
                  worldKey={props.world.key}
                  url={props.world.url}
                />
                {/* TODO: 월드 인스턴스 생성 */}
                {/* <ButtonInstanceCreation
                  worldKey={props.world.key}
                  url={props.world.url}
                  onClickInstance={() => setVisibleInstanceModal(true)}
                /> */}
                {props.onEdit && (
                  <Button
                    type="primary"
                    ghost
                    onClick={() => {
                      props.onEdit?.(props.world!);
                    }}
                  >
                    수정
                  </Button>
                )}
                {props.onRemove && (
                  <Popconfirm
                    title="정말 월드를 삭제하시겠습니까?"
                    placement="topRight"
                    onConfirm={() => props.onRemove?.(props.world!)}
                  >
                    <Button danger>삭제</Button>
                  </Popconfirm>
                )}
              </FlexRow>

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

function ButtonWorldLink(props: { worldKey: string; url: string }) {
  const btnName = 'Link';

  if (props.worldKey.charAt(0) === 'n' && props.worldKey.charAt(1) === 'o') {
    return (
      <Button disabled css={{ marginLeft: 'auto' }}>
        {btnName}
      </Button>
    );
  }
  return (
    <Typography.Link target="_blank" href={props.url}>
      <Button css={{ marginLeft: 'auto' }}>{btnName}</Button>
    </Typography.Link>
  );
}

function ButtonInstanceCreation(props: {
  worldKey: string;
  url: string;
  onClickInstance: () => void;
}) {
  const btnName = '인스턴스 생성';

  if (props.worldKey.charAt(0) === 'n' && props.worldKey.charAt(1) === 'o') {
    return (
      <Button disabled css={{ marginLeft: 'auto' }}>
        {btnName}
      </Button>
    );
  }
  return (
    <Typography.Link target="_blank">
      <Button
        css={{ marginLeft: 'auto' }}
        onClick={(e) => {
          props.onClickInstance();
        }}
      >
        {btnName}
      </Button>
    </Typography.Link>
  );
}
