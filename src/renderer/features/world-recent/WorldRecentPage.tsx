import {
  HeartFilled,
  HeartOutlined,
  ReloadOutlined,
  StarFilled,
} from '@ant-design/icons';
import {
  Button,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { gold, red } from '@ant-design/colors';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import {
  Flex,
  FlexRow,
  FlexRowCenter,
  HoverOpacity,
} from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { mqMinHeight, mqMinWidth, spacing } from '@src/renderer/utils/styling';
import { World, WorldVrcRaw } from '@src/types';
import WorldInfoModal from '@src/renderer/components/WorldInfoModal';
import AddWorldModal from '@src/renderer/components/AddWorldModal';
import useWorldRecentPage from './hooks/useWorldRecentPage';

const { TabPane } = Tabs;
const { Column } = Table;
const { Option } = Select;
const { Search } = Input;

export default function WorldRecentPage() {
  const hookMember = useWorldRecentPage();

  return (
    <Flex
      css={{
        paddingLeft: spacing(1),
        paddingRight: spacing(1),
        paddingTop: spacing(4),
        position: 'relative',
      }}
    >
      <WorldInfoModal
        onCancel={() => {
          hookMember.onCloseWorldInfoModal();
        }}
        visible={hookMember.infoModalWorld ? true : false}
        world={hookMember.infoModalWorld}
      />
      <AddWorldModal
        onCancel={() => {
          hookMember.onCloseAddWorldModal();
        }}
        onOk={(w) => {
          hookMember.onAddWorld(w);
        }}
        visible={hookMember.addModalWorld ? true : false}
        types={hookMember.typeList}
        defaultWorldInfo={hookMember.addModalWorld}
      />

      <FlexRow css={{ marginLeft: 'auto', alignItems: 'center' }}>
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => hookMember.onClickRefresh()}
          loading={hookMember.isLoading}
        />
      </FlexRow>
      <Spin spinning={hookMember.isLoading}>
        <Table
          dataSource={hookMember.currentTableData}
          // scroll={{
          //   x: true,
          // }}
          pagination={{
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              hookMember.onChangePage(page);
            },
            current: hookMember.currentPage,
          }}
        >
          <Column
            width={10}
            title="이미지"
            dataIndex="imageUrl"
            render={(imageUrl, record: World) => (
              <HoverOpacity>
                <Image
                  src={imageUrl}
                  preview={false}
                  onClick={(e) => {
                    hookMember.onOpenWorldInfoModal(record);
                  }}
                />
              </HoverOpacity>
            )}
          />
          <Column
            width={20}
            title="제목"
            dataIndex="name"
            sorter={(a: World, b: World) => a.name.localeCompare(b.name)}
            render={(_, world) => (
              <Typography.Text
                css={{ wordBreak: 'keep-all' }}
                ellipsis={{ tooltip: world.name }}
              >
                <Typography.Link
                  onClick={(e) => {
                    hookMember.onOpenWorldInfoModal(world);
                  }}
                >
                  {world.name}
                </Typography.Link>
              </Typography.Text>
              //
              // <Typography.Paragraph
              //   css={{ wordBreak: 'keep-all' }}
              //   ellipsis={{ rows: 3, expandable: true }}
              // >
              //   {world.name}
              // </Typography.Paragraph>
            )}
            // onCell={(w) => ({
            //   style: {
            //     width: 200,
            //     wordBreak: 'keep-all',
            //   },
            // })}
            // ellipsis
            // render={(_, world) => (
            //   <Typography.Link
            //     onClick={(e) => {
            //       hookMember.onClickOpenWorldInfoModal(world);
            //     }}
            //   >
            //     {world.name}
            //   </Typography.Link>
            // )}
          />
          <Column
            width={10}
            title="제작자"
            dataIndex="author"
            sorter={(a: World, b: World) => a.author.localeCompare(b.author)}
            ellipsis
          />
          <Column
            width={20}
            title="Link"
            key="link"
            render={(_, world: WorldVrcRaw) => (
              <a href={world.url} target="_blank" rel="noreferrer">
                <Typography.Paragraph
                  copyable={{ text: world.url }}
                  css={{ wordBreak: 'keep-all' }}
                  ellipsis={true}
                  type="secondary"
                >
                  {world.key}
                </Typography.Paragraph>
              </a>
            )}
          />
          <Column
            width={7}
            dataIndex="key"
            responsive={['xl']}
            render={(k, record: World) => (
              <Flex
                css={{
                  [mqMinWidth(1200)]: {
                    width: 50,
                  },
                }}
              >
                <Button
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => hookMember.onOpenAddWorldModal(record)}
                >
                  추가
                </Button>
                {/* TODO 월드 추가 버튼 만들기 */}
                {/* <Button
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => hookMember.onOpenEditWorldModal(record)}
                >
                  수정
                </Button>
                <div css={{ marginTop: 4 }} />
                <Popconfirm
                  title="정말 월드를 삭제하시겠습니까?"
                  placement="topRight"
                  onConfirm={() => hookMember.onRemoveWorld(k)}
                >
                  <Button danger size="small">
                    삭제
                  </Button>
                </Popconfirm> */}
              </Flex>
            )}
          />
        </Table>
        <FlexRow>
          <FlexRowCenter css={{ marginLeft: 'auto' }}>
            <InputNumber
              min={0}
              max={100}
              value={hookMember.queryLimit}
              onChange={(e) => hookMember.onChangeQueryLimit(e)}
            />
            개
            <Button
              type="primary"
              css={{ marginLeft: spacing(1) }}
              onClick={() => hookMember.onClickLoadMore()}
              disabled={!hookMember.canLoadMore}
            >
              더 불러오기
            </Button>
          </FlexRowCenter>
        </FlexRow>
      </Spin>
    </Flex>
  );
}
