import { HeartFilled, HeartOutlined, StarFilled } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import { WorldPartial } from '@src/types';
import { Avatar, Card } from 'antd';
import { Flex, FlexRow, FlexRowCenter } from '../styledComponents';

const { Meta } = Card;

interface Props {
  className?: string;
  world?: WorldPartial;
  isBookmarked?: boolean;
  onClick: () => void;
  onClickBookmark: (world: WorldPartial, isBookmarked: boolean) => void;
}

export default function WorldCard(props: Props) {
  return (
    <Card
      className={props.className}
      css={{ width: 300, float: 'left' }}
      cover={<img alt="world_thumbnail" src={props.world?.imageUrl} />}
      onClick={props.onClick}
      actions={[
        <FlexRowCenter css={{ wordBreak: 'keep-all' }}>
          {props.isBookmarked ? (
            <HeartFilled
              css={{ color: red.primary, fontSize: 20 }}
              onClick={() =>
                props.world &&
                props.onClickBookmark(props.world, props.isBookmarked!)
              }
            />
          ) : (
            <HeartOutlined
              css={{ color: red.primary, fontSize: 20 }}
              onClick={() =>
                props.world &&
                props.onClickBookmark(props.world, props.isBookmarked!)
              }
            />
          )}
        </FlexRowCenter>,
        <FlexRowCenter>{props.world?.type} </FlexRowCenter>,
        <FlexRowCenter>⭐{props.world?.score}</FlexRowCenter>,
      ]}
    >
      <Meta
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={props.world?.name}
        description={props.world?.author}
      />
    </Card>
  );
}
