import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { spacing } from '@src/renderer/utils/styling';
import { Avatar, Card } from 'antd';
import { useMemo } from 'react';
import { User } from 'vrchat';
import { Flex, FlexRow } from '../styledComponents';

const SIZE = 16;

const { Meta } = Card;

interface Props {
  className?: string;
  user: User;
}
function UserCard(props: Props) {
  const renderedStatusIcon = useMemo(
    () => convertToStatusCurcle(props.user),
    [props.user],
  );
  return (
    <Card
      className={props.className}
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={<Avatar src={props.user.currentAvatarThumbnailImageUrl} />}
        title={props.user.displayName}
        css={{
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflowX: 'hidden',
        }}
        description={
          <FlexRow css={{ alignItems: 'center' }}>
            {renderedStatusIcon}
            <div
              css={{
                marginLeft: spacing(1),
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflowX: 'hidden',
                visibility:
                  props.user.statusDescription.trim() === ''
                    ? 'hidden'
                    : 'visible',
              }}
            >
              {props.user.statusDescription.trim() === ''
                ? 'No status'
                : props.user.statusDescription}
            </div>
          </FlexRow>
        }
      />
    </Card>
  );
}
export default UserCard;

function convertToStatusCurcle(user: User) {
  if (user.location === 'offline') {
    switch (user.status) {
      case 'active':
        return (
          <div
            css={{
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              border: '2px solid green',
            }}
          />
        );
      case 'join me':
        return (
          <div
            css={{
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              border: '2px solid dodgerblue',
            }}
          />
        );
      case 'ask me':
        return (
          <div
            css={{
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              border: '2px solid orange',
            }}
          />
        );
      case 'busy':
        return (
          <div
            css={{
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              border: '2px solid tomato',
            }}
          />
        );
      case 'offline':
        return (
          <div
            css={{
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              backgroundColor: 'gray',
            }}
          />
        );
      default:
        return (
          <div
            css={{
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              border: '2px solid gray',
            }}
          />
        );
    }
  }

  switch (user.status) {
    case 'active':
      return (
        <div
          css={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: 'green',
          }}
        />
      );
    case 'join me':
      return (
        <div
          css={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: 'dodgerblue',
          }}
        />
      );
    case 'ask me':
      return (
        <div
          css={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: 'orange',
          }}
        />
      );
    case 'busy':
      return (
        <div
          css={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: 'tomato',
          }}
        />
      );
    case 'offline':
      return (
        <div
          css={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: 'gray',
          }}
        />
      );
    default:
      return (
        <div
          css={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            border: '2px solid gray',
          }}
        />
      );
  }
}
