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
import { World, WorldPartial } from '@src/types';
import WorldInfoModal from '@src/renderer/components/WorldInfoModal';
import AddWorldModal from '@src/renderer/components/AddWorldModal';
import { LimitedWorld } from 'vrchat';
import convertWorldKeyToUrl from '@src/renderer/utils/vrc/convertWorldKeyToUrl';
import useWorldFavoritePage from './hooks/useWorldFavoritePage';

const { Column } = Table;
const { Option } = Select;
const { Search } = Input;

export default function WorldFavoritePage() {
  const hookMember = useWorldFavoritePage();

  const tabItems = hookMember.favoriteTabs.map((e) => {
    return { label: e.displayName, key: e.name };
  });

  return (
    <Flex
      css={{
        paddingLeft: spacing(1),
        paddingRight: spacing(1),
        position: 'relative',
      }}
    >
      <WorldInfoModal
        onCancel={() => {
          hookMember.onCloseWorldInfoModal();
        }}
        onAdd={(w) => {
          hookMember.onOpenAddWorldModal(w);
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

      <Tabs
        activeKey={hookMember.currentTab}
        onChange={(e) => hookMember.onClickChangeTab(e)}
        items={tabItems}
      ></Tabs>

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
          rowKey={(record) => record.id}
        >
          <Column
            width={10}
            title="이미지"
            dataIndex="thumbnailImageUrl"
            render={(thumbnailImageUrl, record: LimitedWorld) => (
              <HoverOpacity>
                <Image
                  src={thumbnailImageUrl}
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
            sorter={(a: LimitedWorld, b: LimitedWorld) =>
              a.name.localeCompare(b.name)
            }
            render={(name, world) => (
              <Typography.Text css={{ wordBreak: 'keep-all' }}>
                <Typography.Link
                  onClick={(e) => {
                    hookMember.onOpenWorldInfoModal(world);
                  }}
                  ellipsis
                  copyable
                >
                  {name}
                </Typography.Link>
              </Typography.Text>
            )}
          />
          <Column
            width={10}
            title="제작자"
            dataIndex="authorName"
            sorter={(a: LimitedWorld, b: LimitedWorld) =>
              a.authorName.localeCompare(b.authorName)
            }
            // ellipsis
            render={(_, world) => (
              <Typography.Text
                css={{ wordBreak: 'keep-all' }}
                ellipsis={{ tooltip: world.authorName }}
                copyable
              >
                {world.authorName}
              </Typography.Text>
            )}
          />
          <Column
            width={10}
            title="인원수"
            dataIndex="capacity"
            sorter
            render={(capacity, world) => (
              <Typography.Text
                css={{ wordBreak: 'keep-all' }}
                ellipsis={{ tooltip: capacity }}
              >
                {capacity +
                  ' (' +
                  (capacity === 1 ? 1 : (capacity ?? 0) * 2) +
                  ')'}
              </Typography.Text>
            )}
          />
          <Column
            width={10}
            title="업뎃일"
            dataIndex="updated_at"
            sorter={(a: LimitedWorld, b: LimitedWorld) =>
              a.updated_at.localeCompare(b.updated_at)
            }
            render={(isoDate, world) => (
              <Typography.Text
                css={{ wordBreak: 'keep-all' }}
                ellipsis={{ tooltip: isoDate }}
              >
                {new Date(isoDate).toLocaleDateString()}
              </Typography.Text>
            )}
          />
          <Column width={6} title="즐찾수" dataIndex="favorites" sorter />
          {/* <Column
            width={20}
            title="Link"
            key="link"
            render={(_, world: LimitedWorld) => (
              <a
                href={convertWorldKeyToUrl(world.id)}
                target="_blank"
                rel="noreferrer"
              >
                <Typography.Paragraph
                  copyable={{ text: convertWorldKeyToUrl(world.id) }}
                  css={{ wordBreak: 'keep-all' }}
                  ellipsis={true}
                  type="secondary"
                >
                  {world.id}
                </Typography.Paragraph>
              </a>
            )}
          /> */}
          {/* <Column
            width={7}
            key="actions"
            responsive={['xl']}
            render={(k, record: LimitedWorld) => (
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
              </Flex>
            )}
          /> */}
        </Table>
      </Spin>
    </Flex>
  );
}
