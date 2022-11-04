import {
  DownloadOutlined,
  DownOutlined,
  HeartFilled,
  HeartOutlined,
  MoreOutlined,
  ReloadOutlined,
  StarFilled,
  UploadOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Image,
  Input,
  Menu,
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
  HoverOpacity as ClickableOpacity,
} from '@src/renderer/components/styledComponents';
import simpleStringHash from '@src/renderer/utils/simpleStringHash';
import { mqMinHeight, mqMinWidth, spacing } from '@src/renderer/utils/styling';
import { World } from '@src/types';
import WorldInfoModal from '@src/renderer/components/WorldInfoModal';
import StarSelect from '@src/renderer/components/StarSelect';
import BookmarkSelectModal from '@src/renderer/components/BookmarkSelectModal';
import useBookmark from '@src/renderer/utils/hooks/useBookmark';
import useBookmarkPage from './hooks/useBookmarkPage';
import BookmarkTypeModal from './BookmarkTypeModal';

const { Column } = Table;
const { Option } = Select;
const { Search } = Input;

export default function BookmarkPage() {
  const hookMember = useBookmarkPage();
  const bookmarkHookMember = useBookmark();

  const tabItems = hookMember.typeList.map((e) => ({
    label: e,
    key: e,
  }));

  return (
    <Flex
      css={{
        paddingLeft: spacing(1),
        paddingRight: spacing(1),
        position: 'relative',
      }}
    >
      <BookmarkTypeModal
        onAddBookmark={(type) => {
          bookmarkHookMember.onAddBookmarkType(type);
        }}
        onEditBookmark={(type: string, newType: string): void => {
          bookmarkHookMember.onEditBookmarkType(type, newType);
        }}
        onRemoveBookmark={(type: string): void => {
          bookmarkHookMember.onRemoveBookmarkType(type);
        }}
        onCancel={(): void => {
          hookMember.onCloseTypeModal();
        }}
        bookmarks={hookMember.bookmarkModalData || {}}
        visible={hookMember.bookmarkModalData ? true : false}
      />
      <BookmarkSelectModal
        bookmarkTypes={bookmarkHookMember.bookmarkTypes}
        visible={bookmarkHookMember.isOpenBookmarkModal}
        preSelectType={bookmarkHookMember.targetWorldTypes}
        onOk={(types: string[]): void => {
          bookmarkHookMember.onChangeBookmarkWorld(types);
          bookmarkHookMember.onCloseBookmarkModal();
        }}
        onCancel={(): void => {
          bookmarkHookMember.onCloseBookmarkModal();
        }}
        onAddBookmarkItem={(type: string): void => {
          bookmarkHookMember.onAddBookmarkType(type);
        }}
      />
      <WorldInfoModal
        onCancel={() => {
          hookMember.onClickToggleInfoModal(undefined);
        }}
        visible={hookMember.infoModalWorld ? true : false}
        world={hookMember.infoModalWorld}
        isBookmarked={
          hookMember.infoModalWorld
            ? bookmarkHookMember.checkIsSomewhereBookmarkedWorld(
                hookMember.infoModalWorld,
              )
            : false
        }
        onClickBookmark={(world) =>
          bookmarkHookMember.onClickOpenBookmarkModal(world)
        }
        // onEdit={(world) => {}}
        onRemove={(world) => {
          hookMember.onRemoveWorld(world.key);
        }}
      />

      {/* <Search
        placeholder="Type Search Text"
        allowClear
        onSearch={hookMember.onSearchWorlds}
        css={{
          marginTop: spacing(1),
        }}
        loading={hookMember.isLoading}
      /> */}
      <Flex
        css={{
          [mqMinHeight(768)]: {
            position: 'sticky',
            zIndex: 2,
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#f0f2f5',
          },
        }}
      >
        <FlexRow css={{ alignItems: 'center' }}>
          <Tabs
            css={{ flex: 1, overflowX: 'auto' }}
            activeKey={hookMember.currentType}
            onChange={hookMember.onChangeType}
            items={tabItems}
          />

          <Dropdown.Button
            onClick={() => hookMember.onClickOpenTypeModal()}
            css={{ marginLeft: spacing(1) }}
            overlay={
              <Menu
                items={[
                  {
                    label: '북마크 내보내기',
                    key: '1',
                    icon: <UploadOutlined />,
                    onClick: () => hookMember.onClickOpenSaveBookmarkDialog(),
                  },
                  {
                    label: '북마크 가져오기',
                    key: '2',
                    icon: <DownloadOutlined />,
                    danger: true,
                    onClick: () => hookMember.onClickOpenLoadBookmarkDialog(),
                  },
                ]}
              />
            }
          >
            북마크 관리
          </Dropdown.Button>
          {/* <Button
          onClick={() => hookMember.onClickOpenTypeModal()}
          css={{ marginLeft: spacing(1) }}
        >
          북마크 관리
        </Button>
        <Button
          onClick={() => hookMember.onClickOpenSaveBookmarkDialog()}
          type="link"
        >
          북마크 내보내기
        </Button>
        <Button
          onClick={() => hookMember.onClickOpenLoadBookmarkDialog()}
          danger
          type="text"
        >
          북마크 가져오기
        </Button> */}
        </FlexRow>
      </Flex>

      <FlexRow css={{ marginLeft: 'auto' }}>
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => hookMember.onClickRefresh()}
          loading={hookMember.isLoading}
        />
      </FlexRow>

      <Spin spinning={hookMember.isLoading}>
        <Table
          dataSource={hookMember.worldData}
          pagination={{
            pageSize: 100,
          }}
          onChange={(pagination, filters, sorter) => {
            const isFiltered =
              Object.values(filters).filter((e) => !!e).length > 0;
            // eslint-disable-next-line no-nested-ternary
            const isSorted = Array.isArray(sorter)
              ? true
              : sorter.order
              ? true
              : false;
            hookMember.onChangeIsManipulatedTable(isFiltered || isSorted);
          }}
        >
          <Column
            width={5}
            title=""
            key="bookmark"
            render={(_, record: World) => {
              if (bookmarkHookMember.checkIsSomewhereBookmarkedWorld(record)) {
                return (
                  <HeartFilled
                    css={{ color: red.primary, fontSize: 20 }}
                    onClick={() =>
                      bookmarkHookMember.onClickOpenBookmarkModal(record)
                    }
                  />
                );
              }
              return (
                <HeartOutlined
                  css={{ color: red.primary, fontSize: 20 }}
                  onClick={() =>
                    bookmarkHookMember.onClickOpenBookmarkModal(record)
                  }
                />
              );
            }}
          />
          <Column
            width={10}
            title="이미지"
            dataIndex="imageUrl"
            render={(imageUrl, record: World) => (
              <ClickableOpacity>
                <Image
                  src={imageUrl}
                  preview={false}
                  onClick={(e) => {
                    hookMember.onClickToggleInfoModal(record);
                  }}
                />
              </ClickableOpacity>
            )}
          />
          <Column
            width={20}
            title="제목"
            dataIndex="name"
            sorter={(a: World, b: World) => a.name.localeCompare(b.name)}
            // onCell={(w) => ({
            //   style: {
            //     width: 200,
            //     wordBreak: 'keep-all',
            //   },
            // })}
            // ellipsis
            render={(_, world) => (
              <Typography.Text
                css={{ wordBreak: 'keep-all' }}
                ellipsis={{ tooltip: world.name }}
              >
                <Typography.Link
                  onClick={(e) => {
                    hookMember.onClickToggleInfoModal(world);
                  }}
                >
                  {world.name}
                </Typography.Link>
              </Typography.Text>
            )}
          />
          <Column
            width={10}
            title="제작자"
            dataIndex="author"
            sorter={(a: World, b: World) => a.author.localeCompare(b.author)}
            ellipsis
          />
          <Column
            responsive={['xl']}
            width={6}
            dataIndex="type"
            ellipsis
            onCell={(world) => ({
              style: {
                fontSize: 12,
              },
            })}
          />
          <Column
            width={15}
            title="설명"
            dataIndex="description"
            render={(value) => (
              <Typography.Paragraph
                css={{ wordBreak: 'keep-all' }}
                ellipsis={{ rows: 3, expandable: true }}
              >
                {value}
              </Typography.Paragraph>
            )}
          />
          <Column
            width={15}
            title="태그"
            dataIndex="tags"
            render={(tags: any[]) => (
              <div css={{ wordBreak: 'break-all', whiteSpace: 'break-spaces' }}>
                {tags.map((tag, index) => {
                  const colorIndex =
                    simpleStringHash(tag) % PresetColorTypes.length;
                  const color = PresetColorTypes[colorIndex];
                  return (
                    <span key={tag}>
                      <Tag color={color}>{tag.toUpperCase()}</Tag>
                    </span>
                  );
                })}
              </div>
            )}
            ellipsis
          />
          <Column
            width={9}
            title="별점"
            dataIndex="score"
            render={(score: number) => (
              <FlexRow>
                {new Array(score).fill(null).map((_, index) => (
                  <StarFilled key={index} css={{ color: gold.primary }} />
                ))}
              </FlexRow>
            )}
            sorter={(a: World, b: World) => a.score - b.score}
            filters={scoreFilters}
            onFilter={(value, record) => value === record.score}
          />
          {!hookMember.isManipulatedTable && (
            <Column
              width={5}
              responsive={['xl']}
              title=""
              key="swap"
              render={(_, record, index) => (
                <Flex>
                  {index === 0 ? undefined : (
                    <Button
                      type="text"
                      icon={<UpOutlined />}
                      onClick={() =>
                        bookmarkHookMember.onFrontSwapWorld(
                          hookMember.currentType,
                          record as World,
                        )
                      }
                    />
                  )}
                  {index + 1 === hookMember.worldData.length ? undefined : (
                    <Button
                      type="text"
                      icon={<DownOutlined />}
                      onClick={() =>
                        bookmarkHookMember.onRearSwapWorld(
                          hookMember.currentType,
                          record as World,
                        )
                      }
                    />
                  )}
                </Flex>
              )}
            />
          )}

          {/* <Column
            width="5%"
            dataIndex="key"
            render={(k, record) => (
              <Flex>
                <Popconfirm
                  title="정말 월드를 삭제하시겠습니까?"
                  placement="topRight"
                  onConfirm={() => hookMember.onRemoveWorld(k)}
                >
                  <Button danger size="small">
                    삭제
                  </Button>
                </Popconfirm>
              </Flex>
            )}
          /> */}
        </Table>
      </Spin>
    </Flex>
  );
}

const scoreFilters = [
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 1,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 2,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 3,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 4,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 5,
  },
  {
    text: (
      <FlexRow>
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
        <StarFilled css={{ color: gold.primary }} />
      </FlexRow>
    ),
    value: 6,
  },
];
