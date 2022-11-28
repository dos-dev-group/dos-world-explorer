/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Flex,
  FlexCenter,
  FlexRow,
} from '@src/renderer/components/styledComponents';
import { WorldPartial } from '@src/types';
import {
  Button,
  Image,
  message,
  Modal,
  Popover,
  Select,
  TreeSelect,
  TreeSelectProps,
  Typography,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { spacing } from '@src/renderer/utils/styling';
import { useVrcCurrentUser } from '../data/user';
import {
  sendInvitesToMain,
  sendSelfInviteToMain,
} from '../utils/ipc/vrchatAPIToMain';
import { usePartyData } from '../data/party';
import { useFriendsData } from '../data/friends';

const TOKEN = '@';
const PARTY_IDENTIFIER = 'party' + TOKEN;
const USER_IDENTIFIER = 'user' + TOKEN;

interface Props {
  onCancel?: () => void;
  visible: boolean;
  world?: WorldPartial;
}

const InstanceTypes: string[] = [
  'Public',
  'FriendsPlus',
  'Friends',
  'InvitePlus',
  'Invite',
];
const InstanceDefaultType: string = InstanceTypes[1]; //FriendsPlus

const InstanceRegions: string[] = [
  'UnitedStatesWest',
  'UnitedStatesEast',
  'Europe',
  'Japan',
];
const InstanceDefaultRegion: string = InstanceRegions[3]; //Japan

function WorldInstanceCreationModal(props: Props) {
  const title = '월드 인스턴스 생성';
  const [type, setType] = useState<string>(InstanceDefaultType);
  const [region, setRegion] = useState<string>(InstanceDefaultRegion);
  const [instanceId, setInstanceId] = useState<string>();
  const { currentUser } = useVrcCurrentUser();
  const partyHookMember = usePartyData();
  const friendHookMember = useFriendsData();
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [inviteTargets, setInviteTargets] = useState<string[]>([]);

  const userDataset = useMemo(() => {
    if (!partyHookMember.party || !friendHookMember.friends) return;

    const hasPartyData = Object.entries(partyHookMember.party).map(
      ([key, value]) => {
        return {
          value: PARTY_IDENTIFIER + key,
          title: '👥' + key + ` (${value.length})`,
          checkable: value.length > 0 ? true : false,
          children: value.map((e) => ({
            value: key + USER_IDENTIFIER + e.id,
            title:
              e.location !== 'offline'
                ? '🟢' + e.displayName
                : '⚫' + e.displayName,
          })),
        };
      },
    );
    const nonPartyData = [
      {
        value: PARTY_IDENTIFIER + 'ALL FRIENDS',
        title: `👥ALL FRIENDS (${friendHookMember.friends.length})`,
        checkable: false,
        children: friendHookMember.friends.map((e) => ({
          value: 'ALL FRIENDS' + USER_IDENTIFIER + e.id,
          title:
            e.location !== 'offline'
              ? '🟢' + e.displayName
              : '⚫' + e.displayName,
        })),
      },
    ];
    // eslint-disable-next-line consistent-return
    return [...hasPartyData, ...nonPartyData];
  }, [friendHookMember.friends, partyHookMember.party]);

  const onClickInvite = async () => {
    if (inviteTargets.length > 0 && props.world && instanceId) {
      setIsInviteLoading(true);

      const partyRegex = new RegExp(`^${PARTY_IDENTIFIER}`);
      const userRegex = new RegExp(`^.+${USER_IDENTIFIER}`);
      const partys = inviteTargets
        .filter((e) => partyRegex.test(e))
        .map((e) => e.replace(partyRegex, ''));
      const users = inviteTargets
        .filter((e) => userRegex.test(e))
        .concat(
          partys.flatMap((p) =>
            partyHookMember.party
              ? partyHookMember.party[p].map((u) => u.id)
              : [],
          ),
        )
        .map((e) => e.replace(userRegex, ''))
        .reduce((acc, cur) => {
          if (acc.includes(cur)) {
            return acc;
          }
          acc.push(cur);
          return acc;
        }, [] as string[]);

      await sendInvitesToMain(users, props.world.key, instanceId);
      message.success('보내기 성공');
    } else if (inviteTargets.length <= 0) {
      message.error('초대할 사람이 없습니다');
    } else {
      message.error('초대 에러');
    }
    setIsInviteLoading(false);
  };

  // const onAddInvTargetAsFriends = () => {
  //   setInviteTargets(currentUser.)
  // };

  const renderedTypes = InstanceTypes.map((e) => (
    <Select.Option key={e}>{e}</Select.Option>
  ));

  const renderedRegions = InstanceRegions.map((e) => (
    <Select.Option key={e}>{e}</Select.Option>
  ));

  const renderedPopoverContent = (
    <Flex css={{ padding: spacing(2), width: '40vw' }}>
      <TreeSelect
        treeData={userDataset}
        showCheckedStrategy={TreeSelect.SHOW_PARENT}
        treeCheckable
        placeholder="유저나 파티를 선택해주세요"
        onChange={(selected: string[]) => setInviteTargets(selected)}
        value={inviteTargets}
        placement="topLeft"
      />
      <FlexRow css={{ marginTop: spacing(1) }}>
        {/* <Button
          css={{ marginLeft: 'auto' }}
          size="small"
          onClick={() => setInviteTargets()}
        >
          인스턴스 내 친구 추가
        </Button> */}
        <Button
          // css={{ marginLeft: spacing(1) }}
          css={{ marginLeft: 'auto' }}
          size="small"
          type="primary"
          disabled={!(inviteTargets.length > 0 && props.world && instanceId)}
          onClick={onClickInvite}
        >
          초대
        </Button>
      </FlexRow>
    </Flex>
  );

  useEffect(() => {
    if (instanceId === undefined && currentUser !== undefined) {
      setInstanceId(
        generateInstanceId({
          worldKey: props.world?.key,
          type: type,
          region: region,
          vrcUserId: currentUser?.id,
        }),
      );
    }
  }, [currentUser, instanceId, props.world?.key, region, type]);

  return (
    <Modal
      title={title}
      open={props.visible}
      width="50%"
      footer={[
        <Button key="back" onClick={props.onCancel}>
          취소
        </Button>,
        <Button
          key="selfinvite"
          type="primary"
          loading={isInviteLoading}
          onClick={async () => {
            if (props.world?.key && instanceId) {
              setIsInviteLoading(true);
              try {
                await sendSelfInviteToMain(props.world.key, instanceId);
                message.success('셀프초대를 보냈습니다!');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                message.error('셀프초대를 실패했습니다.');
              }
              setIsInviteLoading(false);
            }
            props.onCancel?.();
          }}
        >
          셀프초대
        </Button>,
        <Popover
          key="partyinvite"
          trigger="click"
          content={renderedPopoverContent}
          placement="topRight"
        >
          <Button type="primary" loading={isInviteLoading}>
            초대
          </Button>
        </Popover>,
      ]}
      onCancel={props.onCancel}
    >
      {props.world && (
        <>
          <Typography.Title level={5}>{props.world.name}</Typography.Title>
          <FlexCenter>
            <Image src={props.world.imageUrl} width="80%"></Image>
          </FlexCenter>
          <br />
          <div>
            <Typography.Title level={5}>타입: </Typography.Title>
            <Select
              css={{
                width: 200,
              }}
              onSelect={(newType: string) => {
                setType(newType);
                if (currentUser) {
                  setInstanceId(
                    generateInstanceId({
                      worldKey: props.world?.key,
                      type: newType,
                      region: region,
                      vrcUserId: currentUser.id,
                    }),
                  );
                }
              }}
              defaultValue={InstanceDefaultType}
            >
              {renderedTypes}
            </Select>
          </div>
          <div>
            <Typography.Title level={5}>지역: </Typography.Title>
            <Select
              css={{
                width: 200,
              }}
              onSelect={(newRegion: string) => {
                setRegion(newRegion);
                if (currentUser) {
                  setInstanceId(
                    generateInstanceId({
                      worldKey: props.world?.key,
                      type: type,
                      region: newRegion,
                      vrcUserId: currentUser.id,
                    }),
                  );
                }
              }}
              defaultValue={InstanceDefaultRegion}
            >
              {renderedRegions}
            </Select>
          </div>

          {/* <Input.Group */}
          <div css={{ marginTop: spacing(1) }}>
            <Typography.Title level={5}>Instance ID: </Typography.Title>
            <code css={{ width: '80%' }}>{instanceId}</code>
          </div>

          <div css={{ marginTop: spacing(1) }}>
            <Typography.Link
              target="_blank"
              href={
                'https://vrchat.com/home/launch?' +
                'worldId=' +
                props.world?.key +
                '&instanceId=' +
                instanceId
              }
            >
              <Button>인스턴스 페이지</Button>
            </Typography.Link>
            <Button
              css={{ marginLeft: spacing(2) }}
              onClick={() => {
                setInstanceId(
                  generateInstanceId({
                    worldKey: props.world?.key,
                    type: type,
                    region: region,
                    vrcUserId: currentUser!.id,
                  }),
                );
              }}
            >
              ID 재생성
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default WorldInstanceCreationModal;

function generateInstanceId(props: {
  worldKey?: string;
  type?: string;
  region?: string;
  vrcUserId: string;
}): string {
  const nonce = '~nonce(825789e5-fdbb-4cb8-9190-df3ee696c987)';
  const max = 99999;
  const randomId = Math.floor(Math.random() * 99999);
  let instanceIdBuf = String(randomId);
  let isPublic = false;

  switch (props.type) {
    case InstanceTypes[0]: {
      // Public
      isPublic = true;
      break;
    }
    case InstanceTypes[1]: {
      // FriendsPlus
      instanceIdBuf += '~hidden(' + props.vrcUserId + ')';
      break;
    }
    case InstanceTypes[2]: {
      // Friends
      instanceIdBuf += '~friends(' + props.vrcUserId + ')';
      break;
    }
    case InstanceTypes[3]: {
      // InvitePlus
      instanceIdBuf += '~private(' + props.vrcUserId + ')~canRequestInvite';
      break;
    }
    case InstanceTypes[4]: {
      // Invite
      instanceIdBuf += '~private(' + props.vrcUserId + ')';
      break;
    }
  }

  switch (props.region) {
    case InstanceRegions[0]: {
      instanceIdBuf += '~region(us)';
      break;
    }
    case InstanceRegions[1]: {
      instanceIdBuf += '~region(use)';
      break;
    }
    case InstanceRegions[2]: {
      instanceIdBuf += '~region(eu)';
      break;
    }
    case InstanceRegions[3]: {
      instanceIdBuf += '~region(jp)';
      break;
    }
  }

  if (!isPublic) {
    instanceIdBuf += nonce;
  }

  return instanceIdBuf;
}
