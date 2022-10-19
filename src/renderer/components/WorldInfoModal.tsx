import {
  HeartFilled,
  HeartOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { red } from '@ant-design/colors';
import {
  Flex,
  FlexCenter,
  FlexRow,
} from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { WorldPartial } from '@src/types';
import {
  Button,
  Image,
  message,
  Modal,
  Popconfirm,
  Tag,
  Typography,
} from 'antd';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { World as VRCWorld } from 'vrchat';
import { spacing } from '../utils/styling';
import WorldInstanceCreationModal from './WorldInstanceCreationModal';
import { useFavoritedWorld } from '../data/favoritedWorld';
import FavoriteWorldSelectModal from './FavoriteWorldSelectModal';
import { getWorldAllInfoToMain } from '../utils/ipc/vrchatAPIToMain';

interface Props {
  onCancel?: () => void;
  onEdit?: (world: WorldPartial) => void;
  onRemove?: (world: WorldPartial) => void;
  onClickBookmark?: (world: WorldPartial, isBookmarked: boolean) => void;

  visible: boolean;
  isBookmarked?: boolean;
  world?: WorldPartial;
}

function WorldInfoModal(props: Props) {
  const [visibleInstanceModal, setVisibleInstanceModal] = useState(false);
  const [visibleFavoriteModal, setVisibleFavoriteModal] = useState(false);
  const [vrcWorldInfo, setVRCWorldInfo] = useState<VRCWorld>();

  const favoritedWorldHookMember = useFavoritedWorld();

  // memoized check is world favorited
  const favoriteGroup = useMemo(
    () =>
      props.world?.key
        ? favoritedWorldHookMember.checkHasFavorite(props.world?.key)
        : undefined,
    [favoritedWorldHookMember, props.world?.key],
  );

  useEffect(() => {
    if (props.world && props.visible) {
      getWorldAllInfoToMain(props.world.key).then((world) =>
        setVRCWorldInfo(world),
      );
    }
  }, [props.world, props.visible]);

  return (
    <Modal
      title={props.world?.name}
      onOk={() => {
        props.onCancel?.();
      }}
      destroyOnClose
      onCancel={props.onCancel}
      visible={props.visible}
      width="80%"
      footer={false}
      zIndex={2}
    >
      <WorldInstanceCreationModal
        onCancel={() => {
          setVisibleInstanceModal(false);
        }}
        visible={visibleInstanceModal}
        world={props.world}
      />
      {props.world && (
        <FavoriteWorldSelectModal
          onCancel={() => {
            setVisibleFavoriteModal(false);
          }}
          onOk={() => {
            setVisibleFavoriteModal(false);
          }}
          visible={visibleFavoriteModal}
          world={props.world}
        />
      )}

      {props.world && (
        <>
          <FlexCenter>
            <Image src={props.world.imageUrl} width="70%"></Image>
          </FlexCenter>
          <br />
          <FlexRow>
            <div css={{ flex: 1 }}>
              <Typography.Title level={5}>
                {props.onClickBookmark && props.isBookmarked !== undefined && (
                  <div>
                    북마크:{' '}
                    {props.isBookmarked ? (
                      <HeartFilled
                        css={{ color: red.primary, fontSize: 20 }}
                        onClick={() =>
                          props.onClickBookmark!(
                            props.world!,
                            props.isBookmarked!,
                          )
                        }
                      />
                    ) : (
                      <HeartOutlined
                        css={{ color: red.primary, fontSize: 20 }}
                        onClick={() =>
                          props.onClickBookmark!(
                            props.world!,
                            props.isBookmarked!,
                          )
                        }
                      />
                    )}
                  </div>
                )}
                {props.world.author && <div>제작자: {props.world.author}</div>}
                {props.world.score && (
                  <div>
                    별점: <StarScore score={props.world.score} />
                  </div>
                )}
                {props.world.type && <div>타입: {props.world.type}</div>}
                {props.world.tags && (
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
                )}
              </Typography.Title>
              <div css={{ marginTop: 20 }}>
                <Typography.Text>
                  {props.world.date && (
                    <>
                      Recorded Date:{' '}
                      {format(props.world.date, 'yyyy-MM-dd HH:mm:ss')} GMT{' '}
                      {props.world.date.getTimezoneOffset() / 60}
                      <br />
                    </>
                  )}
                  ID: {props.world.key}
                </Typography.Text>
              </div>
            </div>

            <div css={{ flex: 1 }}>
              <div
                css={{
                  '& > *': {
                    margin: 4,
                  },
                }}
              >
                {props.world?.key && props.world?.url && (
                  <>
                    <ButtonWorldLink
                      worldKey={props.world.key}
                      url={props.world.url}
                    />
                    {/* TODO: 월드 인스턴스 생성 */}
                    <ButtonInstanceCreation
                      worldKey={props.world.key}
                      onClickInstance={() => setVisibleInstanceModal(true)}
                    />
                  </>
                )}
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
              </div>

              {props.world?.key && (
                <FlexRow
                  css={{
                    alignItems: 'center',
                    marginTop: spacing(1),
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  <Button
                    onClick={() => {
                      if (favoriteGroup) {
                        favoritedWorldHookMember
                          .removeFavorite(props.world!.key)
                          .then(() =>
                            message.info('즐겨찾기에서 제거되었습니다.'),
                          )
                          .catch((e) => message.error(String(e)));
                      } else {
                        setVisibleFavoriteModal(true);
                      }
                    }}
                    type="link"
                    icon={
                      favoriteGroup ? (
                        <StarFilled css={{ color: 'orange', fontSize: 18 }} />
                      ) : (
                        <StarOutlined css={{ color: 'orange', fontSize: 18 }} />
                      )
                    }
                  >
                    {favoriteGroup
                      ? `VRC즐겨찾기 제거 (${favoriteGroup.groupInfo.displayName})`
                      : `VRC즐겨찾기 추가`}
                  </Button>
                </FlexRow>
              )}

              <br />
              <Typography.Paragraph css={{ marginTop: 20 }}>
                {props.world.description}
              </Typography.Paragraph>
            </div>
            <Flex
              css={{
                flex: 1,
                paddingLeft: spacing(1),
                '& *': {
                  wordBreak: 'break-word',
                },
              }}
            >
              <Typography.Title level={5}>VRC 정보</Typography.Title>
              <FlexRow css={{ gap: spacing(2) }}>
                <span>
                  <strong>인원 :</strong>{' '}
                  {vrcWorldInfo?.capacity + ' / ' + vrcWorldInfo?.capacity ??
                    0 * 2}
                </span>
              </FlexRow>
              <FlexRow css={{ gap: spacing(2) }}>
                <span>
                  <strong>방문 수 :</strong> {vrcWorldInfo?.visits}
                </span>
                <span>
                  <strong>즐겨찾기 수 :</strong> {vrcWorldInfo?.favorites}
                </span>
              </FlexRow>
              <FlexRow css={{ gap: spacing(2) }}>
                <span>
                  <strong>인기도 :</strong> {vrcWorldInfo?.popularity}
                </span>
              </FlexRow>
              <FlexRow css={{ gap: spacing(2) }}>
                <span>
                  <strong>생성날짜 :</strong>{' '}
                  {vrcWorldInfo?.created_at
                    ? new Date(vrcWorldInfo?.created_at).toLocaleString()
                    : '알 수 없음'}
                </span>
              </FlexRow>
              <FlexRow css={{ gap: spacing(2) }}>
                <span>
                  <strong>업데이트날짜 :</strong>{' '}
                  {vrcWorldInfo?.updated_at
                    ? new Date(vrcWorldInfo?.updated_at).toLocaleString()
                    : '알 수 없음'}
                </span>
              </FlexRow>
            </Flex>
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
