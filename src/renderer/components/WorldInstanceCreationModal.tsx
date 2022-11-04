/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FlexCenter } from '@src/renderer/components/styledComponents';
import { WorldPartial } from '@src/types';
import { Button, Image, message, Modal, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { spacing } from '@src/renderer/utils/styling';
import { useVrcCurrentUser } from '../data/user';
import { sendSelfInviteToMain } from '../utils/ipc/vrchatAPIToMain';

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

  const renderedTypes = InstanceTypes.map((e) => (
    <Select.Option key={e}>{e}</Select.Option>
  ));

  const renderedRegions = InstanceRegions.map((e) => (
    <Select.Option key={e}>{e}</Select.Option>
  ));

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
      onCancel={props.onCancel}
      onOk={async () => {
        if (props.world?.key && instanceId) {
          try {
            await sendSelfInviteToMain(props.world.key, instanceId);
            message.success('셀프초대를 보냈습니다!');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            message.error('셀프초대를 실패했습니다.');
          }
        }

        props.onCancel?.();
      }}
      okButtonProps={{
        // disabled: !URL_REGEX.test(props.world?.key || '') ? true : false,
        disabled: props.world && instanceId ? false : true,
      }}
      okText="셀프초대"
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
