import { FlexCenter } from '@src/renderer/components/styledComponents';
import {
  World,
  WorldEditInput,
  WorldPartialNonVrcInfo,
  WorldVrcRaw,
} from '@src/types';
import { Button, Image, Input, Modal, Select, Typography } from 'antd';
import { URL_REGEX } from '@src/renderer/utils/constants';
import { useState } from 'react';
import { spacing } from '@src/renderer/utils/styling';
import vrckey from '../../../secret/vrc.json';

interface Props {
  onCancel?: () => void;
  visible: boolean;
  world?: WorldPartialNonVrcInfo;
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
  const [instanceUrl, setInstanceUrl] = useState<string>();

  const renderedTypes = InstanceTypes.map((e) => (
    <Select.Option key={e}>{e}</Select.Option>
  ));

  const renderedRegions = InstanceRegions.map((e) => (
    <Select.Option key={e}>{e}</Select.Option>
  ));

  if (instanceUrl === undefined) {
    setInstanceUrl(
      generateInstanceUrl({
        worldKey: props.world?.key,
        type: type,
        region: region,
      }),
    );
  }

  return (
    <Modal
      title={title}
      onOk={() => {
        props.onCancel?.();
      }}
      destroyOnClose
      onCancel={props.onCancel}
      visible={props.visible}
      width="50%"
      okButtonProps={{
        // disabled: !URL_REGEX.test(props.world?.key || '') ? true : false,
        disabled: instanceUrl === undefined ? true : false,
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
              onSelect={(e: string) => {
                setType(e);
                setInstanceUrl(
                  generateInstanceUrl({
                    worldKey: props.world?.key,
                    type: type,
                    region: region,
                  }),
                );
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
              onSelect={(e: string) => {
                setRegion(e);
                setInstanceUrl(
                  generateInstanceUrl({
                    worldKey: props.world?.key,
                    type: type,
                    region: region,
                  }),
                );
              }}
              defaultValue={InstanceDefaultRegion}
            >
              {renderedRegions}
            </Select>
          </div>

          {/* <Input.Group */}
          <div css={{ marginTop: spacing(1) }}>
            <Typography.Title level={5}>URL: </Typography.Title>
            <div css={{ width: '80%' }}>{instanceUrl}</div>
          </div>

          <Typography.Link
            target="_blank"
            href={'https://vrchat.com/home/launch?' + instanceUrl}
          >
            <Button css={{ marginLeft: 'auto' }}>Link</Button>
          </Typography.Link>
        </>
      )}
    </Modal>
  );
}

export default WorldInstanceCreationModal;

function generateInstanceUrl(props: {
  worldKey?: string;
  type?: string;
  region?: string;
}): string {
  const nonce = '~nonce(825789e5-fdbb-4cb8-9190-df3ee696c987)';
  const max = 99999;
  const randomId = Math.floor(Math.random() * 99999);
  let url = 'worldId=' + props.worldKey + '&instanceId=' + randomId;
  let isPublic = false;

  switch (props.type) {
    case InstanceTypes[0]: {
      // Public
      isPublic = true;
      break;
    }
    case InstanceTypes[1]: {
      // FriendsPlus
      url += '~hidden(' + vrckey.id + ')';
      break;
    }
    case InstanceTypes[2]: {
      // Friends
      url += '~friends(' + vrckey.id + ')';
      break;
    }
    case InstanceTypes[3]: {
      // InvitePlus
      url += '~private(' + vrckey.id + ')~canRequestInvite';
      break;
    }
    case InstanceTypes[4]: {
      // Invite
      url += '~private(' + vrckey.id + ')';
      break;
    }
  }

  switch (props.region) {
    case InstanceRegions[0]: {
      url += '~region(us)';
      break;
    }
    case InstanceRegions[1]: {
      url += '~region(use)';
      break;
    }
    case InstanceRegions[2]: {
      url += '~region(eu)';
      break;
    }
    case InstanceRegions[3]: {
      url += '~region(jp)';
      break;
    }
  }

  if (!isPublic) {
    url += nonce;
  }

  return url;
}
